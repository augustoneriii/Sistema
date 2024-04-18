namespace app.DTO.Request
{
    public class ConsultaRequest
    {
        public long? Id { get; set; }
        public DateTime? Data { get; set; }
        public DateTime? Hora { get; set; }
        public bool? Atendida { get; set; }
        public string? Status { get; set; }
        public string? Tipo { get; set; }
        public string? Observacoes { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public long? PacienteId { get; set; }
        public long? ProfissionalId { get; set; }
        
    }
}
