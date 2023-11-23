using MediatR; 

namespace ARC.Product.Web
{
    internal static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/users").WithTags("Users");
             
            group.MapPost("try-login", async (ISender sender, LoginCommand command) => await sender.Send(command))
                .WithName("TryLogin")
                .WithDescription("Demonstrates a communication between the UserManagement service using gRPC")
                .ProducesValidationProblem();

            return app;
        }
    }
}
