USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BicicleteriaWeb')
BEGIN
    CREATE DATABASE BicicleteriaWeb;
END
GO

USE BicicleteriaWeb;
GO

/* =====================================================
   1. SEGURIDAD Y USUARIOS
   ===================================================== */

CREATE TABLE Roles (
    RolID INT IDENTITY(1,1) PRIMARY KEY,
    NombreRol VARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE Usuarios (
    UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    RolID INT NOT NULL,
    NombreCompleto VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    DNI VARCHAR(20) UNIQUE,
    Telefono VARCHAR(50),
    Direccion VARCHAR(200),
    FechaRegistro DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1,
    
    CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (RolID) REFERENCES Roles(RolID)
);
GO

/* =====================================================
   2. TABLAS PARAMÉTRICAS (Auxiliares)
   ===================================================== */

CREATE TABLE MetodosPago (
    MetodoPagoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Activo BIT DEFAULT 1
);
GO

CREATE TABLE EstadosPedido (
    EstadoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);
GO

CREATE TABLE TiposFactura (
    TipoFacturaID INT IDENTITY(1,1) PRIMARY KEY,
    Letra CHAR(1) NOT NULL,
    Descripcion VARCHAR(50)
);
GO

/* =====================================================
   3. CATÁLOGO DE PRODUCTOS (3 Islas)
   ===================================================== */

CREATE TABLE Bicicletas (
    BicicletaID INT IDENTITY(1,1) PRIMARY KEY,
    Codigo VARCHAR(50) UNIQUE NOT NULL,
    Descripcion VARCHAR(1000) NOT NULL,
    PrecioCosto DECIMAL(18, 2) DEFAULT 0,
    PrecioPublico DECIMAL(18, 2) DEFAULT 0,
    Moneda VARCHAR(3) DEFAULT 'ARS',
    Stock INT DEFAULT 0,
    Rodado VARCHAR(20),
    Velocidades VARCHAR(20),
    Marca VARCHAR(50),
    Frenos VARCHAR(50),
    Color VARCHAR(50),
    ImagenURL VARCHAR(500),
    FechaAlta DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
);
GO

CREATE TABLE Repuestos (
    RepuestoID INT IDENTITY(1,1) PRIMARY KEY,
    Codigo VARCHAR(50) UNIQUE NOT NULL,
    Descripcion VARCHAR(1000) NOT NULL,
    PrecioCosto DECIMAL(18, 2) DEFAULT 0,
    PrecioPublico DECIMAL(18, 2) DEFAULT 0,
    Moneda VARCHAR(3) DEFAULT 'ARS',
    Stock INT DEFAULT 0,
    Categoria VARCHAR(100),
    Compatibilidad VARCHAR(200),
    MarcaComponente VARCHAR(50),
    ImagenURL VARCHAR(500),
    FechaAlta DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
);
GO

CREATE TABLE Indumentaria (
    IndumentariaID INT IDENTITY(1,1) PRIMARY KEY,
    Codigo VARCHAR(50) UNIQUE NOT NULL,
    Descripcion VARCHAR(1000) NOT NULL,
    PrecioCosto DECIMAL(18, 2) DEFAULT 0,
    PrecioPublico DECIMAL(18, 2) DEFAULT 0,
    Moneda VARCHAR(3) DEFAULT 'ARS',
    Stock INT DEFAULT 0,
    Talle VARCHAR(20),
    Color VARCHAR(50),
    Genero VARCHAR(20),
    TipoPrenda VARCHAR(50),
    ImagenURL VARCHAR(500),
    FechaAlta DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
);
GO

/* =====================================================
   4. CARRITO DE COMPRAS (Persistente)
   ===================================================== */

CREATE TABLE Carritos (
    CarritoID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT NOT NULL,
    BicicletaID INT NULL,
    RepuestoID INT NULL,
    IndumentariaID INT NULL,
    Cantidad INT DEFAULT 1,
    FechaAgregado DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Carrito_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Carrito_Bicis FOREIGN KEY (BicicletaID) REFERENCES Bicicletas(BicicletaID),
    CONSTRAINT FK_Carrito_Repuestos FOREIGN KEY (RepuestoID) REFERENCES Repuestos(RepuestoID),
    CONSTRAINT FK_Carrito_Ropa FOREIGN KEY (IndumentariaID) REFERENCES Indumentaria(IndumentariaID),
    
    CONSTRAINT CHK_Carrito_SoloUnProducto CHECK (
        (CASE WHEN BicicletaID IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN RepuestoID IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN IndumentariaID IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);
GO

/* =====================================================
   5. VENTAS Y FACTURACIÓN
   ===================================================== */

CREATE TABLE Ventas (
    VentaID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT NOT NULL,
    FechaVenta DATETIME DEFAULT GETDATE(),
    TotalVenta DECIMAL(18, 2) NOT NULL,
    MetodoPagoID INT,
    EstadoID INT DEFAULT 1,
    DireccionEnvio VARCHAR(255),
    CiudadEnvio VARCHAR(100),
    CodigoPostal VARCHAR(20),
    NumeroSeguimiento VARCHAR(100),
    Observaciones VARCHAR(500),

    CONSTRAINT FK_Ventas_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Ventas_MetodosPago FOREIGN KEY (MetodoPagoID) REFERENCES MetodosPago(MetodoPagoID),
    CONSTRAINT FK_Ventas_Estados FOREIGN KEY (EstadoID) REFERENCES EstadosPedido(EstadoID)
);
GO

CREATE TABLE DetalleVentas (
    DetalleID INT IDENTITY(1,1) PRIMARY KEY,
    VentaID INT NOT NULL,
    BicicletaID INT NULL,
    RepuestoID INT NULL,
    IndumentariaID INT NULL,
    Cantidad INT NOT NULL DEFAULT 1,
    PrecioUnitario DECIMAL(18, 2) NOT NULL,
    Subtotal AS (Cantidad * PrecioUnitario),
    
    CONSTRAINT FK_Detalle_Ventas FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    CONSTRAINT FK_Detalle_Bicis FOREIGN KEY (BicicletaID) REFERENCES Bicicletas(BicicletaID),
    CONSTRAINT FK_Detalle_Repuestos FOREIGN KEY (RepuestoID) REFERENCES Repuestos(RepuestoID),
    CONSTRAINT FK_Detalle_Ropa FOREIGN KEY (IndumentariaID) REFERENCES Indumentaria(IndumentariaID),
    
    CONSTRAINT CHK_Detalle_SoloUnProducto CHECK (
        (CASE WHEN BicicletaID IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN RepuestoID IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN IndumentariaID IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);
GO

CREATE TABLE Facturas (
    FacturaID INT IDENTITY(1,1) PRIMARY KEY,
    VentaID INT UNIQUE NOT NULL,
    TipoFacturaID INT NOT NULL,
    FechaFacturacion DATETIME DEFAULT GETDATE(),
    CAE VARCHAR(50),
    VencimientoCAE DATETIME,
    NumeroFactura VARCHAR(50),
    CUIT_Cliente VARCHAR(20),
    RazonSocial_Cliente VARCHAR(100),
    MontoTotal DECIMAL(18, 2),
    MontoIVA DECIMAL(18, 2),
    
    CONSTRAINT FK_Facturas_Ventas FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    CONSTRAINT FK_Facturas_Tipos FOREIGN KEY (TipoFacturaID) REFERENCES TiposFactura(TipoFacturaID)
);
GO

/* =====================================================
   6. DATOS INICIALES (SEMILLA)
   ===================================================== */

INSERT INTO Roles (NombreRol) VALUES ('Administrador'), ('Cliente');
INSERT INTO MetodosPago (Nombre) VALUES ('MercadoPago'), ('Transferencia Bancaria'), ('Efectivo'), ('Tarjeta Crédito');
INSERT INTO EstadosPedido (Nombre) VALUES ('Pendiente'), ('Pagado'), ('Enviado'), ('Entregado'), ('Cancelado');
INSERT INTO TiposFactura (Letra, Descripcion) VALUES ('A', 'Responsable Inscripto'), ('B', 'Consumidor Final');

-- Usuario Admin por defecto
INSERT INTO Usuarios (RolID, NombreCompleto, Email, PasswordHash, DNI, Telefono)
VALUES (1, 'Admin General', 'admin@bicicleteria.com', 'admin123', '00000000', '0000000000');
GO