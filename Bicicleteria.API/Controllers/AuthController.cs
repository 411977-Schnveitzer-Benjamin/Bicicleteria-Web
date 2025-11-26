using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly BicicleteriaWebContext _context;
        private readonly IConfiguration _config;

        public AuthController(BicicleteriaWebContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 1. REGISTRO DE USUARIOS (Para que se puedan crear cuentas)
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistroDTO request)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("El usuario ya existe.");
            }

            // Encriptar contraseña (Básico con SHA256 para empezar)
            string passwordHash = EncriptarPassword(request.Password);

            // Buscar el ID del rol 'Cliente' (Asumimos que es el 2, o lo buscamos por nombre)
            var rolCliente = await _context.Roles.FirstOrDefaultAsync(r => r.NombreRol == "Cliente");
            int rolId = rolCliente?.RolID ?? 2; // Si no lo encuentra, usa 2 por defecto

            var nuevoUsuario = new Usuario
            {
                NombreCompleto = request.Nombre,
                Email = request.Email,
                PasswordHash = passwordHash,
                RolID = rolId,
                Dni = request.Dni,
                Telefono = request.Telefono,
                FechaRegistro = DateTime.Now,
                Activo = true
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado con éxito.");
        }

        // 2. LOGIN (Donde se genera el Token)
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO request)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol) // Incluimos el Rol para saber si es Admin o Cliente
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null) return Unauthorized("Usuario no encontrado.");

            // Verificar contraseña
            if (usuario.PasswordHash != EncriptarPassword(request.Password))
            {
                return Unauthorized("Contraseña incorrecta.");
            }

            // Generar el Token JWT
            string token = CrearToken(usuario);

            return Ok(new { token = token, usuario = usuario.NombreCompleto, rol = usuario.Rol?.NombreRol });
        }

        // --- MÉTODOS PRIVADOS AUXILIARES ---

        private string CrearToken(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioID.ToString()),
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol?.NombreRol ?? "Cliente") // Guardamos el rol en el token
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string EncriptarPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }

    // CLASES DTO (Data Transfer Object) - Para recibir datos limpios del frontend
    public class RegistroDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Dni { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
    }

    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}