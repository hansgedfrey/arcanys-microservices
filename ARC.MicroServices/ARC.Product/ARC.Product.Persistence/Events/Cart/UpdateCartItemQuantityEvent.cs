
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARC.Product.Persistence.Events.Cart
{
    public record UpdateCartItemQuantityEvent : AbstractCartEvent
    {
        [Required]
        [Column("CartItemId")]
        public Guid CartItemId { get; init; }
        public virtual Entities.CartItem CartItem { get; init; } = null!;
        [Column("Quantity")]
        [Required]
        public required int Quantity { get; init; }
    }
}
