using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ARC.Product.Core.DependencyInjection
{

    /// <summary>
    /// TODO: Move this away from the Core project and create a Nuget package instead to make it reusable to other future projects.
    /// </summary>
    public static class AutoMapperServiceExtensions
    {
        /// <summary>
        /// An extension method that registers Automapper and creates a default profile.
        /// Using reflection, scan the assembly to get all the classes which derives from IMapFrom interface. 
        /// This tells us that the class needs to be mapped by Automapper. Invoke the Mapping() method to create the mapping. 
        /// </summary>
        /// <returns>Returns the service collection with Automapper registered.</returns>
        public static IServiceCollection AddAutoMapperAndProfile(this IServiceCollection services, params Assembly[] assemblies)
        {
            var profile = new AutoMapperProfile();

            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile(profile);
            });

            return services;
        }
    }

    public interface IMapFrom<TSource>
    {
        void Mapping(Profile profile) => profile.CreateMap(typeof(TSource), GetType());
    }

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            ApplyMappingsFromAssembly(Assembly.GetExecutingAssembly());
        }

        private void ApplyMappingsFromAssembly(Assembly assembly)
        {
            var types = assembly.GetExportedTypes()
            .Where(t => t.GetInterfaces()
            .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IMapFrom<>)))
            .ToList();

            foreach (var type in types)
            {
                var instance = Activator.CreateInstance(type);

                var methodInfo = type.GetMethod("Mapping")
                    ?? type.GetInterface("IMapFrom`1").GetMethod("Mapping");

                methodInfo?.Invoke(instance, new object[] { this });
            }
        }
    }
}
