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
 *     summary: Cria uma nova tarefa
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: integer
 *               developerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 */
router.post("/", authenticateToken, createTodo);

router.post("/pauseTask", authenticateToken, pauseTask);

router.put("/continueTask", authenticateToken, continueTask);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *       400:
 *         description: Erro ao listar tarefas
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

router.get("/getComments/:id", authenticateToken, getCommentsTodo);

router.put("/editComentTodo", authenticateToken, editCommentTodo);

router.delete("/deleteComentTodo", authenticateToken, deleteComentTodo);

router.put("/addParticipantes", authenticateToken, addParticipantes);
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

router.delete("/excludeParticipante", authenticateToken, excludeParticipantesTodo)

router.post("/addAttachment", authenticateToken, upload.array("arquivos"), addAttachmentTodo);

router.get("/listAttachment/:id", authenticateToken, listAttachmentTodo);

router.get('/downloadAttachment/:id', authenticateToken, downloadAttachmentByIdTodo);

router.delete('/exludeAttachment', authenticateToken, exludeAttachmentTodo);

// router.delete("/exludeAttachment", authenticateToken, excludeAttachmentTodo);
export default router;