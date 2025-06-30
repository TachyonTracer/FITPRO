using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Npgsql;
using Repo;
using Stripe;
using StackExchange.Redis;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using dotenv.net;
var builder = WebApplication.CreateBuilder(args);

DotEnv.Load(options: new DotEnvOptions(probeForEnv: true));
builder.Services.AddSingleton<Cloudinary>(sp => 
    new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL")));
Cloudinary cloudinary = new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
cloudinary.Api.Secure = true;
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Swagger/OpenAPI with JWT support (DRY)
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("token", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer",
        In = ParameterLocation.Header,
        Name = HeaderNames.Authorization
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "token"
                },
            },
            Array.Empty<string>()
        }
    });
});

// Dependency Injection for Repos (DRY)
builder.Services.AddScoped<IAdminInterface, AdminRepo>();
builder.Services.AddScoped<IEmailInterface, EmailRepo>();
builder.Services.AddScoped<IAuthInterface, AuthRepo>();
builder.Services.AddScoped<IInstructorInterface, InstructorRepo>();
builder.Services.AddScoped<IClassInterface, ClassRepo>();
builder.Services.AddScoped<IUserInterface, UserRepo>();
builder.Services.AddScoped<IFeedbackInterface, FeedbackRepository>();
builder.Services.AddScoped<IAttendanceInterface, AttendanceRepo>();
builder.Services.AddScoped<IBlogInterface, BlogRepo>();

// Stripe configuration (DRY)
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

// Database connection (SOLID)
builder.Services.AddScoped<NpgsqlConnection>(provider =>
{
    var connectionString = provider.GetRequiredService<IConfiguration>().GetConnectionString("pgconn");
    return new NpgsqlConnection(connectionString);
});

// JWT Authentication (DRY)
builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(option =>
{
    option.RequireHttpsMetadata = false;
    option.SaveToken = true;
    option.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = false,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured")))
    };
});

// CORS Policy (DRY)
builder.Services.AddCors(options =>
{
    options.AddPolicy("corsapp", policy =>
    {
        policy.WithOrigins("http://localhost:8081")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Data Protection (SOLID)
builder.Services.AddDataProtection()
    .SetApplicationName("FitPro")
    .PersistKeysToFileSystem(new DirectoryInfo(@"./.aspnet/DataProtection-Keys"));

// Register IConnectionMultiplexer as a singleton
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(
        builder.Configuration.GetConnectionString("RedisConnectionString") ?? "localhost:6379"
    )
);

// --- Notification Services ---
string redisConnectionString = builder.Configuration.GetConnectionString("RedisConnectionString") ?? "redis:6379,password=,allowAdmin=true,abortConnect=false";
builder.Services.AddScoped<RedisService>(provider => new RedisService(redisConnectionString));
builder.Services.AddSignalR();
builder.Services.AddScoped<RabbitMQService>();

var app = builder.Build();

// --- Middleware Pipeline (DRY) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("corsapp");
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// --- SignalR and RabbitMQ Notification Hub (SOLID) ---
app.MapHub<NotificationHub>("/notificationHub");
using (var scope = app.Services.CreateScope())
{
    var rabbitMQService = scope.ServiceProvider.GetRequiredService<RabbitMQService>();
    rabbitMQService.StartListening();
}

// --- Example Endpoint (can be removed in production) ---
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
