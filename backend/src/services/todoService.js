import { date, tuple } from "yup";
import prisma from "../models/prismaClient.js";
import { getAllProjectsByDevId } from "../controllers/projectController.js";

const todoIsDone = async ( tarefaId ) => {
  const isDone = await prisma.tarefa.findUnique({
    where: {
      tarefa_id: parseInt(tarefaId)
    }
  });
  //console.log("isDone: ", isDone);
  if (isDone.concludeAt) {
    //console.log("isDone true: ", isDone.concludeAt);
    return true;
  } else {
    //console.log("isDone false: ", isDone.concludeAt);
    return false;
  }
}

export const createTodoItem = async ( projectData ) => {
    //console.log("projectData: ", projectData);
    if (!projectData.doing) {
      //console.log("entrou no if");
      const todo = await prisma.tarefa.create({
        data: { 
          titulo: projectData.titulo,
          descricao: projectData.descricao,
          createdAt: new Date(),
        }
      });
      
      const projeto_id = projectData.projeto_id;
      const projetoUsuario = await prisma.projetoUsuario.findMany({
        where: { projeto_id: parseInt(projectData.projeto_id), usuario_id: parseInt(projectData.userSessionId) },
      });
      // console.log("projetoUsuario: ", projetoUsuario);
      // console.log("todo: ", todo.tarefa_id);
      const newTask = await prisma.participacaoTarefa.create({
        data: {
          projetoUsuario_id: parseInt(projetoUsuario[0].projetoUsuario_id),
          tarefa_id: parseInt(todo.tarefa_id),
        },
      });
      return todo;
    }
    else {
      //console.log("entrou no else");
      const todo = await prisma.tarefa.create({
        data: { 
          titulo: projectData.titulo,
          descricao: projectData.descricao,
          createdAt: new Date(),
          doing: new Date(),
        }
      });
      const projetoUsuario = await prisma.projetoUsuario.findMany({
        where: { projeto_id: parseInt(projectData.projeto_id), usuario_id: parseInt(projectData.userSessionId) },
      });
      //console.log("projetoUsuario: ", projetoUsuario);
      const newTask = await prisma.participacaoTarefa.create({
        data: {
          projetoUsuario_id: parseInt(projetoUsuario[0].projetoUsuario_id),
          tarefa_id: parseInt(todo.tarefa_id),
        },
      });
      return todo;
    }
};

export const pauseTodo = async (todoData) => {
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(todoData.projeto_id), usuario_id: parseInt(todoData.userSessionId) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(todoData.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipanteeeeeeeeee: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(todoData.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    //console.log("projetoParticipante: ", projetoParticipante);
    return await prisma.pausaTarefa.create({
      data: { 
        tarefa_id: parseInt(todoData.tarefa_id),
        inicioPausa: new Date(),
      }
    });
  }
}

export const continueTodo = async (todoData) => {
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(todoData.projeto_id), usuario_id: parseInt(todoData.userSessionId) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(todoData.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipanteeeeeeeeee: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(todoData.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    //console.log("projetoParticipante: ", projetoParticipante);
    const pauseId = await prisma.pausaTarefa.findFirst({
      where: {
        tarefa_id: parseInt(todoData.tarefa_id),
        fimPausa: null, // Atualiza apenas se a pausa ainda não tiver sido finalizada
      },
      select: {
        pausa_id: true
      }
    });
    console.log("PAUSE_IDIDIDIDIDIDIDIDIDIDIDIDIIDIDID: ", pauseId.pause);
    return await prisma.pausaTarefa.update({
      where: {
        pausa_id: pauseId.pausa_id,
        tarefa_id: parseInt(todoData.tarefa_id),
        fimPausa: null, // Atualiza apenas se a pausa ainda não tiver sido finalizada
      },
      data: { 
        fimPausa: new Date(),
      }
    });
  }
}

export const getTodos = async (projectData) => {
    // console.log("projectData: ", projectData);
    const projetoUsuario = await prisma.projetoUsuario.findMany({
      where: { projeto_id: projectData.projectId },
    });
    const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
    const todos = await prisma.participacaoTarefa.findMany({
        where: { projetoUsuario_id: { in: projetoUsuarioIds } },
    });
    //console.log("todos: ", todos);
    const tarefaIds = todos.map(item => item.tarefa_id);
    const tarefas = await prisma.tarefa.findMany({
      where: {
        tarefa_id: {
          in: tarefaIds,
        },
      },
      include: { 
        pausas: true, // Inclui as pausas associadas à tarefa
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("tarefas: ", tarefas);
    return tarefas;
};

export const getTodosGantt = async (projectData) => {
    // console.log("projectData: ", projectData);
    const projetoUsuario = await prisma.projetoUsuario.findMany({
      where: { projeto_id: projectData.projectId },
    });
    const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
    const todos = await prisma.participacaoTarefa.findMany({
        where: { projetoUsuario_id: { in: projetoUsuarioIds } },
    });
    //console.log("todos: ", todos);
    const tarefaIds = todos.map(item => item.tarefa_id);
    const tarefas = await prisma.tarefa.findMany({
      where: {
        tarefa_id: {
          in: tarefaIds,
        },
        concludeAt: {
          not: null, // Filtra apenas as tarefas concluídas
        },
      },
      include: { 
        pausas: true, // Inclui as pausas associadas à tarefa
      },
      orderBy: { createdAt: "asc" },
    });
    //console.log("tarefas: ", tarefas);
    return tarefas;
};

export const addParticipante = async (data) => {
  //console.log("chamou o service addParti");
  //console.log("data: ", data);
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.userSessionId) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipanteeeeeeeeee: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(data.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    const projetoParticipante = await prisma.projetoUsuario.findMany({
      where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
      select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
    });
    //console.log("projetoParticipante: ", projetoParticipante);
    return await prisma.participacaoTarefa.create({
      data: { 
        projetoUsuario_id: parseInt(projetoParticipante[0].projetoUsuario_id),
        tarefa_id: parseInt(data.tarefa_id),
      }
    });
  }
}

export const getParticipantes = async (taskId) => {
  const participacaoTarefa = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(taskId) },
  });
  //console.log("participacaoTarefa: ", participacaoTarefa);
    const projetoUsuario = await prisma.projetoUsuario.findMany({
        where: { 
            projetoUsuario_id: {
              in: participacaoTarefa.map(item => item.projetoUsuario_id),
            },
        },
        include: {
            usuario: true,
        },
    });
    //console.log("projetoUsuario: ", projetoUsuario);
    return projetoUsuario;
}

export const excludeParticipantes = async (data) => {
  const projetoParticipante = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.userSessionId) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoParticipante.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { participacaoTarefa_id: true, tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipanteeeeeeeeee: ", tarefaParticipante);
  //console.log("isDoneTarefa: ", todoIsDone(data.tarefa_id));
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(data.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    const projetoParticipantee = await prisma.projetoUsuario.findMany({
      where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
      select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
    });
    const projetoUsuarioIds = projetoParticipantee.map(pu => pu.projetoUsuario_id);
    const tarefaParticipantee = await prisma.participacaoTarefa.findMany({
      where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
      select: { participacaoTarefa_id: true, tarefa_id: true, projetoUsuario_id: true },
    });
    //console.log("tarefaParticipanteeeeeeeeee: ", tarefaParticipantee);
    //console.log("projetoParticipante: ", projetoParticipante);
    return await prisma.participacaoTarefa.delete({
      where: { 
        participacaoTarefa_id: tarefaParticipantee[0].participacaoTarefa_id,
        projetoUsuario_id: parseInt(projetoParticipantee[0].projetoUsuario_id),
        tarefa_id: parseInt(data.tarefa_id),
      }
    });
  }
}

export const updateColorBarTodo = async (id, color) => {
    // console.log("id: ", id);
    // console.log("color: ", color);
    return await prisma.tarefa.update({
        where: { tarefa_id: parseInt(id) },
        data: { colorBar: color },
    });
};

export const updateDoingTodo = async (data) => {
  //console.log("data: ", data);
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  if (tarefaParticipante.length <= 0) {
    throw new Error("Você não participa desta tarefa!");
  }
  else {
    return await prisma.tarefa.update({
        where: { tarefa_id: parseInt(data.tarefa_id) },
        data: { doing: new Date() },
    });
  }
};

export const updateConcludeTodo = async (data) => {
  //console.log("data", data);
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  //console.log("projetoParticipante: ", projetoUsuario);
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  //console.log("projetoUsuarioIds: ", projetoUsuarioIds);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("projetoUsuairo: ", projetoUsuario);
  if (tarefaParticipante <= 0) {
    throw new Error("Você não participa desta tarefa!");
  }
  else {
    const todo = await prisma.tarefa.findUnique({
      where: { tarefa_id: parseInt(data.tarefa_id) },
      select: { doing: true },
    });
    if (todo.doing == null) {
      return await prisma.tarefa.update({
        where: { tarefa_id: parseInt(data.tarefa_id) },
        data: { doing: new Date(), concludeAt: new Date() },
      });
    }
    else {
      return await prisma.tarefa.update({
        where: { tarefa_id: parseInt(data.tarefa_id) },
        data: { concludeAt: new Date() },
      });
    }
  }
};

export const updateTodoDescription = async (descriptionData) => {
  // req.body.tarefa_id, req.body.descricao, req.usuario_id
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(descriptionData.projeto_id), usuario_id: parseInt(descriptionData.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  //console.log("projetoParticipante: ", projetoUsuario);
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  //console.log("projetoUsuarioIds: ", projetoUsuarioIds);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(descriptionData.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("projetoUsuairo: ", projetoUsuario);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(descriptionData.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else{
    return await prisma.tarefa.update({
      where: { tarefa_id: parseInt(descriptionData.tarefa_id) },
      data: { descricao: descriptionData.descricao },
    });
  }
};

export const getPendingTodos = async (userId) => {
  const sharedCategories = await prisma.sharedCategory.findMany({
    where: {
      userId: userId, // Verificar as categorias compartilhadas com o usuário
    },
    select: {
      categoryId: true, // Selecionar o ID da categoria compartilhada
    },
  });

  if (sharedCategories.length > 0) {
    for (let i = 0; i < sharedCategories.length; i++)
    {
      //console.log(sharedCategories[i].categoryId);
      const todos = await prisma.todoList.findMany({
        where:{
                categoryId: parseInt(sharedCategories[i].categoryId),
                concludeAt: null, // Filtra as tarefas não concluídas
                dateForConclusion: {
                    gt: new Date(), // Filtra as tarefas com data de conclusão futura (maior que a data atual)
                }
            },
        orderBy: { createdAt: "desc" },
      });
    
      // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
      const todosWithCategory = await Promise.all(
        todos.map(async (todo) => {
          if (todo.categoryId) {  // Verifica se existe uma categoria associada
            const category = await prisma.category.findUnique({
              select: { title: true },
              where: { id: todo.categoryId },
            });
            return { ...todo, category };  // Adiciona a categoria ao todo
          }
          return todo;  // Caso contrário, retorna o todo sem categoria
        })
      );
    
      return todosWithCategory;
    }
  }
  else
  {

    const todos = await prisma.todoList.findMany({
      where:{
              userId: userId,
              concludeAt: null, // Filtra as tarefas não concluídas
              dateForConclusion: {
                  gt: new Date(), // Filtra as tarefas com data de conclusão futura (maior que a data atual)
              }
          },
      orderBy: { createdAt: "desc" },
    });

    // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
    const todosWithCategory = await Promise.all(
      todos.map(async (todo) => {
        if (todo.categoryId) {  // Verifica se existe uma categoria associada
          const category = await prisma.category.findUnique({
            select: { title: true },
            where: { id: todo.categoryId },
          });
          return { ...todo, category };  // Adiciona a categoria ao todo
        }
        return todo;  // Caso contrário, retorna o todo sem categoria
      })
    );

    return todosWithCategory;
  }
};

export const getOverdueTodos = async (userId) => {
  const sharedCategories = await prisma.sharedCategory.findMany({
    where: {
      userId: userId, // Verificar as categorias compartilhadas com o usuário
    },
    select: {
      categoryId: true, // Selecionar o ID da categoria compartilhada
    },
  });

  if (sharedCategories.length > 0) {
    for (let i = 0; i < sharedCategories.length; i++)
    {
      //console.log(sharedCategories[i].categoryId);
      const todos = await prisma.todoList.findMany({
        where:{
                categoryId: parseInt(sharedCategories[i].categoryId),
                concludeAt: null, // Filtra as tarefas não concluídas
                dateForConclusion: {
                    lt: new Date(), // Filtra as tarefas com data de conclusão futura (maior que a data atual)
                }
            },
        orderBy: { createdAt: "desc" },
      });
    
      // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
      const todosWithCategory = await Promise.all(
        todos.map(async (todo) => {
          if (todo.categoryId) {  // Verifica se existe uma categoria associada
            const category = await prisma.category.findUnique({
              select: { title: true },
              where: { id: todo.categoryId },
            });
            return { ...todo, category };  // Adiciona a categoria ao todo
          }
          return todo;  // Caso contrário, retorna o todo sem categoria
        })
      );
    
      return todosWithCategory;
    }
  }
  else
  {

    const todos = await prisma.todoList.findMany({
      where:{
              userId: userId,
              concludeAt: null, // Filtra as tarefas não concluídas
              dateForConclusion: {
                  lt: new Date(), // Filtra as tarefas com data de conclusão futura (maior que a data atual)
              }
          },
      orderBy: { createdAt: "desc" },
    });

    // Verifica se algum todo possui uma categoria e, se existir, adiciona a categoria
    const todosWithCategory = await Promise.all(
      todos.map(async (todo) => {
        if (todo.categoryId) {  // Verifica se existe uma categoria associada
          const category = await prisma.category.findUnique({
            select: { title: true },
            where: { id: todo.categoryId },
          });
          return { ...todo, category };  // Adiciona a categoria ao todo
        }
        return todo;  // Caso contrário, retorna o todo sem categoria
      })
    );

    return todosWithCategory;
  }
};

export const addCategory = async (id, categoryId) => {
    return await prisma.todoList.update({
        where: { id: parseInt(id) },
        data:  { categoryId: parseInt(categoryId) },
    });
}

export const completeTodo = async (id) => {
  return await prisma.todoList.update({
    where: { id: parseInt(id) },
    data: { concludeAt: new Date() },
  });
};

export const updateTodoField = async (id, data) => {
  return await prisma.todoList.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteTodoById = async (todoDataDelete) => {
  //console.log("todoDataDelete: ", todoDataDelete);
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(todoDataDelete.projeto_id), usuario_id: parseInt(todoDataDelete.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(todoDataDelete.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipante: ", tarefaParticipante);
  if (tarefaParticipante <= 0) {
    throw new Error("Você não participa desta tarefa!");
  }
  else {
    return await prisma.tarefa.delete({
      where: { tarefa_id: parseInt(todoDataDelete.tarefa_id) },
    });
  }
};

export const addComent = async (dataComent) => {
  //console.log("dataComent: ", dataComent);
  const projetoParticipante = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(dataComent.projeto_id), usuario_id: parseInt(dataComent.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  //console.log("projetoParticipante: ", projetoParticipante);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(dataComent.tarefa_id), projetoUsuario_id: parseInt(projetoParticipante[0].projetoUsuario_id) },
    select: { participacaoTarefa_id: true, tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipante: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(dataComent.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    //console.log("tarefaParticipante: ", tarefaParticipante[0]);
    return await prisma.comentario.create({
      data: { 
        participacaoTarefa_id: parseInt(tarefaParticipante[0].participacaoTarefa_id),
        comentario: dataComent.comentario,
        usuario_id: parseInt(dataComent.usuario_id),
      }
    });
  }
}

export const getComentarios = async (taskId) => {
  //console.log("taskId: ", taskId);
  const participacaoTarefa = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(taskId) },
  });
  const participacaoTarefaIds = participacaoTarefa.map(pt => pt.participacaoTarefa_id);
  // const tarefaParticipante = await prisma.participacaoTarefa.findMany({
  //   where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
  //   select: { tarefa_id: true, projetoUsuario_id: true },
  // });
  const comentarios = await prisma.comentario.findMany({
    where: { participacaoTarefa_id: {in: participacaoTarefaIds} },
    include: {
      usuario: true,
    },
    orderBy: { data_hora: "desc" },
  });
  //console.log("comentarios: ", comentarios);
  return comentarios;
}

export const editComent = async (dataComent) => {
  console.log("dataComent: ", dataComent);
  const projetoParticipante = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(dataComent.projeto_id), usuario_id: parseInt(dataComent.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  console.log("projetoParticipanteeeeeeeee: ", projetoParticipante);
  const projetoUsuarioIds = projetoParticipante.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(dataComent.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  console.log("tarefaParticipanteeeeeeeee: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(dataComent.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    const comentario = await prisma.comentario.findMany({
      where: { usuario_id: dataComent.usuario_id }
    });
    if ( comentario <= 0 ) {
      throw new Error("Este comentario nao é seu!");
    }
    else {
      return await prisma.comentario.update({
        where: { comentario_id: parseInt(dataComent.comentario_id) },
        data: { 
          comentario: dataComent.comentario,
        }
      });
    }
  }
}

export const deleteComent = async (dataComent) => {
  console.log("dataComent: ", dataComent);
  const projetoParticipante = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(dataComent.projeto_id), usuario_id: parseInt(dataComent.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  console.log("projetoParticipanteeeeeeeee: ", projetoParticipante);
  const projetoUsuarioIds = projetoParticipante.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(dataComent.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  console.log("tarefaParticipanteeeeeeeee: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(dataComent.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    const comentario = await prisma.comentario.findMany({
      where: { usuario_id: dataComent.usuario_id }
    });
    if ( comentario <= 0 ) {
      throw new Error("Este comentario nao é seu!");
    }
    else {
      return await prisma.comentario.delete({
        where: { comentario_id: parseInt(dataComent.comentario_id) },
      });
    }
  }
}



export const addAttachment = async (data) => {
  // console.log("chamou o service addParti");
  console.log("data: ", data);
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(data.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    const arquivosCriados = await Promise.all(
      data.arquivos.map(arqs =>
        prisma.anexoTarefa.create({
          data: {
            tarefa_id: parseInt(data.tarefa_id),
            nome: arqs.nome,
            conteudo: arqs.conteudo,
            tipo: arqs.tipo,
          }
        })
      )
    );
    
    return arquivosCriados;
  }
}

export const listAttachment = async (tarefa_id) => {
  return await prisma.anexoTarefa.findMany({
    where: { tarefa_id: parseInt(tarefa_id) },
    orderBy: { created_at: "desc" },
  });
}

export const downloadAttachmentById = async (data) => {
  //console.log("data: ", data);
  const projetoParticipante = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  //console.log("projetoParticipanteeeeee: ", projetoParticipante);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: parseInt(projetoParticipante[0].projetoUsuario_id) },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  //console.log("tarefaParticipanteeeeeeeeee: ", tarefaParticipante);
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else {
    const file = await prisma.anexoTarefa.findUnique({
      where: { anexoTarefa_id: parseInt(data.anexoTarefa_id) }
    });
    return file;
  }
}

export const excludeAttachment = async (data) => {
  console.log("data: ", data);
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(data.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    return await prisma.anexoTarefa.delete({
      where: {
        anexoTarefa_id: parseInt(data.anexoTarefa_id),
        tarefa_id: parseInt(data.tarefa_id),
      }
    });
    //return response;
  }
}

export const updateTitle = async (data) => {
  const projetoUsuario = await prisma.projetoUsuario.findMany({
    where: { projeto_id: parseInt(data.projeto_id), usuario_id: parseInt(data.usuario_id) },
    select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
  });
  const projetoUsuarioIds = projetoUsuario.map(pu => pu.projetoUsuario_id);
  const tarefaParticipante = await prisma.participacaoTarefa.findMany({
    where: { tarefa_id: parseInt(data.tarefa_id), projetoUsuario_id: { in: projetoUsuarioIds } },
    select: { tarefa_id: true, projetoUsuario_id: true },
  });
  if (tarefaParticipante.length <= 0) {
    // console.log("tarefaParticipante.length <= 0", tarefaParticipante.length);
    throw new Error("Você não participa desta tarefa!");
  }
  else if (await todoIsDone(data.tarefa_id) == true){
    throw new Error ( "Esta tarefa já terminou!" );
  }
  else {
    return await prisma.tarefa.update({
        where: { tarefa_id: parseInt(data.tarefa_id) },
        data: { titulo: data.titulo },
    });
  }
};