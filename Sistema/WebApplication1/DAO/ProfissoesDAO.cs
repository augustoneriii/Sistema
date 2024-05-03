using app.BE;
using app.Data;
using app.DTO;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ProfissoesDAO
    {
        private AppDbContext _context;

        public ProfissoesDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProfissoesDTO>> GetAll(ProfissoesDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Id\", \"Nome\", \"ConselhoProfissional\", \"CreatedAt\", \"UpdatedAt\", \"Ativo\"");
            objSelect.Append("FROM \"Sistema\".\"Profissoes\"                      ");
            objSelect.Append("WHERE 1 = 1                                               ");

            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = {dto.Id} ");
            }
            if (!string.IsNullOrEmpty(dto.Nome))
            {
                objSelect.Append($"AND \"Nome\" = '{dto.Nome}' ");
            }
            if (!string.IsNullOrEmpty(dto.ConselhoProfissional))
            {
                objSelect.Append($"AND \"ConselhoProfissional\" = '{dto.ConselhoProfissional}' ");
            }




            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var lstProfissoes = new List<ProfissoesDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstProfissoes.Add(new ProfissoesDTO
                {
                    Id = Convert.ToInt32(row["Id"]),
                    Nome = row["Nome"].ToString(),
                    ConselhoProfissional = row["ConselhoProfissional"].ToString(),
                    CreatedAt = DateTime.Parse(row["CreatedAt"].ToString()),
                    UpdatedAt = DateTime.Parse(row["UpdatedAt"].ToString()),
                    Ativo = Convert.ToInt32(row["Ativo"])
                });
            }
            return lstProfissoes;
        }

        //insert
        public async Task<ProfissoesDTO> Insert(ProfissoesDTO profissoes)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"Profissoes\" ");
            objInsert.Append("(\"Nome\", \"ConselhoProfissional\", \"Ativo\") ");
            objInsert.Append("VALUES ");
            objInsert.Append($"('{profissoes.Nome}', '{profissoes.ConselhoProfissional}', 1) ");

            var id = await _context.ExecuteNonQuery(objInsert.ToString(), null);

            profissoes.Id = id;
            return profissoes;
        }

        //update
        public async Task<ProfissoesDTO> Update(ProfissoesDTO profissoes)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"Profissoes\" ");
            objUpdate.Append("SET ");
            objUpdate.Append($"\"Nome\" = '{profissoes.Nome}', ");
            objUpdate.Append($"\"ConselhoProfissional\" = '{profissoes.ConselhoProfissional}', ");
            objUpdate.Append($"\"UpdatedAt\" = CURRENT_TIMESTAMP, ");
            objUpdate.Append($"\"Ativo\" = '{profissoes.Ativo}' ");
            objUpdate.Append($"WHERE \"Id\" = {profissoes.Id}; ");

            await _context.ExecuteNonQuery(objUpdate.ToString(), null);
            return profissoes;
        }

        //delete
        //public async Task Delete(long id)
        //{
        //    var objDelete = new StringBuilder();
        //    objDelete.Append("DELETE FROM \"Sistema\".\"Profissoes\" ");
        //    objDelete.Append($"WHERE \"Id\" = {id} ");

        //    _context.ExecuteNonQuery(objDelete.ToString());
        //}

    }
}
