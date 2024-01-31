using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Inventory.Queries.SearchInventory
{
    public record SearchInventoryQuery : IRequest<SearchInventoryResponse>
    { 
        public string? Query { get; init; }
        public int? Page { get; set; }
    }

    public class SearchInventoryQueryValidator : AbstractValidator<SearchInventoryQuery>
    {
        public SearchInventoryQueryValidator()
        {
            RuleFor(x => x.Page).GreaterThan(0);
        }
    }

    public class SearchInventoryResponse
    {
        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
        public int PageSize { get; set; }
        public IList<Models.InventoryItemDto> Results { get; set; } = null!;
    }

    public class Handler : IRequestHandler<SearchInventoryQuery, SearchInventoryResponse>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;
        private const int PAGE_SIZE = 15;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<SearchInventoryResponse> Handle(SearchInventoryQuery request, CancellationToken cancellationToken)
        {
            var query = _applicationDbContext.InventoryItems
                .Include(p=>p.Product)
                .Include(e=>e.Events)
                .AsNoTracking();

            var requestPage = request.Page ?? 1;

            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                query = _applicationDbContext.InventoryItems
                    .Where(c => EF.Functions.Like(c.Product.ProductName, $"%{request.Query}%") || !string.IsNullOrWhiteSpace(c.Details) && EF.Functions.Like(c.Details, $"%{request.Query}%"))
                    .AsNoTracking();
            }

            var count = await query.CountAsync(cancellationToken).ConfigureAwait(false);
            var page = (requestPage - 1) * PAGE_SIZE > count ? 1 : requestPage;

            var inventoryItems = await query
                .Skip(PAGE_SIZE * (page - 1))
                .Take(PAGE_SIZE)
                .ProjectTo<Models.InventoryItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return new SearchInventoryResponse
            {
                CurrentPage = page,
                PageCount = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(count) / PAGE_SIZE)),
                PageSize = PAGE_SIZE,
                Results = inventoryItems
            };
        }
    }
}