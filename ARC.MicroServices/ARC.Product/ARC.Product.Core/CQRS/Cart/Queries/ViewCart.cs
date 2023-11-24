using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Cart.Queries.ViewCart
{
    public record ViewCartQuery : IRequest<Models.CartDto>
    {
        public required Guid CartId { get; init; }
    }

    public class GetProductInfoQueryValidator : AbstractValidator<ViewCartQuery>
    {
        public GetProductInfoQueryValidator()
        {
            RuleFor(x => x.CartId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<ViewCartQuery, Models.CartDto>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<Models.CartDto> Handle(ViewCartQuery request, CancellationToken cancellationToken)
        {
            var cart = await _applicationDbContext.Carts
                .Include(c=>c.Events).ThenInclude(c=> (c as Persistence.Events.Cart.AddItemToCartEvent)!.CartItem)
                                .Where(p => p.CartId == request.CartId) 
                                .ProjectTo<Models.CartDto>(_mapper.ConfigurationProvider)
                                .SingleOrDefaultAsync(cancellationToken);

            if (cart == null)
                throw new ARC.Infrastructure.Exceptions.NotFoundException(nameof(cart), request.CartId);

            return cart;
        }
    }
}
