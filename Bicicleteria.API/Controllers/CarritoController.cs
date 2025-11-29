using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Para [Authorize]
using Microsoft.EntityFrameworkCore;
using System.Security.Claims; // Para leer el ID del usuario del Token
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class CarritoController : ControllerBase
    {
        private readonly BicicleteriaWebContext _context;

        public CarritoController(BicicleteriaWebContext context)
        {
            _context = context;
        }

        // GET: api/Carrito (Ver mi carrito)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarritoItemDTO>>> GetMiCarrito()
        {
            // 1. Obtener ID del usuario logueado desde el Token
            int usuarioId = ObtenerUsuarioId();

            // 2. Buscar items en la BD e incluir los detalles de productos
            var items = await _context.Carritos
                .Include(c => c.Bicicleta)
                .Include(c => c.Repuesto)
                .Include(c => c.Indumentaria)
                .Where(c => c.UsuarioId == usuarioId)
                .ToListAsync();

            // 3. Convertir a DTO
            var carritoDTO = items.Select(c => new CarritoItemDTO
            {
                CarritoId = c.CarritoId,
                Cantidad = c.Cantidad ?? 1,

                ProductoId = c.BicicletaId ?? c.RepuestoId ?? c.IndumentariaId ?? 0,

                Titulo = c.Bicicleta?.Descripcion
                         ?? c.Repuesto?.Descripcion
                         ?? c.Indumentaria?.Descripcion
                         ?? "Producto Desconocido",

                PrecioUnitario = (c.Bicicleta?.PrecioPublico
                                 ?? c.Repuesto?.PrecioPublico
                                 ?? c.Indumentaria?.PrecioPublico) ?? 0,

                ImagenURL = c.Bicicleta?.imagenUrl
                            ?? c.Repuesto?.imagenUrl
                            ?? c.Indumentaria?.imagenUrl,

                Tipo = c.BicicletaId != null ? "BICI" : (c.RepuestoId != null ? "REPUESTO" : "ROPA"),

                Subtotal = ((c.Bicicleta?.PrecioPublico
                             ?? c.Repuesto?.PrecioPublico
                             ?? c.Indumentaria?.PrecioPublico) ?? 0) * (c.Cantidad ?? 1)
            });

            return Ok(carritoDTO);
        }

        // POST: api/Carrito (Agregar producto)
        [HttpPost]
        public async Task<IActionResult> AgregarAlCarrito(AgregarCarritoDTO request)
        {
            int usuarioId = ObtenerUsuarioId();

            // Verificar si ya existe ese producto en el carrito de este usuario
            var itemExistente = await _context.Carritos
                .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId &&
                    (
                        (request.TipoProducto == "BICI" && c.BicicletaId == request.ProductoId) ||
                        (request.TipoProducto == "REPUESTO" && c.RepuestoId == request.ProductoId) ||
                        (request.TipoProducto == "ROPA" && c.IndumentariaId == request.ProductoId)
                    ));

            if (itemExistente != null)
            {
                // Si ya existe, solo sumamos cantidad
                itemExistente.Cantidad += request.Cantidad;
            }
            else
            {
                // Si no existe, creamos uno nuevo
                var nuevoItem = new Carrito
                {
                    UsuarioId = usuarioId,
                    Cantidad = request.Cantidad,
                    FechaAgregado = DateTime.Now
                };

                // Asignamos el ID a la columna correcta
                switch (request.TipoProducto.ToUpper())
                {
                    case "BICI": nuevoItem.BicicletaId = request.ProductoId; break;
                    case "REPUESTO": nuevoItem.RepuestoId = request.ProductoId; break;
                    case "ROPA": nuevoItem.IndumentariaId = request.ProductoId; break;
                    default: return BadRequest("Tipo de producto no válido (Use: BICI, REPUESTO, ROPA)");
                }

                _context.Carritos.Add(nuevoItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Producto agregado al carrito" });
        }

        // DELETE: api/Carrito/5 (Borrar item del carrito)
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarDelCarrito(int id)
        {
            int usuarioId = ObtenerUsuarioId();

            var item = await _context.Carritos
                .FirstOrDefaultAsync(c => c.CarritoId == id && c.UsuarioId == usuarioId);

            if (item == null) return NotFound("El producto no está en tu carrito.");

            _context.Carritos.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Eliminado del carrito" });
        }

        // --- Método Auxiliar para leer el Token ---
        private int ObtenerUsuarioId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim != null && int.TryParse(idClaim.Value, out int id))
            {
                return id;
            }
            throw new Exception("No se pudo identificar al usuario del token.");
        }
    }
}