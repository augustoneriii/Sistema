using app.BE;
using app.Data;
using app.DTO;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ConvenioMedicosDAO
    {
        private AppDbContext _context;

        public ConvenioMedicosDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConvenioMedicosDTO>> GetAll(ConvenioMedicosDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Id\", \"Nome\", \"Telefone\", \"Email\", \"Site\"");
            objSelect.Append("FROM \"Sistema\".\"ConvenioMedicos\"                      ");
            objSelect.Append("WHERE 1 = 1                                               ");

            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = {dto.Id} ");
            }
            if (!string.IsNullOrEmpty(dto.Nome))
            {
                objSelect.Append($"AND \"Nome\" = '{dto.Nome}' ");
            }
            if (!string.IsNullOrEmpty(dto.Telefone))
            {
                objSelect.Append($"AND \"Telefone\" = '{dto.Telefone}' ");
            }
            if (!string.IsNullOrEmpty(dto.Email))
            {
                objSelect.Append($"AND \"Email\" = '{dto.Email}' ");
            }
            if (!string.IsNullOrEmpty(dto.Site))
            {
                objSelect.Append($"AND \"Site\" = '{dto.Site}' ");
            }

            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstConvenioMedicos = new List<ConvenioMedicosDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstConvenioMedicos.Add(new ConvenioMedicosDTO
                {
                    Id = Convert.ToInt32(row["Id"]),
                    Nome = row["Nome"].ToString(),
                    Telefone = row["Telefone"].ToString(),
                    Email = row["Email"].ToString(),
                    Site = row["Site"].ToString()
                });
            }
            return lstConvenioMedicos;
        }

        //insert
        public async Task<ConvenioMedicosDTO> Insert(ConvenioMedicosDTO convenioMedicos)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"ConvenioMedicos\" ");
            objInsert.Append("(\"Nome\", \"Telefone\", \"Email\", \"Site\") ");
            objInsert.Append("VALUES ");
            objInsert.Append($"('{convenioMedicos.Nome}', '{convenioMedicos.Telefone}', '{convenioMedicos.Email}', '{convenioMedicos.Site}') ");

            var id = _context.ExecuteNonQuery(objInsert.ToString());
            
            convenioMedicos.Id = id;
            return convenioMedicos;
        }

        //update
        public async Task<ConvenioMedicosDTO> Update(ConvenioMedicosDTO convenioMedicos)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"ConvenioMedicos\" ");
            objUpdate.Append("SET ");
            objUpdate.Append($"\"Nome\" = '{convenioMedicos.Nome}', ");
            objUpdate.Append($"\"Telefone\" = '{convenioMedicos.Telefone}', ");
            objUpdate.Append($"\"Email\" = '{convenioMedicos.Email}', ");
            objUpdate.Append($"\"Site\" = '{convenioMedicos.Site}' ");
            objUpdate.Append($"WHERE \"Id\" = {convenioMedicos.Id} ");

            _context.ExecuteNonQuery(objUpdate.ToString());
            return convenioMedicos;
        }

        //delete
        public async Task Delete(long id)
        {
            var objDelete = new StringBuilder();
            objDelete.Append("DELETE FROM \"Sistema\".\"ConvenioMedicos\" ");
            objDelete.Append($"WHERE \"Id\" = {id} ");

            _context.ExecuteNonQuery(objDelete.ToString());
        }
    }
}
