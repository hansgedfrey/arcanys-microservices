using ARC.Extension.ValidationMiddleWare.Exceptions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Cart.Commands.AddToCart
{
    public record AddToCartCommand : IRequest<Guid>
    {
        public required Guid ProductId { get; init; }
        public Guid CartId { get; init; }
        public required int Quantity { get; init; }
    }

    public class UpsertCategoryCommandValidator : AbstractValidator<AddToCartCommand>
    {
        public UpsertCategoryCommandValidator()
        {
            RuleFor(x => x.CartId).NotEmpty();
            RuleFor(x => x.ProductId).NotEmpty();
            RuleFor(x => x.Quantity).NotEmpty().GreaterThan(0);
        }
    } 

    public class Handler : IRequestHandler<AddToCartCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task<Guid> Handle(AddToCartCommand request, CancellationToken cancellationToken)
        {   
            var inventoryItem = await _applicationDbContext.InventoryItems 
                             .Include(p => p.Product)
                             .Where(p => p.ProductId == request.ProductId)
                             .SingleOrDefaultAsync(cancellationToken);
            var cart = await _applicationDbContext.Carts
                            .Include(c=>c.CartItems)
                            .ThenInclude(ci=>ci.Product)
                            .Where(c=>c.CartId == request.CartId)
                            .FirstOrDefaultAsync();

            if (cart == null)
                throw new NotFoundException(nameof(cart), request.CartId);

            if (inventoryItem == null)
                throw new NotFoundException(nameof(inventoryItem), request.ProductId);
             
            if (inventoryItem?.Quantity <= 0)
                throw new InvalidOperationException("Item is currently out of stock.");

            var existingCartItem = cart.CartItems.Where(c => c.Product.ProductId == request.ProductId && c.CartItemState == Persistence.Common.CartItemState.Added).FirstOrDefault();
             
            if (existingCartItem != null)
            {
                existingCartItem.ProductId = request.ProductId;
                existingCartItem.Quantity = (existingCartItem?.Quantity ?? 0) + request.Quantity;
                cart.AppendEvent(new Persistence.Events.Cart.UpdateCartItemQuantityEvent { Occurred = DateTime.Now, CartItemId = existingCartItem!.CartItemId, Quantity = request.Quantity });
            }
            else 
            { 
                var cartItem = new Persistence.Entities.CartItem()
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    CartId = cart!.CartId,
                    CartItemState = Persistence.Common.CartItemState.Added
                };

                cartItem.AppendEvent(new Persistence.Events.CartItem.AddedToCartEvent { Occurred = DateTime.Now });
                _applicationDbContext.CartItems.Add(cartItem);

                cart.AppendEvent(new Persistence.Events.Cart.AddItemToCartEvent { Occurred = DateTime.Now, CartItemId = cartItem.CartItemId, Quantity = request.Quantity });
            }

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return cart.CartId;
        }
    }
}