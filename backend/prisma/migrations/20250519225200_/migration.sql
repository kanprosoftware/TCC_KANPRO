-- CreateTable
CREATE TABLE "permissaoProjeto" (
    "permissaoProjeto_id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "projeto_id" INTEGER NOT NULL,

    CONSTRAINT "permissaoProjeto_pkey" PRIMARY KEY ("permissaoProjeto_id")
);

-- AddForeignKey
ALTER TABLE "permissaoProjeto" ADD CONSTRAINT "permissaoProjeto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissaoProjeto" ADD CONSTRAINT "permissaoProjeto_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("projeto_id") ON DELETE CASCADE ON UPDATE CASCADE;
