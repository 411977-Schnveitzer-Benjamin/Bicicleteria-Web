using Microsoft.AspNetCore.Http;

namespace Bicicleteria.API.DTOs
{
    public class BicicletaAdminDTO
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        public decimal PrecioCosto { get; set; }
        public decimal PrecioPublico { get; set; }
        public int? Stock { get; set; }
        public string Moneda { get; set; } = "ARS";
        public bool Activo { get; set; } = true;
        public string? imagenUrl { get; set; }
        public string? Rodado { get; set; }
        public string? Velocidades { get; set; }
        public string? Marca { get; set; }
        public string? Frenos { get; set; }
        public string? Color { get; set; }
    }
}