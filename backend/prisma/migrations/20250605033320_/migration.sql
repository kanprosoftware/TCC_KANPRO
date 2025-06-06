/*
  Warnings:

  - You are about to drop the column `profile_image` on the `login` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "login" DROP COLUMN "profile_image";

-- CreateTable
CREATE TABLE "profile_image" (
    "profile_image_id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "login_id" INTEGER NOT NULL,

    CONSTRAINT "profile_image_pkey" PRIMARY KEY ("profile_image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_image_login_id_key" ON "profile_image"("login_id");

-- AddForeignKey
ALTER TABLE "profile_image" ADD CONSTRAINT "profile_image_login_id_fkey" FOREIGN KEY ("login_id") REFERENCES "login"("login_id") ON DELETE CASCADE ON UPDATE CASCADE;
