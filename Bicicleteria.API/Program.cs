using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Agregar controladores
builder.Services.AddControllers();

// Configurar Swagger (Con soporte para botón de "Authorize" con JWT)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bicicleteria API", Version = "v1" });

    // Definición de seguridad para Swagger (El botón del candado)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Autorización JWT usando el esquema Bearer. \r\n\r\n Ingrese 'Bearer' [espacio] y luego su token en el campo de texto.\r\n\r\nEjemplo: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Configurar la Conexión a Base de Datos (SQL Server)
builder.Services.AddDbContext<BicicleteriaWebContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar Autenticación JWT
var key = builder.Configuration["Jwt:Key"]; // Leemos la clave secreta del appsettings.json

// Verificación de seguridad para que no arranque si falta la clave
if (string.IsNullOrEmpty(key))
{
    throw new Exception("La clave JWT (Jwt:Key) no está configurada en appsettings.json");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = false,   // En producción esto debería ser true
            ValidateAudience = false, // En producción esto debería ser true
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // Para que el token expire exactamente cuando dice
        };
    });

// Configurar CORS (Para permitir que tu futuro Frontend se conecte)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Activar CORS
app.UseCors("PermitirTodo");

// Activar Seguridad
app.UseAuthentication(); // ¿Quién eres?
app.UseAuthorization();  // ¿Qué permisos tienes?

// Mapear los controladores
app.MapControllers();

app.Run();