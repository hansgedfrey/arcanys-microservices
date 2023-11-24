using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ARC.UserManagement.Persistence.Events
{
    public abstract record AbstractEvent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid EventId { get; private set; }
        public string Discriminator { get; } = null!;
        public DateTime Occurred { get; init; }
    }
}
