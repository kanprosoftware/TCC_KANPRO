import prisma from "../models/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: "canjunior15@gmail.com",   
    pass: "kifh vtow okiv actq",   
  },
});

export const getProfile = async (devId) => {
    const profile = await prisma.usuario.findUnique({
        where: { usuario_id: parseInt(devId) },
        include: {
            habilidades: {
                include: {
                    tecnologia: true,
                }
            },
            login: {
                include: {
                    profile_image: true, 
                }
            }
        },
    });
    
    return profile;
}

export const updateName = async (data) => {
    return prisma.usuario.update({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
        data: {
            nome: data.nome,
        },
    });
}

export const updateEmail = async (data) => {
    const usuario = await prisma.usuario.findUnique({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
    });
    const emailProvider = await prisma.login.findFirst({
        where: {
            email: data.emailAtual,
        },
    });
    if ((emailProvider.provider.length > 0) && (emailProvider.provider !== "local")) {
        const provider = emailProvider.provider;
        const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
        throw new Error("Email registrado para login com: " + capitalizedProvider);
    }
    const login = await prisma.login.update({
        where: {
            login_id: parseInt(usuario.login_id),
            email: data.emailAtual, 
        },
        data: {
            email: data.email,
            is_verified: false, 
        },
        include: {
            usuario: true, 
        },
    });

      const token = jwt.sign({ login_id: login.login_id }, process.env.JWT_SECRET, {
        expiresIn: "10m", 
      });
    
      const verificationLink = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

      const mailOptions = {
        from: '', 
        to: data.email, 
        subject: "Email Verification",
        html: `<b>Welcome ${login.usuario.nome}!</b><br/>Seu email foi atualizado com sucesso, clique no link a baixo para verificar e seguir usando sua conta normalmente:<br/><a href="${verificationLink}">Verify Email</a>`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${data.email}`);
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending verification email.");
      }
    return login;
}

export const updateSenha = async (data) => {
    const usuario = await prisma.usuario.findUnique({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
    });
    const verifyPassword = await prisma.login.findFirst({
        where: {
            login_id: parseInt(usuario.login_id),
        },
    });

    if ((verifyPassword.provider.length > 0) && (verifyPassword.provider !== "local")) {
        const provider = verifyPassword.provider;
        const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
        throw new Error("Usuario registrado para login com: " + capitalizedProvider);
    }

    const senhaCorreta = await bcrypt.compare((process.env.HASH_SECRET + data.senhaAtual), verifyPassword.password);

    if (!senhaCorreta) {
        throw new Error("Senha atual incorreta");
    } else {
        const hashedPassword = await bcrypt.hash((process.env.HASH_SECRET + data.novaSenha), 10);

        return prisma.login.update ({
            where: {
                login_id: usuario.login_id,
            },
            data: {
                password: hashedPassword,
            }
        });
    }
}
    

export const updateHabilidades = async (data) => {
    console.log("Chamou o service updateHabilidades");
    console.log("data: ", data);
    const deleteHabilidades = await prisma.habilidadeUsuario.deleteMany({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
    });
    console.log("deleteHabilidades: ", deleteHabilidades);
    const updateHabilidades = await prisma.habilidadeUsuario.createMany({
        data: data.habilidades.map(id => ({
            usuario_id: parseInt(data.usuario_id),
            tecnologia_id: parseInt(id),
        })),
    });
    console.log("updateHabilidades: ", updateHabilidades);
    return updateHabilidades;
}

export const includeUpdateFoto = async (data) => { 

    const usuario = await prisma.usuario.findUnique({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
        include: {
            login: true, 
        },
    });

    const profileImage = await prisma.profile_image.upsert({
        where: {
            login_id: usuario.login_id,
        },
        update: {
            nome: data.arquivo[0].nome,
            tipo: data.arquivo[0].tipo,
            conteudo: data.arquivo[0].conteudo,
        },
        create: {
            login_id: usuario.login_id,
            nome: data.arquivo[0].nome,
            tipo: data.arquivo[0].tipo,
            conteudo: data.arquivo[0].conteudo,
        },
    });

    return profileImage
}