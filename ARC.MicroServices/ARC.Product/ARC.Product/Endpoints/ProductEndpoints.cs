using ARC.Product.Core.CQRS.Product.Commands.RemoveProduct;
using ARC.Product.Core.CQRS.Product.Commands.UpsertProduct;
using ARC.Product.Core.CQRS.Product.Queries.GetProductInfo;
using ARC.Product.Core.CQRS.Product.Queries.SearchProducts;
using MediatR;

namespace ARC.Product.Web.Endpoints
{
    internal static class ProductEndpoints
    {
        public static WebApplication MapProductEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/products").WithTags("Products");

            group.MapGet("", async (ISender sender, string? query, Guid? categoryId, int? page) => await sender.Send(
                new SearchProductsQuery
                {
                    Query = query,
                    Page = page,
                    CategoryId = categoryId,
                })
            ).WithName("Products");

            group.MapGet("product/{productId}", async (ISender sender, Guid productId) => await sender.Send(new GetProductInfoQuery { ProductId = productId }))
                .WithName("GetProductInfo")
                .ProducesValidationProblem();

            group.MapPost("upsert-product", async (ISender sender, UpsertProductCommand command) => await sender.Send(command))
                .WithName("UpsertProduct")
                .ProducesValidationProblem();

            group.MapPost("remove-product", async (ISender sender, RemoveProductCommand command) => await sender.Send(command))
                .WithName("RemoveProduct")
                .ProducesValidationProblem();

            return app;
        }
    }
}
