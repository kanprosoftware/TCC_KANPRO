import e from "express";
import { 
  createTodoItem, 
  getTodos,
  updateColorBarTodo,
  updateDoingTodo,
  updateConcludeTodo,
  getPendingTodos, 
  getOverdueTodos, 
  addCategory, 
  completeTodo,
  updateTodoField, 
  deleteTodoById,
  getParticipantes,
  updateTodoDescription,
  updateTitle,
  addComent,
  getComentarios,
  addParticipante,
  addAttachment,
  listAttachment,
  downloadAttachmentById,
  editComent,
  deleteComent,
  excludeParticipantes,
  excludeAttachment,
  getTodosGantt,
  pauseTodo,
  continueTodo
} from "../services/todoService.js";

export const createTodo = async (req, res) => {
    const userSessionId = req.usuario_id;
    const projectId = parseInt(req.body.projetoId);
    const todoData = {
        ...req.body,
        userSessionId,
        projectId,
    };
    try {
        const todo = await createTodoItem(todoData);
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const pauseTask = async (req, res) => { 
  const todoData = {
    projeto_id: req.body.projeto_id,
    tarefa_id: req.body.tarefa_id,
    userSessionId: req.usuario_id,
  };
  try {
    const todo = await pauseTodo(todoData);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const continueTask = async (req, res) => { 
  const todoData = {
    projeto_id: req.body.projeto_id,
    tarefa_id: req.body.tarefa_id,
    userSessionId: req.usuario_id,
  };
  try {
    const todo = await continueTodo(todoData);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const listTodos = async (req, res) => {
    const userSessionId = req.usuario_id;
    const projectId = parseInt(req.query.idProjeto);
    const todoData = {
        projectId: projectId,
        desenvolvedorId: userSessionId,
    };
  try {
    const todos = await getTodos(todoData);
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listTodosGantt = async (req, res) => {
    const userSessionId = req.usuario_id;
    const projectId = parseInt(req.query.idProjeto);
    const todoData = {
        projectId: projectId,
        desenvolvedorId: userSessionId,
    };
  try {
    const todos = await getTodosGantt(todoData);
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addParticipantes = async (req, res) => {
  const todoData = {
    projeto_id: req.body.projeto_id,
    tarefa_id: req.body.tarefa_id,
    usuario_id: req.body.participantes_ids,
    userSessionId: req.usuario_id,
  };
  try {
    const todo = await addParticipante(todoData);
    res.status(201).json(todo);
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

export const excludeParticipantesTodo = async (req, res) => {
  const todoData = {
    projeto_id: req.body.projeto_id,
    tarefa_id: req.body.tarefa_id,
    usuario_id: req.body.participante_id,
    userSessionId: req.usuario_id,
  };
  try {
    const todo = await excludeParticipantes(todoData);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateColorBar = async (req, res) => {
  try {
    const todo = await updateColorBarTodo(req.body.tarefaId, req.body.barColor);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDoing = async (req, res) => {
  const userSessionId = req.usuario_id;
  const todoData = {
    projeto_id: parseInt(req.body.projetoId),
    tarefa_id: parseInt(req.body.tarefaId),
    usuario_id: userSessionId,
  };
  try {
    const todo = await updateDoingTodo(todoData);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateConclude = async (req, res) => {
  const userSessionId = req.usuario_id;
  const todoData = {
    projeto_id: parseInt(req.body.projetoId),
    tarefa_id: parseInt(req.body.tarefaId),
    usuario_id: userSessionId,
  };
  try {
    const todo = await updateConcludeTodo(todoData);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDescription = async (req, res) => {
  const descriptionData = {
    tarefa_id: req.body.tarefa_id,
    descricao: req.body.descricao,
    usuario_id: req.usuario_id,
    projeto_id: req.body.projeto_id,
  };
  try {
    const todo = await updateTodoDescription(descriptionData);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const listPendingTodos = async (req, res) => {
    const userSessionId = req.userId;
  try {
    const todos = await getPendingTodos(userSessionId);
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listOverdueTodos = async (req, res) => {
    const userSessionId = req.userId;
  try {
    const todos = await getOverdueTodos(userSessionId);
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addCategoryTodo = async (req, res) => {
  try {
    const todos = await addCategory(req.params.id, req.body.categoryId);
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const markTodoComplete = async (req, res) => {
  try {
    const todo = await completeTodo(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTodoDateForConclusion = async (req, res) => {
  try {
    const updatedTodo = await updateTodoField(req.params.id, { dateForConclusion: new Date(req.body.dateForConclusion) });
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTodoCategory = async (req, res) => {
  try {
    const categoryId = req.body.categoryId ? parseInt(req.body.categoryId) : null;
    const updatedTodo = await updateTodoField(req.params.id, { categoryId });
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTitleTodo = async (req, res) => {
  const titleData = {
    tarefa_id: req.body.tarefa_id,
    titulo: req.body.titulo,
    usuario_id: req.usuario_id,
    projeto_id: req.body.projeto_id,
  };
  try {
    const todo = await updateTitle(titleData);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const usuario_id = req.usuario_id;
  const projeto_id = parseInt(req.body.projeto_id);
  const tarefa_id = parseInt(req.body.tarefa_id);
  const todoDataDelete = {
    usuario_id,
    projeto_id,
    tarefa_id
  };
  try {
    await deleteTodoById(todoDataDelete);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addComentTodo = async (req, res) => {
  const usuario_id = parseInt(req.usuario_id);
  const tarefa_id = parseInt(req.body.tarefa_id);
  const comentario = req.body.comentario;
  const projeto_id = parseInt(req.body.projeto_id);
  const todoDataComent = {
    usuario_id,
    tarefa_id,
    projeto_id,
    comentario
  };
  try {
    await addComent(todoDataComent);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getCommentsTodo = async (req, res) => {
  try {
    const commentsTodo = await getComentarios(req.params.id);
    res.json(commentsTodo);
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}

export const editCommentTodo = async (req, res) => {
  const usuario_id = parseInt(req.usuario_id);
  const tarefa_id = parseInt(req.body.tarefa_id);
  const comentario = req.body.comentario;
  const projeto_id = parseInt(req.body.projeto_id);
  const comentario_id = parseInt(req.body.comentario_id);
  const todoDataComent = {
    usuario_id,
    tarefa_id,
    projeto_id,
    comentario,
    comentario_id
  };
  try {
    const editComment = await editComent(todoDataComent);
    res.status(201).json(editComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteComentTodo = async (req, res) => {
  const usuario_id = parseInt(req.usuario_id);
  const tarefa_id = parseInt(req.body.tarefa_id);
  const projeto_id = parseInt(req.body.projeto_id);
  const comentario_id = parseInt(req.body.comentario_id);
  const todoDataComent = {
    usuario_id,
    tarefa_id,
    projeto_id,
    comentario_id
  };
  try {
    const editComment = await deleteComent(todoDataComent);
    res.status(201).json(editComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



export const addAttachmentTodo = async (req, res) => {
  const attachmentData = {
    ...req.body,
    projeto_id: req.body.projeto_id,
    tarefa_id: req.body.tarefa_id,
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

export const listAttachmentTodo = async (req, res) => {
  try {
    const attachment = await listAttachment(req.params.id);
    res.status(201).json(attachment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const downloadAttachmentByIdTodo = async (req, res) => {
  const attachmentData = {
    projeto_id: req.query.projeto_id,
    tarefa_id: req.query.tarefa_id,
    usuario_id: req.usuario_id,
    anexoTarefa_id: req.params.id
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

export const exludeAttachmentTodo = async (req, res) => {
  const attachmentData = {
    projeto_id: req.body.projeto_id,
    tarefa_id: req.body.tarefa_id,
    usuario_id: req.usuario_id,
    anexoTarefa_id: req.body.anexoTarefa_id
  }
  try {
    const file = await excludeAttachment(attachmentData);
    res.status(201).json( file.conteudo );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}