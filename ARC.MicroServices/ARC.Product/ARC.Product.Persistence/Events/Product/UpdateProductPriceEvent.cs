
namespace ARC.Product.Persistence.Events.Product
{
    public record UpdateProductPriceEvent : AbstractProductEvent
    {
        public required decimal UpdatedPrice { get; init; }
    }
} 