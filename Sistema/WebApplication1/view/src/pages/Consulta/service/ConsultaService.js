// ConsultaService.js
import api from '../../../utils/api';

export class ConsultaService {

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


    static async getConsultas(token) {
        return await api.get('/getAllConsultas', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createConsulta(consulta, token) {

        return await api.post('/insertConsulta', consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updateConsulta(consulta, token) {
        return await api.patch(`/updateConsulta`, consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    /*static async deleteConsulta(id, token) {
    return await api.delete(`/deleteConsulta?id=${id}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(token)}`
        }
    });
}*/
}
