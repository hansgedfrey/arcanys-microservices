using ARC.Product.Core.CQRS.Category.Commands.UpsertCategory;
using ARC.Product.Web.Models;
using AutoMapper;
using MediatR;
using System.Text.Json;

namespace ARC.Product.Web.Services.RabbitMQEventProcessing
{
    public class EventProcessor : IEventProcessor
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IMapper _mapper;
        private readonly ISender _sender;

        public EventProcessor(IServiceScopeFactory scopeFactory, IMapper mapper, ISender sender)
        {
            _scopeFactory = scopeFactory;
            _mapper = mapper;
            _sender = sender;
        }

        public void ProcessEvent(string message)
        {
            var eventType = DetermineEvent(message);

            switch (eventType)
            {
                case EventType.Category_Published:
                    receivePublishedCategory(message);
                    break;
                default:
                    break;
            }
        }

        private async void receivePublishedCategory(string publishedCategoryMessage)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var category = JsonSerializer.Deserialize<PublishedCategoryDto>(publishedCategoryMessage);

                if (category != null)
                    Console.WriteLine($"Category with name {category.Name} received");

                //try
                //{
                //    await _sender.Send(new UpsertCategoryCommand {  CategoryId = null, Name = category.Name, Description = category.Description });
                //}
                //catch (Exception ex)
                //{
                //    Console.WriteLine($"--> Could not add Category {ex.Message}");
                //}
            }
        }


        private EventType DetermineEvent(string notifcationMessage)
        {
            var eventType = JsonSerializer.Deserialize<GenericEventDto>(notifcationMessage);

            switch (eventType.Event)
            {
                case "Category_Published":
                    return EventType.Category_Published;
                default:
                    return EventType.Undetermined;
            }
        }

        enum EventType
        {
            Category_Published,
            Undetermined
        }

        public class GenericEventDto
        {
            public string Event { get; set; }
        }
    }
}
