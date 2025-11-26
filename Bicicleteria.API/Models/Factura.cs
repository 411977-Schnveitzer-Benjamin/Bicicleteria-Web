using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class Factura
{
    public int FacturaId { get; set; }

    public int VentaId { get; set; }

    public int TipoFacturaId { get; set; }

    public DateTime? FechaFacturacion { get; set; }

    public string? Cae { get; set; }

    public DateTime? VencimientoCae { get; set; }

    public string? NumeroFactura { get; set; }

    public string? CuitCliente { get; set; }

    public string? RazonSocialCliente { get; set; }

    public decimal? MontoTotal { get; set; }

    public decimal? MontoIva { get; set; }

    public virtual TiposFactura TipoFactura { get; set; } = null!;

    public virtual Venta Venta { get; set; } = null!;
}
