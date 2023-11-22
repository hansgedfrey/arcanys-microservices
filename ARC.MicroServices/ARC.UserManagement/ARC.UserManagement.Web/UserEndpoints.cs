 
namespace ARC.UserManagement.Web
{
    internal static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/users").WithTags("Users");
             
            //group.MapPost("upsert-category", async (ISender sender, UpsertCategoryCommand command) => await sender.Send(command))
            //     .WithName("UpsertCategory")
            //     .ProducesValidationProblem();

            //group.MapGet("category/{categoryId}", async (ISender sender, Guid categoryId) => await sender.Send(new GetCategoryInfoQuery { CategoryId = categoryId }))
            //     .WithName("GetCategoryInfo")
            //     .ProducesValidationProblem();

            return app;
        }
    }
}
