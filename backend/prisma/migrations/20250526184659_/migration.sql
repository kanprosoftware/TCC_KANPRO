-- CreateTable
CREATE TABLE "pausaTarefa" (
    "pausa_id" SERIAL NOT NULL,
    "tarefa_id" INTEGER NOT NULL,
    "inicioPausa" TIMESTAMP(3) NOT NULL,
    "fimPausa" TIMESTAMP(3),

    CONSTRAINT "pausaTarefa_pkey" PRIMARY KEY ("pausa_id")
);

-- AddForeignKey
ALTER TABLE "pausaTarefa" ADD CONSTRAINT "pausaTarefa_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("tarefa_id") ON DELETE RESTRICT ON UPDATE CASCADE;
