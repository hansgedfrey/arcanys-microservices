using ARC.Product.Core.CQRS.Category.Commands.RemoveInventoryItem;
using ARC.Product.Core.CQRS.Inventory.Commands.GetInventoryItem;
using ARC.Product.Core.CQRS.Inventory.Commands.UpsertInventoryItem;
using ARC.Product.Core.CQRS.Inventory.Queries.SearchInventory;
using MediatR; 

namespace ARC.Product.Web.Endpoints
{
    internal static class InventoryItemEndpoints
    {
        public static WebApplication MapInventoryItemEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/inventory-items").WithTags("InventoryItems").WithOpenApi();

            group.MapGet("", async (ISender sender, string? query, int? page, InventoryItemSortOptions sortOrder) => await sender.Send(
                  new SearchInventoryQuery
                  {
                      Query = query,
                      Page = page,
                      SortOrder = sortOrder
                  })
              ).WithName("InventoryItems");

            group.MapGet("inventory-item/{inventoryItemId}", async (ISender sender, Guid inventoryItemId) => await sender.Send(new GetInventoryItemInfoQuery { InventoryItemId = inventoryItemId }))
                .WithName("GetInventoryItem")
                .ProducesValidationProblem();

            group.MapPost("upsert-inventory-item", async (ISender sender, UpsertInventoryItemCommand command) => await sender.Send(command))
                 .WithName("UpsertInventoryItem")
                 .ProducesValidationProblem();

            group.MapPost("remove-inventory-item", async (ISender sender, RemoveInventoryItemCommand command) => await sender.Send(command))
                .WithName("RemoveInventoryItem")
                .ProducesValidationProblem();

            return app;
        }
    }
}
