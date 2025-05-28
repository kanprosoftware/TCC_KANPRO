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
 *   description: Gerenciamento de projetos
 */
/**
 * @swagger
 * /project/listProjectsByDevId:
 *   get:
 *     summary: Lista todos os projetos
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Lista de projetos
 *       400:
 *         description: Erro ao listar projetos
 */
router.get("/listProjectsByDevId", authenticateToken, getAllProjectsByDevId);


router.get("/listProjectsTeamByDevId", authenticateToken, getAllProjectsTeamByDevId);

/**
 * @swagger
 * /project/listProjects:
 *   get:
 *     summary: Lista todos os projetos
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Lista de projetos
 *       400:
 *         description: Erro ao listar projetos
 */
router.get("/listProjects", authenticateToken, getAllProjects);

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Retorna um projeto específico
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *       404:
 *         description: Projeto não encontrado
 */
router.get("/:id", authenticateToken, getProjectsById);

/**
 * @swagger
 * /project/createProject:
 *   post:
 *     summary: Cria um novo projeto
 *     tags: [Projects]
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

router.post("/addParticipantesProject", authenticateToken, addParticipantesProject);

/**
 * @swagger
 * /project/listParticipantes/{id}:
 *   get:
 *     summary: Retorna os participantes de um projeto específico
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *       404:
 *         description: Projeto não encontrado
 */
router.get("/listParticipantes/:id", authenticateToken, listParticipantes);

router.delete("/removeParticipante", authenticateToken, removeParticipantes);

router.delete("/deleteProject", authenticateToken, deleteProject);

/**
 * @swagger
 * /project/detaisProject/{id}:
 *   get:
 *     summary: Retorna os detalhes de um projeto específico
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *       404:
 *         description: Projeto não encontrado
 */
router.get("/detaisProject/:id", authenticateToken, detailsProject);

router.get("/devSugestionProject/:id", authenticateToken, devSugestionProject);

router.put("/updateNameProject", authenticateToken, updateNameProject);

router.put("/updateDescriptionProject", authenticateToken, updateDescriptionProject);

router.put("/updateTecsProject", authenticateToken, updateTecsProject);

router.post("/addAttachment", authenticateToken, upload.array("arquivos"), addAttachmentProject);

router.get("/listAttachment/:id", authenticateToken, listAttachmentProject);

router.get('/downloadAttachment/:id', authenticateToken, downloadAttachmentByIdProject);

router.delete('/exludeAttachment', authenticateToken, exludeAttachmentProject);

export default router;