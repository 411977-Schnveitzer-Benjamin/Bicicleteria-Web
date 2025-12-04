    using System;
    using System.Collections.Generic;
    using Microsoft.EntityFrameworkCore;

    namespace Bicicleteria.API.Models;

    public partial class BicicleteriaWebContext : DbContext
    {
        public BicicleteriaWebContext()
        {
        }

        public BicicleteriaWebContext(DbContextOptions<BicicleteriaWebContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Bicicleta> Bicicletas { get; set; }
        public virtual DbSet<Carrito> Carritos { get; set; }
        public virtual DbSet<DetalleVenta> DetalleVentas { get; set; }
        public virtual DbSet<EstadosPedido> EstadosPedidos { get; set; }
        public virtual DbSet<Factura> Facturas { get; set; }
        public virtual DbSet<ImagenesProducto> ImagenesProductos { get; set; }
        public virtual DbSet<Indumentarium> Indumentaria { get; set; }
        public virtual DbSet<Marca> Marcas { get; set; }
        public virtual DbSet<MetodosPago> MetodosPagos { get; set; }
        public virtual DbSet<Repuesto> Repuestos { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<TiposFactura> TiposFacturas { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Venta> Ventas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Bicicleta>(entity =>
            {
                entity.HasKey(e => e.BicicletaId).HasName("PK__Biciclet__D1711BA816322D6C");
                entity.HasIndex(e => e.Codigo, "UQ__Biciclet__06370DACE85FD9DE").IsUnique();
                entity.Property(e => e.BicicletaId).HasColumnName("BicicletaID");
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.Codigo).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Color).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Descripcion).HasMaxLength(1000).IsUnicode(false);
                entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.Frenos).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.imagenUrl).HasColumnName("ImagenURL"); entity.Property(e => e.Marca).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.MarcaId).HasColumnName("MarcaID");
                entity.Property(e => e.Moneda).HasMaxLength(3).IsUnicode(false).HasDefaultValue("ARS");
                entity.Property(e => e.PrecioCosto).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.PrecioPublico).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.Rodado).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.Stock).HasDefaultValue(0);
                entity.Property(e => e.Velocidades).HasMaxLength(20).IsUnicode(false);

                entity.HasOne(d => d.MarcaNavigation).WithMany(p => p.Bicicleta)
                    .HasForeignKey(d => d.MarcaId)
                    .HasConstraintName("FK__Bicicleta__Marca__76969D2E");
            });

            modelBuilder.Entity<Carrito>(entity =>
            {
                entity.HasKey(e => e.CarritoId).HasName("PK__Carritos__778D580BEC86D73A");
                entity.Property(e => e.CarritoId).HasColumnName("CarritoID");
                entity.Property(e => e.BicicletaId).HasColumnName("BicicletaID");
                entity.Property(e => e.Cantidad).HasDefaultValue(1);
                entity.Property(e => e.FechaAgregado).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.IndumentariaId).HasColumnName("IndumentariaID");
                entity.Property(e => e.RepuestoId).HasColumnName("RepuestoID");
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.HasOne(d => d.Bicicleta).WithMany(p => p.Carritos).HasForeignKey(d => d.BicicletaId).HasConstraintName("FK_Carrito_Bicis");
                entity.HasOne(d => d.Indumentaria).WithMany(p => p.Carritos).HasForeignKey(d => d.IndumentariaId).HasConstraintName("FK_Carrito_Ropa");
                entity.HasOne(d => d.Repuesto).WithMany(p => p.Carritos).HasForeignKey(d => d.RepuestoId).HasConstraintName("FK_Carrito_Repuestos");
                entity.HasOne(d => d.Usuario).WithMany(p => p.Carritos).HasForeignKey(d => d.UsuarioId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Carrito_Usuarios");
            });

            modelBuilder.Entity<DetalleVenta>(entity =>
            {
                entity.HasKey(e => e.DetalleId).HasName("PK__DetalleV__6E19D6FA00ADA6BD");
                entity.Property(e => e.DetalleId).HasColumnName("DetalleID");
                entity.Property(e => e.BicicletaId).HasColumnName("BicicletaID");
                entity.Property(e => e.Cantidad).HasDefaultValue(1);
                entity.Property(e => e.IndumentariaId).HasColumnName("IndumentariaID");
                entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.RepuestoId).HasColumnName("RepuestoID");
                entity.Property(e => e.Subtotal).HasComputedColumnSql("([Cantidad]*[PrecioUnitario])", false).HasColumnType("decimal(29, 2)");
                entity.Property(e => e.VentaId).HasColumnName("VentaID");

                entity.HasOne(d => d.Bicicleta).WithMany(p => p.DetalleVenta).HasForeignKey(d => d.BicicletaId).HasConstraintName("FK_Detalle_Bicis");
                entity.HasOne(d => d.Indumentaria).WithMany(p => p.DetalleVenta).HasForeignKey(d => d.IndumentariaId).HasConstraintName("FK_Detalle_Ropa");
                entity.HasOne(d => d.Repuesto).WithMany(p => p.DetalleVenta).HasForeignKey(d => d.RepuestoId).HasConstraintName("FK_Detalle_Repuestos");
                entity.HasOne(d => d.Venta).WithMany(p => p.DetalleVenta).HasForeignKey(d => d.VentaId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Detalle_Ventas");
            });

            modelBuilder.Entity<EstadosPedido>(entity =>
            {
                entity.HasKey(e => e.EstadoId).HasName("PK__EstadosP__FEF86B60C7D8F551");
                entity.ToTable("EstadosPedido");
                entity.Property(e => e.EstadoId).HasColumnName("EstadoID");
                entity.Property(e => e.Nombre).HasMaxLength(50).IsUnicode(false);
            });

            modelBuilder.Entity<Factura>(entity =>
            {
                entity.HasKey(e => e.FacturaId).HasName("PK__Facturas__5C0248056C3A8596");
                entity.HasIndex(e => e.VentaId, "UQ__Facturas__5B41514D0E1C1492").IsUnique();
                entity.Property(e => e.FacturaId).HasColumnName("FacturaID");
                entity.Property(e => e.Cae).HasMaxLength(50).IsUnicode(false).HasColumnName("CAE");
                entity.Property(e => e.CuitCliente).HasMaxLength(20).IsUnicode(false).HasColumnName("CUIT_Cliente");
                entity.Property(e => e.FechaFacturacion).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.MontoIva).HasColumnType("decimal(18, 2)").HasColumnName("MontoIVA");
                entity.Property(e => e.MontoTotal).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.NumeroFactura).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.RazonSocialCliente).HasMaxLength(100).IsUnicode(false).HasColumnName("RazonSocial_Cliente");
                entity.Property(e => e.TipoFacturaId).HasColumnName("TipoFacturaID");
                entity.Property(e => e.VencimientoCae).HasColumnType("datetime").HasColumnName("VencimientoCAE");
                entity.Property(e => e.VentaId).HasColumnName("VentaID");

                entity.HasOne(d => d.TipoFactura).WithMany(p => p.Facturas).HasForeignKey(d => d.TipoFacturaId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Facturas_Tipos");
                entity.HasOne(d => d.Venta).WithOne(p => p.Factura).HasForeignKey<Factura>(d => d.VentaId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Facturas_Ventas");
            });

            modelBuilder.Entity<ImagenesProducto>(entity =>
            {
                entity.HasKey(e => e.ImagenId).HasName("PK__Imagenes__0C7D20D7682FC48A");
                entity.ToTable("ImagenesProducto");
                entity.Property(e => e.ImagenId).HasColumnName("ImagenID");
                entity.Property(e => e.BicicletaId).HasColumnName("BicicletaID");
                entity.Property(e => e.EsPrincipal).HasDefaultValue(false);
                entity.Property(e => e.IndumentariaId).HasColumnName("IndumentariaID");
                entity.Property(e => e.RepuestoId).HasColumnName("RepuestoID");
                entity.Property(e => e.imagenUrl).HasColumnName("ImagenURL");
                entity.HasOne(d => d.Bicicleta).WithMany(p => p.ImagenesProductos).HasForeignKey(d => d.BicicletaId).HasConstraintName("FK_Img_Bici");
                entity.HasOne(d => d.Indumentaria).WithMany(p => p.ImagenesProductos).HasForeignKey(d => d.IndumentariaId).HasConstraintName("FK_Img_Ind");
                entity.HasOne(d => d.Repuesto).WithMany(p => p.ImagenesProductos).HasForeignKey(d => d.RepuestoId).HasConstraintName("FK_Img_Rep");
            });

            modelBuilder.Entity<Indumentarium>(entity =>
            {
                entity.HasKey(e => e.IndumentariaId).HasName("PK__Indument__53E3B818D4B95513");
                entity.HasIndex(e => e.Codigo, "UQ__Indument__06370DAC5D6A706C").IsUnique();
                entity.Property(e => e.IndumentariaId).HasColumnName("IndumentariaID");
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.Codigo).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Color).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Descripcion).HasMaxLength(1000).IsUnicode(false);
                entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.Genero).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.imagenUrl).HasColumnName("ImagenURL"); entity.Property(e => e.Moneda).HasMaxLength(3).IsUnicode(false).HasDefaultValue("ARS");
                entity.Property(e => e.PrecioCosto).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.PrecioPublico).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.Stock).HasDefaultValue(0);
                entity.Property(e => e.Talle).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.TipoPrenda).HasMaxLength(70).IsUnicode(false);
            });

            modelBuilder.Entity<Marca>(entity =>
            {
                entity.HasKey(e => e.MarcaId).HasName("PK__Marcas__D5B1CDEB0CD7FB9F");
                entity.HasIndex(e => e.NombreMarca, "UQ__Marcas__42FE0ACB638011B4").IsUnique();
                entity.Property(e => e.MarcaId).HasColumnName("MarcaID");
                entity.Property(e => e.LogoUrl).HasMaxLength(500).IsUnicode(false).HasColumnName("LogoURL");
                entity.Property(e => e.NombreMarca).HasMaxLength(50).IsUnicode(false);
            });

            modelBuilder.Entity<MetodosPago>(entity =>
            {
                entity.HasKey(e => e.MetodoPagoId).HasName("PK__MetodosP__A8FEAF741910CD4E");
                entity.ToTable("MetodosPago");
                entity.Property(e => e.MetodoPagoId).HasColumnName("MetodoPagoID");
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.Nombre).HasMaxLength(50).IsUnicode(false);
            });

            modelBuilder.Entity<Repuesto>(entity =>
            {
                entity.HasKey(e => e.RepuestoId).HasName("PK__Repuesto__75B307741A05A37D");
                entity.HasIndex(e => e.Codigo, "UQ__Repuesto__06370DAC62FE64E4").IsUnique();
                entity.Property(e => e.RepuestoId).HasColumnName("RepuestoID");
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.Categoria).HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.Codigo).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Compatibilidad).HasMaxLength(200).IsUnicode(false);
                entity.Property(e => e.Descripcion).HasMaxLength(1000).IsUnicode(false);
                entity.Property(e => e.FechaAlta).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.imagenUrl).HasColumnName("ImagenURL"); entity.Property(e => e.MarcaComponente).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Moneda).HasMaxLength(3).IsUnicode(false).HasDefaultValue("ARS");
                entity.Property(e => e.PrecioCosto).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.PrecioPublico).HasDefaultValue(0m).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.Stock).HasDefaultValue(0);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RolId).HasName("PK__Roles__F92302D134454D02");
                entity.HasIndex(e => e.NombreRol, "UQ__Roles__4F0B537FA7852697").IsUnique();
                entity.Property(e => e.RolId).HasColumnName("RolID");
                entity.Property(e => e.NombreRol).HasMaxLength(50).IsUnicode(false);
            });

            modelBuilder.Entity<TiposFactura>(entity =>
            {
                entity.HasKey(e => e.TipoFacturaId).HasName("PK__TiposFac__F6C21C608E5DA5DC");
                entity.ToTable("TiposFactura");
                entity.Property(e => e.TipoFacturaId).HasColumnName("TipoFacturaID");
                entity.Property(e => e.Descripcion).HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Letra).HasMaxLength(1).IsUnicode(false).IsFixedLength();
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.UsuarioId).HasName("PK__Usuarios__2B3DE7980A5883EE");

                // CAMBIO APLICADO: Eliminamos la configuración de DNI
                entity.HasIndex(e => e.Email, "UQ__Usuarios__A9D1053413CFE584").IsUnique();

                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.Direccion).HasMaxLength(200).IsUnicode(false);
                entity.Property(e => e.Email).HasMaxLength(100).IsUnicode(false);

                // CAMBIO APLICADO: Agregamos mapeo de FechaNacimiento
                entity.Property(e => e.FechaNacimiento).HasColumnType("date");

                entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.NombreCompleto).HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.PasswordHash).HasMaxLength(255).IsUnicode(false);
                entity.Property(e => e.RolId).HasColumnName("RolID");
                entity.Property(e => e.Telefono).HasMaxLength(50).IsUnicode(false);

                entity.HasOne(d => d.Rol).WithMany(p => p.Usuarios).HasForeignKey(d => d.RolId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Usuarios_Roles");
            });

            modelBuilder.Entity<Venta>(entity =>
            {
                entity.HasKey(e => e.VentaId).HasName("PK__Ventas__5B41514CFCA483E0");
                entity.Property(e => e.VentaId).HasColumnName("VentaID");
                entity.Property(e => e.CiudadEnvio).HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.CodigoPostal).HasMaxLength(20).IsUnicode(false);
                entity.Property(e => e.DireccionEnvio).HasMaxLength(255).IsUnicode(false);
                entity.Property(e => e.EstadoId).HasDefaultValue(1).HasColumnName("EstadoID");
                entity.Property(e => e.FechaVenta).HasDefaultValueSql("(getdate())").HasColumnType("datetime");
                entity.Property(e => e.MetodoPagoId).HasColumnName("MetodoPagoID");
                entity.Property(e => e.NumeroSeguimiento).HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.Observaciones).HasMaxLength(500).IsUnicode(false);
                entity.Property(e => e.TotalVenta).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.HasOne(d => d.Estado).WithMany(p => p.Venta).HasForeignKey(d => d.EstadoId).HasConstraintName("FK_Ventas_Estados");
                entity.HasOne(d => d.MetodoPago).WithMany(p => p.Venta).HasForeignKey(d => d.MetodoPagoId).HasConstraintName("FK_Ventas_MetodosPago");
                entity.HasOne(d => d.Usuario).WithMany(p => p.Venta).HasForeignKey(d => d.UsuarioId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Ventas_Usuarios");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }