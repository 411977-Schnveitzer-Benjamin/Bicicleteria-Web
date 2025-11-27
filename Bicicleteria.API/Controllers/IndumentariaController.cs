using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
                PrecioPublico = i.PrecioPublico ?? 0,
                ImagenURL = i.ImagenUrl,
                Talle = i.Talle,
                Color = i.Color,
                Genero = i.Genero,
                TipoPrenda = i.TipoPrenda
            });
        }

        // --- ABM ADMIN ---

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> Create(IndumentariaAdminDTO dto)
        {
            var nuevo = new Indumentarium
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioCosto = dto.PrecioCosto,
                PrecioPublico = dto.PrecioPublico,
                Stock = dto.Stock,
                Moneda = dto.Moneda,
                Activo = dto.Activo,
                ImagenUrl = dto.ImagenURL,
                Talle = dto.Talle,
                Color = dto.Color,
                Genero = dto.Genero,
                TipoPrenda = dto.TipoPrenda,
                FechaAlta = DateTime.Now
            };
            await _repository.AddAsync(nuevo);
            return Ok(new { mensaje = "Indumentaria creada", id = nuevo.IndumentariaId });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Update(int id, IndumentariaAdminDTO dto)
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
            item.Talle = dto.Talle;
            item.Color = dto.Color;
            item.Genero = dto.Genero;
            item.TipoPrenda = dto.TipoPrenda;

            await _repository.UpdateAsync(item);
            return Ok(new { mensaje = "Indumentaria actualizada" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return NotFound();
            item.Activo = false;
            await _repository.UpdateAsync(item);
            return Ok(new { mensaje = "Indumentaria eliminada" });
        }
    }
}