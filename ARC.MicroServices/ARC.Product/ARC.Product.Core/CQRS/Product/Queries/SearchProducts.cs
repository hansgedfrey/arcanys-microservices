using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Product.Queries.SearchProducts
{
    public record SearchProductsQuery : IRequest<SearchProductsResponse>
    {
        public int? Page { get; set; }
        public string? Query { get; init; }
        public Guid? CategoryId { get; set; }
    }

    public class GetAllProductsQueryValidator : AbstractValidator<SearchProductsQuery>
    {
        public GetAllProductsQueryValidator()
        {
            RuleFor(x => x.Page).GreaterThan(0);
        }
    }

    public class SearchProductsResponse
    {
        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
        public int PageSize { get; set; }
        public IList<Models.ProductDto> Results { get; set; } = null!;
    }

    public class Handler : IRequestHandler<SearchProductsQuery, SearchProductsResponse>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;
        private const int PAGE_SIZE = 15;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<SearchProductsResponse> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
        {
            var query = _applicationDbContext.Products
                .Include(c=>c.Category)
                .Include(e=>e.Events)
                .AsNoTracking();
            
            var requestPage = request.Page ?? 1;
 
            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                query = _applicationDbContext.Products
                    .Where(c => EF.Functions.Like(c.ProductName, $"%{request.Query}%") || 
                    !string.IsNullOrWhiteSpace(c.Description) && EF.Functions.Like(c.Description, $"%{request.Query}%"))
                    .AsNoTracking();
            }

            if (request.CategoryId != null)
                query = query.Where(c => c.CategoryId == request.CategoryId);

            var count = await query.CountAsync(cancellationToken).ConfigureAwait(false);
            var page = (requestPage - 1) * PAGE_SIZE > count ? 1 : requestPage;
             
            var products = await query
                .Skip(PAGE_SIZE * (page - 1))
                .Take(PAGE_SIZE)
                .ProjectTo<Models.ProductDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return new SearchProductsResponse
            {
                CurrentPage = page,
                PageCount = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(count) / PAGE_SIZE)),
                PageSize = PAGE_SIZE,
                Results = products
            };
        }
    }
}