// ProfissaoService.js
import api from '../../../../utils/api';

export class ProfissaoService {
    static getProfissoes(token) {
        return api.get('/getAllProfissoes', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static createProfissao(profissao, token) {
        console.log("create ", profissao);

        return api.post('/insertProfissoes', profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static updateProfissao(profissao, token) {
        console.log("update ",profissao);
        return api.patch(`/updateProfissoes`, profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static deleteProfissao(id, token) {
        console.log("delete ",id);
        return api.delete(`/deleteProfissoes?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
