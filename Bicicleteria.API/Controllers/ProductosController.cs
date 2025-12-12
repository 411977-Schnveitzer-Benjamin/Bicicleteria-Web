using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using System.Text.Json; // <--- Necesario para la configuración manual
using System.Text.Json.Serialization; // <--- Necesario para IgnoreCycles

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly BicicleteriaWebContext _context;

        public ProductosController(BicicleteriaWebContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                var listaUnificada = new List<object>();

                // 1. BICICLETAS
                var bicis = await _context.Bicicletas
                    .AsNoTracking()
                    .Where(b => b.Activo == true)
                    .Select(b => new
                    {
                        id = b.BicicletaId,
                        bicicletaId = b.BicicletaId,
                        codigo = b.Codigo,
                        descripcion = b.Descripcion,
                        precioPublico = b.PrecioPublico,
                        stock = b.Stock,
                        imagenUrl = b.imagenUrl,
                        categoria = "Bicicletas",
                        talle = b.Rodado,
                        tipo = "Bicicleta"
                    })
                    .ToListAsync();

                // 2. REPUESTOS
                var repuestos = await _context.Repuestos
                    .AsNoTracking()
                    .Where(r => r.Activo == true)
                    .Select(r => new
                    {
                        id = r.RepuestoId,
                        repuestoId = r.RepuestoId,
                        codigo = r.Codigo,
                        descripcion = r.Descripcion,
                        precioPublico = r.PrecioPublico,
                        stock = r.Stock,
                        imagenUrl = r.imagenUrl,
                        categoria = "Repuestos",
                        talle = "-",
                        tipo = "Repuesto"
                    })
                    .ToListAsync();

                // 3. INDUMENTARIA
                var ropa = await _context.Indumentaria
                    .AsNoTracking()
                    .Where(i => i.Activo == true)
                    .Select(i => new
                    {
                        id = i.IndumentariaId,
                        indumentariaId = i.IndumentariaId,
                        codigo = i.Codigo,
                        descripcion = i.Descripcion,
                        precioPublico = i.PrecioPublico,
                        stock = i.Stock,
                        imagenUrl = i.imagenUrl,
                        categoria = "Indumentaria",
                        talle = i.Talle, // Asegúrate que en la BD esto sea texto simple
                        tipo = "Indumentaria"
                    })
                    .ToListAsync();

                listaUnificada.AddRange(bicis);
                listaUnificada.AddRange(repuestos);
                listaUnificada.AddRange(ropa);

                // --- EL CAMBIO CLAVE ESTÁ AQUÍ ---
                // Forzamos la configuración para ignorar ciclos AQUÍ MISMO.
                // Esto anula cualquier error que pudiera haber en Program.cs
                var opcionesSeguras = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.IgnoreCycles,
                    WriteIndented = true
                };

                return new JsonResult(listaUnificada, opcionesSeguras);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error crítico al obtener productos", error = ex.Message });
            }
        }
    }
}