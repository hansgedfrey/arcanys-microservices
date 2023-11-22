using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Cart.Commands.RemoveFromCart
{
    public record RemoveFromCartCommand : IRequest<Guid>
    {
        public required Guid CartId { get; init; }
        public required Guid CartItemId { get; init; }
    }

    public class UpsertCategoryCommandValidator : AbstractValidator<RemoveFromCartCommand>
    {
        public UpsertCategoryCommandValidator()
        {
            RuleFor(x => x.CartId).NotEmpty();
            RuleFor(x => x.CartItemId).NotEmpty();
        }
    }
     
    public class Handler : IRequestHandler<RemoveFromCartCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task<Guid> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
        {    
            var cart = await _applicationDbContext.Carts
                            .Include(c=>c.CartItems)
                            .ThenInclude(ci=>ci.Product)
                            .Where(c=>c.CartId == request.CartId)
                            .FirstOrDefaultAsync();

            if (cart == null)
                throw new ARC.Infrastructure.NotFoundException(nameof(cart), request.CartId);

            var existingCartItem = cart.CartItems.Where(c => c.CartItemId == request.CartItemId).FirstOrDefault();

            if (existingCartItem != null)
            {
                existingCartItem.CartItemState = Persistence.Common.CartItemState.Removed; 
                cart.AppendEvent(new Persistence.Events.Cart.RemoveItemFromCartEvent { Occurred = DateTime.Now, CartItemId = existingCartItem.CartItemId });
            }

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return cart.CartId;
        }
    }
}