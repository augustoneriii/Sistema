// ProfissionalService.js
import api from '../../../utils/api';

export class ProfissionalService {
    static async getProfissoes(token) {
        return await api.get('/getAllProfissoes', {
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

    static async getProfissionais(token) {
        return await api.get('/getAllProfissionais', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createProfissional(profissional, token) {
        console.log("create ", profissional);
        const body = {
            nome: profissional.NomeProfissional,
            cpf: profissional.cpf,
            rg: profissional.rg,
            telefone: profissional.telefone,
            email: profissional.EmailProfissional,
            endereco: profissional.endereco,
            nascimento: profissional.nascimento.toISOString(), 
            sexo: profissional.sexo,
            observacoes: profissional.observacoes,
            image: '', 
            convenioMedicos: profissional.convenioMedicos.map(c => ({ id: c.id })),
            profissoes: { id: profissional.profissoes.id }
        };

        return await api.post('/insertProfissionais', body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }


    static async updateProfissional(profissional, token) {
        console.log("update ", profissional);
        return await api.put(`/updateProfissionais`, profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deleteProfissional(id, token) {
        console.log("delete ", id);
        return await api.delete(`/deleteProfissionais?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
