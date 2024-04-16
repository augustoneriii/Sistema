// ProfissionalService.js
import api from '../../../utils/api';

export class ProfissionalService {
    static getProfissoes(token) {
        return api.get('/profissoes/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static getConvenios(token) {
        return api.get('/convenios/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static getProfissionais(token) {
        return api.get('/profissionais/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static createProfissional(profissional, token) {
        return api.post('/profissionais/create', profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static updateProfissional(profissional, token) {
        console.log("update ",profissional);
        return api.put(`/profissionais/update/${profissional.id}`, profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static deleteProfissional(id, token) {
        console.log("delete ",id);
        return api.delete(`/profissionais/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
