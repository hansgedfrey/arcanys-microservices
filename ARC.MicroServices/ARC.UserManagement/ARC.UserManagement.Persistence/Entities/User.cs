using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ARC.UserManagement.Persistence.Events;

namespace ARC.UserManagement.Persistence.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid UserId { get; set; }
        [Required]
        [EmailAddress]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        public virtual ICollection<AbstractEvent> Events { get; private set; } = new HashSet<AbstractEvent>();

        public void AppendEvent(AbstractEvent @event)
        {
            switch (@event)
            {
                //add events here if needed
                case RegisterEvent _:
                case LoginEvent _:
                case ChangePasswordEvent _:
                case UpdateProfileEvent _:
                    goto default;
                default:
                    Events.Add(@event);
                    break;
            }
        }
    }
}
