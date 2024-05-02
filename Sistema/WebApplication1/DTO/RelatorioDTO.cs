namespace app.DTO
{
    public class RelatorioDTO
    {
        public long? Id {  get; set; }
        public DateTime? Data { get; set; }
        public DateTime? Hora {  get; set; }
        public bool? Atendida { get; set; }
        public string? Status { get; set; }
        public string? Tipo { get; set;}
        public string? Observacoes { get; set; }
        
        public PacientesDTO? Pacientes { get; set; }
        public ProfissionaisDTO? Profissionais { get; set; }
    }
}
