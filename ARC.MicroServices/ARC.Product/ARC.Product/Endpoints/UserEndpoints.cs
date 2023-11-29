using ARC.Product.Web.Services.gRPC;
using MediatR;

namespace ARC.Product.Web.Endpoints
{
    internal static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/users").WithTags("Users");

            group.MapPost("try-login", async (ISender sender, LoginRequestCommand command) => await sender.Send(command))
                .WithName("TryLogin")
                .WithOpenApi(config => new(config) 
                {
                     Summary = "Demonstrates a communication between the UserManagement service using gRPC",
                     Description = "Calls the Authentication Service in UserAuthManagement microservice. " +
                     "Please see Services/gRPC/AuthenticationService.cs for the handler."
                })
                .ProducesValidationProblem();

            return app;
        }
    }
}
