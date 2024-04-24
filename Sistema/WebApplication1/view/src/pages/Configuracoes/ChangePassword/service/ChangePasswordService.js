import api from '../../../../utils/api';

export default class ChangePassWordService { 
    static async changePassword(usuario, token) {
        return await api.patch(`/ChangePassword`, usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
