namespace app.DTO
{
    public class PreAgendamentoDTO
    {
        public long? Id { get; set; } // Permite nulo se for o caso de inserção
        public DateTime Data { get; set; }
        public TimeOnly Hora { get; set; } // Para pegar apenas a hora 00:00:00
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? PlanoDeSaude { get; set; }
        public string? Especialidade { get; set; }
        public string Status { get; set; }
        public string? Observacoes { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
