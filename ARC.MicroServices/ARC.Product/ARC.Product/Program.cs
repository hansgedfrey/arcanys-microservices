using ARC.Product.Core;
using ARC.Product.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Core.DependencyInjection;
using ARC.Infrastructure;
using ARC.Product.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCore(builder.Configuration, typeof(ARC.Infrastructure.Exceptions.NotFoundException).Assembly, typeof(RequestLogger<>).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(RequestLogger<>).Assembly);
    cfg.AddOpenBehavior(typeof(ARC.Infrastructure.Validation.ValidationBehavior<,>));
});

builder.Services.AddGrpcClient<ARC.UserAuthManagement.Authentication.AuthenticationClient>((services, options) =>
{
    options.Address = new Uri(builder.Configuration["InternalGRPCServerUrl"]!);
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
app
    .MapProductEndpoints()
    .MapCategoryEndpoints()
    .MapCartEndpoints()
    .MapInventoryItemEndpoints();

app.Run();
