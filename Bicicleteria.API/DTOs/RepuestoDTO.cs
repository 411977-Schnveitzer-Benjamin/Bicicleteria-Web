namespace Bicicleteria.API.DTOs
{
    public class RepuestoDTO
    {
        public int RepuestoId { get; set; }   
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public decimal? PrecioPublico { get; set; } 
        public int Stock { get; set; }         
        public string imagenUrl { get; set; }   
        public string Categoria { get; set; }
        public string Compatibilidad { get; set; }
        public string MarcaComponente { get; set; }
    }
}