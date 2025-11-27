namespace Bicicleteria.API.DTOs
{
    public class CarritoItemDTO
    {
        public int CarritoId { get; set; } 
        public int ProductoId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public decimal PrecioUnitario { get; set; }
        public int Cantidad { get; set; }
        public decimal Subtotal { get; set; } 
        public string? ImagenURL { get; set; }
        public string Tipo { get; set; } = string.Empty; 
    }
}