import { getProjectsByDevId, 
         getProjectsTeamByDevId, 
         getProjects, 
         getProjectById, 
         createProject,
         getParticipantes,
         deleteProjectById,
         detailsProjectById,
         devSugestion,
         addParticipantes,
         removeParticipante,
         updateName,
         updateDescription,
         updateTecnologis,
         excludeAttachment,
         downloadAttachmentById,
         listAttachment,
         addAttachment,
        } from "../services/projectService.js";

export const getAllProjectsByDevId = async (req, res) => {
    const devId = req.usuario_id;
    try {
        const projects = await getProjectsByDevId(devId);
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getAllProjectsTeamByDevId = async (req, res) => {
    const devId = req.usuario_id;
    try {
        const projects = await getProjectsTeamByDevId(devId);
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const projects = await getProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getProjectsById = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await getProjectById(id);
        if (!project) {
            return res.status(404).json({ error: "Project not found." });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const createNewProject = async (req, res) => {
    const { nome, descricao, tecnologias } = req.body;
    const participanteProject = req.usuario_id;

    if (!nome || !descricao || !tecnologias || tecnologias.length === 0) {
        return res.status(400).json({ error: "Nome, descrição e tecnologias são obrigatórios." });
    }

    try {
        const project = await createProject({ nome, descricao, tecnologias, participanteProject });
        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const addParticipantesProject = async (req, res) => {
    const addData = {
        usuario_id: req.usuario_id,
        participantesIds: req.body.participantes_ids,
        projeto_id: req.body.projeto_id,
    };
    try {
        const participantes = await addParticipantes(addData);
        res.json(participantes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const listParticipantes = async (req, res) => {
    const projectId = parseInt(req.params.id);
  try {
    const participantes = await getParticipantes(projectId);
    res.json(participantes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeParticipantes = async (req, res) => {
    const deleteData = {
        projeto_id: parseInt(req.body.projeto_id),
        usuario_id: parseInt(req.body.usuario_id),
        projetoUsuario_id: parseInt(req.body.projetoUsuario_id),
    };
    try {
        const deleteParticipante = await removeParticipante(deleteData)
        res.status(200).json(deleteParticipante);
    } catch (error) {
        res.status(500).json( { error: "Erro ao remover participante!" });
    }
}

export const deleteProject = async (req, res) => {
    const deleteData = {
        projeto_id: (req.body.projeto_id),
        usuario_id: req.usuario_id,
    };
    try {
        const deletedProject = await deleteProjectById(deleteData);
        res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const detailsProject = async (req, res) => {
    const projectData = {
        usuario_id: req.usuario_id,
        projeto_id: req.query.projeto_id
    }
    try {
        const datailsProject = await detailsProjectById(projectData);
        res.status(200).json(datailsProject);
    } catch (error) {
        console.error("Erro ao obter os detalhes do projeto:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const devSugestionProject = async (req, res) => {
    try {
        const devSugestions = await devSugestion(req.params.id, req.usuario_id)
        res.status(201).json(devSugestions);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}

export const updateNameProject = async (req, res) => {
    const dataUpdateName = {
        projeto_id: req.body.projeto_id,
        nome: req.body.nomeProjeto
    }
    try {
        const updateNameProject = await updateName(dataUpdateName);
        res.status(200).json(updateNameProject);
    } catch (error) {
        res.status(500).json( { error: "Erro ao renomear projeto!" } );
    }
}

export const updateDescriptionProject = async (req, res) => {
    const dataUpdaDescription = {
        projeto_id: req.body.projeto_id,
        descricao: req.body.descricaoProjeto
    }
    try {
        const updateDescriptionsProject = await updateDescription(dataUpdaDescription);
        res.status(200).json(updateDescriptionsProject);
    } catch (error) {
        res.status(500).json( { error: "Erro ao atualizar a descrição do projeto!" } );
    }
}

export const updateTecsProject = async (req, res) => {
    const dataTecsProject = {
        projeto_id: req.body.projeto_id,
        tecnologias: req.body.tecnologias,
    }
    try {
        const updateTecs = await updateTecnologis(dataTecsProject);
        res.status(200).json(updateTecs);
    } catch (error) {
        res.status(500).json( { error: "Erro ao atualizar as tecnologias!" } );
    }
}

export const addAttachmentProject = async (req, res) => {
  const attachmentData = {
    ...req.body,
    projeto_id: req.body.projeto_id,
    usuario_id: req.usuario_id,
  }
  if (req.files && req.files.length > 0) {
    attachmentData.arquivos = req.files.map((file) => ({
      nome: file.originalname,
      tipo: file.mimetype,
      conteudo: file.buffer,
    }));
  }
  try {
    const attachment = await addAttachment(attachmentData);
    res.status(201).json(attachment);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

export const listAttachmentProject = async (req, res) => {
  try {
    const attachment = await listAttachment(req.params.id);
    res.status(201).json(attachment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const downloadAttachmentByIdProject = async (req, res) => {
  const attachmentData = {
    projeto_id: req.query.projeto_id,
    usuario_id: req.usuario_id,
    anexo_id: req.params.id
  }
  try {
    const file = await downloadAttachmentById(attachmentData);
    const isImage = file.tipo.startsWith('image/');
    const isPdf = file.tipo === 'application/pdf';

    const isInline = isImage || isPdf;
    res.header('Content-Type', file.tipo);
    res.header('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${(file.nome)}"`);

    res.send(file.conteudo);
  } catch (error) {
    console.error('Erro ao manipular arquivo:', error.message);
    res.status(400).json({ error: error.message });
  }
}

export const exludeAttachmentProject = async (req, res) => {
  const attachmentData = {
    projeto_id: req.body.projeto_id,
    usuario_id: req.usuario_id,
    anexo_id: req.body.anexo_id
  }
  try {
    const file = await excludeAttachment(attachmentData);
    res.status(201).json( file.conteudo );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}