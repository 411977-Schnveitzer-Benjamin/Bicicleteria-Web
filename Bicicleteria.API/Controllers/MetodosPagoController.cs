using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetodosPagoController : ControllerBase
    {
        private readonly BicicleteriaWebContext _context;

        public MetodosPagoController(BicicleteriaWebContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MetodoPagoDTO>>> GetAll()
        {
            var metodos = await _context.MetodosPagos
                .Where(m => m.Activo == true)
                .Select(m => new MetodoPagoDTO
                {
                    Id = m.MetodoPagoId,
                    Nombre = m.Nombre,
                    Instrucciones = m.Instrucciones
                })
                .ToListAsync();

            return Ok(metodos);
        }
    }
}