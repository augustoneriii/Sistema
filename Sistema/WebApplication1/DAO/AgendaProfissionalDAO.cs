using app.Data;
using app.DTO;
using app.DTO.Request;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class AgendaProfissionalDAO
    {
        private AppDbContext _context;
        
        public AgendaProfissionalDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AgendaProfissionalDTO>> GetAll(AgendaProfissionalDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT ");
            objSelect.Append("\"Sistema\" . \"AgendaProfissional\" . \"Id\", ");
            objSelect.Append("\"Sistema\".\"AgendaProfissional\".\"Dia\", ");
            objSelect.Append("TO_CHAR(\"Sistema\".\"AgendaProfissional\".\"Hora\", 'HH24:MI:SS') AS \"Hora\", ");
            objSelect.Append("\"Sistema\" . \"AgendaProfissional\" . \"DiaSemana\", ");
            objSelect.Append("\"Sistema\" . \"AgendaProfissional\" . \"ProfissionalId\",");
            objSelect.Append("\"Profissionais\".\"Nome\" AS \"NomeProfissionais\", ");
            objSelect.Append("\"Profissionais\".\"Email\" AS \"EmailProfissionais\" ");

            objSelect.Append("FROM \"Sistema\".\"AgendaProfissional\" ");

            objSelect.Append("LEFT JOIN \"Sistema\".\"Profissionais\" ON \"Sistema\".\"AgendaProfissional\".\"ProfissionalId\" = \"Profissionais\".\"Id\" ");



            objSelect.Append("WHERE 1 = 1");

            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = '{dto.Id}'");

            }
            if (!string.IsNullOrEmpty(dto.DiaSemana))
            {
                objSelect.Append($"AND \"DiaSemana\" = '{dto.DiaSemana}'");
            }
            if( dto.Profissionais.Id > 0)
            {
                objSelect.Append($"AND \"ProfissionalId\" = '{dto.Profissionais.Id}'");
            }


            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstAgendas = new List<AgendaProfissionalDTO>();

            foreach(DataRow row in dt.Rows)
            {
                lstAgendas.Add(new AgendaProfissionalDTO()
                {
                    Id = Convert.ToInt32(row["id"]),
                    Dia = Convert.ToDateTime(row["Dia"]),
                    Hora = Convert.ToDateTime(row["Hora"]),
                    DiaSemana = row["DiaSemana"].ToString(),
                    Profissionais = new ProfissionaisDTO
                    {
                        Id = Convert.ToInt32(row["ProfissionalId"] != DBNull.Value ? Convert.ToInt32(row["ProfissionalId"]) : 0),

                        Nome = row["NomeProfissionais"] != DBNull.Value ? row["NomeProfissionais"].ToString() : string.Empty,
                        Email = row["EmailProfissionais"] != DBNull.Value ? row["EmailProfissionais"].ToString() : string.Empty,

                    }
                }); ;
            }
            return lstAgendas;
        }

        //insert
        public async Task<int> Insert(AgendaProfissionalRequest dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"AgendaProfissional\" (");

            objInsert.Append(" \"Dia\", ");
            objInsert.Append(" \"Hora\", ");
            objInsert.Append(" \"DiaSemana\", ");
            objInsert.Append(" \"ProfissionalId\" ");

            objInsert.Append(") VALUES (");

            objInsert.Append($" '{dto.Dia}', ");
            objInsert.Append($" '{dto.Hora}', "); // Adicionando a aspa simples de fechamento aqui

            objInsert.Append($" '{dto.DiaSemana}', ");
            objInsert.Append($" '{dto.ProfissionalId}' ");

            objInsert.Append(" ); ");

            var id = _context.ExecuteNonQuery(objInsert.ToString());

            return id;
        }

        //Update
        public async Task<int> Update(AgendaProfissionalRequest dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"AgendaProfissional\" SET ");
            objUpdate.Append($" \"Dia\" = '{dto.Dia}', ");
            objUpdate.Append($" \"Hora\" = TO_TIMESTAMP('{dto.Hora}', 'HH24:MI:SS'), "); // Usando TO_TIMESTAMP para converter hora
            objUpdate.Append($" \"DiaSemana\" = '{dto.DiaSemana}', ");
            objUpdate.Append($" \"ProfissionalId\" = '{dto.ProfissionalId}' ");

            objUpdate.Append($"WHERE \"Id\" = {dto.Id}; ");

            var id = _context.ExecuteNonQuery(objUpdate.ToString());

            return id;
        }

        ////Delete
        //public async Task Delete(long? id)
        //{
        //    var objDelete = new StringBuilder();
        //    objDelete.Append("DELETE FROM \"Sistema\".\"AgendaProfissional\" ");
        //    objDelete.Append($" WHERE \"Id\" = {id} ");

        //    _context.ExecuteNonQuery(objDelete.ToString());
        //}
    }
}
