using MediatR;
using Microsoft.AspNetCore.Hosting.Server;

namespace ARC.UserAuthManagement
{
    internal static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/users").WithTags("Users");
            group.MapGet("hello/{param}", (ISender sender, string param) => {
                var testing = param;
            });
            group.MapPost("register", async (ISender sender) => { })
                .WithName("RegisterUser")
                .WithDescription("Register a new user")
                .ProducesValidationProblem();

            group.MapPost("login", async (ISender sender) => { })
                .WithName("Login")
                .WithDescription("Login using username and password and returns a JWT token for authetication to other endpoints.")
                .ProducesValidationProblem();

            group.MapPost("update-profile", async (ISender sender) => { })
                .WithName("UpdateUserProfile")
                .WithDescription("Update user profile")
                .ProducesValidationProblem();

            group.MapPost("change-password", async (ISender sender) => { })
                .WithName("ChangePassword")
                .WithDescription("Change an existing user's password")
                .ProducesValidationProblem();

            return app;
        }
    }
}
