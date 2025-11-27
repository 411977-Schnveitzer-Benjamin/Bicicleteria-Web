using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;
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

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistroDTO request)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
                return BadRequest("El usuario ya existe.");

            string passwordHash = EncriptarPassword(request.Password);

            // Buscamos el rol de Cliente
            // NOTA: Ajusté 'NombreRol' por si acaso, verifica si en Role.cs es NombreRol o Nombre
            var rolCliente = await _context.Roles.FirstOrDefaultAsync(r => r.NombreRol == "Cliente");
            int rolIdDefecto = rolCliente?.RolId ?? 2; // <--- CAMBIO: RolId (d minúscula)

            var nuevoUsuario = new Usuario
            {
                NombreCompleto = request.Nombre,
                Email = request.Email,
                PasswordHash = passwordHash,
                RolId = rolIdDefecto, // <--- CAMBIO: RolId (d minúscula)
                Dni = request.Dni,    // Verifica si en Usuario.cs es Dni o Dni (normalmente es Dni)
                Telefono = request.Telefono,
                FechaRegistro = DateTime.Now,
                Activo = true
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado.");
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO request)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol) // <--- Si te marca error aquí, cambia 'Rol' por 'RolNavigation'
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null) return Unauthorized("Usuario no encontrado.");

            if (usuario.PasswordHash != EncriptarPassword(request.Password))
                return Unauthorized("Contraseña incorrecta.");

            string token = CrearToken(usuario);
            return Ok(new { token = token });
        }

        private string CrearToken(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                // CAMBIO: UsuarioId (d minúscula)
                new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioId.ToString()),
                new Claim(ClaimTypes.Name, usuario.Email),
                
                // CAMBIO: Verificamos si la propiedad de navegación es 'Rol' o 'RolNavigation'
                // Si te sigue dando error en 'Rol?', prueba cambiarlo a 'RolNavigation?'
                new Claim(ClaimTypes.Role, usuario.Rol?.NombreRol ?? "Cliente")
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
}