
using System.ComponentModel.DataAnnotations.Schema;

namespace ARC.Product.Persistence.Events.InventoryItem
{
    public record UpdateInventoryItemEvent : AbstractInventoryItemEvent
    {
        [Column("Quantity")]
        public required int Quantity { get; init; }
    }
} 