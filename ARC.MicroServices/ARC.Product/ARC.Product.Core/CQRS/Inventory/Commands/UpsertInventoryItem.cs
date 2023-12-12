using ARC.Extension.ValidationMiddleWare.Exceptions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Inventory.Commands.UpsertInventoryItem
{
    public record UpsertInventoryItemCommand : IRequest<Guid>
    {
        public required Guid ProductId { get; init; }
        public Guid? InventoryItemId { get; init; }
        public required int Quantity { get; init; }
        public string? Details { get; init; }
    }

    public class UpsertInventoryCommandValidator : AbstractValidator<UpsertInventoryItemCommand>
    {
        public UpsertInventoryCommandValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty();
            RuleFor(x => x.Quantity).NotEmpty().GreaterThan(0);
        }
    } 

    public class Handler : IRequestHandler<UpsertInventoryItemCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task<Guid> Handle(UpsertInventoryItemCommand request, CancellationToken cancellationToken)
        {
            var productExists = await _coreHelper.ProductExistsAsync(request.ProductId, cancellationToken);
     
            var inventoryItemId = request.InventoryItemId.GetValueOrDefault();
            var inventoryItemToInsert = new Persistence.Entities.InventoryItem();

            if (productExists)
            {
                var inventoryItem = new Persistence.Entities.InventoryItem();
            }

            if (inventoryItemId == Guid.Empty)
            {
                inventoryItemToInsert.AppendEvent(new Persistence.Events.InventoryItem.AddInventoryItemEvent { Occurred = DateTime.Now, Quantity = request.Quantity });
                _applicationDbContext.InventoryItems.Add(inventoryItemToInsert);
            } 
            else
            {
                inventoryItemToInsert = await _applicationDbContext.InventoryItems
                             .Where(p => p.InventoryItemId == inventoryItemId)
                             .SingleOrDefaultAsync(cancellationToken) ?? throw new NotFoundException(nameof(Persistence.Entities.Category));

                inventoryItemToInsert.AppendEvent(new Persistence.Events.InventoryItem.UpdateInventoryItemEvent { Occurred = DateTime.Now, Quantity = request.Quantity });
            }

            inventoryItemToInsert.Details = request.Details;
            inventoryItemToInsert.ProductId = request.ProductId;
            inventoryItemToInsert.Quantity = request.Quantity;


            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return inventoryItemToInsert.InventoryItemId;
        }
    }
}
