export class Commom {
    static formatCpf(cpf) {
       cpf = cpf.replace(/\D/g, ''); // Remove caracteres n�o num�ricos
       cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2'); // Insere ponto ap�s o terceiro d�gito
       cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3'); // Insere ponto ap�s o sexto d�gito
       cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4'); // Insere h�fen ap�s o nono d�gito
       return cpf;
        
    }

    static formatPhone(phone) {
        phone = phone.replace(/\D/g, ''); // Remove caracteres n�o num�ricos
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2'); // Insere par�nteses ap�s o segundo d�gito
        phone = phone.replace(/(\d)(\d{4})$/, '$1-$2'); // Insere h�fen ap�s o quinto d�gito
        return phone;
    }
    static formatRg(rg) {
        // Remove caracteres n�o num�ricos
        rg = rg.replace(/[^\d]/g, '');

        // Formata o RG no formato "xxxxxxx-x"
        return rg.replace(/^(\d{7})(\d{1})$/, '$1-$2');
    }
}