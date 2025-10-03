-- Funzione per creare la tabella MUR universities se non esiste
CREATE OR REPLACE FUNCTION create_mur_universities_table()
RETURNS void AS $$
BEGIN
    -- Crea la tabella se non esiste
    CREATE TABLE IF NOT EXISTS mur_universities (
        id VARCHAR(50) PRIMARY KEY,
        name TEXT NOT NULL,
        short_name VARCHAR(100),
        city VARCHAR(100),
        region VARCHAR(100),
        website TEXT,
        type VARCHAR(50),
        specializations TEXT[], -- Array di stringhe per le specializzazioni
        tuition_min INTEGER,
        tuition_max INTEGER,
        students INTEGER,
        founded INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Crea indici per migliorare le performance
    CREATE INDEX IF NOT EXISTS idx_mur_universities_region ON mur_universities(region);
    CREATE INDEX IF NOT EXISTS idx_mur_universities_type ON mur_universities(type);
    CREATE INDEX IF NOT EXISTS idx_mur_universities_students ON mur_universities(students DESC);
    CREATE INDEX IF NOT EXISTS idx_mur_universities_name ON mur_universities(name);

    -- Abilita Row Level Security (RLS)
    ALTER TABLE mur_universities ENABLE ROW LEVEL SECURITY;

    -- Policy per lettura pubblica
    CREATE POLICY IF NOT EXISTS "mur_universities_select_policy"
    ON mur_universities FOR SELECT
    TO public
    USING (true);

    -- Policy per inserimento/aggiornamento (solo utenti autenticati)
    CREATE POLICY IF NOT EXISTS "mur_universities_insert_policy"
    ON mur_universities FOR INSERT
    TO authenticated
    WITH CHECK (true);

    CREATE POLICY IF NOT EXISTS "mur_universities_update_policy"
    ON mur_universities FOR UPDATE
    TO authenticated
    USING (true);

END;
$$ LANGUAGE plpgsql;

-- Crea anche una tabella per tracciare i file MUR caricati
CREATE OR REPLACE FUNCTION create_mur_files_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS mur_files (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL, -- 'atenei', 'iscritti', 'laureati', etc.
        file_size INTEGER,
        records_processed INTEGER,
        status VARCHAR(20) DEFAULT 'uploaded', -- 'uploaded', 'processed', 'error'
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX IF NOT EXISTS idx_mur_files_type ON mur_files(file_type);
    CREATE INDEX IF NOT EXISTS idx_mur_files_status ON mur_files(status);
    CREATE INDEX IF NOT EXISTS idx_mur_files_uploaded_at ON mur_files(uploaded_at DESC);

    -- RLS per la tabella files
    ALTER TABLE mur_files ENABLE ROW LEVEL SECURITY;

    CREATE POLICY IF NOT EXISTS "mur_files_select_policy"
    ON mur_files FOR SELECT
    TO public
    USING (true);

    CREATE POLICY IF NOT EXISTS "mur_files_insert_policy"
    ON mur_files FOR INSERT
    TO authenticated
    WITH CHECK (true);

END;
$$ LANGUAGE plpgsql;

-- Funzione per ottenere statistiche delle università
CREATE OR REPLACE FUNCTION get_universities_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_universities', COUNT(*),
        'by_region', (
            SELECT json_object_agg(region, count)
            FROM (
                SELECT region, COUNT(*) as count
                FROM mur_universities
                WHERE region IS NOT NULL
                GROUP BY region
                ORDER BY count DESC
            ) regions
        ),
        'by_type', (
            SELECT json_object_agg(type, count)
            FROM (
                SELECT type, COUNT(*) as count
                FROM mur_universities
                WHERE type IS NOT NULL
                GROUP BY type
                ORDER BY count DESC
            ) types
        ),
        'total_students', SUM(students),
        'avg_tuition', ROUND(AVG((tuition_min + tuition_max) / 2.0)),
        'last_updated', MAX(updated_at)
    )
    INTO result
    FROM mur_universities;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Funzione per cercare università per parole chiave
CREATE OR REPLACE FUNCTION search_universities(search_term TEXT)
RETURNS SETOF mur_universities AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM mur_universities
    WHERE
        LOWER(name) LIKE LOWER('%' || search_term || '%') OR
        LOWER(short_name) LIKE LOWER('%' || search_term || '%') OR
        LOWER(city) LIKE LOWER('%' || search_term || '%') OR
        LOWER(region) LIKE LOWER('%' || search_term || '%') OR
        EXISTS (
            SELECT 1 FROM unnest(specializations) spec
            WHERE LOWER(spec) LIKE LOWER('%' || search_term || '%')
        )
    ORDER BY students DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;
