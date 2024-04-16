// PacienteService.js
import api from '../../../utils/api';

export class PacienteService {
    static getPacientes(token) {
        return api.get('/pacientes/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static getConvenios(token) {
        return api.get('/convenios/getAll', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static createPaciente(paciente, token) {
        return api.post('/pacientes/create', paciente, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static updatePaciente(paciente, token) {
        console.log("update ",paciente);
        return api.put(`/pacientes/update/${paciente.id}`, paciente, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static deletePaciente(id, token) {
        console.log("delete ",id);
        return api.delete(`/pacientes/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
