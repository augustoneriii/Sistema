// ConsultaService.js
import api from '../../../utils/api';

export class HomeService {

   

    static async getProfissionais(token, query) {
        return await api.get(`/getAllProfissionais?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }


    static async getConsultas(token, query) {
        return await api.get(`/getAllConsultas${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    
}
