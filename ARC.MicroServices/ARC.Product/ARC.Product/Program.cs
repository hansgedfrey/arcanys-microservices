using ARC.Product.Core;
using ARC.Product.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Core.DependencyInjection;
using ARC.Infrastructure;
using ARC.Product.Web.Services;
using ARC.Product.Web.Services.RabbitMQEventProcessing;
using ARC.Product.Web.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCore(builder.Configuration, typeof(ARC.Infrastructure.Exceptions.NotFoundException).Assembly, typeof(RequestLogger<>).Assembly, typeof(Program).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<MessageBusSubscriber>();
builder.Services.AddSingleton<IEventProcessor, EventProcessor>();

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssemblies(typeof(RequestLogger<>).Assembly, typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(ARC.Infrastructure.Validation.ValidationBehavior<,>));
});

builder.Services.AddGrpcClient<ARC.UserAuthManagement.Authentication.AuthenticationClient>((services, options) =>
{
    options.Address = new Uri(builder.Configuration["InternalGRPCServerUrl"]!);
});

var app = builder.Build();

//Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await using var scope = app.Services.CreateAsyncScope();
using var db = scope.ServiceProvider.GetService<ApplicationDbContext>();
await db!.Database.MigrateAsync();
 
app.UseValidationExceptionHandling();

app
    .MapProductEndpoints()
    .MapCategoryEndpoints()
    .MapCartEndpoints()
    .MapInventoryItemEndpoints()
    .MapUserEndpoints();

app.Run();
