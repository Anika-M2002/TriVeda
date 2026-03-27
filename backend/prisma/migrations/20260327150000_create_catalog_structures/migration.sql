-- Catalog structure migration (no seed data)

-- Reusable trigger function for updated_at maintenance
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Foods quality constraints
ALTER TABLE foods
  ALTER COLUMN food_name SET NOT NULL;

ALTER TABLE foods
  ADD CONSTRAINT foods_serving_size_non_negative CHECK (serving_size IS NULL OR serving_size >= 0),
  ADD CONSTRAINT foods_calories_non_negative CHECK (calories IS NULL OR calories >= 0),
  ADD CONSTRAINT foods_protein_non_negative CHECK (protein IS NULL OR protein >= 0),
  ADD CONSTRAINT foods_carbs_non_negative CHECK (carbs IS NULL OR carbs >= 0),
  ADD CONSTRAINT foods_fat_non_negative CHECK (fat IS NULL OR fat >= 0),
  ADD CONSTRAINT foods_vit_c_non_negative CHECK (vit_c IS NULL OR vit_c >= 0),
  ADD CONSTRAINT foods_iron_non_negative CHECK (iron IS NULL OR iron >= 0);

CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(food_name);

-- Asanas catalog
CREATE TABLE IF NOT EXISTS asanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  ayurvedic_properties TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  effect_profile TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  contraindications TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT asanas_name_unique UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS idx_asanas_active_name ON asanas(is_active, name);
CREATE INDEX IF NOT EXISTS idx_asanas_category ON asanas(category);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_asanas_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_asanas_set_updated_at
    BEFORE UPDATE ON asanas
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_column();
  END IF;
END $$;

-- Medicines catalog
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_name TEXT NOT NULL,
  medicine_type TEXT,
  herbs_used TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ayurvedic_properties TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  dosage_guideline TEXT,
  contraindications TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT medicines_name_unique UNIQUE (medicine_name)
);

CREATE INDEX IF NOT EXISTS idx_medicines_active_name ON medicines(is_active, medicine_name);
CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(medicine_type);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_medicines_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_medicines_set_updated_at
    BEFORE UPDATE ON medicines
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_column();
  END IF;
END $$;

-- Relation constraints for foods <-> ayurveda_props
ALTER TABLE foods
  ALTER COLUMN food_id SET NOT NULL;

ALTER TABLE ayurveda_props
  ALTER COLUMN food_id SET NOT NULL,
  ALTER COLUMN id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'foods_pkey'
      AND conrelid = 'foods'::regclass
  ) THEN
    ALTER TABLE foods
      ADD CONSTRAINT foods_pkey PRIMARY KEY (food_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ayurveda_props_food_id ON ayurveda_props(food_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ayurveda_props_food_id_fkey'
      AND conrelid = 'ayurveda_props'::regclass
  ) THEN
    ALTER TABLE ayurveda_props
      ADD CONSTRAINT ayurveda_props_food_id_fkey
      FOREIGN KEY (food_id)
      REFERENCES foods(food_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ayurveda_props_pkey'
      AND conrelid = 'ayurveda_props'::regclass
  ) THEN
    ALTER TABLE ayurveda_props
      ADD CONSTRAINT ayurveda_props_pkey PRIMARY KEY (id);
  END IF;
END $$;
