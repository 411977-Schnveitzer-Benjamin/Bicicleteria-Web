using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;

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
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            try
            {
                var listaUnificada = new List<object>();

                // 1. BICICLETAS (Seguro)
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
                    .ToListAsync(); // El ToList va AL FINAL

                // 2. REPUESTOS (Seguro)
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
                    .ToListAsync(); // El ToList va AL FINAL

                // 3. INDUMENTARIA (Aquí estaba el error)
                var ropa = await _context.Indumentaria
                    .AsNoTracking()
                    .Where(i => i.Activo == true)
                    .Select(i => new // <--- ¡EL SELECT VA AQUÍ!
                    {
                        id = i.IndumentariaId,
                        indumentariaId = i.IndumentariaId,
                        codigo = i.Codigo,
                        descripcion = i.Descripcion,
                        precioPublico = i.PrecioPublico,
                        stock = i.Stock,
                        imagenUrl = i.imagenUrl,
                        categoria = "Indumentaria",
                        talle = i.Talle,
                        tipo = "Indumentaria"
                    })
                    .ToListAsync(); // <--- ¡AHORA SÍ, AL FINAL!

                listaUnificada.AddRange(bicis);
                listaUnificada.AddRange(repuestos);
                listaUnificada.AddRange(ropa);

                return Ok(listaUnificada);
            }
            catch (Exception ex)
            {
                // Si falla, al menos te dirá por qué en vez de cerrarse
                Console.WriteLine($"ERROR CRITICO: {ex.Message}");
                return BadRequest($"Error en servidor: {ex.Message}");
            }
        }
    }
}