// // ConvenioService.js
// import api from '../../../../utils/api';

// export class ConvenioService {
//     static getConvenios(token) {
//         return api.get('/getAllConvenioMedicos', {
//             headers: {
//                 Authorization: `Bearer ${JSON.parse(token)}`
//             }
//         });
//     }

//     static createConvenio(convenio, token) {
//         return api.post('/insertConvenioMedicos', convenio, {
//             headers: {
//                 Authorization: `Bearer ${JSON.parse(token)}`
//             }
//         });
//     }

//     static updateConvenio(convenio, token) {
//         console.log("update ",convenio);
//         return api.put(`/updateConvenioMedicos`, convenio, {
//             headers: {
//                 Authorization: `Bearer ${JSON.parse(token)}`
//             }
//         });
//     }

//     static deleteConvenio(id, token) {
//         console.log("delete ",id);
//         return api.delete(`/deleteConvenioMedicos?id=${id}`, {
//             headers: {
//                 Authorization: `Bearer ${JSON.parse(token)}`
//             }
//         });
//     }
// }

// ConvenioService.js
import api from '../../../../utils/api';

export class ConvenioService {
    static getConvenios() {
        return api.get('/getAllConvenioMedicos');
    }

    static createConvenio(convenio) {
        console.log("Convenio a ser enviado:", convenio);

        return api.post('/insertConvenioMedicos', convenio);
    }

    static updateConvenio(convenio) {
        console.log("update ", convenio);
        return api.patch(`/updateConvenioMedicos`, convenio);
    }

    static deleteConvenio(id) {
        console.log("delete ", id);
        return api.delete(`/deleteConvenioMedicos?id=${id}`);
    }
}
