using ARC.Extension.ValidationMiddleWare.Exceptions;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Core.CQRS.Product.Queries.GetProductInfo
{
    public record GetProductInfoQuery : IRequest<Models.ProductDto>
    {
        public required Guid ProductId { get; init; }
    }

    public class GetProductInfoQueryValidator : AbstractValidator<GetProductInfoQuery>
    {
        public GetProductInfoQueryValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<GetProductInfoQuery, Models.ProductDto>
    {
        private readonly Persistence.Entities.ApplicationDbContext _applicationDbContext;
        private readonly AutoMapper.IMapper _mapper;

        public Handler(AutoMapper.IMapper mapper, Persistence.Entities.ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<Models.ProductDto> Handle(GetProductInfoQuery request, CancellationToken cancellationToken)
        {
            var product = await _applicationDbContext.Products
                                .Where(p => p.ProductId == request.ProductId)
                                .ProjectTo<Models.ProductDto>(_mapper.ConfigurationProvider)
                                .SingleOrDefaultAsync(cancellationToken);

            if (product == null)
                throw new NotFoundException(nameof(product), request.ProductId);

            return product;
        }
    }
}