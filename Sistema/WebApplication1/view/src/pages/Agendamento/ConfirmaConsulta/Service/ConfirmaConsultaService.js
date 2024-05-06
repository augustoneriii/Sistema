// ConsultaService.js
import api from '../../../../utils/api';

export class ConfirmaConsultaService {

    static async getPacientes(token, cpf) {
        let query = '';

        if (cpf) {
            query = `?Cpf=${cpf}`;
        }

        return await api.get(`/getAllPacientes${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getAll(token) {
        return await api.get('/getAllConfirmaConsultas', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async insert(consulta, token) {

        return await api.post('/insertConfirmaConsulta', consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    // static async updateConsulta(consulta, token) {
    //     return await api.patch(`/updateConsulta`, consulta, {
    //         headers: {
    //             Authorization: `Bearer ${JSON.parse(token)}`
    //         }

    //     });
    // }
}
