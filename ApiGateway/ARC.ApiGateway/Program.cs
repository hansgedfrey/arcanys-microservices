using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Kubernetes;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", true, true)
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddOcelot(builder.Configuration).AddKubernetes();

var app = builder.Build();

await app.UseOcelot();
 
app.Run();
