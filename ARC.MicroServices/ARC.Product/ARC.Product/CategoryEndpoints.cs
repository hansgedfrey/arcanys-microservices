using ARC.Product.Core.CQRS.Category.Commands.UpsertCategory;
using ARC.Product.Core.CQRS.Category.Queries.GetCategoryInfo;
using MediatR;

namespace ARC.Product.Web
{
    internal static class CategoryEndpoints
    {
        public static WebApplication MapCategoryEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/categories").WithTags("Categories");
             
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
