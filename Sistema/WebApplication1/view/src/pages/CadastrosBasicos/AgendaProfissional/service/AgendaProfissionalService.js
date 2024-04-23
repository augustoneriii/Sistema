// ConsultaService.js
import api from '../../../../utils/api';

export class AgendaProfissionalService {

 
    static async getProfissionais(token) {
        return await api.get('/getAllProfissionais', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }


    static async getAgendas(token) {
        return await api.get('/getAllAgendas', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createAgenda(agenda, token) {
        console.log("create ", agenda);

        return await api.post('/insertAgenda', agenda, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updateAgenda(agenda, token) {
        console.log("update ", agenda);
        return await api.patch(`/updateAgenda`, agenda, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    /*static async deleteConsulta(id, token) {
    console.log("delete ", id);
    return await api.delete(`/deleteConsulta?id=${id}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(token)}`
        }
    });
}*/
}
