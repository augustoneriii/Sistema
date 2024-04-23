// PacienteService.js
import api from '../../../utils/api';

export class PacienteService {
    static async getPacientes(token) {
        return await api.get('/getAllPacientes', {
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

    static async createPaciente(paciente, token) {
        return await api.post('/insertPacientes', {
            ...paciente,
            ConvenioId: paciente.IdConvenio // Garantir que este campo esteja correto
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }



    static async updatePaciente(paciente, token) {
        console.log("update ", paciente);
        return await api.patch(`/updatePacientes`, paciente, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
    /*
    static async deletePaciente(id, token) {
        console.log("delete ",id);
        return await api.delete(`/deletePacientes?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }*/
}
