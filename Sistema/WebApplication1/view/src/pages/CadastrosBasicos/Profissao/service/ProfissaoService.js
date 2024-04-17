// ProfissaoService.js
import api from '../../../../utils/api';

export class ProfissaoService {
    static async  getProfissoes(token) {
        return await api.get('/getAllProfissoes', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async  createProfissao(profissao, token) {
        console.log("create ", profissao);

        return await api.post('/insertProfissoes', profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async  updateProfissao(profissao, token) {
        console.log("update ",profissao);
        return await api.patch(`/updateProfissoes`, profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async  deleteProfissao(id, token) {
        console.log("delete ",id);
        return await api.delete(`/deleteProfissoes?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
