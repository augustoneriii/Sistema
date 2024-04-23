namespace app.DTO.Request
{
    public class ProfissionaisRequest
    {
        public long? Id { get; set; }
        public string? Nome { get; set; }
        public string? Cpf { get; set; }
        public string? Rg { get; set; }
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public string? Endereco { get; set; }
        public string? Conselho { get; set; }
        public DateTime? Nascimento { get; set; }
        public string? Sexo { get; set; }
        public string? Observacoes { get; set; }
        public string? Image { get; set; }
        public long? ProfissaoId { get; set; }
        public long? ConvenioId { get; set; }
        public int? Ativo { get;  set; }
    }
}
