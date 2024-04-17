// ConvenioService.js
import api from '../../../../utils/api';

export class ConvenioService {
    static async getConvenios(token) {
<<<<<<< HEAD
        return await api.get('/getAllConvenioMedicos', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
=======
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.get('/getAllConvenioMedicos', {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
>>>>>>> Dev
            }
        });
    }

    static async createConvenio(convenio, token) {
<<<<<<< HEAD
        return await api.post('/insertConvenioMedicos', convenio, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
=======
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.post('/insertConvenioMedicos', convenio, {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
>>>>>>> Dev
            }
        });
    }

    static async updateConvenio(convenio, token) {
<<<<<<< HEAD
        console.log("update ", convenio);
        return await api.patch(`/updateConvenioMedicos`, convenio, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
=======
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.patch(`/updateConvenioMedicos`, convenio, {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
>>>>>>> Dev
            }
        });
    }

    static async deleteConvenio(id, token) {
<<<<<<< HEAD
        console.log("delete ", id);
        return await api.delete(`/deleteConvenioMedicos?id=${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
=======
        const tokenParsed = token ? JSON.parse(token) : '';
        return await api.delete(`/deleteConvenioMedicos?id=${id}`, {
            headers: {
                Authorization: `Bearer ${tokenParsed}`
>>>>>>> Dev
            }
        });
    }
}
