using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class DetalleVenta
{
    public int DetalleId { get; set; }

    public int VentaId { get; set; }

    public int? BicicletaId { get; set; }

    public int? RepuestoId { get; set; }

    public int? IndumentariaId { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }

    public virtual Bicicleta? Bicicleta { get; set; }

    public virtual Indumentarium? Indumentaria { get; set; }

    public virtual Repuesto? Repuesto { get; set; }

    public virtual Venta Venta { get; set; } = null!;
}
