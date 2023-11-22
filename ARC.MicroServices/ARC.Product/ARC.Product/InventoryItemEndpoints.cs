using ARC.Product.Core.CQRS.Inventory.Commands.GetInventoryItem;
using ARC.Product.Core.CQRS.Inventory.Commands.UpsertInventoryItem;
using ARC.Product.Core.CQRS.Inventory.Queries.SearchInventory;
using MediatR;

namespace ARC.Product.Web
{
    internal static class InventoryItemEndpoints
    {
        public static WebApplication MapInventoryItemEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/inventory-items").WithTags("InventoryItems");

            group.MapGet("", async (ISender sender, string? query, int page) => await sender.Send(
                  new SearchInventoryQuery
                  {
                      Query = query,
                      Page = page
                  })
              ).WithName("InventoryItems");

            group.MapPost("upsert-inventory-item", async (ISender sender, UpsertInventoryItemCommand command) => await sender.Send(command))
                 .WithName("UpsertInventoryItem")
                 .ProducesValidationProblem();

            group.MapGet("inventory-item/{inventoryItemId}", async (ISender sender, Guid inventoryItemId) => await sender.Send(new GetInventoryItemInfoQuery { InventoryItemId = inventoryItemId }))
                .WithName("GetInventoryItem")
                .ProducesValidationProblem();

            return app;
        }
    }
}
