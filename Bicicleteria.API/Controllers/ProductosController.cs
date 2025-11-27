using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

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

        // GET: api/Productos/buscar?q=shimano
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<ProductoResumenDTO>>> Buscar([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return BadRequest("El término de búsqueda no puede estar vacío.");

            q = q.ToLower(); // Convertimos a minúsculas para comparar fácil
            var resultados = new List<ProductoResumenDTO>();

            // 1. Buscar en Bicicletas
            var bicis = await _context.Bicicletas
                .Where(b => b.Activo == true && (b.Descripcion.Contains(q) || b.Marca.Contains(q) || b.Codigo.Contains(q)))
                .Take(20) // Limitamos para no traer mil resultados
                .ToListAsync();

            resultados.AddRange(bicis.Select(b => new ProductoResumenDTO
            {
                Id = b.BicicletaId,
                Codigo = b.Codigo,
                Descripcion = b.Descripcion,
                Precio = b.PrecioPublico ?? 0,
                ImagenURL = b.ImagenUrl,
                Tipo = "Bicicleta"
            }));

            // 2. Buscar en Repuestos
            var repuestos = await _context.Repuestos
                .Where(r => r.Activo == true && (r.Descripcion.Contains(q) || r.Codigo.Contains(q)))
                .Take(20)
                .ToListAsync();

            resultados.AddRange(repuestos.Select(r => new ProductoResumenDTO
            {
                Id = r.RepuestoId,
                Codigo = r.Codigo,
                Descripcion = r.Descripcion,
                Precio = r.PrecioPublico ?? 0,
                ImagenURL = r.ImagenUrl,
                Tipo = "Repuesto"
            }));

            // 3. Buscar en Indumentaria
            var ropa = await _context.Indumentaria // Recuerda que EF puede llamarla 'Indumentaria' o 'Indumentarium' según tu modelo
                .Where(i => i.Activo == true && (i.Descripcion.Contains(q) || i.Codigo.Contains(q)))
                .Take(20)
                .ToListAsync();

            resultados.AddRange(ropa.Select(i => new ProductoResumenDTO
            {
                Id = i.IndumentariaId,
                Codigo = i.Codigo,
                Descripcion = i.Descripcion,
                Precio = i.PrecioPublico ?? 0,
                ImagenURL = i.ImagenUrl,
                Tipo = "Indumentaria"
            }));

            return Ok(resultados);
        }

        // GET: api/Productos/recomendados
        [HttpGet("recomendados")]
        public async Task<ActionResult<IEnumerable<ProductoResumenDTO>>> GetRecomendados()
        {
            // Estrategia: Traer los últimos 3 de cada categoría para la portada
            var listaMix = new List<ProductoResumenDTO>();

            // Últimas 3 Bicis
            var bicis = await _context.Bicicletas
                .Where(b => b.Activo == true)
                .OrderByDescending(b => b.FechaAlta) // Asumiendo que tienes FechaAlta, si no usa BicicletaId
                .Take(3)
                .ToListAsync();

            listaMix.AddRange(bicis.Select(b => new ProductoResumenDTO
            {
                Id = b.BicicletaId,
                Codigo = b.Codigo,
                Descripcion = b.Descripcion,
                Precio = b.PrecioPublico ?? 0,
                ImagenURL = b.ImagenUrl,
                Tipo = "Bicicleta"
            }));

            // Últimos 3 Repuestos
            var repuestos = await _context.Repuestos
                .Where(r => r.Activo == true)
                .OrderByDescending(r => r.FechaAlta)
                .Take(3)
                .ToListAsync();

            listaMix.AddRange(repuestos.Select(r => new ProductoResumenDTO
            {
                Id = r.RepuestoId,
                Codigo = r.Codigo,
                Descripcion = r.Descripcion,
                Precio = r.PrecioPublico ?? 0,
                ImagenURL = r.ImagenUrl,
                Tipo = "Repuesto"
            }));

            // Últimas 3 Prendas
            var ropa = await _context.Indumentaria
                .Where(i => i.Activo == true)
                .OrderByDescending(i => i.FechaAlta)
                .Take(3)
                .ToListAsync();

            listaMix.AddRange(ropa.Select(i => new ProductoResumenDTO
            {
                Id = i.IndumentariaId,
                Codigo = i.Codigo,
                Descripcion = i.Descripcion,
                Precio = i.PrecioPublico ?? 0,
                ImagenURL = i.ImagenUrl,
                Tipo = "Indumentaria"
            }));

            // Mezclamos la lista para que no salgan todos ordenados por categoría
            var listaAleatoria = listaMix.OrderBy(x => Guid.NewGuid()).ToList();

            return Ok(listaAleatoria);
        }
    }
}