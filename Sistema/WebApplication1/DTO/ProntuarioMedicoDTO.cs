namespace app.DTO
{
    public class ProntuarioMedicoDTO
    {
        public long? Id { get; set; }
        public PacientesDTO? Pacientes { get; set; }
        public ProfissionaisDTO? Profissionais { get; set; }
        public string? PrescricaoMedicamentos { get; set; }
        public string? EvolucaoPaciente { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
