import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  console.log("Autenticando token...");
  const token = 
    req.session?.token || 
    req.query?.token ||   
    req.headers?.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ error: "Token de acesso é obrigatório." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.usuario_id) {
      return res.status(403).json({ error: "Token inválido." });
    }

    req.usuario_id = decoded.usuario_id;
    req.nomeDesenvolvedor = decoded.nomeDesenvolvedor;
    req.token = token;

    next(); 
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Erro de JWT:", error.message); 
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expirado:", error.message); 
    } else {
      console.error("Erro desconhecido:", error.message); 
    }
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

export const authenticateTempToken = (req, res, next) => {
  console.log("Autenticando token temporário...");  const token =
    req.session?.token ||  
    req.query?.token ||        
    req.headers?.authorization?.split(" ")[1] || 
    req.body?.token; 
    console.log("Token temporário recebido:", token);

  if (!token) {
    return res.status(401).json({ error: "Token temporário é obrigatório." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TEMP_SECRET);  
    if (!decoded?.login_id) {
      return res.status(403).json({ error: "Token temporário inválido." });
    }

    req.user = decoded;  
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token temporário inválido ou expirado." });
  }
};

