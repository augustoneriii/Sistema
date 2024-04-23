namespace app.DTO
{
    public class ProfissoesDTO
    {
        public long? Id { get; set; } // Permite nulo se for o caso de inserção
        public string? Nome { get; set; }
        public string? ConselhoProfissional { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public int Ativo { get; set; }
    }
}
