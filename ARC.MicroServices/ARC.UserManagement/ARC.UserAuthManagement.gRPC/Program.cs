using ARC.Infrastructure;
using ARC.UserAuthManagement;
using ARC.UserAuthManagement.Services;
using ARC.UserManagement.Core;
using ARC.UserManagement.Core.DependencyInjection;
using ARC.UserManagement.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCore(builder.Configuration, typeof(ARC.Infrastructure.NotFoundException).Assembly, typeof(RequestLogger<>).Assembly);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddGrpc();

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(RequestLogger<>).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
}); 


var app = builder.Build();

await using var scope = app.Services.CreateAsyncScope();
using var db = scope.ServiceProvider.GetService<ApplicationDbContext>();
await db!.Database.MigrateAsync();

app.UseValidationExceptionHandling();
 
//Map gRPC servers
app.MapGrpcService<GreeterService>();
app.MapGrpcService<AuthenticationService>();

//Map user endpoints
app.MapUserEndpoints();

app.Run();
