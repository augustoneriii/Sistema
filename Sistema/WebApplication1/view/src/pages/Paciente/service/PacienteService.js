// PacienteService.js
import api from '../../../utils/api';

export class PacienteService {
    static async getPacientes(token) {
        return await api.get('/pacientes/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getConvenios(token) {
        return await api.get('/convenios/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createPaciente(paciente, token) {
        return await api.post('/pacientes/create', paciente, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async updatePaciente(paciente, token) {
        console.log("update ",paciente);
        return await api.put(`/pacientes/update/${paciente.id}`, paciente, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deletePaciente(id, token) {
        console.log("delete ",id);
        return await api.delete(`/pacientes/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
