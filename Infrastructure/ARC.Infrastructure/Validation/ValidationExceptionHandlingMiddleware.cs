using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ARC.Product.Infrastructure
{
    /// <summary>
    /// Handles the exception thrown by our defined Validation behavior in the MediatR pipeline.
    /// Displays the Problem details with a comprehensive list of validation errors.
    /// </summary>
    public sealed class ValidationExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ValidationExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                var problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Type = "ValidationFailure",
                    Title = "Validation error",
                    Detail = "One or more validation errors has occurred"
                };

                if (ex.Errors is not null)
                    problemDetails.Extensions["errors"] = ex.Errors.GroupBy(p => p.PropertyName).Select(g => g.First());

                context.Response.StatusCode = StatusCodes.Status400BadRequest;

                await context.Response.WriteAsJsonAsync(problemDetails);
            }
        }
    }
}
