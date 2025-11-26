using System;
using System.Collections.Generic;

namespace Bicicleteria.API.Models;

public partial class Bicicleta
{
    public int BicicletaId { get; set; }

    public string Codigo { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public decimal? PrecioCosto { get; set; }

    public decimal? PrecioPublico { get; set; }

    public string? Moneda { get; set; }

    public int? Stock { get; set; }

    public string? Rodado { get; set; }

    public string? Velocidades { get; set; }

    public string? Marca { get; set; }

    public string? Frenos { get; set; }

    public string? Color { get; set; }

    public string? ImagenUrl { get; set; }

    public DateTime? FechaAlta { get; set; }

    public bool? Activo { get; set; }

    public int? MarcaId { get; set; }

    public virtual ICollection<Carrito> Carritos { get; set; } = new List<Carrito>();

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();

    public virtual ICollection<ImagenesProducto> ImagenesProductos { get; set; } = new List<ImagenesProducto>();

    public virtual Marca? MarcaNavigation { get; set; }
}
