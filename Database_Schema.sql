USE BicicleteriaWeb;
GO

-------------------------------------------------------------------------
-- PASO 1: ROMPER EL CANDADO DEL DNI (Sea cual sea su nombre raro)
-------------------------------------------------------------------------
DECLARE @NombreCandado NVARCHAR(200);
DECLARE @SentenciaSQL NVARCHAR(MAX);

-- Buscamos el nombre exacto de la restricción UNIQUE sobre la columna DNI
SELECT @NombreCandado = kc.name
FROM sys.key_constraints kc
JOIN sys.index_columns ic ON kc.unique_index_id = ic.index_id AND kc.parent_object_id = ic.object_id
JOIN sys.columns c ON ic.column_id = c.column_id AND ic.object_id = c.object_id
WHERE kc.parent_object_id = OBJECT_ID('Usuarios')
  AND c.name = 'DNI';

-- Si existe el candado, construimos la orden para borrarlo y la ejecutamos
IF @NombreCandado IS NOT NULL
BEGIN
    SET @SentenciaSQL = 'ALTER TABLE Usuarios DROP CONSTRAINT ' + @NombreCandado;
    EXEC sp_executesql @SentenciaSQL;
    PRINT 'Restricción de seguridad eliminada: ' + @NombreCandado;
END
ELSE
BEGIN
    PRINT 'No se encontró ningún candado en DNI (quizás ya lo borraste).';
END
GO

-------------------------------------------------------------------------
-- PASO 2: BORRAR LA COLUMNA DNI (Ahora que está libre)
-------------------------------------------------------------------------
-- Verificamos si la columna existe antes de intentar borrarla
IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'DNI' AND Object_ID = OBJECT_ID('Usuarios'))
BEGIN
    ALTER TABLE Usuarios DROP COLUMN DNI;
    PRINT 'Columna DNI eliminada exitosamente.';
END
GO

-------------------------------------------------------------------------
-- PASO 3: AGREGAR LA NUEVA COLUMNA DE FECHA
-------------------------------------------------------------------------
-- Verificamos que no exista ya para no dar error
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'FechaNacimiento' AND Object_ID = OBJECT_ID('Usuarios'))
BEGIN
    ALTER TABLE Usuarios ADD FechaNacimiento DATE NULL;
    PRINT 'Columna FechaNacimiento agregada.';
END
GO

PRINT '¡Operación completada! Base de datos actualizada.';