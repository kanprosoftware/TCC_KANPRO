import { getProfile, includeUpdateFoto, updateEmail, updateHabilidades, updateName, updateSenha } from '../services/profileService.js';

export const profile = async (req, res) => {
    const devId = req.usuario_id;
    try {
        const profile = await getProfile(devId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateProfileName = async (req, res) => {
    const dataNewName = {
        usuario_id: req.usuario_id,
        nome: req.body.nome,
    }
    try {
        const newName = await updateName(dataNewName);
        res.status(200).json(newName);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateProfileEmail = async (req, res) => {
    const dataNewEmail = {
        usuario_id: req.usuario_id,
        email: req.body.emailNovo,
        emailAtual: req.body.emailAtual,
    }
    try {
        const newEmail = await updateEmail(dataNewEmail);
        res.status(200).json(newEmail);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateProfileSenha = async (req, res) => {
    const dataNewSenha = {
        usuario_id: req.usuario_id,
        senhaAtual: req.body.senhaAtual,
        novaSenha: req.body.senhaNova,
    }
    try {
        const newSenha = await updateSenha(dataNewSenha);
        res.status(200).json(newSenha);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateProfileHabilidades = async (req, res) => {
    const dataNewHabilidades = {
        habilidades: req.body.habilidades,
        usuario_id: req.usuario_id,
    }
    try {
        const newHabilidades = await updateHabilidades(dataNewHabilidades);
        res.status(200).json(newHabilidades);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const includeUpdateProfileFoto = async (req, res) => { 
    const dataNewFoto = {
        ...req.body,
        usuario_id: req.usuario_id,
    }
    if (req.files && req.files.length > 0) {
        dataNewFoto.arquivo = req.files.map((file) => ({
            nome: file.originalname,
            tipo: file.mimetype,
            conteudo: file.buffer,
        }));
    }
    try {
        const newFoto = await includeUpdateFoto(dataNewFoto);
        res.status(200).json(newFoto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}