namespace ARC.UserAuthManagement.Web.Services.RabbitMQ
{
    public interface IMessageBusClient
    {
        void PublishNewCategory(Models.PublishCategoryDto category);
    }
}
