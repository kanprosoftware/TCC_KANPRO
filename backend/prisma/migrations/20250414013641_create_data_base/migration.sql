-- CreateTable
CREATE TABLE "login" (
    "loginId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "providerId" INTEGER,
    "profileImage" TEXT DEFAULT 'teste',
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "login_pkey" PRIMARY KEY ("loginId")
);

-- CreateTable
CREATE TABLE "desenvolvedor" (
    "desenvolvedorId" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginId" INTEGER NOT NULL,

    CONSTRAINT "desenvolvedor_pkey" PRIMARY KEY ("desenvolvedorId")
);

-- CreateTable
CREATE TABLE "projeto" (
    "projetoId" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concludeAt" TIMESTAMP(3),
    "creatorProject" INTEGER NOT NULL,

    CONSTRAINT "projeto_pkey" PRIMARY KEY ("projetoId")
);

-- CreateTable
CREATE TABLE "recurso" (
    "recursoId" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "projetoId" INTEGER NOT NULL,

    CONSTRAINT "recurso_pkey" PRIMARY KEY ("recursoId")
);

-- CreateTable
CREATE TABLE "anexo" (
    "anexoId" SERIAL NOT NULL,
    "caminho" TEXT,
    "projetoId" INTEGER NOT NULL,

    CONSTRAINT "anexo_pkey" PRIMARY KEY ("anexoId")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "tarefaId" SERIAL NOT NULL,
    "projetoId" INTEGER NOT NULL,
    "desenvolvedorId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doing" TIMESTAMP(3),
    "concludeAt" TIMESTAMP(3),

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("tarefaId")
);

-- CreateTable
CREATE TABLE "habilidadeDesenvolvedor" (
    "habilidadesDesenvolvedorId" SERIAL NOT NULL,
    "habilidade" TEXT NOT NULL,
    "desenvolvedorId" INTEGER NOT NULL,

    CONSTRAINT "habilidadeDesenvolvedor_pkey" PRIMARY KEY ("habilidadesDesenvolvedorId")
);

-- CreateTable
CREATE TABLE "projetoTecnologia" (
    "projetoTecnologiasId" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "projetoId" INTEGER NOT NULL,

    CONSTRAINT "projetoTecnologia_pkey" PRIMARY KEY ("projetoTecnologiasId")
);

-- CreateTable
CREATE TABLE "projetoDesenvolvedor" (
    "projetoDesenvolvedorId" SERIAL NOT NULL,
    "projetoId" INTEGER NOT NULL,
    "desenvolvedorId" INTEGER NOT NULL,

    CONSTRAINT "projetoDesenvolvedor_pkey" PRIMARY KEY ("projetoDesenvolvedorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "desenvolvedor_loginId_key" ON "desenvolvedor"("loginId");

-- AddForeignKey
ALTER TABLE "desenvolvedor" ADD CONSTRAINT "desenvolvedor_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "login"("loginId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_creatorProject_fkey" FOREIGN KEY ("creatorProject") REFERENCES "desenvolvedor"("desenvolvedorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurso" ADD CONSTRAINT "recurso_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projeto"("projetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projeto"("projetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projeto"("projetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_desenvolvedorId_fkey" FOREIGN KEY ("desenvolvedorId") REFERENCES "desenvolvedor"("desenvolvedorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidadeDesenvolvedor" ADD CONSTRAINT "habilidadeDesenvolvedor_desenvolvedorId_fkey" FOREIGN KEY ("desenvolvedorId") REFERENCES "desenvolvedor"("desenvolvedorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoTecnologia" ADD CONSTRAINT "projetoTecnologia_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projeto"("projetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoDesenvolvedor" ADD CONSTRAINT "projetoDesenvolvedor_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projeto"("projetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoDesenvolvedor" ADD CONSTRAINT "projetoDesenvolvedor_desenvolvedorId_fkey" FOREIGN KEY ("desenvolvedorId") REFERENCES "desenvolvedor"("desenvolvedorId") ON DELETE RESTRICT ON UPDATE CASCADE;
