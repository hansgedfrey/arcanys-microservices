using ARC.Extension.ValidationMiddleWare.Exceptions;
using ARC.Product.Core.Models;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Category.Commands.RemoveCategory
{
    public record RemoveCategoryCommand : IRequest
    {
        public Guid CategoryId { get; init; }
    }

    public class UpsertCategoryCommandValidator : AbstractValidator<RemoveCategoryCommand>
    {
        public UpsertCategoryCommandValidator()
        {
            RuleFor(x => x.CategoryId).NotEmpty();
        }
    } 

    public class Handler : IRequestHandler<RemoveCategoryCommand>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task Handle(RemoveCategoryCommand request, CancellationToken cancellationToken)
        {  
            var categoryToDelete = await _applicationDbContext.Categories
                          .Include(c=>c.Products)
                          .Where(p => p.CategoryId == request.CategoryId)
                          .SingleOrDefaultAsync(cancellationToken) ?? throw new NotFoundException(nameof(Persistence.Entities.Category));
             
            if (categoryToDelete.Products.Any())
                throw new InvalidOperationException($"Category {categoryToDelete.Name} is bound to products.");

            _applicationDbContext.Remove(categoryToDelete);

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false); 
        }
    }
}