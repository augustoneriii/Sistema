import api from '../../../../utils/api';

export default class UsuarioService {
    static async getUsuarios(token) {
        return await api.get('/GetAllUsers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    static async createUsuario(usuario, token) {
        return await api.post('/register', usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    
    static async changePassword(usuario, token) {
        return await api.patch(`/ChangePassword`, usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    static async updateUsuario(usuario, token) {
       return await api.patch(`/UpdateUser`, usuario, {
           headers: {
               Authorization: `Bearer ${token}`
           }
       });
    }

    //static async deleteUsuario(id, token) {
    //    return await api.delete(`/deleteUsuarioMedicos?id=${id}`, {
    //        headers: {
    //            Authorization: `Bearer ${token}`
    //        }
    //    });
    //}
}
