// Importa as dependências
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import tecnologyRoutes from "./routes/tecnologyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import validateTokenRoutes from "./routes/validateTokenRoutes.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import configurePassport from "./config/passport.js";
import { profile } from "./controllers/profileController.js";
import multer from "multer";

// Carrega variáveis de ambiente
dotenv.config();
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
  console.log("Running in development mode");
  dotenv.config({ path: '.env.development' });
} else if (NODE_ENV === 'production') {
  console.log("Running in production mode");
  dotenv.config({ path: '.env.production' });
}

// Instancia do express
const app = express();

// Configurações do Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KANPRO API",
      version: "1.0.0",
      description: `
        API REST para do sistema KANPRO, uma plataforma de gestão de projetos e colaboração. 
        Permite o gerenciamento de tarefas, projetos, usuários, autenticação (incluindo OAuth com Google, GitHub, Microsoft e LinkedIn), perfis de usuário, recuperação e atualização de senha, além do controle de permissões e papéis dos usuários.

        Funcionalidades principais:
        - Autenticação segura com JWT e OAuth
        - Gerenciamento de projetos com atribuição de equipes e tecnologias
        - Controle de perfis e habilidades dos usuários
        - Upload e atualização de fotos de perfil
        - Recuperação e redefinição de senhas via e-mail
        - Atualização de informações pessoais como nome, e-mail e senha
        - Rotas protegidas por autenticação e autorização
      `,
      contact: {
        name: "KANPRO Software",
        email: "kanprosoftware@gmail.com",
        url: "https://github.com/kanprosoftware", 
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/server.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

// Middlewares
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.APP_SECRET === "development", 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

// Inicializa o Passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

// Rotas
app.use("/auth", authRoutes);
app.use("/auth", oauthRoutes);
app.use("/todos", todoRoutes);
app.use("/tecnologys", tecnologyRoutes);
app.use("/project", projectRoutes);
app.use("/profile", profileRoutes);
app.use("/", validateTokenRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/**
 * @swagger
 * tags:
 *   name: Health Check
 *   description: Rotas para verificação do status e saúde do servidor
 */

/**
 * @swagger
 * /healthcheck:
 *   get:
 *     summary: Verifica o status do servidor
 *     description: Endpoint para confirmar se o servidor está ativo e respondendo.
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: Servidor está ativo e funcionando normalmente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 */
app.get('/healthcheck', (req, res) => res.json({ status: 'OK' }));

// Inicializa servidor
app.listen(3000, () => console.log("Server iniciou na porta 3000"));
