namespace ARC.Product.Infrastructure
{
    internal class ValidationError
    {
        public required string PropertyName { get; init; }
        public required string ErrorMessage { get; init; }
    }
}
