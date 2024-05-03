// Prontuario.js
import api from '../../../../utils/api';

export class ProntuarioService {
    static async getProntuarios(token) {
        return await api.get('/getAllProntuarioMedico', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
    static async getPacientes(token) {
        return await api.get('/getAllPacientes', {
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

    static async getConvenios(token) {
        return await api.get('/getAllConvenioMedicos', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createProntuario(prontuario, token) {
        return await api.post('/insertProntuarioMedico', prontuario, {
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    static async updateProntuario(prontuario, token) {
        return await api.patch(`/updateProntuarioMedico`, prontuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

}