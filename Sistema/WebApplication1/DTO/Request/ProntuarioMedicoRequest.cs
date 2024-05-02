namespace app.DTO.Request
{
    public class ProntuarioMedicoRequest
    {
        public long? Id { get; set; }
        public int? PacienteId { get; set; }
        public int? ProfissionalId { get; set; }
        public string? PrescricaoMedicamentos { get; set; } 
        public string? EvolucaoPaciente { get; set; }
    }
}
