import api from '../../../../utils/api';


export class AtendimentoService {
    static async getProfissionais(token, query) {
        return await api.get(`/getAllProfissionais?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
    static async getConsultas(token, query) {
        return await api.get(`/getAllConsultas?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
    static async getConvenios(token, query) {

        return await api.get(`/getAllConvenioMedicos?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getPacientes(token, query) {
        return await api.get(`/getAllPacientes?${query}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

}