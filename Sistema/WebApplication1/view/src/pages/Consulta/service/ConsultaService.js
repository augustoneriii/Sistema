// ConsultaService.js
import api from '../../../utils/api';

export class ConsultaService {

    static async getPacientes(token) {
        return await api.get('/pacientes/getAll', {
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


    static async getConsultas(token) {
        return await api.get('/consultas/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createConsulta(consulta, token) {
        return await api.post('/consultas/create', consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updateConsulta(consulta, token) {
        console.log("update ", consulta);
        return await api.put(`/consultas/update/${consulta.id}`, consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deleteConsulta(id, token) {
        console.log("delete ", id);
        return await api.delete(`/consultas/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
