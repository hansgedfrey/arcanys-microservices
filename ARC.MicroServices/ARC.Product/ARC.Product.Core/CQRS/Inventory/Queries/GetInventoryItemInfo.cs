using ARC.Extension.ValidationMiddleWare.Exceptions;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Inventory.Commands.GetInventoryItem
{
    public record GetInventoryItemInfoQuery : IRequest<Models.InventoryItemDto>
    {
        public required Guid InventoryItemId { get; init; }
    }

    public class GetInventoryItemInfoQueryValidator : AbstractValidator<GetInventoryItemInfoQuery>
    {
        public GetInventoryItemInfoQueryValidator()
        {
            RuleFor(x => x.InventoryItemId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<GetInventoryItemInfoQuery, Models.InventoryItemDto>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<Models.InventoryItemDto> Handle(GetInventoryItemInfoQuery request, CancellationToken cancellationToken)
        {
            var inventoryItem = await _applicationDbContext.InventoryItems
                                .Where(p => p.InventoryItemId == request.InventoryItemId)
                                .ProjectTo<Models.InventoryItemDto>(_mapper.ConfigurationProvider)
                                .SingleOrDefaultAsync(cancellationToken);

            if (inventoryItem == null)
                throw new NotFoundException(nameof(inventoryItem), request.InventoryItemId);

            return inventoryItem;
        }
    }
}