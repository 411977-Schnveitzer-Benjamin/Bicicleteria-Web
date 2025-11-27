using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Models;
// --- AGREGAMOS LAS REFERENCIAS FALTANTES ---
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.DTOs;
// -------------------------------------------

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BicicletasController : ControllerBase
    {
        private readonly IGenericRepository<Bicicleta> _repository;

        public BicicletasController(IGenericRepository<Bicicleta> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BicicletaDTO>>> GetAll()
        {
            var bicis = await _repository.GetAllAsync();

            // Proyección a DTO
            var dtos = bicis.Where(b => b.Activo == true).Select(b => new BicicletaDTO
            {
                Id = b.BicicletaId,
                Codigo = b.Codigo,
                Descripcion = b.Descripcion,
                PrecioPublico = b.PrecioPublico ?? 0, // Usamos ?? 0 para evitar error de nulos
                ImagenURL = b.ImagenUrl,
                Rodado = b.Rodado,
                Velocidades = b.Velocidades,
                Marca = b.Marca,
                Frenos = b.Frenos,
                Color = b.Color
            });

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BicicletaDTO>> GetById(int id)
        {
            var b = await _repository.GetByIdAsync(id);
            if (b == null || b.Activo != true) return NotFound();

            var dto = new BicicletaDTO
            {
                Id = b.BicicletaId,
                Codigo = b.Codigo,
                Descripcion = b.Descripcion,
                PrecioPublico = b.PrecioPublico ?? 0,
                ImagenURL = b.ImagenUrl,
                Rodado = b.Rodado,
                Velocidades = b.Velocidades,
                Marca = b.Marca,
                Frenos = b.Frenos,
                Color = b.Color
            };

            return Ok(dto);
        }
    }
}