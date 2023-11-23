using ARC.Infrastructure;
using ARC.UserAuthManagement.Services;
using ARC.UserManagement.Core;
using ARC.UserManagement.Core.DependencyInjection;
using ARC.UserManagement.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCore(builder.Configuration, typeof(NotFoundException).Assembly, typeof(RequestLogger<>).Assembly);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddGrpc();

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(RequestLogger<>).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await using var scope = app.Services.CreateAsyncScope();
using var db = scope.ServiceProvider.GetService<ApplicationDbContext>();
await db!.Database.MigrateAsync();

app.UseValidationExceptionHandling();

//Map gRPC servers
app.MapGrpcService<GreeterService>();
app.MapGrpcService<AuthenticationService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
