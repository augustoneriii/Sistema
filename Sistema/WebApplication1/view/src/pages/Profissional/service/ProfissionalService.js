// ProfissionalService.js
import api from '../../../utils/api';

export class ProfissionalService {
    static async getProfissoes(token) {
        return await api.get('/profissoes/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getConvenios(token) {
        return await api.get('/convenios/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getProfissionais(token) {
        return await api.get('/profissionais/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createProfissional(profissional, token) {
        return await api.post('/profissionais/create', profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updateProfissional(profissional, token) {
        console.log("update ", profissional);
        return await api.put(`/profissionais/update/${profissional.id}`, profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deleteProfissional(id, token) {
        console.log("delete ", id);
        return await api.delete(`/profissionais/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
