namespace app.DTO
{
    public class ConvenioMedicosDTO
    {
        public int? Id { get; set; } // Permite nulo se for o caso de inserção
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string Site { get; set; }

    }
}
