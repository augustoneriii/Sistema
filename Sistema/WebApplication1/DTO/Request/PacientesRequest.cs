namespace app.DTO.Request
{
    public class PacientesRequest
    {
        public long? Id { get; set; } // Permite nulo se for o caso de inserção
        public string? Nome { get; set; }
        public string? Cpf { get; set; }
        public string? Rg { get; set; }
        public string? Telefone { get; set; }
        public string? Endereco { get; set; }
        public DateTime? Nascimento { get; set; }
        public string? Sexo { get; set; }
        public string? Email { get; set; }
        public long? ConvenioId { get; set; }
        public string? TipoSanguineo { get; set; }
        public string? Alergias { get; set; }
        public string? Medicamentos { get; set; }
        public string? Cirurgias { get; set; }
        public string? Historico { get; set; }
        public int? Ativo { get; set; }

    }
}