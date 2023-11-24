
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ARC.Product.Persistence.Events.Cart
{
    public record RemoveItemFromCartEvent : AbstractCartEvent
    {
        [Required]
        [Column("CartItemId")]
        public Guid CartItemId { get; init; }
        public virtual Entities.CartItem CartItem { get; init; } = null!;
    }
}
