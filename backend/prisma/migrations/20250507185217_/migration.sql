/*
  Warnings:

  - Added the required column `usuario_id` to the `comentario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comentario" ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;
