import prisma from "../models/prismaClient.js";

export const getProfile = async (devId) => {
    //console.log("CHAMOU O SERVICE - devId", devId);
    const profile = await prisma.usuario.findUnique({
        where: { usuario_id: parseInt(devId) },
        include: {
            habilidades: {
                include: {
                    tecnologia: true,
                }
            },
            login: true,
        },
    });
    
    return profile;
}
