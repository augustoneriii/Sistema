    // ConsultaService.js
    import api from '../../../../utils/api';

export class AgendaProfissionalService {


    static async getProfissionais(token, query) {
        return await api.get(`/getAllProfissionais?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getAgendas(token, query) {
        return await api.get(`/getAllAgendas?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createAgenda(agenda, token) {

        return await api.post('/insertAgenda', agenda, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updateAgenda(agenda, token) {
        return await api.patch(`/updateAgenda`, agenda, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deleteAgenda(id, token) {
        return await api.delete(`/deleteAgenda?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
