using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ARC.Product.Persistence.Entities
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CategoryId { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public virtual ICollection<Product> Products { get; private set; } = new HashSet<Product>(); 
    }
}
