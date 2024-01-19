using ARC.Product.Core.CQRS.Category.Commands.UpsertCategory;
using ARC.Product.Core.CQRS.Category.Queries.GetCategoryInfo;
using ARC.Product.Core.CQRS.Category.Queries.SearchCategories;
using MediatR;

namespace ARC.Product.Web.Endpoints
{
    internal static class CategoryEndpoints
    {
        public static WebApplication MapCategoryEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/categories").WithTags("Categories");

            group.MapGet("", async (ISender sender, string? query, int page) => await sender.Send(
               new SearchCategoriesQuery
               {
                   Query = query,
                   Page = page
               })
           ).WithName("Categories");

            group.MapPost("upsert-category",
                async (ISender sender, UpsertCategoryCommand command) => await sender.Send(command))
                 .WithName("UpsertCategory")
                 .ProducesValidationProblem();

            group.MapGet("category/{categoryId}", async (ISender sender, Guid categoryId) => await sender.Send(new GetCategoryInfoQuery { CategoryId = categoryId }))
                 .WithName("GetCategoryInfo")
                 .ProducesValidationProblem();

            return app;
        }
    }
}
