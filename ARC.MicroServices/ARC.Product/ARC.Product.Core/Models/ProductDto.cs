using Arc.Common.Automapper;
using AutoMapper;

namespace ARC.Product.Core.Models
{
    public record ProductDto : IMapFrom<Persistence.Entities.Product>
    {
        public required Guid ProductId { get; set; }
        public required string ProductName { get; set; }
        public string? Description { get; set; }
        public required decimal Price { get; set; }
        public required string SKU { get; set; }
        public DateTime? Created { get; set; }
        public PriceUpdate LatestPriceUpdate { get; set; } = null!;
        public required CategoryDto Category { get; set; }

        public void Mapping(Profile profile) 
        {
            profile.CreateMap<Persistence.Entities.Product, ProductDto>()
                  .ForMember(p => p.Created, o => o.MapFrom(s => s.Events.OrderBy(e => e.Occurred).Select(e => (DateTime?)e.Occurred).FirstOrDefault()))
                  .ForMember(p => p.LatestPriceUpdate, o => o.MapFrom(s => s.Events.OfType<Persistence.Events.Product.UpdateProductPriceEvent>().OrderBy(e => e.Occurred).Select(p =>
                      new PriceUpdate
                      {
                          Price = p.UpdatedPrice,
                          UpdatedDate = p.Occurred
                      }).FirstOrDefault()))
                  .ForMember(p => p.Category, o => o.MapFrom(s => s.Category));
        }

        public record PriceUpdate 
        {
            public decimal Price { get; set; }
            public DateTime UpdatedDate { get; set; }
        }
    }
}
