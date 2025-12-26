using Bicicleteria.API.DTOs;
using Bicicleteria.API.Interfaces; // O Repositories.Interfaces
using Bicicleteria.API.Models;
using Bicicleteria.API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult> Create([FromForm] BicicletaAdminDTO dto) // <--- CAMBIO CLAVE: [FromForm]
        {
            // 1. Verificación de duplicados
            bool existe = await _repository.ExistsAsync(x => x.Codigo == dto.Codigo);
            if (existe) return BadRequest("El código ya existe.");

            string urlFinal = dto.imagenUrl; // Por defecto, usa la URL si viene escrita

            // 2. LÓGICA DE CLOUDINARY
            // Si viene un archivo físico, lo subimos y pisamos la URL
            if (dto.ImagenArchivo != null && dto.ImagenArchivo.Length > 0)
            {
                // "bicicletas" es la carpeta en tu Cloudinary
                urlFinal = await _cloudinary.SubirImagen(dto.ImagenArchivo, "bicicletas");
            }
            // Opcional: Si puso una URL externa y quieres guardarla en TU Cloudinary
            else if (!string.IsNullOrEmpty(dto.imagenUrl) && !dto.imagenUrl.Contains("cloudinary"))
            {
                // Descomenta si quieres re-subir URLs externas:
                // urlFinal = await _cloudinaryService.SubirImagenPorUrl(dto.ImagenUrl, "bicicletas");
            }

            // 3. Mapeo
            var nuevaBici = new Bicicleta
            {
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                PrecioPublico = dto.PrecioPublico,
                PrecioCosto = dto.PrecioCosto,
                Stock = dto.Stock ?? 0,
                Rodado = dto.Rodado,
                Marca = dto.Marca,
                Color = dto.Color,
                imagenUrl = urlFinal, // <--- Usamos la URL que nos devolvió Cloudinary
                Activo = true,
                FechaAlta = DateTime.Now
            };

            await _repository.AddAsync(nuevaBici);
            return Ok(new { message = "Bicicleta creada exitosamente", imagen = urlFinal });
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
