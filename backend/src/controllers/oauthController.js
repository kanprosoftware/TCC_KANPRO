import { handleOAuthCallback } from '../services/oauthService.js';

export const googleCallback = async (req, res, next) => {
  //console.log("chamou o Controller.googleCallback");
  //console.log("--------------------------------");
  //console.log("req.user: ", req.user);
  //console.log("--------------------------------");
  try {
    const { login, desenvolvedor, habilidades, tempToken } = req.user;
    req.session.token = tempToken;
    //console.log("req.user.habilidades", req.user.habilidades);
    if ( req.user.habilidades.length <= 0 ) {
        res.redirect(`${process.env.FRONTEND_URL}/registro?etapa=2&token=${tempToken}`);
    } else if ( req.user.login.is_verified == false ) {
        return res.redirect(`http://localhost:5173/login?erro=email-nao-verificado`);
    }
    else {
        res.redirect(`${process.env.FRONTEND_URL}/projetos`);
    }
  } catch (error) {
    next(error);
  }
};