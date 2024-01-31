using ARC.Extension.ValidationMiddleWare.Exceptions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Product.Commands.RemoveProduct
{
    public record RemoveProductCommand : IRequest
    {
        public Guid ProductId { get; init; }
    }

    public class UpsertCategoryCommandValidator : AbstractValidator<RemoveProductCommand>
    {
        public UpsertCategoryCommandValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty();
        }
    } 

    public class Handler : IRequestHandler<RemoveProductCommand>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task Handle(RemoveProductCommand request, CancellationToken cancellationToken)
        {
            var productToDelete = await _applicationDbContext.Products
                                     .Include(p => p.Events)
                                      .Where(p => p.ProductId == request.ProductId)
                                      .SingleOrDefaultAsync(cancellationToken) ?? throw new NotFoundException(nameof(Persistence.Entities.Product));

            var inventoriesWithProduct = _applicationDbContext.InventoryItems
                          .Include(i => i.Product)
                          .Where(i => i.Product.ProductId == request.ProductId);

            if (inventoriesWithProduct.Any())
                throw new InvalidOperationException($"Product {productToDelete.ProductName} is bound to invetory items.");

            _applicationDbContext.Remove(productToDelete);

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }
    }
}