namespace Bicicleteria.API.DTOs
{
    public class BicicletaDTO
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal PrecioPublico { get; set; }
        public string? ImagenURL { get; set; }
        public string? Rodado { get; set; }
        public string? Velocidades { get; set; }
        public string? Marca { get; set; }
        public string? Frenos { get; set; }
        public string? Color { get; set; }
    }
}