import { registerUser, loginUser, verifyUserEmail, logoutUser, finalizeProfile, findTotalUsers, getAllUsers, updateRoule, disableUser } from "../services/authService.js";

export const firstUser = async (req, res) => {
  try {
    const user = await findTotalUsers({ });
    res.status(201).json(user);
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: error.message || "Erro interno no servidor." });
  } 
}

export const register = async (req, res) => {
  try {
    const { name, email, password, habilidades, serial } = req.body;
    // Verifica se os campos obrigatórios foram enviados
    if (!name || !email || !password || !Array.isArray(habilidades)) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes ou inválidos." });
    }

    // Registra o usuário, o desenvolvedor e as habilidades
    const user = await registerUser({ name, email, password, habilidades, serial });

    res.status(201).json({ message: "Usuário registrado com sucesso!", user });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: error.message || "Erro interno no servidor." });
  }
};


export const login = async (req, res) => {
  try {
    const token = await loginUser(req.body);
    req.session.token = token;
    res.status(200).json({ message: "Login realizado com sucesso!" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  //console.log("req.query.token", req.query.token);
  //console.log("chamou o Controller.verifyEmail");
  try {
    //console.log("req.query.token", req.body.token);
    const result = await verifyUserEmail(req.body.token);
   // console.log("result", result);
    res.status(200).json({ message: "Email validado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const completeProfile = async (req, res) => {
  const { habilidades } = req.body;
  const userId = req.user.login_id;

  if (!habilidades || habilidades.length === 0) {
    return res.status(400).json({ mensagem: 'Habilidades são obrigatórias.' });
  }

  try {
    const finalToken = await finalizeProfile(userId, habilidades);
    res.json({ token: finalToken });
  } catch (error) {
    console.error('Erro ao completar perfil:', error);
    res.status(500).json({ mensagem: 'Erro ao completar perfil.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const geAlltUsers = await getAllUsers();
    res.status(200).json({geAlltUsers});
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter usuarios'});
  }
}

export const updateRouleUser = async (req, res) => {
  console.log("--------------------------------");
  console.log("req.user: ", req);
  console.log("--------------------------------");
  try {
    const updateRouleUsers = await updateRoule(req.body.usuario_id, req.body.role);
    res.status(200).json({updateRouleUsers});
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar regra de usuario'});
  }
}

export const disableUserById = async (req, res) => {
  try {
    const disableUserId = await disableUser(req.body.usuario_id);
    res.status(200).json({disableUserId});
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao desativar usuario'});
  }
}