using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class Carrito
{
    public int CarritoId { get; set; }

    public int UsuarioId { get; set; }

    public int? BicicletaId { get; set; }

    public int? RepuestoId { get; set; }

    public int? IndumentariaId { get; set; }

    public int? Cantidad { get; set; }

    public DateTime? FechaAgregado { get; set; }

    public virtual Bicicleta? Bicicleta { get; set; }

    public virtual Indumentarium? Indumentaria { get; set; }

    public virtual Repuesto? Repuesto { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
