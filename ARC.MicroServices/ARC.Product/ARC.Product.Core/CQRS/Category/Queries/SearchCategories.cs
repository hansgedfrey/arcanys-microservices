using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace ARC.Product.Core.CQRS.Category.Queries.SearchCategories
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CategorySortOptions
    {
        CategoryName,
        CategoryNameDesc
    }

    public record SearchCategoriesQuery : IRequest<SearchCategoriesResponse>
    {
        public int Page { get; init; } = 1;
        public string? Query { get; init; }
        public CategorySortOptions SortOrder { get; set; }
    }

    public class SearchCategoriesQueryValidator : AbstractValidator<SearchCategoriesQuery>
    {
        public SearchCategoriesQueryValidator()
        {
            RuleFor(x => x.Page).GreaterThan(0);
        }
    }

    public class SearchCategoriesResponse
    {
        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
        public int PageSize { get; set; }
        public IList<Models.CategoryDto> Results { get; set; } = null!;
    }

    public class Handler : IRequestHandler<SearchCategoriesQuery, SearchCategoriesResponse>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;
        private const int PAGE_SIZE = 10;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<SearchCategoriesResponse> Handle(SearchCategoriesQuery request, CancellationToken cancellationToken)
        {
            var query = _applicationDbContext.Categories.AsNoTracking();
    
            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                query = _applicationDbContext.Categories
                    .Where(c => EF.Functions.Like(c.Name, $"%{request.Query}%") || !string.IsNullOrWhiteSpace(c.Description) && EF.Functions.Like(c.Description, $"%{request.Query}%"))
                    .AsNoTracking();
            }

            var count = await query.CountAsync(cancellationToken).ConfigureAwait(false);
            var page = (request.Page - 1) * PAGE_SIZE > count ? 1 : request.Page;

            query = request.SortOrder switch
            {
                CategorySortOptions.CategoryName => query.OrderBy(i => i.Name),
                CategorySortOptions.CategoryNameDesc => query.OrderByDescending(i => i.Name),
                _ => query,
            };

            var products = await query
                .Skip(PAGE_SIZE * (page - 1))
                .Take(PAGE_SIZE)
                .ProjectTo<Models.CategoryDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return new SearchCategoriesResponse
            {
                CurrentPage = page,
                PageCount = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(count) / PAGE_SIZE)),
                PageSize = PAGE_SIZE,
                Results = products
            };
        }
    }
}