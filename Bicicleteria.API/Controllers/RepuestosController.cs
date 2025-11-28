using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Models;
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.DTOs;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult<IEnumerable<RepuestoDTO>>> Get()
        {
            var lista = await _repository.GetAllAsync();
            var dtos = lista.Select(r => new RepuestoDTO
            {
                RepuestoId = r.RepuestoId,
                Codigo = r.Codigo,
                Descripcion = r.Descripcion,
                PrecioPublico = r.PrecioPublico,
                Stock = r.Stock ?? 0,
                ImagenUrl = r.ImagenUrl,
                Categoria = r.Categoria,
                Compatibilidad = r.Compatibilidad,
                MarcaComponente = r.MarcaComponente
            });
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult> Create(RepuestoAdminDTO dto)
        {
            // 1. Validación
            bool existe = await _repository.ExistsAsync(r => r.Codigo == dto.Codigo);
            if (existe)
                return BadRequest(new { title = "Código Duplicado", message = $"El código '{dto.Codigo}' ya existe en Repuestos." });

            // 2. Mapeo
            var nuevo = new Repuesto
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioPublico = dto.PrecioPublico,
                PrecioCosto = dto.PrecioCosto,
                Stock = dto.Stock ?? 0,
                ImagenUrl = dto.ImagenUrl,
                Categoria = dto.Categoria,
                Compatibilidad = dto.Compatibilidad,
                MarcaComponente = dto.MarcaComponente,
                Activo = true,
                FechaAlta = DateTime.Now
            };

            await _repository.AddAsync(nuevo);
            return Ok(new { message = "Repuesto creado" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, RepuestoAdminDTO dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return NotFound();

            entity.Descripcion = dto.Descripcion;
            entity.PrecioPublico = dto.PrecioPublico;
            entity.PrecioCosto = dto.PrecioCosto;
            entity.Stock = dto.Stock ?? 0;
            entity.ImagenUrl = dto.ImagenUrl;
            entity.Categoria = dto.Categoria;
            entity.Compatibilidad = dto.Compatibilidad;
            entity.MarcaComponente = dto.MarcaComponente;

            await _repository.UpdateAsync(entity);
            return Ok(new { message = "Repuesto actualizado" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return NotFound();

            entity.Activo = false;
            await _repository.UpdateAsync(entity);
            return Ok(new { message = "Repuesto eliminado" });
        }
    }
}