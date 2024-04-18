using app.BE;
using app.Data;
using app.DTO;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class PreAgendamentoDAO
    {
        private AppDbContext _context;

        public PreAgendamentoDAO(AppDbContext context)
        {
            _context = context;
        }

        //getAll
        public async Task<List<PreAgendamentoDTO>> GetAll(PreAgendamentoDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Id\", \"Data\", \"Hora\"");
            objSelect.Append(", \"Nome\", \"Email\", \"Telefone\"");
            objSelect.Append(", \"PlanoDeSaude\", \"Especialidade\", \"Status\", \"Observacoes\"");
            objSelect.Append(", \"CreatedAt\", \"UpdatedAt\"");
            objSelect.Append("FROM \"Sistema\".\"PreAgendamento\"                      ");
            objSelect.Append("WHERE 1 = 1                                               ");

            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = {dto.Id} ");
            }
            if (!string.IsNullOrEmpty(dto.Status))
            {
                objSelect.Append($"AND \"Status\" = '{dto.Status}' ");
            }

            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstPreAgendamento = new List<PreAgendamentoDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstPreAgendamento.Add(new PreAgendamentoDTO
                {
                    Id = Convert.ToInt32(row["Id"]),
                    Data = DateTime.Parse(row["Data"].ToString()),
                    Hora = TimeOnly.Parse(row["Hora"].ToString()),
                    Nome = row["Nome"].ToString(),
                    Email = row["Email"].ToString(),
                    Telefone = row["Telefone"].ToString(),
                    PlanoDeSaude = row["PlanoDeSaude"].ToString(),
                    Especialidade = row["Especialidade"].ToString(),
                    Status = row["Status"].ToString(),
                    Observacoes = row["Observacoes"].ToString(),

                    CreatedAt = DateTime.Parse(row["CreatedAt"].ToString()),
                    UpdatedAt = DateTime.Parse(row["UpdatedAt"].ToString())
                });
            }
            return lstPreAgendamento;
        }

        public async Task<PreAgendamentoDTO> Insert(PreAgendamentoDTO preAgendamento)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"PreAgendamento\" ");
            objInsert.Append("(\"Data\", \"Hora\", \"Nome\", \"Email\", \"Telefone\", \"PlanoDeSaude\", \"Especialidade\", \"Status\", \"Observacoes\") ");
            objInsert.Append("VALUES ");
            objInsert.Append($"('{preAgendamento.Data:yyyy-MM-dd}', '{preAgendamento.Hora:HH:mm:ss}', '{preAgendamento.Nome}', ");
            objInsert.Append($"'{preAgendamento.Email}', '{preAgendamento.Telefone}', '{preAgendamento.PlanoDeSaude}', ");
            objInsert.Append($"'{preAgendamento.Especialidade}', '{preAgendamento.Status}', '{preAgendamento.Observacoes}') ");

            var id = _context.ExecuteNonQuery(objInsert.ToString());

            preAgendamento.Id = id;
            return preAgendamento;
        }

        //update
        public async Task<int> Update(PreAgendamentoDTO dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"PreAgendamento\" SET ");
            objUpdate.Append($" \"Data\" = '{dto.Data:yyyy-MM-dd}', ");
            objUpdate.Append($" \"Hora\" = '{dto.Hora::HH:mm:ss}', ");
            objUpdate.Append($" \"Nome\" = '{dto.Nome}', ");
            objUpdate.Append($" \"Email\" = '{dto.Email}', ");
            objUpdate.Append($" \"Telefone\" = '{dto.Telefone}', ");
            objUpdate.Append($" \"PlanoDeSaude\" = '{dto.PlanoDeSaude}', ");
            objUpdate.Append($" \"Especialidade\" = '{dto.Especialidade}', ");
            objUpdate.Append($" \"Status\" = '{dto.Status}', ");
            objUpdate.Append($" \"Observacoes\" = '{dto.Observacoes}' ");
            objUpdate.Append($"WHERE \"Id\" = {dto.Id}; ");

            var id = _context.ExecuteNonQuery(objUpdate.ToString());

            return id;
        }

        //delete
        public async Task Delete(long? id)
        {
            var objDelete = new StringBuilder();
            objDelete.Append("DELETE FROM \"Sistema\".\"PreAgendamento\" ");
            objDelete.Append($"WHERE \"Id\" = {id} ");

            _context.ExecuteNonQuery(objDelete.ToString());
        }

    }
}
