import { getProfile } from '../services/profileService.js';

export const profile = async (req, res) => {
    //console.log("CHAMOU O CONTROLLER - devId", req.desenvolvedorId);
    const devId = req.usuario_id;
    try {
        const profile = await getProfile(devId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}