import prisma from "../models/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: "canjunior15@gmail.com",   // google app email
    pass: "kifh vtow okiv actq",   // google app password
  },
});

// const hashedPassword = async (password) => { 
//     const bcr = await bcrypt.hash((process.env.HASH_SECRET + password), 10);
//     // const hashedPassword = await bcrypt.hash((process.env.HASH_SECRET + passWord), 10);
//     return bcr;
// }

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
            login: {
                include: {
                    profile_image: true, // Inclui a imagem de perfil
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
    // console.log("CHAMOU O SERVICE - updateEmail", data);
    const usuario = await prisma.usuario.findUnique({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
    });
    // console.log("usuario", usuario);
    const emailProvider = await prisma.login.findFirst({
        where: {
            email: data.emailAtual,
        },
    });
    // console.log("emailProvider", emailProvider);
    if ((emailProvider.provider.length > 0) && (emailProvider.provider !== "local")) {
        const provider = emailProvider.provider;
        const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
        throw new Error("Email registrado para login com: " + capitalizedProvider);
    }
    const login = await prisma.login.update({
        where: {
            login_id: parseInt(usuario.login_id),
            email: data.emailAtual, // Verifica se o email atual corresponde ao login
        },
        data: {
            email: data.email,
            is_verified: false, // Reseta o status de verificação do email
        },
        include: {
            usuario: true, // Inclui os dados do usuário relacionado
        },
    });

    //console.log ("login", login);
      // Gerando o token para envio de verificação de e-mail
      const token = jwt.sign({ login_id: login.login_id }, process.env.JWT_SECRET, {
        expiresIn: "10m", // Expira em 10 minutos
      });
    
      const verificationLink = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;
    
      // Configuração do e-mail
      const mailOptions = {
        from: '', // Remetente
        to: data.email, // Destinatário
        subject: "Email Verification",
        html: `<b>Welcome ${login.usuario.nome}!</b><br/>Seu email foi atualizado com sucesso, clique no link a baixo para verificar e seguir usando sua conta normalmente:<br/><a href="${verificationLink}">Verify Email</a>`,
      };
    
      // Enviar o e-mail de verificação
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
    // const hashedPasswordNova = await hashedPassword(data.novaSenha);
    // console.log("CHAMOU O SERVICE - updateSenha", data);
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
    // console.log("emailProvider", emailProvider);
    if ((verifyPassword.provider.length > 0) && (verifyPassword.provider !== "local")) {
        const provider = verifyPassword.provider;
        const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
        throw new Error("Usuario registrado para login com: " + capitalizedProvider);
    }
    // console.log("verifyPassword", verifyPassword.password);
    // console.log("data.senhaAtual", data.senhaAtual);
    const senhaCorreta = await bcrypt.compare((process.env.HASH_SECRET + data.senhaAtual), verifyPassword.password);
    // console.log("verifyPassword", senhaCorreta);
    if (!senhaCorreta) {
        throw new Error("Senha atual incorreta");
    } else {
        const hashedPassword = await bcrypt.hash((process.env.HASH_SECRET + data.novaSenha), 10);
        // console.log("hasef: ", hashedPassword);
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
    // console.log("CHAMOU O SERVICE - includeUpdateFoto", data);
    const usuario = await prisma.usuario.findUnique({
        where: {
            usuario_id: parseInt(data.usuario_id),
        },
        include: {
            login: true, // Inclui o login para acessar a imagem de perfil
        },
    });
    // console.log("usuario: ", usuario);
    // console.log("usuario.login_id: ", data.arquivo[0]);
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
    // console.log("profileImage: ", profileImage);
    return profileImage
}