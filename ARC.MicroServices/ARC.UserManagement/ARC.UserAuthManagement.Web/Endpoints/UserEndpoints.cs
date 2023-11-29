using ARC.UserAuthManagement.Web.Models;
using ARC.UserAuthManagement.Web.Services.Http;
using ARC.UserAuthManagement.Web.Services.RabbitMQ;
using ARC.UserManagement.Core.CQRS.User.Commands.ChangePassword;
using ARC.UserManagement.Core.CQRS.User.Commands.Login;
using ARC.UserManagement.Core.CQRS.User.Commands.Register;
using ARC.UserManagement.Core.CQRS.User.Commands.UpdateProfile;
using MediatR;

namespace ARC.UserAuthManagement.Web.Endpoints
{
    internal static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/users").WithTags("Users");

            group.MapPost("register", async (ISender sender, RegisterCommand command) => await sender.Send(command))
                .WithName("RegisterUser")
                .WithOpenApi(config => new(config)
                {
                    Description = "Adds a new user. Does not support claims at the moment."
                })
                .ProducesValidationProblem();

            group.MapPost("update-profile", async (ISender sender, UpdateProfileCommand command) => await sender.Send(command))
                .WithName("UpdateUserProfile")
                .WithOpenApi(config => new(config)
                {
                    Description = "Update an existing user's profile."
                })
                .ProducesValidationProblem();

            group.MapPost("change-password", async (ISender sender, ChangePasswordCommand command) => await sender.Send(command))
                .WithName("ChangePassword")
                .WithOpenApi(config => new(config)
                {
                    Description = "Update an existing user's password."
                })
                .ProducesValidationProblem();

            group.MapPost("login", async (ISender sender, LoginCommand command) => await sender.Send(command))
                 .WithName("Login")
                 .WithOpenApi(config => new(config)
                 {
                     Description = "Try login using an existing user's username and password. " +
                     "Does not support any login mechanism at the moment, " +
                     "it just checks the DB for the correct username and password"
                 })
                 .ProducesValidationProblem();

            group.MapGet("category-http", async (ISender sender, ICategoryHttpClient categoryHttpClient) =>
            {
                var categoryId = await categoryHttpClient.InsertCategoryAsync(new CategoryDto { Name = "Category Name", Description = "Category description" });
                var category = categoryId != Guid.Empty ? await categoryHttpClient.GetCategoryAsync(categoryId) : default;

                if (category != null)
                    Console.WriteLine($"Category with name {category.Name} was inserted successfully.");
            })
            .WithName("CategoryHttp") 
            .WithOpenApi(config => new(config)
            {
                Summary = "Insert and get a new category thru http.",
                Description = "Test http client for categories (POST and GET)." +
                "Please see Services/Http/CategoryHttpClient.cs for the implementation."
            })
            .ProducesValidationProblem();

            group.MapPost("publish-category", async (ISender sender, IMessageBusClient messageBusClient) =>
            {
                //Send Async Message
                try
                {
                    var category = new PublishCategoryDto
                    {
                        CategoryId = null,
                        Name = "Test category",
                        Description = "Publish a new category async",
                        Event = "Category_Published"
                    };

                    messageBusClient.PublishNewCategory(category);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"--> Could not send asynchronously: {ex.Message}");
                }
            })
            .WithName("PublishCategory")
            .WithOpenApi(config => new(config)
            {
                Summary = "Publish a new event asyncronously using RabbitMQ",
                Description = "This a test endpoint for the RabbitMQ message bus." +
                "Please see Services/RabbitMQ/MessageBusClient.cs and Services/RabbitMQEventProcessing/EventProcessor.cs for the implementation.",
            })
            .ProducesValidationProblem();

            return app;
        }
    }
}
