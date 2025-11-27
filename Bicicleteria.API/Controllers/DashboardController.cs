using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrador")] // Solo el jefe puede ver los números
    public class DashboardController : ControllerBase
    {
        private readonly BicicleteriaWebContext _context;

        public DashboardController(BicicleteriaWebContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDTO>> GetResumen()
        {
            var hoy = DateTime.Today;
            var primerDiaMes = new DateTime(hoy.Year, hoy.Month, 1); // El día 1 de este mes

            // 1. Estadísticas del Mes Actual
            var ventasMes = await _context.Ventas
                .Where(v => v.FechaVenta >= primerDiaMes)
                .ToListAsync();

            var totalVendido = ventasMes.Sum(v => v.TotalVenta);
            var cantidadVentas = ventasMes.Count;

            var clientesNuevos = await _context.Usuarios
                .CountAsync(u => u.FechaRegistro >= primerDiaMes && u.RolId == 2); // Rol 2 = Clientes

            // 2. Traer las últimas 5 ventas para mostrar en lista
            var ultimasVentas = await _context.Ventas
                .Include(v => v.Usuario)
                .Include(v => v.Estado)
                .OrderByDescending(v => v.FechaVenta) // Las más nuevas primero
                .Take(5)
                .Select(v => new VentaResumenDTO
                {
                    Id = v.VentaId,
                    Fecha = v.FechaVenta.HasValue ? v.FechaVenta.Value.ToString("dd/MM/yyyy HH:mm") : "-",
                    Cliente = v.Usuario.NombreCompleto,
                    Total = v.TotalVenta,
                    Estado = v.Estado != null ? v.Estado.Nombre : "Desconocido"
                })
                .ToListAsync();

            // 3. Alertas de Stock Bajo (Buscamos cosas con poco stock)
            var bajoStock = new List<ProductoAlertaDTO>();

            // Bicis con menos de 2 unidades
            var bicisBajas = await _context.Bicicletas
                .Where(b => b.Activo == true && b.Stock <= 2)
                .Select(b => new ProductoAlertaDTO
                {
                    Codigo = b.Codigo,
                    Descripcion = b.Descripcion,
                    Stock = b.Stock ?? 0,
                    Tipo = "Bici"
                })
                .Take(5)
                .ToListAsync();

            // Repuestos con menos de 5 unidades
            var repuestosBajos = await _context.Repuestos
                .Where(r => r.Activo == true && r.Stock <= 5)
                .Select(r => new ProductoAlertaDTO
                {
                    Codigo = r.Codigo,
                    Descripcion = r.Descripcion,
                    Stock = r.Stock ?? 0,
                    Tipo = "Repuesto"
                })
                .Take(5)
                .ToListAsync();

            bajoStock.AddRange(bicisBajas);
            bajoStock.AddRange(repuestosBajos);

            // Armamos el paquete final
            var dashboard = new DashboardDTO
            {
                TotalVendidoMes = totalVendido,
                CantidadVentasMes = cantidadVentas,
                ClientesNuevosMes = clientesNuevos,
                UltimasVentas = ultimasVentas,
                ProductosBajoStock = bajoStock
            };

            return Ok(dashboard);
        }
    }
}