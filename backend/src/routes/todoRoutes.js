import express from "express";
// import { upload } from "../server.js";
import { 
    createTodo, 
    listTodos,
    updateColorBar,
    updateDoing,
    updateConclude,
    updateDescription,
    listPendingTodos, 
    listOverdueTodos, 
    markTodoComplete, 
    addCategoryTodo, 
    updateTodoDateForConclusion, 
    updateTodoCategory, 
    updateTitleTodo, 
    deleteTodo,
    addComentTodo,
    listParticipantes,
    getCommentsTodo,
    addParticipantes,
    addAttachmentTodo,
    listAttachmentTodo,
    downloadAttachmentByIdTodo,
    editCommentTodo, 
    deleteComentTodo,
    excludeParticipantesTodo,
    exludeAttachmentTodo,
    listTodosGantt,
    pauseTask,
    continueTask
} from "../controllers/todoController.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

import { createTodoSchema, deleteTodoSchema, updateTodoCategorySchema, updateTodoDateForConclusionSchema, updateTodoDescriptionSchema, updateTodoTitleSchema } from "../validators/todoValidator.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Gerenciamento de tarefas
 */


/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Criar uma nova tarefa
 *     description: Cria uma tarefa associada a um projeto e vincula o usuário autenticado a ela.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - projetoId
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Implementar login com OAuth"
 *               descricao:
 *                 type: string
 *                 example: "Usar Google e GitHub para autenticação"
 *               projetoId:
 *                 type: integer
 *                 example: 3
 *               doing:
 *                 type: boolean
 *                 description: Indica se a tarefa já deve iniciar no status 'Doing'
 *                 example: true
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tarefa_id:
 *                   type: integer
 *                   example: 15
 *                 titulo:
 *                   type: string
 *                   example: "Implementar login com OAuth"
 *                 descricao:
 *                   type: string
 *                   example: "Usar Google e GitHub para autenticação"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-25T15:30:00.000Z"
 *                 doing:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2025-06-25T15:30:00.000Z"
 *       400:
 *         description: Erro ao criar a tarefa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao criar tarefa"
 */
router.post("/", authenticateToken, createTodo);

/**
 * @swagger
 * /todos/pauseTask:
 *   post:
 *     summary: Pausar uma tarefa
 *     description: Inicia o período de pausa de uma tarefa. Apenas participantes da tarefa ou donos do projeto podem pausar.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto ao qual a tarefa pertence
 *                 example: 3
 *               tarefa_id:
 *                 type: integer
 *                 description: ID da tarefa a ser pausada
 *                 example: 12
 *     responses:
 *       201:
 *         description: Pausa iniciada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pausaTarefa_id:
 *                   type: integer
 *                   example: 7
 *                 tarefa_id:
 *                   type: integer
 *                   example: 12
 *                 inicioPausa:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-25T15:45:00.000Z"
 *       400:
 *         description: Erro ao pausar a tarefa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você não participa desta tarefa!"
 */
router.post("/pauseTask", authenticateToken, pauseTask);

/**
 * @swagger
 * /todos/continueTask:
 *   put:
 *     summary: Continuar uma tarefa pausada
 *     description: Finaliza o período de pausa de uma tarefa. Apenas participantes da tarefa ou donos do projeto podem continuar.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto ao qual a tarefa pertence
 *                 example: 3
 *               tarefa_id:
 *                 type: integer
 *                 description: ID da tarefa a ser continuada
 *                 example: 12
 *     responses:
 *       201:
 *         description: Pausa finalizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pausa_id:
 *                   type: integer
 *                   example: 7
 *                 tarefa_id:
 *                   type: integer
 *                   example: 12
 *                 fimPausa:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-25T16:00:00.000Z"
 *       400:
 *         description: Erro ao continuar a tarefa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você não participa desta tarefa!"
 */
router.put("/continueTask", authenticateToken, continueTask);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Listar tarefas de um projeto
 *     description: Retorna todas as tarefas associadas ao projeto informado, incluindo pausas vinculadas. Apenas membros do projeto podem visualizar.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idProjeto
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto cujas tarefas devem ser listadas
 *         example: 3
 *     responses:
 *       200:
 *         description: Lista de tarefas recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tarefa_id:
 *                     type: integer
 *                     example: 12
 *                   titulo:
 *                     type: string
 *                     example: "Criar tela de login"
 *                   descricao:
 *                     type: string
 *                     example: "Implementar a tela de login com validação"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-25T13:20:00.000Z"
 *                   doing:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *                   done:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *                   pausas:
 *                     type: array
 *                     description: Lista de pausas associadas à tarefa
 *                     items:
 *                       type: object
 *                       properties:
 *                         pausa_id:
 *                           type: integer
 *                           example: 5
 *                         inicioPausa:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-25T14:00:00.000Z"
 *                         fimPausa:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *       400:
 *         description: Erro ao listar as tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao listar tarefas"
 */
router.get("/", authenticateToken, listTodos);

/**
 * @swagger
 * /todos/todosGantt:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *       400:
 *         description: Erro ao listar tarefas
 */
router.get("/todosGantt", authenticateToken, listTodosGantt);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Exclui uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tarefa excluída com sucesso
 *       400:
 *         description: Erro ao excluir a tarefa
 */
router.delete("/", authenticateToken, deleteTodo);

/**
 * @swagger
 * /todos/listParticipantes/{id}:
 *   get:
 *     summary: Retorna os participantes de uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *       404:
 *         description: Projeto não encontrado
 */
router.get("/listParticipantes/:id", authenticateToken, listParticipantes);

router.patch("/colorBar", authenticateToken, updateColorBar);
router.patch("/doing", authenticateToken, updateDoing);
router.patch("/conclude", authenticateToken, updateConclude);

/**
 * @swagger
 * /todos/{id}/description:
 *   put:
 *     summary: Atualiza a descrição de uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Descrição atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a descrição
 */
router.put("/description/:id", authenticateToken, updateDescription);

/**
 * @swagger
 * /todos/pending:
 *   get:
 *     summary: Lista todas as tarefas pendentes
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Lista de tarefas pendentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   concludeAt:
 *                     type: string
 *                     format: date-time
 *                   completed:
 *                     type: boolean
 *       400:
 *         description: Erro ao listar tarefas pendentes
 */
router.get("/pending", authenticateToken, listPendingTodos);

/**
 * @swagger
 * /todos/overdue:
 *   get:
 *     summary: Lista todas as tarefas atrasadas
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Lista de tarefas atrasadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   concludeAt:
 *                     type: string
 *                     format: date-time
 *                   completed:
 *                     type: boolean
 *       400:
 *         description: Erro ao listar tarefas atrasadas
 */
router.get("/overdue", authenticateToken, listOverdueTodos);

/**
 * @swagger
 * /todos/{id}/addCategory:
 *   patch:
 *     summary: "Adiciona uma categoria a uma todoList"
 *     description: "Essa rota permite adicionar uma categoria a uma todoList existente."
 *     operationId: addCategoryTodo
 *     tags: [Todos]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID da todoList"
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: "ID da categoria a ser associada à todoList"
 *                 example: 2
 *     responses:
 *       '200':
 *         description: "Categoria adicionada com sucesso à todoList"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Minha ToDo List"
 *                 description:
 *                   type: string
 *                   example: "Descrição da minha todoList"
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Trabalho"
 *       '400':
 *         description: "Requisição inválida, falta parâmetro ou dados incorretos"
 *       '404':
 *         description: "TodoList ou categoria não encontrada"
 *       '500':
 *         description: "Erro no servidor ao processar a requisição"
 */
router.patch("/:id/addCategory", authenticateToken, addCategoryTodo);

/**
 * @swagger
 * /todos/{id}/complete:
 *   patch:
 *     summary: Marca uma tarefa como concluída
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa a ser concluída
 *     responses:
 *       200:
 *         description: Tarefa marcada como concluída
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 concludeAt:
 *                   type: string
 *                   format: date-time
 *                 completed:
 *                   type: boolean
 *       400:
 *         description: Erro ao marcar a tarefa como concluída
 */
router.patch("/:id/complete", authenticateToken, markTodoComplete);

/**
 * @swagger
 * /todos/{id}/description:
 *   put:
 *     summary: Atualiza a descrição de uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Descrição atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a descrição
 */
// router.put("/:id/description", authenticateToken, validate(updateTodoDescriptionSchema), updateTodoDescription);

/**
 * @swagger
 * /todos/{id}/dateForConclusion:
 *   put:
 *     summary: Atualiza a data de conclusão de uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateForConclusion:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Data de conclusão atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a data de conclusão
 */
router.put("/:id/dateForConclusion", authenticateToken, validate(updateTodoDateForConclusionSchema), updateTodoDateForConclusion);

/**
 * @swagger
 * /todos/{id}/category:
 *   put:
 *     summary: Atualiza ou remove a categoria de uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: ID da categoria (null para remover)
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a categoria
 */
router.put("/:id/category", authenticateToken, validate(updateTodoCategorySchema), updateTodoCategory);

/**
 * @swagger
 * /todos/{id}/title:
 *   put:
 *     summary: Atualiza o título de uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Título atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar o título
 */
router.put("/title", authenticateToken, updateTitleTodo);



/**
 * @swagger
 * /todos/addComentTodo:
 *   post:
 *     summary: Adiciona um comentário a uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *               - comentario
 *             properties:
 *               tarefa_id:
 *                 type: integer
 *                 example: 1
 *               comentario:
 *                 type: string
 *                 example: "Esse é um comentário novo."
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Comentário adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comentário adicionado com sucesso
 *                 todoAtualizado:
 *                   type: object
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/addComentTodo", authenticateToken, addComentTodo);

/**
 * @swagger
 * /todos/getComments/{id}:
 *   get:
 *     summary: Retorna os comentários de uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa para a qual se deseja listar os comentários
 *     responses:
 *       200:
 *         description: Lista de comentários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   comentario_id:
 *                     type: integer
 *                     example: 5
 *                   texto:
 *                     type: string
 *                     example: "Comentário de exemplo"
 *                   data_hora:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-07T12:00:00Z"
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "João da Silva"
 *                       email:
 *                         type: string
 *                         example: "joao@email.com"
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/getComments/:id", authenticateToken, getCommentsTodo);

/**
 * @swagger
 * /todos/editComentTodo:
 *   put:
 *     summary: Edita um comentário de uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - tarefa_id
 *               - projeto_id
 *               - comentario
 *               - comentario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 4
 *               tarefa_id:
 *                 type: integer
 *                 example: 2
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               comentario_id:
 *                 type: integer
 *                 example: 10
 *               comentario:
 *                 type: string
 *                 example: "Comentário editado com sucesso."
 *     responses:
 *       201:
 *         description: Comentário editado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comentario_id:
 *                   type: integer
 *                   example: 10
 *                 comentario:
 *                   type: string
 *                   example: "Comentário editado com sucesso."
 *                 usuario_id:
 *                   type: integer
 *                   example: 4
 *                 participacaoTarefa_id:
 *                   type: integer
 *                   example: 8
 *                 data_hora:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-07T12:34:56Z"
 *       400:
 *         description: Erro de validação ou usuário não autorizado a editar o comentário
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/editComentTodo", authenticateToken, editCommentTodo);

/**
 * @swagger
 * /todos/deleteComentTodo:
 *   delete:
 *     summary: Exclui um comentário de uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - tarefa_id
 *               - projeto_id
 *               - comentario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 4
 *               tarefa_id:
 *                 type: integer
 *                 example: 2
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               comentario_id:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Comentário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comentario_id:
 *                   type: integer
 *                   example: 10
 *                 comentario:
 *                   type: string
 *                   example: "Comentário excluído"
 *                 usuario_id:
 *                   type: integer
 *                   example: 4
 *                 participacaoTarefa_id:
 *                   type: integer
 *                   example: 8
 *                 data_hora:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-07T12:34:56Z"
 *       400:
 *         description: Erro de validação ou usuário não autorizado a excluir o comentário
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/deleteComentTodo", authenticateToken, deleteComentTodo);

/**
 * @swagger
 * /todos/addParticipantes:
 *   put:
 *     summary: Adiciona um ou mais participantes a uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *               - participantes_ids
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               tarefa_id:
 *                 type: integer
 *                 example: 5
 *               participantes_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 4]
 *     responses:
 *       201:
 *         description: Participantes adicionados com sucesso à tarefa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Erro de validação, permissão negada ou tarefa finalizada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/addParticipantes", authenticateToken, addParticipantes);

/**
 * @swagger
 * /todos/listParticipantes/{id}:
 *   get:
 *     summary: Lista os participantes atribuídos a uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Lista de participantes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projetoUsuario_id:
 *                     type: integer
 *                     example: 7
 *                   projeto_id:
 *                     type: integer
 *                     example: 1
 *                   usuario_id:
 *                     type: integer
 *                     example: 3
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "Maria Oliveira"
 *                       email:
 *                         type: string
 *                         example: "maria@exemplo.com"
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/listParticipantes/:id", authenticateToken, listParticipantes);

/**
 * @swagger
 * /todos/excludeParticipante:
 *   delete:
 *     summary: Remove um participante de uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *               - participante_id
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               tarefa_id:
 *                 type: integer
 *                 example: 5
 *               participante_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Participante removido com sucesso da tarefa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participacaoTarefa_id:
 *                   type: integer
 *                   example: 12
 *                 projetoUsuario_id:
 *                   type: integer
 *                   example: 7
 *                 tarefa_id:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Erro de validação, tentativa de excluir o único participante ou falta de permissão
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/excludeParticipante", authenticateToken, excludeParticipantesTodo)

/**
 * @swagger
 * /todos/addAttachment:
 *   post:
 *     summary: Adiciona um ou mais arquivos anexos a uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *               - arquivos
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               tarefa_id:
 *                 type: integer
 *                 example: 7
 *               arquivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Arquivo(s) anexado(s) com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anexo_id:
 *                     type: integer
 *                     example: 15
 *                   tarefa_id:
 *                     type: integer
 *                     example: 7
 *                   nome:
 *                     type: string
 *                     example: "relatorio_final.pdf"
 *                   tipo:
 *                     type: string
 *                     example: "application/pdf"
 *                   conteudo:
 *                     type: string
 *                     format: binary
 *       400:
 *         description: Erro de validação, permissão negada ou tarefa finalizada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/addAttachment", authenticateToken, upload.array("arquivos"), addAttachmentTodo);

/**
 * @swagger
 * /todos/listAttachment/{id}:
 *   get:
 *     summary: Lista os arquivos anexados a uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       201:
 *         description: Lista de anexos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anexo_id:
 *                     type: integer
 *                     example: 12
 *                   tarefa_id:
 *                     type: integer
 *                     example: 5
 *                   nome:
 *                     type: string
 *                     example: "documento_final.pdf"
 *                   tipo:
 *                     type: string
 *                     example: "application/pdf"
 *                   conteudo:
 *                     type: string
 *                     format: binary
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-07T14:22:30Z"
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/listAttachment/:id", authenticateToken, listAttachmentTodo);

/**
 * @swagger
 * /todos/downloadAttachment/{id}:
 *   get:
 *     summary: Baixa ou exibe um arquivo anexo de uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anexo da tarefa
 *       - in: query
 *         name: projeto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto ao qual pertence a tarefa
 *       - in: query
 *         name: tarefa_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa à qual o anexo está vinculado
 *     responses:
 *       200:
 *         description: Arquivo retornado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Requisição inválida ou permissão negada
 *       401:
 *         description: Token inválido ou não fornecido
 *       404:
 *         description: Anexo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/downloadAttachment/:id', authenticateToken, downloadAttachmentByIdTodo);

/**
 * @swagger
 * /todos/exludeAttachment:
 *   delete:
 *     summary: Exclui um anexo de uma tarefa (Todo)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projeto_id
 *               - tarefa_id
 *               - anexoTarefa_id
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               tarefa_id:
 *                 type: integer
 *                 example: 5
 *               anexoTarefa_id:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       201:
 *         description: Anexo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: binary
 *               example: Conteúdo removido do anexo
 *       400:
 *         description: Erro de validação ou permissão negada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/exludeAttachment', authenticateToken, exludeAttachmentTodo);

export default router;