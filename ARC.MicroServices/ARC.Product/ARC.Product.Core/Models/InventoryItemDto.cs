using AutoMapper;

namespace ARC.Product.Core.Models
{
    public record InventoryItemDto : ARC.Infrastructure.IMapFrom<Persistence.Entities.InventoryItem>
    {
        public required Guid InventoryItemId { get; set; }
        public DateTime Created { get; set; }
        public required ProductDto Product { get; set; } 
        public int Quantity { get; set; }
        public string? Details { get; set; }
        public IList<InventoryItemUpdate> InventoryItemUpdates { get; set; } = null!;

        public void Mapping(Profile profile) 
        { 
            profile.CreateMap<Persistence.Entities.InventoryItem, InventoryItemDto>()
                   .ForMember(p => p.Created, o => o.MapFrom(s => s.Events.OrderBy(e => e.Occurred).Select(e => (DateTime?)e.Occurred).FirstOrDefault()))
                   .ForMember(p => p.InventoryItemUpdates, o => o.MapFrom(s => s.Events.OfType<Persistence.Events.InventoryItem.UpdateInventoryItemEvent>().OrderBy(e => e.Occurred).Select(p =>
                      new InventoryItemUpdate
                      {
                          Quantity = p.Quantity,
                          UpdatedDate = p.Occurred
                      })))
                   .ForMember(p => p.Product, o => o.MapFrom(s => s.Product));
        }

        public record InventoryItemUpdate
        {
            public int Quantity { get; set; }
            public DateTime UpdatedDate { get; set; }
        }
    }
}
