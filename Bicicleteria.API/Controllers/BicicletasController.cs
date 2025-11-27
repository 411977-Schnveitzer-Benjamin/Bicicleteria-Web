using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Para seguridad
using Bicicleteria.API.Interfaces;
using Bicicleteria.API.Models;
using Bicicleteria.API.DTOs;

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

        // GET: api/Bicicletas (Público)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BicicletaDTO>>> GetAll()
        {
            var bicis = await _repository.GetAllAsync();
            var dtos = bicis.Where(b => b.Activo == true).Select(b => new BicicletaDTO
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
            });
            return Ok(dtos);
        }

        // GET: api/Bicicletas/5 (Público)
        [HttpGet("{id}")]
        public async Task<ActionResult<BicicletaDTO>> GetById(int id)
        {
            var b = await _repository.GetByIdAsync(id);
            if (b == null || b.Activo != true) return NotFound();

            return Ok(new BicicletaDTO
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
            });
        }

        // --- ZONA ADMINISTRADOR ---

        // POST: api/Bicicletas (Crear)
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> Create(BicicletaAdminDTO dto)
        {
            var nuevaBici = new Bicicleta
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioCosto = dto.PrecioCosto,
                PrecioPublico = dto.PrecioPublico,
                Stock = dto.Stock,
                Moneda = dto.Moneda,
                Activo = dto.Activo,
                ImagenUrl = dto.ImagenURL,
                Rodado = dto.Rodado,
                Velocidades = dto.Velocidades,
                Marca = dto.Marca,
                Frenos = dto.Frenos,
                Color = dto.Color,
                FechaAlta = DateTime.Now
            };

            await _repository.AddAsync(nuevaBici);
            return Ok(new { mensaje = "Bicicleta creada exitosamente", id = nuevaBici.BicicletaId });
        }

        // PUT: api/Bicicletas/5 (Actualizar)
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Update(int id, BicicletaAdminDTO dto)
        {
            var bici = await _repository.GetByIdAsync(id);
            if (bici == null) return NotFound();

            // Actualizamos los campos
            bici.Codigo = dto.Codigo;
            bici.Descripcion = dto.Descripcion;
            bici.PrecioCosto = dto.PrecioCosto;
            bici.PrecioPublico = dto.PrecioPublico;
            bici.Stock = dto.Stock;
            bici.Moneda = dto.Moneda;
            bici.Activo = dto.Activo;
            bici.ImagenUrl = dto.ImagenURL;
            bici.Rodado = dto.Rodado;
            bici.Velocidades = dto.Velocidades;
            bici.Marca = dto.Marca;
            bici.Frenos = dto.Frenos;
            bici.Color = dto.Color;

            await _repository.UpdateAsync(bici);
            return Ok(new { mensaje = "Bicicleta actualizada" });
        }

        // DELETE: api/Bicicletas/5 (Borrar)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            // Usamos borrado físico (Repository.Delete) o lógico (Activo = false)
            // Aquí haremos borrado lógico para no romper ventas históricas
            var bici = await _repository.GetByIdAsync(id);
            if (bici == null) return NotFound();

            bici.Activo = false; // "Borrado" lógico
            await _repository.UpdateAsync(bici);

            return Ok(new { mensaje = "Bicicleta eliminada (desactivada)" });
        }
    }
}