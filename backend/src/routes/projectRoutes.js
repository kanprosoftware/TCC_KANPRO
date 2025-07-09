import express from "express";
import { validate } from "../middlewares/validationMiddleware.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getAllProjectsByDevId, 
         getAllProjectsTeamByDevId, 
         getAllProjects, 
         getProjectsById, 
         createNewProject,
         listParticipantes,
         deleteProject,
         detailsProject,
         devSugestionProject,
         addParticipantesProject,
         removeParticipantes,
         updateNameProject,
         updateDescriptionProject,
         updateTecsProject,
         listAttachmentProject,
         addAttachmentProject,
         downloadAttachmentByIdProject,
         exludeAttachmentProject
        } from "../controllers/projectController.js";
import upload from "../middlewares/multerMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gerenciamento completo dos projetos, incluindo criação, atualização, participantes e tecnologias
 */

/**
 * @swagger
 * /project/listProjectsByDevId:
 *   get:
 *     summary: Listar todos os projetos criados pelo usuário autenticado
 *     description: Retorna a lista de projetos onde o usuário autenticado é o proprietário (owner).
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projeto:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "Sistema de Recomendação"
 *                       descricao:
 *                         type: string
 *                         example: "Projeto acadêmico para recomendação social"
 *                       tecnologias:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             tecnologia:
 *                               type: object
 *                               properties:
 *                                 nome:
 *                                   type: string
 *                                   example: "Node.js"
 *                       projetoUsuarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             usuario:
 *                               type: object
 *                               properties:
 *                                 nome:
 *                                   type: string
 *                                   example: "João Silva"
 *       401:
 *         description: Token JWT ausente ou inválido
 *       500:
 *         description: Erro interno ao buscar os projetos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get("/listProjectsByDevId", authenticateToken, getAllProjectsByDevId);

/**
 * @swagger
 * /project/listProjectsTeamByDevId:
 *   get:
 *     summary: Listar projetos em que o usuário participa como membro da equipe
 *     description: Retorna todos os projetos em que o usuário autenticado faz parte da equipe, mas não é o criador (owner).
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de projetos da equipe retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projeto:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "Sistema de Recomendação"
 *                       descricao:
 *                         type: string
 *                         example: "Projeto acadêmico para recomendação social"
 *                       tecnologias:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             tecnologia:
 *                               type: object
 *                               properties:
 *                                 nome:
 *                                   type: string
 *                                   example: "Node.js"
 *                       projetoUsuarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             usuario:
 *                               type: object
 *                               properties:
 *                                 nome:
 *                                   type: string
 *                                   example: "João Silva"
 *       401:
 *         description: Token JWT ausente ou inválido
 *       500:
 *         description: Erro interno ao buscar os projetos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get("/listProjectsTeamByDevId", authenticateToken, getAllProjectsTeamByDevId);

/**
 * @swagger
 * /project/listProjects:
 *   get:
 *     summary: Listar todos os projetos da plataforma
 *     description: Retorna todos os projetos cadastrados no sistema, incluindo suas tecnologias e desenvolvedores.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projeto_id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Projeto X
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   tecnologias:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         tecnologia_id:
 *                           type: integer
 *                           example: 3
 *                         nome:
 *                           type: string
 *                           example: Vue.js
 *                   desenvolvedor:
 *                     type: object
 *                     properties:
 *                       usuario_id:
 *                         type: integer
 *                         example: 7
 *                       nome:
 *                         type: string
 *                         example: João Silva
 *       500:
 *         description: Erro interno ao listar os projetos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/listProjects", authenticateToken, getAllProjects);

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Obter projeto por ID
 *     description: Retorna os detalhes de um projeto específico com suas tecnologias associadas.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projeto_id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Sistema Kanban"
 *                 descricao:
 *                   type: string
 *                   example: "Projeto para gerenciamento de tarefas estilo Trello"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-06-01T12:00:00.000Z"
 *                 tecnologias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tecnologia:
 *                         type: object
 *                         properties:
 *                           tecnologia_id:
 *                             type: integer
 *                             example: 3
 *                           nome:
 *                             type: string
 *                             example: "Vue.js"
 *       404:
 *         description: Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Project not found."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get("/:id", authenticateToken, getProjectsById);

/**
 * @swagger
 * /project/createProject:
 *   post:
 *     summary: Cria um novo projeto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Novo Projeto"
 *               descricao:
 *                 type: string
 *                 example: "Descrição do projeto"
 *               tecnologias:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["SQL", "C#", "COBOL"]
 *             creatorProject:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - nome
 *               - descricao
 *               - tecnologias
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 */
//router.post("/createProject", authenticateToken, validate(createProject), createProject);
router.post("/createProject", authenticateToken, createNewProject);

/**
 * @swagger
 * /project/addParticipantesProject:
 *   post:
 *     summary: Adicionar participantes a um projeto
 *     description: Adiciona uma lista de usuários como participantes de um projeto existente.
 *     tags: [Projects]
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
 *               - participantes_ids
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto ao qual os participantes serão adicionados
 *                 example: 5
 *               participantes_ids:
 *                 type: array
 *                 description: Lista de IDs dos usuários participantes
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 4]
 *     responses:
 *       200:
 *         description: Participantes adicionados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 count: 3
 *       400:
 *         description: Erro ao adicionar participantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao adicionar participantes ao projeto"
 */
router.post("/addParticipantesProject", authenticateToken, addParticipantesProject);

/**
 * @swagger
 * /project/listParticipantes/{id}:
 *   get:
 *     summary: Listar participantes de um projeto
 *     description: Retorna todos os usuários participantes (colaboradores) de um projeto específico.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *           example: 10
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
 *                   projeto_id:
 *                     type: integer
 *                     example: 10
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       usuario_id:
 *                         type: integer
 *                         example: 5
 *                       nome:
 *                         type: string
 *                         example: "João da Silva"
 *                       email:
 *                         type: string
 *                         example: "joao@email.com"
 *       400:
 *         description: Erro ao buscar participantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar participantes"
 */
router.get("/listParticipantes/:id", authenticateToken, listParticipantes);

/**
 * @swagger
 * /project/removeParticipante:
 *   delete:
 *     summary: Remover participante de um projeto
 *     description: Remove um participante específico de um projeto com base nos IDs fornecidos.
 *     tags: [Projects]
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
 *               - usuario_id
 *               - projetoUsuario_id
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 description: ID do participante que será removido
 *                 example: 5
 *               projetoUsuario_id:
 *                 type: integer
 *                 description: ID do registro de associação projeto-usuário
 *                 example: 8
 *     responses:
 *       200:
 *         description: Participante removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projetoUsuario_id:
 *                   type: integer
 *                   example: 8
 *                 projeto_id:
 *                   type: integer
 *                   example: 1
 *                 usuario_id:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erro ao remover participante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao remover participante!"
 */
router.delete("/removeParticipante", authenticateToken, removeParticipantes);

/**
 * @swagger
 * /project/deleteProject:
 *   delete:
 *     summary: Excluir um projeto
 *     description: Exclui um projeto do sistema. Apenas o usuário participante do projeto pode excluí-lo.
 *     tags: [Projects]
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
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto a ser excluído
 *                 example: 12
 *     responses:
 *       200:
 *         description: Projeto excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project deleted successfully."
 *       403:
 *         description: Usuário não participa do projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Voce não participa deste projeto."
 *       500:
 *         description: Erro interno ao excluir projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.delete("/deleteProject", authenticateToken, deleteProject);

/**
 * @swagger
 * /project/detailsProject:
 *   get:
 *     summary: Retorna os detalhes de um projeto específico
 *     description: Retorna os dados do projeto, incluindo tecnologias, desde que o usuário participe dele.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projeto_id
 *         in: query
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projeto_id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   tecnologias:
 *                     type: array
 *                     items:
 *                       type: object
 *       403:
 *         description: Usuário não participa deste projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Voce não participa deste projeto."
 *       500:
 *         description: Erro interno ao buscar projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get("/detaisProject/:id", authenticateToken, detailsProject);

/**
 * @swagger
 * /project/devSugestionProject/{id}:
 *   get:
 *     summary: Sugestão de desenvolvedores para um projeto
 *     description: |
 *       Retorna duas listas:
 *         - `sugestaoDevs`: Desenvolvedores com habilidades que coincidem com as tecnologias do projeto.
 *         - `desenvolvedoresRestantes`: Demais desenvolvedores, excluindo o dono do projeto.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto para gerar sugestões
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Sugestões de desenvolvedores retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sugestaoDevs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       usuario_id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                 desenvolvedoresRestantes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       usuario_id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *       500:
 *         description: Erro interno ao buscar sugestões
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get("/devSugestionProject/:id", authenticateToken, devSugestionProject);

/**
 * @swagger
 * /project/updateNameProject:
 *   put:
 *     summary: Renomear projeto
 *     description: Atualiza o nome de um projeto específico com base no ID informado.
 *     tags: [Projects]
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
 *               - nomeProjeto
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto a ser renomeado
 *                 example: 1
 *               nomeProjeto:
 *                 type: string
 *                 description: Novo nome do projeto
 *                 example: "Kanban Redesign"
 *     responses:
 *       200:
 *         description: Nome do projeto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projeto_id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Kanban Redesign"
 *       500:
 *         description: Erro ao atualizar o nome do projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao renomear projeto!"
 */
router.put("/updateNameProject", authenticateToken, updateNameProject);

/**
 * @swagger
 * /project/updateDescriptionProject:
 *   put:
 *     summary: Atualiza a descrição de um projeto
 *     tags: [Projects]
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
 *               - descricaoProjeto
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 example: 1
 *               descricaoProjeto:
 *                 type: string
 *                 example: "Descrição atualizada do projeto KanPro."
 *     responses:
 *       200:
 *         description: Descrição atualizada com sucesso
 *       500:
 *         description: Erro ao atualizar a descrição
 */
router.put("/updateDescriptionProject", authenticateToken, updateDescriptionProject);

/**
 * @swagger
 * /project/updateTecsProject:
 *   put:
 *     summary: Atualiza as tecnologias de um projeto
 *     description: Substitui todas as tecnologias associadas a um projeto pelas novas informadas.
 *     tags: [Projects]
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
 *               - tecnologias
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto que será atualizado
 *                 example: 1
 *               tecnologias:
 *                 type: array
 *                 description: Lista de IDs das novas tecnologias a serem associadas
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Tecnologias atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Erro ao atualizar as tecnologias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar as tecnologias!"
 */
router.put("/updateTecsProject", authenticateToken, updateTecsProject);

/**
 * @swagger
 * /project/addAttachment:
 *   post:
 *     summary: Adiciona anexos a um projeto
 *     description: Faz o upload de um ou mais arquivos e os associa a um projeto específico.
 *     tags: [Projects]
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
 *               - arquivos
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 description: ID do projeto ao qual os arquivos serão anexados
 *                 example: 1
 *               arquivos:
 *                 type: array
 *                 description: Arquivos a serem enviados
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Arquivo(s) anexado(s) com sucesso ao projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anexo_id:
 *                     type: integer
 *                     example: 10
 *                   projeto_id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: "documento.pdf"
 *                   tipo:
 *                     type: string
 *                     example: "application/pdf"
 *       400:
 *         description: Erro ao adicionar anexos ao projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falha ao processar os arquivos enviados."
 */
router.post("/addAttachment", authenticateToken, upload.array("arquivos"), addAttachmentProject);

/**
 * @swagger
 * /project/listAttachment/{id}:
 *   get:
 *     summary: Lista os anexos de um projeto
 *     description: Retorna todos os arquivos anexados a um projeto específico.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
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
 *                     example: 5
 *                   projeto_id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: "relatorio.pdf"
 *                   tipo:
 *                     type: string
 *                     example: "application/pdf"
 *                   conteudo:
 *                     type: string
 *                     format: binary
 *       400:
 *         description: Erro ao buscar os anexos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar os anexos"
 */
router.get("/listAttachment/:id", authenticateToken, listAttachmentProject);

/**
 * @swagger
 * /project/downloadAttachment/{id}:
 *   get:
 *     summary: Download de anexo do projeto
 *     description: Retorna o conteúdo de um anexo (imagem, PDF ou outro arquivo) de um projeto, exibindo inline se for PDF ou imagem.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anexo
 *       - in: query
 *         name: projeto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto ao qual o anexo pertence
 *     responses:
 *       200:
 *         description: Arquivo retornado com sucesso
 *         content:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Erro ao manipular o arquivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao manipular arquivo"
 */
router.get('/downloadAttachment/:id', authenticateToken, downloadAttachmentByIdProject);

/**
 * @swagger
 * /project/exludeAttachment:
 *   delete:
 *     summary: Excluir anexo de um projeto
 *     description: Remove um anexo específico associado a um projeto.
 *     tags: [Projects]
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
 *               - anexo_id
 *             properties:
 *               projeto_id:
 *                 type: integer
 *                 example: 12
 *               anexo_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Anexo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Arquivo excluído"
 *       400:
 *         description: Erro ao excluir o anexo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao excluir anexo"
 */
router.delete('/exludeAttachment', authenticateToken, exludeAttachmentProject);

export default router;