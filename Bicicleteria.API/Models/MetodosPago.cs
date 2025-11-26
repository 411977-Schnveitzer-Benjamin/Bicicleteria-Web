using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class MetodosPago
{
    public int MetodoPagoId { get; set; }

    public string Nombre { get; set; } = null!;

    public bool? Activo { get; set; }

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
