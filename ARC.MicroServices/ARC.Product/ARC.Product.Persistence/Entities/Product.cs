using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ARC.Product.Persistence.Events.Product;
using Microsoft.EntityFrameworkCore;

namespace ARC.Product.Persistence.Entities
{
    [Index(nameof(CategoryId), nameof(SKU), IsUnique = true)]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ProductId { get; set; }
        [Required]
        public string ProductName { get; set; } = null!;
        [Required] 
        public string SKU { get; set; } = null!;
        public string? Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; private set; } = null!; 
        public virtual ICollection<AbstractProductEvent> Events { get; private set; } = new HashSet<AbstractProductEvent>();

        public void AppendEvent(AbstractProductEvent @event) 
        {
            switch (@event)
            {
                //add events here if needed
                case AddProductEvent _:
                case UpdateProductPriceEvent _:
                case UpdateProductEvent _:
                    goto default;
                default:
                    Events.Add(@event);
                    break;
            }
        }
    }
}
