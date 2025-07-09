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

export const findTotalUsers = async () => {
  const totalUsuarios = await prisma.login.count();
  if (totalUsuarios === 0) {
    return true;
  }
  else {
    return false;
  }
};

export const registerUser = async ({ name, email, password, habilidades, serial }) => {
  const hashedPassword = await bcrypt.hash(process.env.HASH_SECRET + password, 10);
  let login;
  let user;

  if (!serial) {
    const existEmail = await prisma.login.findUnique({
      where: { email },
    });
    if (existEmail) {
      throw new Error("Email já cadastrado");
    }
    login = await prisma.login.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    user = await prisma.usuario.create({
      data: {
        nome: name,
        login_id: login.login_id, 
      },
    });

    const habilidadesPromises = habilidades.map(async (habilidade) => {
      const tecnologia = await prisma.tecnologia.findUnique({
        where: { descricao: habilidade },
      });

      return prisma.habilidadeUsuario.create({
        data: {
          usuario_id: user.usuario_id,
          tecnologia_id: tecnologia.tecnologia_id,
        },
      });
    });

    await Promise.all(habilidadesPromises);
  }
  else if (serial === process.env.INSTALL_KEY) {
    login = await prisma.login.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    user = await prisma.usuario.create({
      data: {
        nome: name,
        login_id: login.login_id, 
        roule: "super", 
      },
    });

    const habilidadesPromises = habilidades.map(async (habilidade) => {
      const tecnologia = await prisma.tecnologia.findUnique({
        where: { descricao: habilidade },
      });

      return prisma.habilidadeUsuario.create({
        data: {
          usuario_id: user.usuario_id,
          tecnologia_id: tecnologia.tecnologia_id,
        },
      });
    });

    await Promise.all(habilidadesPromises);
  }
  else {
    throw new Error("Serial inválido");
  }

  const token = jwt.sign({ login_id: login.login_id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

  const mailOptions = {
    from: '', 
    to: login.email, 
    subject: "Email Verification",
    html: `<b>Welcome ${user.nome}!</b><br/>Please click the link below to verify your email:<br/><a href="${verificationLink}">Verify Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending verification email.");
  }

  return login;
};


export const loginUser = async ({ email, password, provider}) => {
  const emailNotVerified = await prisma.login.findUnique({ where: { email, ativo: true } });
  if ((emailNotVerified != null) && (!emailNotVerified.is_verified)) throw new Error("Por favor, verifique seu e-mail para ativar sua conta.");

  const login = await prisma.login.findUnique({ where: { email, is_verified: true, provider: "local", ativo: true } });
  if (!login) throw new Error("Invalid credentials");
  
  const isPasswordValid = await bcrypt.compare((process.env.HASH_SECRET + password), login.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");
  const dev = await prisma.usuario.findUnique({
    where: { login_id: login.login_id },
  });

  const token = jwt.sign({ usuario_id: dev.usuario_id, nomeDesenvolvedor:dev.nome }, process.env.JWT_SECRET, { expiresIn: "1d" });

  console.log("Login successful:", token);

  return token;
};

export const verifyUserEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.login.update({
      where: { login_id: decoded.login_id},
      data: { is_verified: true },
    });
    return true;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const forgotPassword = async (email) => {
  const findEmail = await prisma.login.findFirst({
    where: {
      email: email,
    },
    include: {
      usuario: true,
    }
  });
  if ((findEmail) && (findEmail.provider != "local")) {
    const provider = findEmail.provider;
    const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);

    throw new Error("Login não realizado com email e senha!\nPor favor, utilize o login com o provedor: " + capitalizedProvider);
  }
  if (findEmail) {
    const token = jwt.sign({ login_id: findEmail.usuario.login_id }, process.env.JWT_TEMP_SECRET, {
      expiresIn: "5m",
    });

    const verificationLink = `${process.env.FRONTEND_URL}/password-reset?token=${token}`;
    const mailOptions = {
      from: '', 
      to: email, 
      subject: "KANPRO Software - Redefir Senha",
      html: `<b>Olá ${findEmail.usuario.nome}!</b><br/>Clique no link para redefinir sua senha:<br/><a href="${verificationLink}">Redefinir senha</a><br><b>Se voce nao solicitou a troca de senha, desconcidere!</b>`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Error sending verification email.");
    }
  } else {
    throw new Error("Email não encontrado!");
  }
}

export const resetPassword = async (loginId, passWord) => {
  const hashedPassword = await bcrypt.hash((process.env.HASH_SECRET + passWord), 10);

  return prisma.login.update ({
    where: {
      login_id: loginId,
    },
    data: {
      password: hashedPassword,
    }
  });
}

export const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
}


export const finalizeProfile = async (userId, habilidades) => {
  const usuario = await prisma.usuario.findUnique({
    where: { login_id: userId },
  });

  const habilidadesPromises = habilidades.map(async (habilidades) => {
    const tecnologia = await prisma.tecnologia.findFirst({
      where: { descricao: habilidades },
    });

    return prisma.habilidadeUsuario.create({
      data: {
        usuario_id: usuario.usuario_id,
        tecnologia_id: tecnologia.tecnologia_id,
      },
    });
  });
  const token = jwt.sign({ desenvolvedorId: usuario.desenvolvedorId }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

export const getAllUsers = async() => {
  return prisma.login.findMany({
    where: {
      ativo: true,
    },
    include: {
      usuario:true
    }
  });
}

export const updateRoule = async(userId, role) => {
  return prisma.usuario.update ({
    where: {
      usuario_id: userId,
    },
    data: {
      roule: role
    },
  });
}

export const disableUser = async(userId) => {
  const login_id = await prisma.usuario.findUnique ({
    where: {
      usuario_id: parseInt(userId),
    },
    select: {
      login_id: true,
    }
  });

  return prisma.login.update ({
    where: {
      login_id: parseInt(login_id.login_id),
    },
    data: {
      ativo: false,
    },
  }); 
}