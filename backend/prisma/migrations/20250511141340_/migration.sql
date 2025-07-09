/*
  Warnings:

  - You are about to drop the column `caminho` on the `anexoTarefa` table. All the data in the column will be lost.
  - You are about to drop the `anexo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conteudo` to the `anexoTarefa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `anexoTarefa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `anexoTarefa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "anexo" DROP CONSTRAINT "anexo_projeto_id_fkey";

-- AlterTable
ALTER TABLE "anexoTarefa" DROP COLUMN "caminho",
ADD COLUMN     "conteudo" BYTEA NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL;

-- DropTable
DROP TABLE "anexo";

-- CreateTable
CREATE TABLE "anexoProjeto" (
    "anexo_id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "projeto_id" INTEGER NOT NULL,

    CONSTRAINT "anexoProjeto_pkey" PRIMARY KEY ("anexo_id")
);

-- AddForeignKey
ALTER TABLE "anexoProjeto" ADD CONSTRAINT "anexoProjeto_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("projeto_id") ON DELETE CASCADE ON UPDATE CASCADE;
