using ARC.UserManagement.Persistence.Events;
using Microsoft.EntityFrameworkCore;

namespace ARC.UserManagement.Persistence.Entities
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {

        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        } 

        public virtual DbSet<User> Users => Set<User>();
        public virtual DbSet<RegisterEvent> RegisterEvents => Set<RegisterEvent>();
        public virtual DbSet<LoginEvent> LoginEvents => Set<LoginEvent>();
        public virtual DbSet<ChangePasswordEvent> ChangeEvents => Set<ChangePasswordEvent>();
        public virtual DbSet<UpdateProfileEvent> UpdateEvents => Set<UpdateProfileEvent>();
        public virtual DbSet<AbstractEvent> Events => Set<AbstractEvent>();
    }
}
