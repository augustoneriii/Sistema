// DadosPessoaisService.js
import api from '../../../../utils/api';

export class PerfilService {
    static async getDadosPessoais(token) {
        console.log('token', token);
        return await api.get('/getAllDadosPessoais', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    static async createDadosPessoais(dados, token) {
        return await api.post('/insertDadosPessoais', dados, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    static async updateDadosPessoais(dados, token) {
        return await api.patch(`/updateDadosPessoais`, dados, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}