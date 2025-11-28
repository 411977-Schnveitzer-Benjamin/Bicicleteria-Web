namespace Bicicleteria.API.DTOs
{
    public class BicicletaDTO
    {
        public int BicicletaId { get; set; } 
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public decimal? PrecioPublico { get; set; } 
        public int Stock { get; set; } 
        public string ImagenUrl { get; set; }
        public string Rodado { get; set; }
        public string Velocidades { get; set; }
        public string Marca { get; set; }
        public string Color { get; set; }
    }
}