namespace Bicicleteria.API.DTOs
{
    public class IndumentariaAdminDTO
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        public decimal PrecioCosto { get; set; }
        public decimal PrecioPublico { get; set; }
        public int Stock { get; set; }
        public string Moneda { get; set; } = "ARS";
        public bool Activo { get; set; } = true;

        public string? ImagenURL { get; set; }
        public string? Talle { get; set; }
        public string? Color { get; set; }
        public string? Genero { get; set; }
        public string? TipoPrenda { get; set; }
    }
}