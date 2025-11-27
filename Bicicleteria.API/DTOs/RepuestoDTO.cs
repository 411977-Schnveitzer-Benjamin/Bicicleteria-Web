namespace Bicicleteria.API.DTOs
{
    public class RepuestoDTO
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal PrecioPublico { get; set; }
        public string? ImagenURL { get; set; }
        public string? Categoria { get; set; }
        public string? Compatibilidad { get; set; }
        public string? MarcaComponente { get; set; }
    }
}