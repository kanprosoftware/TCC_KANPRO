/*
  Warnings:

  - The primary key for the `anexo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `anexoId` on the `anexo` table. All the data in the column will be lost.
  - You are about to drop the column `projetoId` on the `anexo` table. All the data in the column will be lost.
  - The primary key for the `login` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isVerified` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `loginId` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `login` table. All the data in the column will be lost.
  - The primary key for the `projeto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `concludeAt` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `creatorProject` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `projetoId` on the `projeto` table. All the data in the column will be lost.
  - The primary key for the `projetoTecnologia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `projetoId` on the `projetoTecnologia` table. All the data in the column will be lost.
  - You are about to drop the column `projetoTecnologiasId` on the `projetoTecnologia` table. All the data in the column will be lost.
  - You are about to drop the column `tecnologiaId` on the `projetoTecnologia` table. All the data in the column will be lost.
  - The primary key for the `recurso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `projetoId` on the `recurso` table. All the data in the column will be lost.
  - You are about to drop the column `recursoId` on the `recurso` table. All the data in the column will be lost.
  - The primary key for the `tarefa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `desenvolvedorId` on the `tarefa` table. All the data in the column will be lost.
  - You are about to drop the column `projetoId` on the `tarefa` table. All the data in the column will be lost.
  - You are about to drop the column `tarefaId` on the `tarefa` table. All the data in the column will be lost.
  - The primary key for the `tecnologia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tecnologiaId` on the `tecnologia` table. All the data in the column will be lost.
  - You are about to drop the `desenvolvedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `frameWorkTecnologia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `habilidadeDesenvolvedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projetoDesenvolvedor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projeto_id` to the `anexo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projeto_id` to the `projetoTecnologia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tecnologia_id` to the `projetoTecnologia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projeto_id` to the `recurso` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "anexo" DROP CONSTRAINT "anexo_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "desenvolvedor" DROP CONSTRAINT "desenvolvedor_loginId_fkey";

-- DropForeignKey
ALTER TABLE "frameWorkTecnologia" DROP CONSTRAINT "frameWorkTecnologia_tecnologiaId_fkey";

-- DropForeignKey
ALTER TABLE "habilidadeDesenvolvedor" DROP CONSTRAINT "habilidadeDesenvolvedor_desenvolvedorId_fkey";

-- DropForeignKey
ALTER TABLE "habilidadeDesenvolvedor" DROP CONSTRAINT "habilidadeDesenvolvedor_tecnologiaId_fkey";

-- DropForeignKey
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_creatorProject_fkey";

-- DropForeignKey
ALTER TABLE "projetoDesenvolvedor" DROP CONSTRAINT "projetoDesenvolvedor_desenvolvedorId_fkey";

-- DropForeignKey
ALTER TABLE "projetoDesenvolvedor" DROP CONSTRAINT "projetoDesenvolvedor_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "projetoTecnologia" DROP CONSTRAINT "projetoTecnologia_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "projetoTecnologia" DROP CONSTRAINT "projetoTecnologia_tecnologiaId_fkey";

-- DropForeignKey
ALTER TABLE "recurso" DROP CONSTRAINT "recurso_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "tarefa" DROP CONSTRAINT "tarefa_desenvolvedorId_fkey";

-- DropForeignKey
ALTER TABLE "tarefa" DROP CONSTRAINT "tarefa_projetoId_fkey";

-- AlterTable
ALTER TABLE "anexo" DROP CONSTRAINT "anexo_pkey",
DROP COLUMN "anexoId",
DROP COLUMN "projetoId",
ADD COLUMN     "anexo_id" SERIAL NOT NULL,
ADD COLUMN     "projeto_id" INTEGER NOT NULL,
ADD CONSTRAINT "anexo_pkey" PRIMARY KEY ("anexo_id");

-- AlterTable
ALTER TABLE "login" DROP CONSTRAINT "login_pkey",
DROP COLUMN "isVerified",
DROP COLUMN "loginId",
DROP COLUMN "profileImage",
DROP COLUMN "providerId",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "login_id" SERIAL NOT NULL,
ADD COLUMN     "profile_image" TEXT DEFAULT 'teste',
ADD COLUMN     "provider_id" TEXT,
ADD CONSTRAINT "login_pkey" PRIMARY KEY ("login_id");

-- AlterTable
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_pkey",
DROP COLUMN "concludeAt",
DROP COLUMN "createdAt",
DROP COLUMN "creatorProject",
DROP COLUMN "projetoId",
ADD COLUMN     "conclude_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projeto_id" SERIAL NOT NULL,
ADD CONSTRAINT "projeto_pkey" PRIMARY KEY ("projeto_id");

-- AlterTable
ALTER TABLE "projetoTecnologia" DROP CONSTRAINT "projetoTecnologia_pkey",
DROP COLUMN "projetoId",
DROP COLUMN "projetoTecnologiasId",
DROP COLUMN "tecnologiaId",
ADD COLUMN     "projetoTecnologia_id" SERIAL NOT NULL,
ADD COLUMN     "projeto_id" INTEGER NOT NULL,
ADD COLUMN     "tecnologia_id" INTEGER NOT NULL,
ADD CONSTRAINT "projetoTecnologia_pkey" PRIMARY KEY ("projetoTecnologia_id");

-- AlterTable
ALTER TABLE "recurso" DROP CONSTRAINT "recurso_pkey",
DROP COLUMN "projetoId",
DROP COLUMN "recursoId",
ADD COLUMN     "projeto_id" INTEGER NOT NULL,
ADD COLUMN     "recurso_id" SERIAL NOT NULL,
ADD CONSTRAINT "recurso_pkey" PRIMARY KEY ("recurso_id");

-- AlterTable
ALTER TABLE "tarefa" DROP CONSTRAINT "tarefa_pkey",
DROP COLUMN "desenvolvedorId",
DROP COLUMN "projetoId",
DROP COLUMN "tarefaId",
ADD COLUMN     "tarefa_id" SERIAL NOT NULL,
ADD CONSTRAINT "tarefa_pkey" PRIMARY KEY ("tarefa_id");

-- AlterTable
ALTER TABLE "tecnologia" DROP CONSTRAINT "tecnologia_pkey",
DROP COLUMN "tecnologiaId",
ADD COLUMN     "tecnologia_id" SERIAL NOT NULL,
ADD CONSTRAINT "tecnologia_pkey" PRIMARY KEY ("tecnologia_id");

-- DropTable
DROP TABLE "desenvolvedor";

-- DropTable
DROP TABLE "frameWorkTecnologia";

-- DropTable
DROP TABLE "habilidadeDesenvolvedor";

-- DropTable
DROP TABLE "projetoDesenvolvedor";

-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roule" TEXT NOT NULL,
    "login_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "projetoUsuario" (
    "projetoUsuario_id" SERIAL NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "owner" BOOLEAN NOT NULL,

    CONSTRAINT "projetoUsuario_pkey" PRIMARY KEY ("projetoUsuario_id")
);

-- CreateTable
CREATE TABLE "habilidadeUsuario" (
    "habilidadeUsuario_id" SERIAL NOT NULL,
    "tecnologia_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "habilidadeUsuario_pkey" PRIMARY KEY ("habilidadeUsuario_id")
);

-- CreateTable
CREATE TABLE "participacaoTarefa" (
    "participacaoTarefa_id" SERIAL NOT NULL,
    "tarefa_id" INTEGER NOT NULL,
    "projetoUsuario_id" INTEGER NOT NULL,
    "owner" BOOLEAN NOT NULL,

    CONSTRAINT "participacaoTarefa_pkey" PRIMARY KEY ("participacaoTarefa_id")
);

-- CreateTable
CREATE TABLE "comentario" (
    "comentario_id" SERIAL NOT NULL,
    "comentario" TEXT NOT NULL,
    "participacaoTarefa_id" INTEGER NOT NULL,

    CONSTRAINT "comentario_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateTable
CREATE TABLE "anexoTarefa" (
    "anexoTarefa_id" SERIAL NOT NULL,
    "caminho" TEXT NOT NULL,
    "tarefa_id" INTEGER NOT NULL,

    CONSTRAINT "anexoTarefa_pkey" PRIMARY KEY ("anexoTarefa_id")
);

-- CreateTable
CREATE TABLE "anexoComentario" (
    "anexoComentario_id" SERIAL NOT NULL,
    "comentario_id" INTEGER NOT NULL,
    "anexoTarefa_id" INTEGER NOT NULL,

    CONSTRAINT "anexoComentario_pkey" PRIMARY KEY ("anexoComentario_id")
);

-- CreateTable
CREATE TABLE "permissao" (
    "permissao_id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "permissao_pkey" PRIMARY KEY ("permissao_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_id_key" ON "usuario"("login_id");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_login_id_fkey" FOREIGN KEY ("login_id") REFERENCES "login"("login_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoUsuario" ADD CONSTRAINT "projetoUsuario_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("projeto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoUsuario" ADD CONSTRAINT "projetoUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoTecnologia" ADD CONSTRAINT "projetoTecnologia_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("projeto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoTecnologia" ADD CONSTRAINT "projetoTecnologia_tecnologia_id_fkey" FOREIGN KEY ("tecnologia_id") REFERENCES "tecnologia"("tecnologia_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidadeUsuario" ADD CONSTRAINT "habilidadeUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidadeUsuario" ADD CONSTRAINT "habilidadeUsuario_tecnologia_id_fkey" FOREIGN KEY ("tecnologia_id") REFERENCES "tecnologia"("tecnologia_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurso" ADD CONSTRAINT "recurso_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("projeto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("projeto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacaoTarefa" ADD CONSTRAINT "participacaoTarefa_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("tarefa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacaoTarefa" ADD CONSTRAINT "participacaoTarefa_projetoUsuario_id_fkey" FOREIGN KEY ("projetoUsuario_id") REFERENCES "projetoUsuario"("projetoUsuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_participacaoTarefa_id_fkey" FOREIGN KEY ("participacaoTarefa_id") REFERENCES "participacaoTarefa"("participacaoTarefa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexoTarefa" ADD CONSTRAINT "anexoTarefa_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("tarefa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexoComentario" ADD CONSTRAINT "anexoComentario_comentario_id_fkey" FOREIGN KEY ("comentario_id") REFERENCES "comentario"("comentario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexoComentario" ADD CONSTRAINT "anexoComentario_anexoTarefa_id_fkey" FOREIGN KEY ("anexoTarefa_id") REFERENCES "anexoTarefa"("anexoTarefa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissao" ADD CONSTRAINT "permissao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;
