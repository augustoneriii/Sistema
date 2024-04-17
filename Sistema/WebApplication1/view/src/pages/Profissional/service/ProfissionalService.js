// ProfissionalService.js
import api from '../../../utils/api';

export class ProfissionalService {
    static async getProfissoes(token) {
<<<<<<< HEAD
        return await api.get('/profissoes/getAll', {
=======
        return await api.get('/getAllProfissoes', {
>>>>>>> Dev
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getConvenios(token) {
<<<<<<< HEAD
        return await api.get('/convenios/getAll', {
=======
        return await api.get('/getAllConvenioMedicos', {
>>>>>>> Dev
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async getProfissionais(token) {
<<<<<<< HEAD
        return await api.get('/profissionais/getAll', {
=======
        return await api.get('/getAllProfissionais', {
>>>>>>> Dev
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async createProfissional(profissional, token) {
<<<<<<< HEAD
        return await api.post('/profissionais/create', profissional, {
=======
        console.log("create ", profissional);

        return await api.post('/insertProfissionais', profissional, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }


    static async updateProfissional(profissional, token) {
        console.log("update ", profissional);
        return await api.put(`/updateProfissionais`, profissional, {
>>>>>>> Dev
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

<<<<<<< HEAD
    static async updateProfissional(profissional, token) {
        console.log("update ", profissional);
        return await api.put(`/profissionais/update/${profissional.id}`, profissional, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }

    static async deleteProfissional(id, token) {
        console.log("delete ", id);
        return await api.delete(`/profissionais/delete/${id}`, {
=======
    static async deleteProfissional(id, token) {
        console.log("delete ", id);
        return await api.delete(`/deleteProfissionais?id=${id}`, {
>>>>>>> Dev
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
    }
}
