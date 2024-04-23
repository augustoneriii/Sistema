namespace app.DTO.Request
{
    public class AgendaProfissionalRequest
    {
        public long? Id { get; set; }
        public DateTime? Dia { get; set; }
        public DateTime? Hora { get; set; }
        public int? ProfissionalId { get; set; }
        public string? DiaSemana { get; set; }
        public int? Ativo { get; set; }

    }
}
