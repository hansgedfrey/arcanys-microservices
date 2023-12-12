using Arc.Common.Automapper;
using AutoMapper;
namespace ARC.Product.Core.Models
{
    public record CartDto : IMapFrom<Persistence.Entities.Cart>
    {
        public required Guid CartId { get; set; }
        public DateTime Created { get; set; }
        public IList<CartItemDto> CartItems { get; set; } = null!;
        public decimal Total { get; set; }
        public void Mapping(Profile profile) 
        {
            profile.CreateMap<Persistence.Entities.Cart, CartDto>()
                   .ForMember(p => p.Created, o => o.MapFrom(s => s.Events.OrderBy(e => e.Occurred).Select(e => (DateTime?)e.Occurred).FirstOrDefault()))
                   .ForMember(p => p.CartItems, o => o.MapFrom(s => s.Events.OfType<Persistence.Events.Cart.AddItemToCartEvent>().Select(p => p.CartItem).Where(c => c.CartItemState == Persistence.Common.CartItemState.Added)))
                   .ForMember(p => p.Total, o => o.MapFrom(s => s.CartItems.Sum(c => c.Quantity * c.Product.Price)));
        }
    }
}
