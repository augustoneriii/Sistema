// ProfissionalService.js
import api from '../../../utils/api';

export class ProfissionalService {
    static async getProfissoes(token) {
        return await api.get('/getAllProfissoes', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getConvenios(token) {
        return await api.get('/getAllConvenioMedicos', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getProfissionais(token) {
        return await api.get('/getAllProfissionais', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async saveProfissional(profissional, token) {

        return await api.post('/insertProfissionais', profissional, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }


    static async updateProfissional(profissional, token) {
        return await api.patch(`/updateProfissionais`, profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    /*static async deleteProfissional(id, token) {
        return await api.delete(`/deleteProfissionais?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }*/
}
