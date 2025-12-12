using Microsoft.AspNetCore.Mvc;
using Bicicleteria.API.Models;
using Bicicleteria.API.Interfaces;
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

        // ... (Mantén tus métodos Create, Update, Delete como estaban, esos no dan error)
        [HttpPost]
        public async Task<ActionResult> Create(IndumentariaAdminDTO dto)
        {
            bool existe = await _repository.ExistsAsync(i => i.Codigo == dto.Codigo);
            if (existe) return BadRequest("Código duplicado");

            var nuevo = new Indumentarium
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioPublico = dto.PrecioPublico,
                PrecioCosto = dto.PrecioCosto,
                Stock = dto.Stock ?? 0,
                imagenUrl = dto.imagenUrl,
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
    }
}