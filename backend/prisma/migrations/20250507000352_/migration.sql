-- CreateTable
CREATE TABLE "_participacaoTarefaTousuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_participacaoTarefaTousuario_AB_unique" ON "_participacaoTarefaTousuario"("A", "B");

-- CreateIndex
CREATE INDEX "_participacaoTarefaTousuario_B_index" ON "_participacaoTarefaTousuario"("B");

-- AddForeignKey
ALTER TABLE "_participacaoTarefaTousuario" ADD CONSTRAINT "_participacaoTarefaTousuario_A_fkey" FOREIGN KEY ("A") REFERENCES "participacaoTarefa"("participacaoTarefa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participacaoTarefaTousuario" ADD CONSTRAINT "_participacaoTarefaTousuario_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;
