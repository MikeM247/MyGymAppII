-- CreateTable
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  youtube_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  order_index INT NOT NULL,
  target_sets INT NOT NULL,
  target_reps INT NOT NULL,
  target_rpe DOUBLE PRECISION,
  rest_seconds INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_template_exercise UNIQUE (template_id, exercise_id)
);

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  template_id UUID REFERENCES workout_templates(id),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  notes TEXT,
  total_volume_kg DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  set_number INT NOT NULL,
  weight_kg DOUBLE PRECISION NOT NULL,
  reps INT NOT NULL,
  rpe DOUBLE PRECISION,
  rest_seconds INT,
  volume_kg DOUBLE PRECISION NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  weight_kg DOUBLE PRECISION NOT NULL,
  reps INT NOT NULL,
  achieved_at TIMESTAMPTZ NOT NULL,
  session_id UUID REFERENCES workout_sessions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_pr_user_exercise UNIQUE (user_id, exercise_id)
);

CREATE INDEX idx_templates_user_id ON workout_templates (user_id);
CREATE INDEX idx_template_exercises_template_id ON template_exercises (template_id);
CREATE INDEX idx_template_exercises_exercise_id ON template_exercises (exercise_id);
CREATE INDEX idx_sessions_user_started_at ON workout_sessions (user_id, started_at);
CREATE INDEX idx_sets_session_id ON workout_sets (session_id);
CREATE INDEX idx_sets_exercise_id ON workout_sets (exercise_id);
CREATE INDEX idx_sets_exercise_completed ON workout_sets (exercise_id, completed_at);
CREATE INDEX idx_pr_user_exercise ON personal_records (user_id, exercise_id);
CREATE INDEX idx_sets_user_exercise ON workout_sets (exercise_id, session_id);
