using AutoMapper;

namespace ARC.Product.Core.Models
{
    public record CategoryDto : ARC.Infrastructure.IMapFrom<Persistence.Entities.Category>
    {
        public required Guid CategoryId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Persistence.Entities.Category, CategoryDto>();
        }
    }
}
