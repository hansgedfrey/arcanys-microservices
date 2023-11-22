using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Product.Commands.UpsertProduct
{
    public record UpsertProductCommand : IRequest<Guid>
    {
        public Guid? ProductId { get; init; }
        public required string ProductName { get; init; }
        public required decimal Price { get; init; }
        public string? Description { get; init; }
        public required string SKU { get; init; }
        public required Guid CategoryId { get; init; }
    }

    public class UpsertProductCommandCommandValidator : AbstractValidator<UpsertProductCommand>
    {
        public UpsertProductCommandCommandValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty();
            RuleFor(x => x.Price).GreaterThan(0);
            RuleFor(x => x.CategoryId).NotEmpty();
            RuleFor(x => x.SKU).NotEmpty();
        }
    }
 
    public class Handler : IRequestHandler<UpsertProductCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task<Guid> Handle(UpsertProductCommand request, CancellationToken cancellationToken)
        {
            var productToUpsert = new Persistence.Entities.Product();

            if (!await _coreHelper.CategoryExistsAsync(request.CategoryId, cancellationToken))
                throw new Exceptions.NotFoundException(nameof(Category), request.CategoryId);

            if (request.ProductId == null || request.ProductId == Guid.Empty)
            {
                if (await _coreHelper.ProductExistsAsync(request.SKU, cancellationToken))
                    throw new Exceptions.AlreadyExistsException(nameof(Product), nameof(request.SKU));

                productToUpsert.SKU = request.SKU;
                productToUpsert.AppendEvent(new Persistence.Events.Product.AddProductEvent { Occurred = DateTime.Now });
                _applicationDbContext.Products.Add(productToUpsert);
            }
            else
            {
                productToUpsert = await _applicationDbContext.Products
                          .Where(p => p.ProductId == request.ProductId)
                          .SingleOrDefaultAsync(cancellationToken) ?? throw new Exceptions.NotFoundException(nameof(Persistence.Entities.Product));

                if (request.Price != productToUpsert.Price)
                    productToUpsert.AppendEvent(new Persistence.Events.Product.UpdateProductPriceEvent { Occurred = DateTime.Now, UpdatedPrice = request.Price });
                else
                    productToUpsert.AppendEvent(new Persistence.Events.Product.UpdateProductEvent { Occurred = DateTime.Now });
            }

            productToUpsert.ProductName = request.ProductName;
            productToUpsert.Price = request.Price;
            productToUpsert.Description = request.Description;
            productToUpsert.CategoryId = request.CategoryId;
            
            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return productToUpsert.ProductId;
        }
    }
}