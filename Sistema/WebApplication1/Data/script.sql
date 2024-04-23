﻿-- Cria o esquema se ele não existir
CREATE SCHEMA IF NOT EXISTS "Sistema";

-- Tabela "AspNetRoles"
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetRoles" (
    Id TEXT PRIMARY KEY,
    Name VARCHAR(256),
    NormalizedName VARCHAR(256),
    ConcurrencyStamp TEXT
);

-- Tabela AspNetUsers
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetUsers" (
    Id TEXT PRIMARY KEY,
    UserName VARCHAR(256),
    NormalizedUserName VARCHAR(256),
    Email VARCHAR(256),
    NormalizedEmail VARCHAR(256),
    Cpf VARCHAR(256),
    EmailConfirmed BOOLEAN NOT NULL,
    PasswordHash TEXT,
    SecurityStamp TEXT,
    ConcurrencyStamp TEXT,
    PhoneNumber TEXT,
    PhoneNumberConfirmed BOOLEAN NOT NULL,
    TwoFactorEnabled BOOLEAN NOT NULL,
    LockoutEnd TIMESTAMP WITH TIME ZONE,
    LockoutEnabled BOOLEAN NOT NULL,
    AccessFailedCount INTEGER NOT NULL
);

-- Tabela AspNetRoleClaims
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetRoleClaims" (
    Id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    RoleId TEXT NOT NULL,
    ClaimType TEXT,
    ClaimValue TEXT,
    FOREIGN KEY (RoleId) REFERENCES "Sistema"."AspNetRoles"(Id) ON DELETE CASCADE
);

-- Tabela AspNetUserClaims
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetUserClaims" (
    Id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    UserId TEXT NOT NULL,
    ClaimType TEXT,
    ClaimValue TEXT,
    FOREIGN KEY (UserId) REFERENCES "Sistema"."AspNetUsers"(Id) ON DELETE CASCADE
);

-- Tabela AspNetUserLogins
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetUserLogins" (
    LoginProvider TEXT,
    ProviderKey TEXT,
    ProviderDisplayName TEXT,
    UserId TEXT NOT NULL,
    PRIMARY KEY (LoginProvider, ProviderKey),
    FOREIGN KEY (UserId) REFERENCES "Sistema"."AspNetUsers"(Id) ON DELETE CASCADE
);

-- Tabela AspNetUserRoles
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetUserRoles" (
    UserId TEXT NOT NULL,
    RoleId TEXT NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES "Sistema"."AspNetUsers"(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES "Sistema"."AspNetRoles"(Id) ON DELETE CASCADE
);

-- Tabela AspNetUserTokens
CREATE TABLE IF NOT EXISTS "Sistema"."AspNetUserTokens" (
    UserId TEXT NOT NULL,
    LoginProvider TEXT NOT NULL,
    Name TEXT NOT NULL,
    Value TEXT,
    PRIMARY KEY (UserId, LoginProvider, Name),
    FOREIGN KEY (UserId) REFERENCES "Sistema"."AspNetUsers"(Id) ON DELETE CASCADE
);

-- Índices e restrições únicas
CREATE UNIQUE INDEX IF NOT EXISTS RoleNameIndex ON "Sistema"."AspNetRoles" (NormalizedName);
CREATE UNIQUE INDEX IF NOT EXISTS UserNameIndex ON "Sistema"."AspNetUsers" (NormalizedUserName);
CREATE INDEX IF NOT EXISTS IX_AspNetRoleClaims_RoleId ON "Sistema"."AspNetRoleClaims" (RoleId);
CREATE INDEX IF NOT EXISTS IX_AspNetUserClaims_UserId ON "Sistema"."AspNetUserClaims" (UserId);
CREATE INDEX IF NOT EXISTS IX_AspNetUserLogins_UserId ON "Sistema"."AspNetUserLogins" (UserId);
CREATE INDEX IF NOT EXISTS IX_AspNetUserRoles_RoleId ON "Sistema"."AspNetUserRoles" (RoleId);
CREATE INDEX IF NOT EXISTS EmailIndex ON "Sistema"."AspNetUsers" (NormalizedEmail);

-- Table "Sistema"."DadosPessoais"
CREATE TABLE IF NOT EXISTS "Sistema"."DadosPessoais" (
  "Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "Nome" VARCHAR(255) NOT NULL,
  "Cpf" VARCHAR(14) NOT NULL,
  "Rg" VARCHAR(20) NOT NULL,
  "Telefone" VARCHAR(20) NOT NULL,
  "Endereco" VARCHAR(255) NOT NULL,
  "Nascimento" DATE NOT NULL,
  "Sexo" VARCHAR(1) NOT NULL,
  "Email" VARCHAR(255) NOT NULL,
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
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

-- -----------------------------------------------------
-- Table "Sistema"."AgendaProfissional"
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS "Sistema" . "AgendaProfissional"(
"Id" BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
"Dia" DATE NOT NULL,
"Hora" TIME NOT NULL,
"Ativo" int,
"DiaSemana" varchar(20),
"ProfissionalId" BIGINT,
"CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
"UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 UNIQUE ("Dia", "Hora", "ProfissionalId")
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
  "Ativo" INTEGER,
  "Medicamentos" TEXT,
  "Cirurgias" TEXT,
  "Historico" TEXT,
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
  "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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


-- Adicionando a coluna "Ativo" à tabela "ConvenioMedicos"
ALTER TABLE "Sistema"."ConvenioMedicos"
ADD COLUMN "Ativo" INTEGER;

-- Adicionando a coluna "Ativo" à tabela "Pacientes"
ALTER TABLE "Sistema"."Pacientes"
ADD COLUMN "Ativo" INTEGER;

-- Adicionando a coluna "Ativo" à tabela "Profissoes"
ALTER TABLE "Sistema"."Profissoes"
ADD COLUMN "Ativo" INTEGER;

-- Adicionando a coluna "Ativo" à tabela "Profissionais"
ALTER TABLE "Sistema"."Profissionais"
ADD COLUMN "Ativo" INTEGER;

-- Adicionando a coluna "Ativo" à tabela "Consultas"
ALTER TABLE "Sistema"."Consultas"
ADD COLUMN "Ativo" INTEGER;

-- Adicionando a coluna "Ativo" à tabela "PreAgendamento"
ALTER TABLE "Sistema"."PreAgendamento"
ADD COLUMN "Ativo" INTEGER;


INSERT INTO "Sistema"."AspNetRoles" (id, name, normalizedname, concurrencystamp) VALUES
('f3f629', 'admin', 'ADMIN', '76dca6b7-a95b-4aa3-a469-2c8985354936'),
('c8fffd', 'profissional', 'PROFISSIONAL', '09b023d6-65a4-4268-aaf5-6b5f230aec3e'),
('f8abf4', 'assistente', 'ASSISTENTE', '626ab808-4453-40dc-9815-6854a0f78923');
