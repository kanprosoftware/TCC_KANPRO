import prisma from "../models/prismaClient.js";

export const getTecnologies = async () => {
    const tecnologies = await prisma.tecnologia.findMany({
        orderBy: {
            descricao: "asc",
        },
    });

    return tecnologies;
}