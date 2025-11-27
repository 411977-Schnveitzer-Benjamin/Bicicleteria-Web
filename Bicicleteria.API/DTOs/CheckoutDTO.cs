namespace Bicicleteria.API.DTOs
{
    public class CheckoutDTO
    {
        public int MetodoPagoId { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public string CodigoPostal { get; set; } = string.Empty;
        public string? Observaciones { get; set; }
    }
}