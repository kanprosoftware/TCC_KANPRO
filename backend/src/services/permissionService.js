import prisma from "../models/prismaClient.js";

export const getPermissionsSystem = async() => {
    return await prisma.permissao.findMany ({
        
    });
}