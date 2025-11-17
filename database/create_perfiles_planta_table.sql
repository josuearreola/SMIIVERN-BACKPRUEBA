-- Script para crear la tabla de perfiles de plantas
-- Ejecutar este script en PostgreSQL

CREATE TABLE perfiles_planta (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    
    -- Parámetros de temperatura (en Celsius)
    temperatura_min DECIMAL(4,2) NOT NULL CHECK (temperatura_min >= -50 AND temperatura_min <= 100),
    temperatura_max DECIMAL(4,2) NOT NULL CHECK (temperatura_max >= -50 AND temperatura_max <= 100),
    temperatura_optima DECIMAL(4,2),
    
    -- Parámetros de humedad (porcentaje)
    humedad_min DECIMAL(5,2) NOT NULL CHECK (humedad_min >= 0 AND humedad_min <= 100),
    humedad_max DECIMAL(5,2) NOT NULL CHECK (humedad_max >= 0 AND humedad_max <= 100),
    humedad_optima DECIMAL(5,2),
    
    -- Parámetros de pH
    ph_min DECIMAL(3,2) NOT NULL CHECK (ph_min >= 0 AND ph_min <= 14),
    ph_max DECIMAL(3,2) NOT NULL CHECK (ph_max >= 0 AND ph_max <= 14),
    ph_optimo DECIMAL(3,2),
    
    -- Parámetros de NPK (ppm - partes por millón)
    nitrogeno_min INTEGER NOT NULL CHECK (nitrogeno_min >= 0),
    nitrogeno_max INTEGER NOT NULL CHECK (nitrogeno_max >= 0),
    nitrogeno_optimo INTEGER,
    
    fosforo_min INTEGER NOT NULL CHECK (fosforo_min >= 0),
    fosforo_max INTEGER NOT NULL CHECK (fosforo_max >= 0),
    fosforo_optimo INTEGER,
    
    potasio_min INTEGER NOT NULL CHECK (potasio_min >= 0),
    potasio_max INTEGER NOT NULL CHECK (potasio_max >= 0),
    potasio_optimo INTEGER,
    
    -- Parámetros de luz
    luz_min INTEGER CHECK (luz_min >= 0), -- lux mínimo
    luz_max INTEGER CHECK (luz_max >= 0), -- lux máximo
    horas_luz_diarias INTEGER CHECK (horas_luz_diarias >= 0 AND horas_luz_diarias <= 24),
    
    -- Parámetros de crecimiento
    dias_germinacion INTEGER CHECK (dias_germinacion > 0),
    dias_cosecha INTEGER CHECK (dias_cosecha > 0),
    
    -- Información adicional
    tipo_planta VARCHAR(50), -- verdura, hierba, fruta, etc.
    dificultad VARCHAR(20) CHECK (dificultad IN ('facil', 'intermedio', 'dificil')),
    
    -- Imagen del perfil (almacenamiento como bytea para archivos)
    imagen BYTEA,
    imagen_nombre VARCHAR(255),
    imagen_tipo VARCHAR(50), -- image/jpeg, image/png, etc.
    imagen_tamaño INTEGER,
    
    -- Campos de auditoría
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints adicionales
    CONSTRAINT check_temperatura CHECK (temperatura_min <= temperatura_max),
    CONSTRAINT check_humedad CHECK (humedad_min <= humedad_max),
    CONSTRAINT check_ph CHECK (ph_min <= ph_max),
    CONSTRAINT check_nitrogeno CHECK (nitrogeno_min <= nitrogeno_max),
    CONSTRAINT check_fosforo CHECK (fosforo_min <= fosforo_max),
    CONSTRAINT check_potasio CHECK (potasio_min <= potasio_max),
    CONSTRAINT check_luz CHECK (luz_min IS NULL OR luz_max IS NULL OR luz_min <= luz_max),
    CONSTRAINT check_dias_crecimiento CHECK (dias_germinacion IS NULL OR dias_cosecha IS NULL OR dias_germinacion <= dias_cosecha)
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_perfiles_planta_nombre ON perfiles_planta(nombre);
CREATE INDEX idx_perfiles_planta_tipo ON perfiles_planta(tipo_planta);
CREATE INDEX idx_perfiles_planta_activo ON perfiles_planta(activo);
CREATE INDEX idx_perfiles_planta_created_at ON perfiles_planta(created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_perfiles_planta_updated_at 
    BEFORE UPDATE ON perfiles_planta 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos perfiles de ejemplo
INSERT INTO perfiles_planta (
    nombre, descripcion, 
    temperatura_min, temperatura_max, temperatura_optima,
    humedad_min, humedad_max, humedad_optima,
    ph_min, ph_max, ph_optimo,
    nitrogeno_min, nitrogeno_max, nitrogeno_optimo,
    fosforo_min, fosforo_max, fosforo_optimo,
    potasio_min, potasio_max, potasio_optimo,
    luz_min, luz_max, horas_luz_diarias,
    dias_germinacion, dias_cosecha,
    tipo_planta, dificultad
) VALUES 
(
    'Lechuga Romana', 
    'Variedad de lechuga crujiente, ideal para hidroponia. Crecimiento rápido y hojas grandes.',
    15.0, 25.0, 20.0,
    60.0, 80.0, 70.0,
    5.5, 6.5, 6.0,
    150, 250, 200,
    30, 50, 40,
    200, 300, 250,
    2000, 4000, 12,
    5, 60,
    'verdura', 'facil'
),
(
    'Tomate Cherry', 
    'Tomates pequeños perfectos para sistemas hidropónicos. Producción continua.',
    18.0, 28.0, 23.0,
    65.0, 85.0, 75.0,
    5.8, 6.8, 6.3,
    200, 400, 300,
    50, 80, 65,
    300, 500, 400,
    3000, 6000, 14,
    7, 120,
    'fruta', 'intermedio'
),
(
    'Albahaca', 
    'Hierba aromática de fácil cultivo. Ideal para cocina y muy resistente.',
    20.0, 30.0, 25.0,
    50.0, 70.0, 60.0,
    5.5, 7.0, 6.5,
    100, 200, 150,
    20, 40, 30,
    150, 250, 200,
    2500, 5000, 12,
    3, 90,
    'hierba', 'facil'
);

-- Comentarios para documentar la tabla
COMMENT ON TABLE perfiles_planta IS 'Almacena los perfiles de configuración para diferentes tipos de plantas en sistemas hidropónicos';
COMMENT ON COLUMN perfiles_planta.imagen IS 'Almacena la imagen del perfil como datos binarios (bytea)';
COMMENT ON COLUMN perfiles_planta.temperatura_min IS 'Temperatura mínima en grados Celsius';
COMMENT ON COLUMN perfiles_planta.humedad_min IS 'Humedad mínima en porcentaje (0-100)';
COMMENT ON COLUMN perfiles_planta.ph_min IS 'pH mínimo del agua (0-14)';
COMMENT ON COLUMN perfiles_planta.nitrogeno_min IS 'Nivel mínimo de nitrógeno en ppm';
COMMENT ON COLUMN perfiles_planta.fosforo_min IS 'Nivel mínimo de fósforo en ppm';
COMMENT ON COLUMN perfiles_planta.potasio_min IS 'Nivel mínimo de potasio en ppm';