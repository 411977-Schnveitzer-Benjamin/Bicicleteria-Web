using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

        // --- ABM ADMIN ---

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> Create(RepuestoAdminDTO dto)
        {
            var nuevo = new Repuesto
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioCosto = dto.PrecioCosto,
                PrecioPublico = dto.PrecioPublico,
                Stock = dto.Stock,
                Moneda = dto.Moneda,
                Activo = dto.Activo,
                ImagenUrl = dto.ImagenURL,
                Categoria = dto.Categoria,
                Compatibilidad = dto.Compatibilidad,
                MarcaComponente = dto.MarcaComponente,
                FechaAlta = DateTime.Now
            };
            await _repository.AddAsync(nuevo);
            return Ok(new { mensaje = "Repuesto creado", id = nuevo.RepuestoId });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Update(int id, RepuestoAdminDTO dto)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return NotFound();

            item.Codigo = dto.Codigo;
            item.Descripcion = dto.Descripcion;
            item.PrecioCosto = dto.PrecioCosto;
            item.PrecioPublico = dto.PrecioPublico;
            item.Stock = dto.Stock;
            item.Moneda = dto.Moneda;
            item.Activo = dto.Activo;
            item.ImagenUrl = dto.ImagenURL;
            item.Categoria = dto.Categoria;
            item.Compatibilidad = dto.Compatibilidad;
            item.MarcaComponente = dto.MarcaComponente;

            await _repository.UpdateAsync(item);
            return Ok(new { mensaje = "Repuesto actualizado" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return NotFound();
            item.Activo = false;
            await _repository.UpdateAsync(item);
            return Ok(new { mensaje = "Repuesto eliminado" });
        }
    }
}