import api from '../../../utils/api';

export class ChamarPacienteService {


    static async getProfissionais(token) {
        return await api.get(`/getAllProfissionais`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }


    static async getConsultas(token) {
        return await api.get(`/getAllConsultas`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }


}