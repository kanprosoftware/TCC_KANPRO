import jwt from 'jsonwebtoken';
import prisma from "../models/prismaClient.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "canjunior15@gmail.com",
    pass: "kifh vtow okiv actq",
  },
});

export const handleOAuthCallback = async ({ provider, provider_id, email, displayName }) => {
  // console.log("email", email);
  // console.log("provider", provider);
  // console.log("provider_id", provider_id);
  // console.log("displayName", displayName);
  if (!provider || !provider_id || !email) throw new Error("Dados incompletos para autenticação OAuth");
    //console.log("Dados recebidos:", { provider, providerId, email });
  let login = await prisma.login.findFirst({ where: { email, provider, provider_id } });
  // console.log("Login encontrado:", login);
  // const isNew = !login;
  if (!login) {
    login = await prisma.login.create({
      data: {
        provider,
        provider_id,
        email,
      },
    });

    const desenvolvedor = await prisma.usuario.create({
      data: {
        nome: displayName,
        login_id: login.login_id,
      },
    });

    const verificationToken = jwt.sign({ login_id: login.login_id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    const verificationLink = `${process.env.FRONTEND_URL}/verificar-email?token=${verificationToken}`;

    const mailOptions = {
      from: '',
      to: email,
      subject: "Email Verification",
      html: `<b>Welcome ${displayName}!</b><br/>Please click the link below to verify your email:<br/><a href="${verificationLink}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    const tempToken = jwt.sign({ login_id: login.login_id, email: login.email, cadastroIncompleto:true }, process.env.JWT_TEMP_SECRET, { expiresIn: '15m' });
    return { login, desenvolvedor, habilidades: [], tempToken };
  } else {
    let desenvolvedor = await prisma.usuario.findFirst({ where: { login_id: login?.login_id } });
    //console.log("Desenvolvedor encontrado:", desenvolvedor);
    let habilidades = await prisma.habilidadeUsuario.findMany({
        where: { usuario_id: desenvolvedor?.usuario_id },
        include: { tecnologia: true },
    });
    //console.log("Habilidades encontradas:", habilidades);
    const tempToken = jwt.sign({ usuario_id: desenvolvedor.usuario_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return { login, desenvolvedor, habilidades, tempToken };
  }
};