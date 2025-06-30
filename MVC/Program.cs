using Microsoft.AspNetCore.DataProtection;
using Npgsql;
using Repo;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<NpgsqlConnection>((provider) =>
{
    var connectionString = provider.GetRequiredService<IConfiguration>().GetConnectionString("pgconn");
    return new NpgsqlConnection(connectionString);
});
// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDataProtection()
    .SetApplicationName("FitPro")
    .PersistKeysToFileSystem(new DirectoryInfo(@"./.aspnet/DataProtection-Keys"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
