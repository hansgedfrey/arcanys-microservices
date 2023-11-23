
namespace ARC.Infrastructure.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string name, object? key = null)
            : base($"\"{name}\" ({key}) was not found.")
        {
        }
    }
}
