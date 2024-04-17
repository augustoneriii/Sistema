using app.Data;
using app.DTO;
using app.DTO.Request;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ConsultaDAO
    {
        private AppDbContext _context;

        public ConsultaDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConsultaDTO>> GetAll(ConsultaDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Sistema\".\"Consultas\".\"Id\"     ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Data\"        ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Hora\"        ");
            //SELECIONAR O PACIENTEID
            objSelect.Append(", \"UserId\"                                ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Atendida\"    ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Status\"      ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Tipo\"        ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Observacoes\" ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"CreatedAt\"   ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"UpdateAt\"    ");

            if(dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = '{dto.Id}'");

            }
            if (!string.IsNullOrEmpty(dto.Status))
            {
                objSelect.Append($"AND \"Status\" = '{dto.Status}'");
            }
            if (!string.IsNullOrEmpty(dto.Tipo))
            {
                objSelect.Append($"AND \"Tipo\" = '{dto.Tipo}' ");
            }
            if(!string.IsNullOrEmpty(dto.Observacoes)) 
            {
                objSelect.Append($"AND \"Observacoes\" = '{dto.Observacoes} ");

            }

            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstConsultas = new List<ConsultaDTO>();

            foreach(DataRow row in dt.Rows)
            {
                lstConsultas.Add(new ConsultaDTO()
                {
                    Id = Convert.ToInt32(row["Id"]),
                    Data = Convert.ToDateTime(row["Data"]),
                    Hora = Convert.ToDateTime(row["Hora"]),
                    //Atendida
                    Status = row["Status"].ToString(),
                    Tipo = row["Tipo"].ToString(),
                    Observacoes = row["Observacoes"].ToString(),
                    User = new UserDTO
                    {
                        Id = row["Id"].ToString(),
                        UserName = row["UserName"] != DBNull.Value ? row["UserName"].ToString() : string.Empty,
                        Email = row["Email"] != DBNull.Value ? row["Email"].ToString() : string.Empty,
                    },
                    //PacienteID
                });
            }
            return lstConsultas;
        }

        //insert
        public async Task<int> Insert(ConsultaDTO dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"Consultas\"        (");
            objInsert.Append(" \"Data\"                                     ");
            objInsert.Append(" \"Hora\"                                     ");
            objInsert.Append(" \"Atendida\"                                 ");
            objInsert.Append(" \"Status\"                                   ");
            objInsert.Append(" \"Tipo\"                                     ");
            objInsert.Append(" \"Observacoes\"                              ");
            objInsert.Append(" \"UserId\"                                   ");
            objInsert.Append(") VALUES (                                    ");
            objInsert.Append($" '{dto.Data:yyyy-MM-dd}',                    ");
            objInsert.Append($" '{dto.Hora}',                               ");
            objInsert.Append($" '{dto.Atendida}',                           ");
            objInsert.Append($" '{dto.Status}',                             ");
            objInsert.Append($" '{dto.Tipo}',                               ");
            objInsert.Append($" '{dto.Observacoes}',                        ");
            objInsert.Append($" '{dto.User}',                               ");
            var id = _context.ExecuteNonQuery(objInsert.ToString());

            return id;
        }

        public async Task<int> Update(ConsultaDTO dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"Consultas\" SET ");
            objUpdate.Append($" \"Data\" = '{dto.Data:yyyy-MM-dd}', ");
            objUpdate.Append($" \"Hora\" = '{dto.Hora}', ");
            objUpdate.Append($" \"Atendida\" = '{dto.Atendida}', ");
            objUpdate.Append($" \"Status\" = '{dto.Status}', ");
            objUpdate.Append($" \"Tipo\" = '{dto.Tipo}', ");
            objUpdate.Append($" \"Observacoes\" = '{dto.Observacoes}', ");
            //objUpdate.Append($" \"UserId\" = '{dto.UserId}', ");
         
            objUpdate.Append($"WHERE \"Id\" = {dto.Id}; ");

            var id = _context.ExecuteNonQuery(objUpdate.ToString());

            return id;
        }

        public async Task Delete(long? id)
        {
            var objDelete = new StringBuilder();
            objDelete.Append("DELETE FROM \"Sistema\".\"Consultas\" ");
            objDelete.Append($" WHERE \"Id\" = {id} ");

            _context.ExecuteNonQuery(objDelete.ToString());
        }
    }
}
