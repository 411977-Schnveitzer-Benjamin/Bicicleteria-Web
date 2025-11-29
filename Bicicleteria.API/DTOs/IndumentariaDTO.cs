namespace Bicicleteria.API.DTOs
{
    public class IndumentariaDTO
    {
        public int IndumentariaId { get; set; }  
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public decimal? PrecioPublico { get; set; }
        public int Stock { get; set; }          
        public string imagenUrl { get; set; }   
        public string Talle { get; set; }
        public string Genero { get; set; }
        public string TipoPrenda { get; set; }
        public string Color { get; set; }
    }
}