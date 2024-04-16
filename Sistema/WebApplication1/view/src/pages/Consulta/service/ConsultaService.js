// ConsultaService.js
import api from '../../../utils/api';

export class ConsultaService {

    static getPacientes(token) {
        return api.get('/pacientes/getAll', {
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


    static getConsultas(token) {
        return api.get('/consultas/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static createConsulta(consulta, token) {
        return api.post('/consultas/create', consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static updateConsulta(consulta, token) {
        console.log("update ", consulta);
        return api.put(`/consultas/update/${consulta.id}`, consulta, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static deleteConsulta(id, token) {
        console.log("delete ", id);
        return api.delete(`/consultas/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
