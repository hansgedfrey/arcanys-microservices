using ARC.Product.Infrastructure;
using Microsoft.AspNetCore.Builder;

namespace ARC.Infrastructure
{ 
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseValidationExceptionHandling(this IApplicationBuilder app)
        {
            if (app == null)
                throw new ArgumentNullException(nameof(app));

            app.UseMiddleware<ValidationExceptionHandlingMiddleware>();

            return app;
        }
    }
}
