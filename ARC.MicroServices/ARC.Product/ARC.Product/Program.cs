using ARC.Product.Core.Exceptions;
using ARC.Product.Core;
using ARC.Product.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Core.DependencyInjection;
using ARC.Product.Infrastructure;
using ARC.Product;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCore(builder.Configuration, typeof(NotFoundException).Assembly, typeof(RequestLogger<>).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(RequestLogger<>).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

var app = builder.Build();

app.UseValidationExceptionHandling();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

//await using var scope = app.Services.CreateAsyncScope();
//using var db = scope.ServiceProvider.GetService<ApplicationDbContext>();
//await db!.Database.MigrateAsync();

app.MapCategoryEndpoints();

app.Run();
