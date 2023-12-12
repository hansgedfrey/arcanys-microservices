using ARC.Extension.ValidationMiddleWare;
using ARC.Extension.ValidationMiddleWare.Exceptions;
using ARC.Extension.ValidationMiddleWare.Validation;
using ARC.UserAuthManagement.Web.Endpoints;
using ARC.UserAuthManagement.Web.Services.gRPC;
using ARC.UserAuthManagement.Web.Services.Http;
using ARC.UserAuthManagement.Web.Services.RabbitMQ;
using ARC.UserManagement.Core;
using ARC.UserManagement.Core.DependencyInjection;
using ARC.UserManagement.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCore(builder.Configuration, typeof(NotFoundException).Assembly, typeof(RequestLogger<>).Assembly);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddGrpc();
builder.Services.AddHttpClient<ICategoryHttpClient, CategoryHttpClient>();
builder.Services.AddSingleton<IMessageBusClient, MessagBusClient>();
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(RequestLogger<>).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI();

await using var scope = app.Services.CreateAsyncScope();
using var db = scope.ServiceProvider.GetService<ApplicationDbContext>();
await db!.Database.MigrateAsync();

app.UseValidationExceptionHandling();

//Map gRPC services
app.MapGrpcService<AuthenticationService>();

//Map endpoints
app.MapUserEndpoints();

app.Run();
