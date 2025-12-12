using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Models;
using Bicicleteria.API.Interfaces; // O Repositories.Interfaces
using Bicicleteria.API.DTOs;
using Microsoft.AspNetCore.Authorization;

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

        // GET: api/Bicicletas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BicicletaDTO>>> Get()
        {
            var bicis = await _repository.GetAllAsync();

            // Mapeo manual a DTO para devolver solo lo necesario
            var dtos = bicis.Select(b => new BicicletaDTO
            {
                BicicletaId = b.BicicletaId,
                Codigo = b.Codigo,
                Descripcion = b.Descripcion,
                PrecioPublico = b.PrecioPublico,
                Stock = b.Stock ?? 0, 
                imagenUrl = b.imagenUrl,
                Rodado = b.Rodado,
                Velocidades = b.Velocidades,
                Marca = b.Marca,
                Color = b.Color
            });

            return Ok(dtos);
        }

        // GET: api/Bicicletas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BicicletaDTO>> Get(int id)
        {
            var b = await _repository.GetByIdAsync(id);
            if (b == null) return NotFound();

            var dto = new BicicletaDTO
            {
                BicicletaId = b.BicicletaId,
                Codigo = b.Codigo,
                Descripcion = b.Descripcion,
                PrecioPublico = b.PrecioPublico,
                Stock = b.Stock ?? 0,
                imagenUrl = b.imagenUrl,
                Rodado = b.Rodado,
                Velocidades = b.Velocidades,
                Marca = b.Marca,
                Color = b.Color
            };

            return Ok(dto);
        }

        // POST: api/Bicicletas
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> Create(BicicletaAdminDTO dto)
        {
            // 1. VERIFICACIÓN DE DUPLICADOS
            bool existe = await _repository.ExistsAsync(x => x.Codigo == dto.Codigo);
            if (existe)
            {
                return BadRequest(new { title = "Código Duplicado", message = $"El código '{dto.Codigo}' ya está en uso en otra bicicleta." });
            }

            // 2. Mapeo de DTO a Entidad
            var nuevaBici = new Bicicleta
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioPublico = dto.PrecioPublico,
                PrecioCosto = dto.PrecioCosto,
                Stock = dto.Stock ?? 0,
                imagenUrl = dto.imagenUrl,
                Rodado = dto.Rodado,
                Marca = dto.Marca,
                Color = dto.Color,
                Activo = true,
                FechaAlta = DateTime.Now
            };

            await _repository.AddAsync(nuevaBici);
            return Ok(new { message = "Bicicleta creada exitosamente" });
        }

        // PUT: api/Bicicletas/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, BicicletaAdminDTO dto)
        {
            var biciExistente = await _repository.GetByIdAsync(id);
            if (biciExistente == null) return NotFound("Bicicleta no encontrada");

            // Actualizamos los campos
            biciExistente.Descripcion = dto.Descripcion;
            biciExistente.PrecioPublico = dto.PrecioPublico;
            biciExistente.PrecioCosto = dto.PrecioCosto;
            biciExistente.Stock = dto.Stock ?? 0;
            biciExistente.imagenUrl = dto.imagenUrl;
            biciExistente.Rodado = dto.Rodado;
            biciExistente.Velocidades = dto.Velocidades;
            biciExistente.Marca = dto.Marca;
            biciExistente.Color = dto.Color;
            biciExistente.Frenos = dto.Frenos;

            // Nota: Generalmente no permitimos cambiar el Código al editar para no romper historial,
            // pero si quisieras, deberías validar duplicados aquí también.

            await _repository.UpdateAsync(biciExistente);
            return Ok(new { message = "Bicicleta actualizada" });
        }
    }
}
