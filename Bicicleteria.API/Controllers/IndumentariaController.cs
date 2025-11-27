using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IndumentariaController : ControllerBase
    {
        private readonly IGenericRepository<Indumentarium> _repository;

        public IndumentariaController(IGenericRepository<Indumentarium> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IndumentariaDTO>>> GetAll()
        {
            var items = await _repository.GetAllAsync();
            var dtos = items.Where(i => i.Activo == true).Select(i => new IndumentariaDTO
            {
                Id = i.IndumentariaId,
                Codigo = i.Codigo,
                Descripcion = i.Descripcion,
                // CORRECCIÓN AQUÍ:
                PrecioPublico = i.PrecioPublico ?? 0,
                ImagenURL = i.ImagenUrl,
                Talle = i.Talle,
                Color = i.Color,
                Genero = i.Genero,
                TipoPrenda = i.TipoPrenda
            });
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IndumentariaDTO>> GetById(int id)
        {
            var i = await _repository.GetByIdAsync(id);
            if (i == null || i.Activo != true) return NotFound();

            return Ok(new IndumentariaDTO
            {
                Id = i.IndumentariaId,
                Codigo = i.Codigo,
                Descripcion = i.Descripcion,
                // CORRECCIÓN AQUÍ:
                PrecioPublico = i.PrecioPublico ?? 0,
                ImagenURL = i.ImagenUrl,
                Talle = i.Talle,
                Color = i.Color,
                Genero = i.Genero,
                TipoPrenda = i.TipoPrenda
            });
        }
    }
}