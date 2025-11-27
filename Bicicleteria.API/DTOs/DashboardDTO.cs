namespace Bicicleteria.API.DTOs
{
    public class DashboardDTO
    {
        // Métricas Generales
        public decimal TotalVendidoMes { get; set; }
        public int CantidadVentasMes { get; set; }
        public int ClientesNuevosMes { get; set; }

        // Tablas de resumen
        public List<VentaResumenDTO> UltimasVentas { get; set; } = new();
        public List<ProductoAlertaDTO> ProductosBajoStock { get; set; } = new();
    }

    public class VentaResumenDTO
    {
        public int Id { get; set; }
        public string Fecha { get; set; } = string.Empty;
        public string Cliente { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string Estado { get; set; } = string.Empty;
    }

    public class ProductoAlertaDTO
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public int Stock { get; set; }
        public string Tipo { get; set; } = string.Empty; // "Bici", "Repuesto", etc.
    }
}