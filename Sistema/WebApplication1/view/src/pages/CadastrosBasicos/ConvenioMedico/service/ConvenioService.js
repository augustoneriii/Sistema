// ConvenioService.js
import api from '../../../../utils/api';

export class ConvenioService {
    static async getConvenios(token) {
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.get('/getAllConvenioMedicos', {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
            }
        });
    }

    static async createConvenio(convenio, token) {
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.post('/insertConvenioMedicos', convenio, {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
            }
        });
    }

    static async updateConvenio(convenio, token) {
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.patch(`/updateConvenioMedicos`, convenio, {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
            }
        });
    }

    static async deleteConvenio(id, token) {
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.delete(`/deleteConvenioMedicos?id=${id}`, {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
            }
        });
    }
}
