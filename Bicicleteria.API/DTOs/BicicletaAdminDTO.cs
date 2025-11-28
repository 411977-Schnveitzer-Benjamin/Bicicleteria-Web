namespace Bicicleteria.API.DTOs
{
    public class BicicletaAdminDTO
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        // Datos sensibles (Solo Admin)
        public decimal PrecioCosto { get; set; }
        public decimal PrecioPublico { get; set; }
        public int? Stock { get; set; }
        public string Moneda { get; set; } = "ARS"; // "ARS" o "USD"
        public bool Activo { get; set; } = true;

        // Detalles
        public string? ImagenUrl { get; set; }
        public string? Rodado { get; set; }
        public string? Velocidades { get; set; }
        public string? Marca { get; set; }
        public string? Frenos { get; set; }
        public string? Color { get; set; }
    }
}