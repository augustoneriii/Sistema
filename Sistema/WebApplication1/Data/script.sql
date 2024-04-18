--CREATE SCHEMA IF NOT EXISTS "Sistema";

-- -----------------------------------------------------
-- Table "Sistema"."Users"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "Sistema"."Users" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Name" VARCHAR(255) NOT NULL,
  "Email" VARCHAR(255) NOT NULL,
  "Password" VARCHAR(255) NOT NULL,
  "Image" VARCHAR(255),
  "Phone" VARCHAR(20),
  "Nivel" VARCHAR(20) NOT NULL,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table "Sistema"."ConvenioMedicos"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "Sistema"."ConvenioMedicos" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Nome" VARCHAR(255) NOT NULL,
  "Telefone" VARCHAR(20) NOT NULL,
  "Email" VARCHAR(255) NOT NULL,
  "Site" VARCHAR(255) NOT NULL,
  "UserId" BIGINT,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("UserId") REFERENCES "Sistema"."Users"("Id")
);

-- -----------------------------------------------------
-- Table "Sistema"."Pacientes"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "Sistema"."Pacientes" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Nome" VARCHAR(255) NOT NULL,
  "Cpf" VARCHAR(14) NOT NULL,
  "Rg" VARCHAR(20) NOT NULL,
  "Telefone" VARCHAR(20) NOT NULL,
  "Endereco" VARCHAR(255) NOT NULL,
  "Nascimento" DATE NOT NULL,
  "Sexo" VARCHAR(1) NOT NULL,
  "Email" VARCHAR(255) NOT NULL,
  "ConvenioId" BIGINT,
  "TipoSanguineo" VARCHAR(5) NOT NULL,
  "Alergias" TEXT,
  "Medicamentos" TEXT,
  "Cirurgias" TEXT,
  "Historico" TEXT,
  "UserId" BIGINT,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("ConvenioId") REFERENCES "Sistema"."ConvenioMedicos"("Id"),
  FOREIGN KEY ("UserId") REFERENCES "Sistema"."Users"("Id")
);

-- -----------------------------------------------------
-- Table "Sistema"."Profissoes"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "Sistema"."Profissoes" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Nome" VARCHAR(255) NOT NULL,
  "ConselhoProfissional" VARCHAR(255) NOT NULL,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table "Sistema"."Profissionais"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "Sistema"."Profissionais" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Nome" VARCHAR(255) NOT NULL,
  "Cpf" VARCHAR(14) NOT NULL,
  "Rg" VARCHAR(20) NOT NULL,
  "Telefone" VARCHAR(20) NOT NULL,
  "Endereco" VARCHAR(255) NOT NULL,
  "Nascimento" DATE NOT NULL,
  "Sexo" VARCHAR(1) NOT NULL,
  "Email" VARCHAR(255) NOT NULL,
  "ProfissaoId" BIGINT,
  "Conselho" VARCHAR(20),
  "ConvenioId" BIGINT,
  "Observacoes" TEXT,
  "Image" VARCHAR(255),
  "UserId" BIGINT,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("ProfissaoId") REFERENCES "Sistema"."Profissoes"("Id"),
  FOREIGN KEY ("ConvenioId") REFERENCES "Sistema"."ConvenioMedicos"("Id"),
  FOREIGN KEY ("UserId") REFERENCES "Sistema"."Users"("Id")
);

-- -----------------------------------------------------
-- Table "Sistema"."Consultas"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "Sistema"."Consultas" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Data" DATE NOT NULL,
  "Hora" TIME NOT NULL,
  "PacienteId" BIGINT,
  "ProfissionalId" BIGINT,
  "UserId" BIGINT,
  "Atendida" BOOLEAN NOT NULL,
  "Status" VARCHAR(50) NOT NULL,
  "Tipo" VARCHAR(50) NOT NULL,
  "Observacoes" TEXT,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("Data", "Hora", "ProfissionalId"),
  FOREIGN KEY ("PacienteId") REFERENCES "Sistema"."Pacientes"("Id"),
  FOREIGN KEY ("ProfissionalId") REFERENCES "Sistema"."Profissionais"("Id"),
  FOREIGN KEY ("UserId") REFERENCES "Sistema"."Users"("Id")
);


-- -----------------------------------------------------
-- Table "Sistema"."PreAgendamento"
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS "Sistema"."PreAgendamento" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Data" DATE NOT NULL,
  "Hora" TIME NOT NULL,
  "Nome" VARCHAR(60),
  "Email" VARCHAR(100),
  "Telefone" VARCHAR(100),
  "PlanoDeSaude" VARCHAR(100),
  "Especialidade" VARCHAR(100),
  "Status" VARCHAR(50) NOT NULL,
  "Observacoes" TEXT,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("Data", "Hora")
);
