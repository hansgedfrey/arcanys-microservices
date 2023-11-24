
namespace ARC.Infrastructure.Validation
{
    internal class ValidationError
    {
        public required string PropertyName { get; init; }
        public required string ErrorMessage { get; init; }
    }
}
