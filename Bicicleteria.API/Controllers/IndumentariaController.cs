using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Models;
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.DTOs;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult<IEnumerable<IndumentariaDTO>>> Get()
        {
            var lista = await _repository.GetAllAsync();
            var dtos = lista.Select(i => new IndumentariaDTO
            {
                IndumentariaId = i.IndumentariaId,
                Codigo = i.Codigo,
                Descripcion = i.Descripcion,
                PrecioPublico = i.PrecioPublico,
                Stock = i.Stock ?? 0,
                ImagenUrl = i.ImagenUrl,
                Talle = i.Talle,
                Genero = i.Genero,
                TipoPrenda = i.TipoPrenda,
                Color = i.Color
            });
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult> Create(IndumentariaAdminDTO dto)
        {
            // 1. Validación
            bool existe = await _repository.ExistsAsync(i => i.Codigo == dto.Codigo);
            if (existe)
                return BadRequest(new { title = "Código Duplicado", message = $"El código '{dto.Codigo}' ya existe en Indumentaria." });

            // 2. Mapeo
            var nuevo = new Indumentarium
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioPublico = dto.PrecioPublico,
                PrecioCosto = dto.PrecioCosto,
                Stock = dto.Stock ?? 0,
                ImagenUrl = dto.ImagenUrl,
                Talle = dto.Talle,
                Genero = dto.Genero,
                TipoPrenda = dto.TipoPrenda,
                Color = dto.Color,
                Activo = true,
                FechaAlta = DateTime.Now
            };

            await _repository.AddAsync(nuevo);
            return Ok(new { message = "Indumentaria creada" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, IndumentariaAdminDTO dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return NotFound();

            entity.Descripcion = dto.Descripcion;
            entity.PrecioPublico = dto.PrecioPublico;
            entity.PrecioCosto = dto.PrecioCosto;
            entity.Stock = dto.Stock ?? 0;
            entity.ImagenUrl = dto.ImagenUrl;
            entity.Talle = dto.Talle;
            entity.Genero = dto.Genero;
            entity.TipoPrenda = dto.TipoPrenda;
            entity.Color = dto.Color;

            await _repository.UpdateAsync(entity);
            return Ok(new { message = "Indumentaria actualizada" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return NotFound();

            entity.Activo = false;
            await _repository.UpdateAsync(entity);
            return Ok(new { message = "Indumentaria eliminada" });
        }
    }
}