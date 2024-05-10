namespace app.DTO
{
    public class ConfirmaConsultaDTO
    {
        public long? Id { get; set; }
        public long? IdConsulta { get; set; }
        public string? Nome { get; set; }
        public string? Cpf { get; set; }
        public string? ConvenioMedico { get; set; }
        public string? Profissional { get; set; }
        public string? Consultorio { get; set; }
        public int? Chamado { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
