using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class TiposFactura
{
    public int TipoFacturaId { get; set; }

    public string Letra { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
}
