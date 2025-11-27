using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
// --- AGREGADOS NUEVOS ---
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.Repositories;
// ------------------------

var builder = WebApplication.CreateBuilder(args);

// 1. SERVICIOS
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger con seguridad
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bicicleteria API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Autorización. Escribe 'Bearer' [espacio] y tu token.",
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

// Base de Datos
builder.Services.AddDbContext<BicicleteriaWebContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- INYECCIÓN DE REPOSITORIOS (NUEVO) ---
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
// ----------------------------------------

// JWT
var key = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(key)) throw new Exception("Falta Jwt:Key en appsettings.json");