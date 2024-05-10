using app.Data;
using app.DTO;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ConfirmaConsultaDAO
    {
        private AppDbContext _context;

        public ConfirmaConsultaDAO(AppDbContext context)
        {
            _context = context;
        }

        //get all
        public async Task<List<ConfirmaConsultaDTO>> GetAll(ConfirmaConsultaDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Id\", \"IdConsulta\", \"Nome\", \"Cpf\", \"ConvenioMedico\", \"Profissional\", \"Consultorio\" ,\"Chamado\", \"CreatedAt\", \"UpdatedAt\" FROM \"Sistema\".\"ConfirmarConsulta\"; ");

            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = '{dto.Id}'");
            }
            if (!string.IsNullOrEmpty(dto.Nome))
            {
                objSelect.Append($"AND \"Nome\" = '{dto.Nome}'");
            }
            if (!string.IsNullOrEmpty(dto.Cpf))
            {
                objSelect.Append($"AND \"Cpf\" = '{dto.Cpf}' ");
            }
            if (!string.IsNullOrEmpty(dto.ConvenioMedico))
            {
                objSelect.Append($"AND \"ConvenioMedico\" = '{dto.ConvenioMedico}' ");
            }
            if (!string.IsNullOrEmpty(dto.Profissional))
            {
                objSelect.Append($"AND \"Profissional\" = '{dto.Profissional}' ");
            }
            if (dto.Chamado > 0)
            {
                objSelect.Append($"AND \"Chamado\" = '{dto.Chamado}' ");
            }
            if (dto.CreatedAt != null)
            {
                objSelect.Append($"AND \"CreatedAt\" = '{dto.CreatedAt}' ");
            }
            if (dto.UpdatedAt != null)
            {
                objSelect.Append($"AND \"UpdatedAt\" = '{dto.UpdatedAt}' ");
            }

            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var result = new List<ConfirmaConsultaDTO>();
            if (dt != null)
            {
                foreach (DataRow row in dt.Rows)
                {
                    var obj = new ConfirmaConsultaDTO();
                    obj.Id = row["Id"] != DBNull.Value ? Convert.ToInt64(row["Id"]) : (long?)null;
                    obj.IdConsulta = row["IdConsulta"] != DBNull.Value ? Convert.ToInt64(row["IdConsulta"]) : (long?)null;
                    obj.Nome = row["Nome"] != DBNull.Value ? row["Nome"].ToString() : null;
                    obj.Cpf = row["Cpf"] != DBNull.Value ? row["Cpf"].ToString() : null;
                    obj.ConvenioMedico = row["ConvenioMedico"] != DBNull.Value ? row["ConvenioMedico"].ToString() : null;
                    obj.Profissional = row["Profissional"] != DBNull.Value ? row["Profissional"].ToString() : null;
                    obj.Consultorio = row["Consultorio"] != DBNull.Value ? row["Consultorio"].ToString() : null;
                    obj.Chamado = row["Chamado"] != DBNull.Value ? Convert.ToInt32(row["Chamado"]) : (int?)null;
                    obj.CreatedAt = row["CreatedAt"] != DBNull.Value ? Convert.ToDateTime(row["CreatedAt"]) : (DateTime?)null;
                    obj.UpdatedAt = row["UpdatedAt"] != DBNull.Value ? Convert.ToDateTime(row["UpdatedAt"]) : (DateTime?)null;

                    result.Add(obj);
                }
            }

            return result;
        }

        //insert
        public async Task<long> Insert(ConfirmaConsultaDTO dto)
        {
            var objInsert = new StringBuilder();
            dto.CreatedAt = DateTime.Now;
            dto.UpdatedAt = DateTime.Now;
            objInsert.Append("INSERT INTO \"Sistema\".\"ConfirmarConsulta\" (\"IdConsulta\", \"Nome\", \"Cpf\", \"ConvenioMedico\", \"Profissional\", \"Consultorio\" , \"Chamado\", \"CreatedAt\", \"UpdatedAt\") ");
            objInsert.Append($"VALUES ('{dto.IdConsulta}','{dto.Nome}', '{dto.Cpf}', '{dto.ConvenioMedico}', '{dto.Profissional}','{dto.Consultorio}' ,'{dto.Chamado}', '{dto.CreatedAt}', '{dto.UpdatedAt}') RETURNING \"Id\";");

            var id = await _context.ExecuteNonQuery(objInsert.ToString(), null);

            return id;
        }
    }
}
