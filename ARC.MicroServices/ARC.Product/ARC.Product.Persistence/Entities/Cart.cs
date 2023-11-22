using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ARC.Product.Persistence.Events.Cart;

namespace ARC.Product.Persistence.Entities
{
    public class Cart
    { 
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CartId { get; set; }
        [Required]
        public Guid UserId { get; private set; }
        public virtual ICollection<AbstractCartEvent> Events { get; private set; } = new HashSet<AbstractCartEvent>();
        public virtual ICollection<CartItem> CartItems { get; init; } = new HashSet<CartItem>();

        public void AppendEvent(AbstractCartEvent @event)
        {
            switch (@event)
            {
                //add events here if needed
                case CreateCartEvent _:
                case AddItemToCartEvent _:
                case RemoveItemFromCartEvent _:
                case CheckoutCartEvent _: 
                    goto default;
                default:
                    Events.Add(@event);
                    break;
            }
        }
    }
}
