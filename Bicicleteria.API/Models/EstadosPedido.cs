using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class EstadosPedido
{
    public int EstadoId { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
