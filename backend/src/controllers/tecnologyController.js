import { getTecnologies } from "../services/tecnologyService.js";

export const getTecnology = async (req, res) => {
    try {
        const tecnologies = await getTecnologies();
        res.status(200).json(tecnologies);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}