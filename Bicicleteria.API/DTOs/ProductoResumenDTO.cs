namespace Bicicleteria.API.DTOs
{
    public class ProductoResumenDTO
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? imagenUrl { get; set; }
        public string Tipo { get; set; } = string.Empty;
    }
}