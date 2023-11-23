using ARC.UserAuthManagement.Web.Services.Http;
using ARC.UserManagement.Core.CQRS.User.Commands.ChangePassword;
using ARC.UserManagement.Core.CQRS.User.Commands.Login;
using ARC.UserManagement.Core.CQRS.User.Commands.Register;
using ARC.UserManagement.Core.CQRS.User.Commands.UpdateProfile;
using MediatR;

namespace ARC.UserAuthManagement.Web
{
    internal static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/users").WithTags("Users");

            group.MapPost("register", async (ISender sender, RegisterCommand command) => await sender.Send(command))
                .WithName("RegisterUser")
                .WithDescription("Register a new user")
                .WithOpenApi()
                .ProducesValidationProblem();

            group.MapPost("update-profile", async (ISender sender, UpdateProfileCommand command) => await sender.Send(command))
                .WithName("UpdateUserProfile")
                .WithDescription("Update user profile")
                .ProducesValidationProblem();

            group.MapPost("change-password", async (ISender sender, ChangePasswordCommand command) => await sender.Send(command))
                .WithName("ChangePassword")
                .WithDescription("Change an existing user's password")
                .ProducesValidationProblem();

            group.MapPost("login", async (ISender sender, LoginCommand command) => await sender.Send(command))
                 .WithName("Login")
                 .WithDescription("Try login using username and password")
                 .ProducesValidationProblem();

            group.MapGet("category-http", async (ISender sender, ICategoryHttpClient categoryHttpClient) =>
            {
                var categoryId = await categoryHttpClient.InsertCategoryAsync(new Models.CategoryDto { Name = "Category Name", Description = "Category description" });

                // check if we're getting the inserted category
                if (categoryId != Guid.Empty)
                {
                    var category = await categoryHttpClient.GetCategoryAsync(categoryId);
                }
            })
            .WithName("CategoryHttp")
            .WithDescription("Test http client for categories (POST and GET)")
            .ProducesValidationProblem();

            return app;
        }
    }
}
