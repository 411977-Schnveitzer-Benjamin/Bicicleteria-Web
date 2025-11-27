using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Solo usuarios registrados pueden comprar
    public class VentasController : ControllerBase
    {
        private readonly BicicleteriaWebContext _context;

        public VentasController(BicicleteriaWebContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> ProcesarCompra(CheckoutDTO request)
        {
            // 1. Identificar al Usuario
            int usuarioId = ObtenerUsuarioId();

            // 2. Iniciar una Transacción (Para que todo se guarde junto o falle junto)
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // A. Buscar items del carrito
                var itemsCarrito = await _context.Carritos
                    .Include(c => c.Bicicleta)
                    .Include(c => c.Repuesto)
                    .Include(c => c.Indumentaria)
                    .Where(c => c.UsuarioId == usuarioId)
                    .ToListAsync();

                if (!itemsCarrito.Any()) return BadRequest("El carrito está vacío.");

                // B. Calcular Total
                decimal totalVenta = itemsCarrito.Sum(item =>
                    ((item.Bicicleta?.PrecioPublico
                      ?? item.Repuesto?.PrecioPublico
                      ?? item.Indumentaria?.PrecioPublico) ?? 0) * (item.Cantidad ?? 1)
                );

                // C. Crear la Cabecera de Venta
                var nuevaVenta = new Venta
                {
                    UsuarioId = usuarioId,
                    FechaVenta = DateTime.Now,
                    TotalVenta = totalVenta,
                    MetodoPagoId = request.MetodoPagoId,
                    EstadoId = 1, // 1 = Pendiente (Según tu tabla EstadosPedido)
                    DireccionEnvio = request.Direccion,
                    CiudadEnvio = request.Ciudad,
                    CodigoPostal = request.CodigoPostal,
                    Observaciones = request.Observaciones
                };

                _context.Ventas.Add(nuevaVenta);
                await _context.SaveChangesAsync(); // Guardamos para obtener el ID de Venta

                // D. Mover items del Carrito a DetalleVenta
                foreach (var item in itemsCarrito)
                {
                    var precioUnitario = (item.Bicicleta?.PrecioPublico
                                          ?? item.Repuesto?.PrecioPublico
                                          ?? item.Indumentaria?.PrecioPublico) ?? 0;

                    var detalle = new DetalleVenta
                    {
                        VentaId = nuevaVenta.VentaId,
                        BicicletaId = item.BicicletaId,
                        RepuestoId = item.RepuestoId,
                        IndumentariaId = item.IndumentariaId,
                        Cantidad = item.Cantidad ?? 1,
                        PrecioUnitario = precioUnitario
                        // El Subtotal es columna calculada en BD, no hace falta ponerlo
                    };
                    _context.DetalleVentas.Add(detalle);
                }

                // E. Generar Factura Automática
                var factura = new Factura
                {
                    VentaId = nuevaVenta.VentaId,
                    TipoFacturaId = 2, // 2 = Consumidor Final (B)
                    FechaFacturacion = DateTime.Now,
                    MontoTotal = totalVenta,
                    MontoIva = totalVenta * 0.21m, // Calculo simple de IVA
                    NumeroFactura = $"F-{DateTime.Now:yyyyMM}-{nuevaVenta.VentaId:D6}",
                    CuitCliente = "00000000",
                    RazonSocialCliente = "Consumidor Final"
                };
                _context.Facturas.Add(factura);

                // F. Vaciar el Carrito
                _context.Carritos.RemoveRange(itemsCarrito);

                // G. Confirmar todo
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    mensaje = "Compra realizada con éxito",
                    nroVenta = nuevaVenta.VentaId,
                    total = totalVenta
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error procesando la venta: " + ex.Message);
            }
        }

        // --- Método Auxiliar ---
        private int ObtenerUsuarioId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim != null && int.TryParse(idClaim.Value, out int id)) return id;
            throw new Exception("Usuario no identificado");
        }
    }
}