
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Persistence.Events.InventoryItem;

namespace ARC.Product.Persistence.Entities
{
    [Index(nameof(ProductId), IsUnique = true)]
    public class InventoryItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid InventoryItemId { get; set; }
        [Required]
        public Guid ProductId { get; set; }
        public virtual Product Product { get; private set; } = null!;
        [Required]
        public int Quantity { get; set; }
        public string? Details { get; set; }

        public virtual ICollection<AbstractInventoryItemEvent> Events { get; private set; } = new HashSet<AbstractInventoryItemEvent>();

        public void AppendEvent(AbstractInventoryItemEvent @event)
        {
            switch (@event)
            {
                //add events here if needed
                case AddInventoryItemEvent _:
                case UpdateInventoryItemEvent _:
                    goto default;
                default:
                    Events.Add(@event);
                    break;
            }
        }
    }
}
