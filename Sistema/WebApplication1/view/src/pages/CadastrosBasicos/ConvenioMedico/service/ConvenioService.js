// ConvenioService.js
import api from '../../../../utils/api';

export class ConvenioService {
    static async getConvenios(token) {
        return await api.get('/getAllConvenioMedicos', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createConvenio(convenio, token) {
        return await api.post('/insertConvenioMedicos', convenio, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updateConvenio(convenio, token) {
        console.log("update ", convenio);
        return await api.patch(`/updateConvenioMedicos`, convenio, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deleteConvenio(id, token) {
        console.log("delete ", id);
        return await api.delete(`/deleteConvenioMedicos?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
