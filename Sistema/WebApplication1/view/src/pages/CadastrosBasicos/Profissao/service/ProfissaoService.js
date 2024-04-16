// ProfissaoService.js
import api from '../../../../utils/api';

export class ProfissaoService {
    static getProfissoes(token) {
        return api.get('/profissoes/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static createProfissao(profissao, token) {
        return api.post('/profissoes/create', profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static updateProfissao(profissao, token) {
        console.log("update ",profissao);
        return api.put(`/profissoes/update/${profissao.id}`, profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static deleteProfissao(id, token) {
        console.log("delete ",id);
        return api.delete(`/profissoes/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
