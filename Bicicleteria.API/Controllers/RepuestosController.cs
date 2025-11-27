using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepuestosController : ControllerBase
    {
        private readonly IGenericRepository<Repuesto> _repository;

        public RepuestosController(IGenericRepository<Repuesto> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RepuestoDTO>>> GetAll()
        {
            var items = await _repository.GetAllAsync();
            var dtos = items.Where(r => r.Activo == true).Select(r => new RepuestoDTO
            {
                Id = r.RepuestoId,
                Codigo = r.Codigo,
                Descripcion = r.Descripcion,
                PrecioPublico = r.PrecioPublico ?? 0,
                ImagenURL = r.ImagenUrl,
                Categoria = r.Categoria,
                Compatibilidad = r.Compatibilidad,
                MarcaComponente = r.MarcaComponente
            });
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RepuestoDTO>> GetById(int id)
        {
            var r = await _repository.GetByIdAsync(id);
            if (r == null || r.Activo != true) return NotFound();

            return Ok(new RepuestoDTO
            {
                Id = r.RepuestoId,
                Codigo = r.Codigo,
                Descripcion = r.Descripcion,
                PrecioPublico = r.PrecioPublico ?? 0,
                ImagenURL = r.ImagenUrl,
                Categoria = r.Categoria,
                Compatibilidad = r.Compatibilidad,
                MarcaComponente = r.MarcaComponente
            });
        }
    }
}