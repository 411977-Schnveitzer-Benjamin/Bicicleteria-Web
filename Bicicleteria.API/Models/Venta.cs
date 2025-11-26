using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class Venta
{
    public int VentaId { get; set; }

    public int UsuarioId { get; set; }

    public DateTime? FechaVenta { get; set; }

    public decimal TotalVenta { get; set; }

    public int? MetodoPagoId { get; set; }

    public int? EstadoId { get; set; }

    public string? DireccionEnvio { get; set; }

    public string? CiudadEnvio { get; set; }

    public string? CodigoPostal { get; set; }

    public string? NumeroSeguimiento { get; set; }

    public string? Observaciones { get; set; }

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();

    public virtual EstadosPedido? Estado { get; set; }

    public virtual Factura? Factura { get; set; }

    public virtual MetodosPago? MetodoPago { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
