namespace Bicicleteria.API.DTOs
{
    public class RepuestoAdminDTO
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        public decimal PrecioCosto { get; set; }
        public decimal PrecioPublico { get; set; }
        public int? Stock { get; set; }
        public string Moneda { get; set; } = "ARS";
        public bool Activo { get; set; } = true;

        public string? imagenUrl { get; set; }
        public string? Categoria { get; set; }
        public string? Compatibilidad { get; set; }
        public string? MarcaComponente { get; set; }
    }
}