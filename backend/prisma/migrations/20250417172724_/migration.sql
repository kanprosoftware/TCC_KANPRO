/*
  Warnings:

  - You are about to drop the column `habilidade` on the `habilidadeDesenvolvedor` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `projetoTecnologia` table. All the data in the column will be lost.
  - Added the required column `tecnologiaId` to the `habilidadeDesenvolvedor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tecnologiaId` to the `projetoTecnologia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habilidadeDesenvolvedor" DROP COLUMN "habilidade",
ADD COLUMN     "tecnologiaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "projetoTecnologia" DROP COLUMN "descricao",
ADD COLUMN     "tecnologiaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "tecnologia" (
    "tecnologiaId" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "tecnologia_pkey" PRIMARY KEY ("tecnologiaId")
);

-- CreateTable
CREATE TABLE "frameWorkTecnologia" (
    "frameWorkTecnologiaId" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "tecnologiaId" INTEGER NOT NULL,

    CONSTRAINT "frameWorkTecnologia_pkey" PRIMARY KEY ("frameWorkTecnologiaId")
);

-- AddForeignKey
ALTER TABLE "habilidadeDesenvolvedor" ADD CONSTRAINT "habilidadeDesenvolvedor_tecnologiaId_fkey" FOREIGN KEY ("tecnologiaId") REFERENCES "tecnologia"("tecnologiaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetoTecnologia" ADD CONSTRAINT "projetoTecnologia_tecnologiaId_fkey" FOREIGN KEY ("tecnologiaId") REFERENCES "tecnologia"("tecnologiaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frameWorkTecnologia" ADD CONSTRAINT "frameWorkTecnologia_tecnologiaId_fkey" FOREIGN KEY ("tecnologiaId") REFERENCES "tecnologia"("tecnologiaId") ON DELETE RESTRICT ON UPDATE CASCADE;
