namespace ARC.Product.Web.Models
{
    public class PublishedCategoryDto
    {
        public Guid? CategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Event { get; set; }
    }
}
