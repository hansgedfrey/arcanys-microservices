
namespace ARC.Infrastructure
{ 
    public class AlreadyExistsException : Exception
    {
        public AlreadyExistsException(string name, object? key = null)
            : base($"\"{name}\" with key ({key}) already exists.")
        {
        }
    }
}
