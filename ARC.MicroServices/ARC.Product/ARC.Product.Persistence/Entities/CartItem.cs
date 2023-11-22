using ARC.Product.Persistence.Common;
using ARC.Product.Persistence.Events.CartItem;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARC.Product.Persistence.Entities
{
    [Index(nameof(ProductId), nameof(CartId))]
    public class CartItem
    { 
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CartItemId { get; set; }

        [Required]
        public Guid ProductId { get; set; }
        public virtual Product Product { get; private set; } = null!;
        [Required]
        public Guid CartId { get; set; }
        public virtual Cart Cart { get; private set; } = null!;
        [Required]
        public int Quantity { get; set; }

        [Required]
        public CartItemState CartItemState { get; set; }
        public virtual ICollection<AbstractCartItemEvent> Events { get; private set; } = new HashSet<AbstractCartItemEvent>();

        public void AppendEvent(AbstractCartItemEvent @event)
        {
            switch (@event)
            {
                //add events here if needed
                case AddedToCartEvent _:
                    goto default;
                default:
                    Events.Add(@event);
                    break;
            }
        }
    }
}
