import prisma from "../models/prismaClient.js";

// console.log("chamou o Service.getTecnology");
export const getTecnologies = async () => {
    const tecnologies = await prisma.tecnologia.findMany({
        orderBy: {
            descricao: "asc",
        },
    });

    return tecnologies;
}