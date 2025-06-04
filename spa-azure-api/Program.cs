var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<GraphAuthService>();
builder.Services.AddHttpClient();

builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("AllowLocalhost3000");

app.MapControllers();

app.Run();
