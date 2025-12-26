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
    public class IndumentariaController : ControllerBase
    {
        private readonly IGenericRepository<Indumentarium> _repository;
        private readonly ICloudinaryService _cloudinary;

        public IndumentariaController(IGenericRepository<Indumentarium> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            // 1. Traemos los datos de la base de datos
            var lista = await _repository.GetAllAsync();

            // 2. Proyección manual a una lista ANÓNIMA o DTO simple.
            // Al usar .ToList() aquí forzamos la ejecución y desconectamos de Entity Framework
            var resultadoSeguro = lista.Select(i => new
            {
                IndumentariaId = i.IndumentariaId,
                Codigo = i.Codigo,
                Descripcion = i.Descripcion,
                PrecioPublico = i.PrecioPublico,
                Stock = i.Stock ?? 0,
                imagenUrl = i.imagenUrl,
                Talle = i.Talle,
                Genero = i.Genero,
                TipoPrenda = i.TipoPrenda,
                Color = i.Color
            }).ToList();

            // Esto devuelve un JSON plano, imposible que tenga ciclos
            return Ok(resultadoSeguro);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Post([FromForm] IndumentariaAdminDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var nuevaIndumentaria = new Indumentarium
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
                Talle = dto.Talle,
                Genero = dto.Genero,
                TipoPrenda = dto.TipoPrenda,
                Color = dto.Color,
            };

            // USAMOS EL REPOSITORIO, NO EL CONTEXTO DIRECTO
            await _repository.AddAsync(nuevaIndumentaria);

            // Asumiendo que tu repositorio hace SaveChanges internamente.
            // Si tu repositorio no hace SaveChanges, deberías llamar a _unitOfWork.Complete() o similar.

            return Ok(new { message = "Bicicleta creada", id = nuevaIndumentaria.IndumentariaId });
        }
    }
}