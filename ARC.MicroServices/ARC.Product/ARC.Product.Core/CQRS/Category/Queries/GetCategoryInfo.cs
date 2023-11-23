using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Category.Queries.GetCategoryInfo
{
    public record GetCategoryInfoQuery : IRequest<Models.CategoryDto>
    {
        public required Guid CategoryId { get; init; }
    }

    public class GetCategoryInfoQueryValidator : AbstractValidator<GetCategoryInfoQuery>
    {
        public GetCategoryInfoQueryValidator()
        {
            RuleFor(x => x.CategoryId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<GetCategoryInfoQuery, Models.CategoryDto>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<Models.CategoryDto> Handle(GetCategoryInfoQuery request, CancellationToken cancellationToken)
        {
            var category = await _applicationDbContext.Categories
                                .Where(p => p.CategoryId == request.CategoryId)
                                .ProjectTo<Models.CategoryDto>(_mapper.ConfigurationProvider)
                                .SingleOrDefaultAsync(cancellationToken);

            if (category == null)
                throw new ARC.Infrastructure.Exceptions.NotFoundException(nameof(category), request.CategoryId);

            return category;
        }
    }
}