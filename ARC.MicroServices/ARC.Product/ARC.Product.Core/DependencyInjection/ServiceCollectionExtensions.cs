using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Persistence.Entities;

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
            var connectionString = 
                $"Data Source={Environment.GetEnvironmentVariable("DB_HOST")};" +
                $"Initial Catalog={Environment.GetEnvironmentVariable("DB_NAME")};" +
                $"User ID=sa;Password={Environment.GetEnvironmentVariable("DB_SA_PASSWORD")};TrustServerCertificate=true";

            services.AddValidatorsFromAssemblies(assemblies);
            services.AddDbContext<ApplicationDbContext>(opt => opt.UseSqlServer(connectionString));
            services.AddAutoMapperAndProfile(assemblies);
            services.AddScoped<CoreHelper>();

            return services;
        }
    }
}
