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

        return await api.post('/insertProfissoes', profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async  updateProfissao(profissao, token) {
        return await api.patch(`/updateProfissoes`, profissao, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    /*static async  deleteProfissao(id, token) {
        return await api.delete(`/deleteProfissoes?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }*/
}
