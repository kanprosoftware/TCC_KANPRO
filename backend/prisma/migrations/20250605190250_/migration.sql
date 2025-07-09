/*
  Warnings:

  - You are about to drop the `anexoComentario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "anexoComentario" DROP CONSTRAINT "anexoComentario_anexoTarefa_id_fkey";

-- DropForeignKey
ALTER TABLE "anexoComentario" DROP CONSTRAINT "anexoComentario_comentario_id_fkey";

-- DropTable
DROP TABLE "anexoComentario";
