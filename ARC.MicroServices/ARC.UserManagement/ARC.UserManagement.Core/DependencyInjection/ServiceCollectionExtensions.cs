using Arc.Common.Automapper;
using ARC.UserManagement.Persistence.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ARC.UserManagement.Core.DependencyInjection
{
    /// <summary>
    /// This is where our services for the core project are consolidated.
    /// Needs to be called in the main project to add all dependencies.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration, params Assembly[] assemblies)
        { 
            services.AddValidatorsFromAssemblies(assemblies);
            services.AddDbContext<ApplicationDbContext>(opt => opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection")!));
            services.AddAutoMapperAndProfile(assemblies);
            services.AddDataProtection();
            return services;
        }
    }
}
