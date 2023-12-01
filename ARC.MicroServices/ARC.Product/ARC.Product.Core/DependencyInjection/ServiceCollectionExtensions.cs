using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Persistence.Entities;
using ARC.Infrastructure;

namespace ARC.Product.Core.DependencyInjection
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
            services.AddScoped<CoreHelper>();

            return services;
        }
    }
}
