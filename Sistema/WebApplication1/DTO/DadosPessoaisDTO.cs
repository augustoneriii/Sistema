namespace app.DTO
{
    public class DadosPessoaisDTO
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
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
