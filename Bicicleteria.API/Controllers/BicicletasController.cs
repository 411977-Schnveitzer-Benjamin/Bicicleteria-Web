using Bicicleteria.API.DTOs;
using Bicicleteria.API.Interfaces; // O Repositories.Interfaces
using Bicicleteria.API.Models;
using Bicicleteria.API.Services;
using Bicicleteria.API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bicicleteria.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BicicletasController : ControllerBase
    {
        private readonly IGenericRepository<Bicicleta> _repository;
        private readonly ICloudinaryService _cloudinary;

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

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Post([FromForm] BicicletaAdminDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var nuevaBici = new Bicicleta
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
                Marca = dto.Marca,
                Rodado = dto.Rodado,
                Velocidades = dto.Velocidades,
                Color = dto.Color,
                Frenos = dto.Frenos ?? "V-Brake"
            };

            // USAMOS EL REPOSITORIO, NO EL CONTEXTO DIRECTO
            await _repository.AddAsync(nuevaBici);

            // Asumiendo que tu repositorio hace SaveChanges internamente.
            // Si tu repositorio no hace SaveChanges, deberías llamar a _unitOfWork.Complete() o similar.

            return Ok(new { message = "Bicicleta creada", id = nuevaBici.BicicletaId });
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
