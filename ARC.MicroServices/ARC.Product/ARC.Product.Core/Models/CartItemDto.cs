using AutoMapper;

namespace ARC.Product.Core.Models
{
    public record CartItemDto : ARC.Infrastructure.IMapFrom<Persistence.Entities.CartItem>
    { 
        public Guid CartItemId { get; set; } 
        public required ProductDto Product { get; set; }
        public required CartDto Cart { get; set; }
        public int Quantity { get; set; }
        public DateTime Created { get; set; }
        public Persistence.Common.CartItemState CartItemState { get; set; }
        public void Mapping(Profile profile) 
        {
            profile.CreateMap<Persistence.Entities.CartItem, CartItemDto>()
                   .ForMember(p => p.Created, o => o.MapFrom(s => s.Events.OrderBy(e => e.Occurred).Select(e => (DateTime?)e.Occurred).FirstOrDefault()))
                   .ForMember(p => p.Cart, o => o.MapFrom(s => s.Cart))
                   .ForMember(p => p.Product, o => o.MapFrom(s => s.Product));
        } 
    }
}
