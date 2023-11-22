using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Cart.Commands.CreateCart
{
    public record CreateCartCommand : IRequest<Guid> { }
     
    /// <summary>
    /// This is a flimsy one. Doesn't handle sessions yet so we're only doing a single cart.
    /// </summary>
    public class Handler : IRequestHandler<CreateCartCommand, Guid>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly CoreHelper _coreHelper;

        public Handler(Persistence.Entities.ApplicationDbContext applicationDbContext, CoreHelper coreHelper)
        {
            _applicationDbContext = applicationDbContext;
            _coreHelper = coreHelper;
        }

        public async Task<Guid> Handle(CreateCartCommand request, CancellationToken cancellationToken)
        {
            var cartToUpsert = new Persistence.Entities.Cart();
            var existingCart = await _applicationDbContext.Carts
                          .FirstOrDefaultAsync(cancellationToken);

            if (existingCart == null)
                _applicationDbContext.Carts.Add(cartToUpsert);

            cartToUpsert.AppendEvent(new Persistence.Events.Cart.CreateCartEvent { Occurred = DateTime.Now });

            await _applicationDbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return existingCart != null ? existingCart.CartId : cartToUpsert.CartId;
        }
    }
}