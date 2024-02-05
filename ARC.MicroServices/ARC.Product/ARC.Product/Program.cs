using ARC.Product.Core;
using ARC.Product.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using ARC.Product.Core.DependencyInjection;
using ARC.Product.Web.Services;
using ARC.Product.Web.Services.RabbitMQEventProcessing;
using ARC.Product.Web.Endpoints;
using ARC.Extension.ValidationMiddleWare.Validation;
using ARC.Extension.ValidationMiddleWare;
using ARC.Extension.ValidationMiddleWare.Exceptions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using NSwag.AspNetCore;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCore(builder.Configuration, typeof(NotFoundException).Assembly, typeof(RequestLogger<>).Assembly, typeof(Program).Assembly);

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
//})
//.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
//.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
//{
//    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.Authority = "https://localhost:5001/";
//    options.ClientId = "B860EDC2-5159-48D5-B233-BDC8FA8C85E9";
//    options.ClientSecret = "secret";
//    options.ResponseType = "code";
//    //options.Scope.Add("openid");
//    //options.Scope.Add("profile");
//    //options.CallbackPath = new PathString("/signin-oidc");
//    options.SaveTokens = true;
//});

//builder.Services.AddHostedService<MessageBusSubscriber>();
//builder.Services.AddSingleton<IEventProcessor, EventProcessor>();

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssemblies(typeof(RequestLogger<>).Assembly, typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

builder.Services.AddGrpcClient<ARC.UserAuthManagement.Authentication.AuthenticationClient>((services, options) =>
{
    options.Address = new Uri(builder.Configuration["InternalGRPCServerUrl"]!);
});

// Allow our react test app
builder.Services.AddCors(cfg =>
{
    cfg.AddPolicy("CorsApi",
        builder => builder.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

#region Swagger Stuff
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.SerializerOptions.Converters.Add(new JsonStringTrimmerConverter());
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "Arc Products API";
});
#endregion

var app = builder.Build();

//Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseSwaggerUi(options =>
//{
//    options.OAuth2Client = new OAuth2ClientSettings
//    {
//        ClientId = builder.Configuration["app.test.web"],
//        UsePkceWithAuthorizationCodeGrant = true
//    };
//});

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

app.UseCors("CorsApi");

app.Run();
 