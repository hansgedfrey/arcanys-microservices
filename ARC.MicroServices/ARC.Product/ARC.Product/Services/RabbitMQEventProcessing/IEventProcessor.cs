namespace ARC.Product.Web.Services.RabbitMQEventProcessing
{
    public interface IEventProcessor
    {
        void ProcessEvent(string message);
    }
}
