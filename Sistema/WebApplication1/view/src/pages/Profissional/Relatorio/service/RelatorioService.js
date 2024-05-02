// ConsultaService.js
import api from '../../../../utils/api';

export class RelatorioService {

    static async getRelatorio(token, query) {
        return await api.get(`/getAllRelatorios?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
    }

    static async getProfissionais(token, query) {
        return await api.get(`/getAllProfissionais?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

}