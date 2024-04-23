export class Commom {
    static formatCpf(cpf) {
       cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
       cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2'); // Insere ponto após o terceiro dígito
       cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3'); // Insere ponto após o sexto dígito
       cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4'); // Insere hífen após o nono dígito
       return cpf;
        
    }

    static formatPhone(phone) {
        phone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2'); // Insere parênteses após o segundo dígito
        phone = phone.replace(/(\d)(\d{4})$/, '$1-$2'); // Insere hífen após o quinto dígito
        return phone;
    }
    static formatRg(rg) {
        // Remove caracteres não numéricos
        rg = rg.replace(/[^\d]/g, '');

        // Formata o RG no formato "xxxxxxx-x"
        return rg.replace(/^(\d{7})(\d{1})$/, '$1-$2');
    }
}