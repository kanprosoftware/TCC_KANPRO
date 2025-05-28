-- DropForeignKey
ALTER TABLE "pausaTarefa" DROP CONSTRAINT "pausaTarefa_tarefa_id_fkey";

-- AddForeignKey
ALTER TABLE "pausaTarefa" ADD CONSTRAINT "pausaTarefa_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("tarefa_id") ON DELETE CASCADE ON UPDATE CASCADE;
