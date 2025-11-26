using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class Marca
{
    public int MarcaId { get; set; }

    public string NombreMarca { get; set; } = null!;

    public string? LogoUrl { get; set; }

    public virtual ICollection<Bicicleta> Bicicleta { get; set; } = new List<Bicicleta>();
}
