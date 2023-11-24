using ARC.Product.Core.CQRS.Cart.Commands.AddToCart;
using ARC.Product.Core.CQRS.Cart.Commands.CreateCart;
using ARC.Product.Core.CQRS.Cart.Commands.RemoveFromCart;
using ARC.Product.Core.CQRS.Cart.Queries.ViewCart;
using MediatR;

namespace ARC.Product.Web.Endpoints
{
    internal static class CartEndpoints
    {
        public static WebApplication MapCartEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/cart").WithTags("Carts");

            group.MapPost("create-cart", async (ISender sender, CreateCartCommand command) => await sender.Send(command))
                 .WithName("CreateCart")
                 .ProducesValidationProblem();

            group.MapPost("add-to-cart", async (ISender sender, AddToCartCommand command) => await sender.Send(command))
                 .WithName("AddToCart")
                 .ProducesValidationProblem();

            group.MapPost("remove-from-cart", async (ISender sender, RemoveFromCartCommand command) => await sender.Send(command))
                .WithName("RemoveFromCart")
                .ProducesValidationProblem();

            group.MapGet("view-cart/{cartId}", async (ISender sender, Guid cartId) => await sender.Send(new ViewCartQuery { CartId = cartId }))
                .WithName("ViewCart")
                .ProducesValidationProblem();

            return app;
        }
    }
}
