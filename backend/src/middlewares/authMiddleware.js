import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  console.log("Autenticando token...");
  const token = 
    req.session?.token || // sessão
    req.query?.token ||   // query string
    req.headers?.authorization?.split(" ")[1]; // Authorization: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "Token de acesso é obrigatório." });
  }

  try {
    //console.log("token", token);
    //console.log("jwt_secret", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded token:", jwt.verify(token, process.env.JWT_SECRET));

    if (!decoded?.usuario_id) {
      return res.status(403).json({ error: "Token inválido." });
    }

    req.usuario_id = decoded.usuario_id;
    req.nomeDesenvolvedor = decoded.nomeDesenvolvedor;
    req.token = token;

    next(); 
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Erro de JWT:", error.message);  // Erro de JWT específico
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expirado:", error.message);  // Token expirado
    } else {
      console.error("Erro desconhecido:", error.message);  // Outros erros
    }
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

export const authenticateTempToken = (req, res, next) => {
  console.log("Autenticando token temporário...");
  // console.log("req:", req);
  const token =
    req.session?.token ||  // sessão, no caso de estar armazenado na sessão
    req.query?.token ||        // query string
    req.headers?.authorization?.split(" ")[1] || // Authorization: Bearer <token>
    req.body?.token; 
    console.log("Token temporário recebido:", token);

  if (!token) {
    return res.status(401).json({ error: "Token temporário é obrigatório." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TEMP_SECRET);  // Usando uma chave secreta diferente
    // console.log("Decoded token temporário:", decoded);
    if (!decoded?.login_id) {
      return res.status(403).json({ error: "Token temporário inválido." });
    }

    req.user = decoded;  // Isso pode ser usado para acessar o usuário depois
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token temporário inválido ou expirado." });
  }
};
