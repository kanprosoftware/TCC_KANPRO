// Importa as dependências
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import sharedRoutes from "./routes/sharedRoutes.js";
import tecnologyRoutes from "./routes/tecnologyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
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
      title: "Todo List API",
      version: "1.0.0",
      description: "API para gerenciamento de tarefas, categorias e compartilhamentos.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/server.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

// Middlewares
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // ou a porta do seu frontend
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.APP_SECRET === "development", // true só em produção com HTTPS
    httpOnly: true, // protege contra scripts do navegador
    maxAge: 1000 * 60 * 60 * 24 // 1 dia
  }
}));

// Inicializa o Passport
configurePassport(passport);
app.use(passport.initialize());

app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

// Rotas
app.use("/auth", authRoutes);
app.use("/auth", oauthRoutes);
app.use("/todos", todoRoutes);
app.use("/categories", categoryRoutes);
app.use("/shared", sharedRoutes);
app.use("/tecnologys", tecnologyRoutes);
app.use("/project", projectRoutes);
app.use("/profile", profileRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/**
 * @swagger
 * tags:
 *   name: Health Check
 *   description: Rota de verificação de servidor
 */

/**
 * @swagger
 * /healthcheck:
 *   get:
 *     summary: Verifica se o servidor está no ar
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/healthcheck', (req, res) => res.send('OK! Usuario logado: ' + req.session.token));

// Inicializa servidor
app.listen(3000, () => console.log("Server iniciou na porta 3000"));
