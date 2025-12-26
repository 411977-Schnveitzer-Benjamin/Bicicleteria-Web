using Bicicleteria.API.DTOs;
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.Models;
using Bicicleteria.API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepuestosController : ControllerBase
    {
        private readonly IGenericRepository<Repuesto> _repository;
        private readonly ICloudinaryService _cloudinary;

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
                imagenUrl = r.imagenUrl,
                Categoria = r.Categoria,
                Compatibilidad = r.Compatibilidad,
                MarcaComponente = r.MarcaComponente
            });
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Post([FromForm] RepuestoAdminDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var nuevoRepuesto = new Repuesto
            {
                // Campos obligatorios
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioPublico = dto.PrecioPublico,
                PrecioCosto = dto.PrecioCosto,
                Stock = dto.Stock,
                FechaAlta = DateTime.Now,
                Activo = true,

                // --- CORRECCIÓN CLAVE ---
                // Si el string viene con datos, lo guardamos. Si no, NULL.
                imagenUrl = !string.IsNullOrEmpty(dto.imagenUrl) ? dto.imagenUrl : null,
                // ------------------------ 

                // Campos específicos de Bici
                Categoria = dto.Categoria,
                Compatibilidad = dto.Compatibilidad,
                MarcaComponente = dto.MarcaComponente,
            };

            // USAMOS EL REPOSITORIO, NO EL CONTEXTO DIRECTO
            await _repository.AddAsync(nuevoRepuesto);

            // Asumiendo que tu repositorio hace SaveChanges internamente.
            // Si tu repositorio no hace SaveChanges, deberías llamar a _unitOfWork.Complete() o similar.

            return Ok(new { message = "Repuesto creado", id = nuevoRepuesto.RepuestoId });
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
            entity.imagenUrl = dto.imagenUrl;
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