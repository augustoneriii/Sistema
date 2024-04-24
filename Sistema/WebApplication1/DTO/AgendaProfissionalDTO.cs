using System.Diagnostics.Tracing;

namespace app.DTO
{
    public class AgendaProfissionalDTO
    {
        public long? Id { get; set; }
        //public DateTime? Dia { get; set; }
        public DateTime? Hora { get; set; }
        public string? DiaSemana { get; set; }
        public int? Ativo { get; set; }
        public ProfissionaisDTO? Profissionais { get; set;}
    }
}
