import { getTecnologies } from "../services/tecnologyService.js";

// console.log("chamou o Controller.getTecnology");
export const getTecnology = async (req, res) => {
    
    try {
        const tecnologies = await getTecnologies();
        res.status(200).json(tecnologies);
    } catch (error) {
        // console.error("Erro ao buscar tecnologias:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}