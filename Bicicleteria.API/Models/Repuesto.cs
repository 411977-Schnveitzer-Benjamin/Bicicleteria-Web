    using System;
    using System.Collections.Generic;
using System.Text.Json.Serialization;

    namespace Bicicleteria.API.Models;

    public partial class Repuesto
    {
        public int RepuestoId { get; set; }

        public string Codigo { get; set; } = null!;

        public string Descripcion { get; set; } = null!;

        public decimal? PrecioCosto { get; set; }

        public decimal? PrecioPublico { get; set; }

        public string? Moneda { get; set; }

        public int? Stock { get; set; }

        public string? Categoria { get; set; }

        public string? Compatibilidad { get; set; }

        public string? MarcaComponente { get; set; }

        public string? imagenUrl { get; set; }

        public DateTime? FechaAlta { get; set; }

        public bool? Activo { get; set; }

        public virtual ICollection<Carrito> Carritos { get; set; } = new List<Carrito>();

        public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();

        public virtual ICollection<ImagenesProducto> ImagenesProductos { get; set; } = new List<ImagenesProducto>();
    }
