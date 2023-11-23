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

            //group.MapPost("login", async (ISender sender) => { })
            //    .WithName("Login")
            //    .WithDescription("Login using username and password and returns a JWT token for authetication to other endpoints.")
            //    .ProducesValidationProblem();



            //group.MapPost("change-password", async (ISender sender) => { })
            //    .WithName("ChangePassword")
            //    .WithDescription("Change an existing user's password")
            //    .ProducesValidationProblem();

            return app;
        }
    }
}
