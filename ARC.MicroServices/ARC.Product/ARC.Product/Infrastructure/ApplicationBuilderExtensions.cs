namespace ARC.Product.Infrastructure
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
