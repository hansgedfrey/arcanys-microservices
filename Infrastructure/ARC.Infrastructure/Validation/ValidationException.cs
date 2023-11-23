using System.Runtime.Serialization;

namespace ARC.Infrastructure
{
    [Serializable]
    internal class ValidationException : Exception
    {
        public ValidationException() { }

        public ValidationException(List<ValidationError> errors) { Errors = errors; }

        public ValidationException(string? message) : base(message) { }

        public ValidationException(string? message, Exception? innerException) : base(message, innerException) { }

        protected ValidationException(SerializationInfo info, StreamingContext context) : base(info, context) { }

        public List<ValidationError>? Errors { get; init; }
    }
}
