using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Category.Commands.UpsertCategory
{
    public record UpsertCategoryCommand : IRequest<Guid>
    {
        public Guid? CategoryId { get; init; }
        public required string CategoryName { get; init; }
        public string? Description { get; init; }
    }

    public class UpsertCategoryCommandValidator : AbstractValidator<UpsertCategoryCommand>
    {
        public UpsertCategoryCommandValidator()
        {
            RuleFor(x => x.CategoryName).NotEmpty();
        }
    } 

    public class Handler : IRequestHandler<UpsertCategoryCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task<Guid> Handle(UpsertCategoryCommand request, CancellationToken cancellationToken)
        {
            var categoryId = request.CategoryId.GetValueOrDefault();
            var categoryToUpsert = new Persistence.Entities.Category();

            if (categoryId == Guid.Empty)
                _applicationDbContext.Categories.Add(categoryToUpsert);
            else
                categoryToUpsert = await _applicationDbContext.Categories
                          .Where(p => p.CategoryId == categoryId)
                          .SingleOrDefaultAsync(cancellationToken) ?? throw new ARC.Infrastructure.NotFoundException(nameof(Persistence.Entities.Category));

            categoryToUpsert.Name = request.CategoryName;
            categoryToUpsert.Description = request.Description;

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return categoryToUpsert.CategoryId;
        }
    }
}