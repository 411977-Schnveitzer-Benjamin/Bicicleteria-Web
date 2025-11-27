namespace Bicicleteria.API.DTOs
{
    public class AgregarCarritoDTO
    {
        public int ProductoId { get; set; }
        public string TipoProducto { get; set; } = string.Empty; // Valores esperados: "BICI", "REPUESTO", "ROPA"
        public int Cantidad { get; set; } = 1;
    }
}