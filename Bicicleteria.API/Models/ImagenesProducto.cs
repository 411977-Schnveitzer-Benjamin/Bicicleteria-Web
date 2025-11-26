using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class ImagenesProducto
{
    public int ImagenId { get; set; }

    public string Urlimagen { get; set; } = null!;

    public bool? EsPrincipal { get; set; }

    public int? BicicletaId { get; set; }

    public int? RepuestoId { get; set; }

    public int? IndumentariaId { get; set; }

    public virtual Bicicleta? Bicicleta { get; set; }

    public virtual Indumentarium? Indumentaria { get; set; }

    public virtual Repuesto? Repuesto { get; set; }
}
