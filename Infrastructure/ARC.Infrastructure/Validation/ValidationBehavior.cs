using FluentValidation;
using MediatR;

namespace ARC.Infrastructure
{
    /// <summary>
    /// The is registered againts our MediatR pipeline. This is used to intercept all the validation failures by all the validation classes which derives from <AbstractValidator>.
    /// Invoke the FluentValidation Validate method. This will throw the ValidationException exception if there are validation errors.
    /// ValidationException will be handled by our ValidationExceptionHandlingMiddleware middleware.
    /// </summary>
    public sealed class ValidationBehavior<TRequest, TResponse>
        : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            var context = new ValidationContext<TRequest>(request);

            var validationFailures = await Task.WhenAll(
                _validators.Select(validator => validator.ValidateAsync(context)));

            var errors = validationFailures
                .Where(validationResult => !validationResult.IsValid)
                .SelectMany(validationResult => validationResult.Errors)
                .Select(validationFailure => new ValidationError { PropertyName = validationFailure.PropertyName, ErrorMessage = validationFailure.ErrorMessage })
                .ToList();

            if (errors.Any())
                throw new ValidationException(errors);

            var response = await next();

            return response;
        }
    }
}
