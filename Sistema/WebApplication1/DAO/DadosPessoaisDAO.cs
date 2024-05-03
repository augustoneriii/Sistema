using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class DadosPessoaisDAO
    {
        private AppDbContext _context;

        public DadosPessoaisDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DadosPessoaisDTO>> GetAll(DadosPessoaisDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT   \"Sistema\".\"DadosPessoais\".\"Id\", ");
            objSelect.Append("         \"Sistema\".\"DadosPessoais\".\"Nome\", ");
            objSelect.Append("         \"Cpf\", ");
            objSelect.Append("         \"Rg\", ");
            objSelect.Append("         \"Sistema\".\"DadosPessoais\".\"Telefone\", ");
            objSelect.Append("         \"Endereco\", ");
            objSelect.Append("         \"Nascimento\", ");
            objSelect.Append("         \"Sexo\", ");
            objSelect.Append("         \"Sistema\".\"DadosPessoais\".\"Email\" ");
            objSelect.Append("FROM     \"Sistema\".\"DadosPessoais\" ");
          

            objSelect.Append("WHERE    1 = 1 ");

            //
            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = '{dto.Id}' ");
            }
            if (!string.IsNullOrEmpty(dto.Nome))
            {
                objSelect.Append($"AND \"Nome\" = '{dto.Nome}' ");
            }
            if (!string.IsNullOrEmpty(dto.Cpf))
            {
                objSelect.Append($"AND \"Cpf\" = '{dto.Cpf}' ");
            }
            if (!string.IsNullOrEmpty(dto.Rg))
            {
                objSelect.Append($"AND \"Rg\" = '{dto.Rg}' ");
            }
            if (!string.IsNullOrEmpty(dto.Telefone))
            {
                objSelect.Append($"AND \"Telefone\" = '{dto.Telefone}' ");
            }
            if (!string.IsNullOrEmpty(dto.Endereco))
            {
                objSelect.Append($"AND \"Endereco\" = '{dto.Endereco}' ");
            }
            if (!string.IsNullOrEmpty(dto.Email))
            {
                objSelect.Append($"AND \"Email\" = '{dto.Email}' ");
            }
            if (!string.IsNullOrEmpty(dto.Sexo))
            {
                objSelect.Append($"AND \"Sexo\" = '{dto.Sexo}' ");
            }

            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var lstDadosPessoais = new List<DadosPessoaisDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstDadosPessoais.Add(new DadosPessoaisDTO
                {
                    Id = Convert.ToInt32(row["Id"]),
                    Nome = row["Nome"].ToString(),
                    Cpf = row["Cpf"].ToString(),
                    Rg = row["Rg"].ToString(),
                    Telefone = row["Telefone"].ToString(),
                    Endereco = row["Endereco"].ToString(),
                    Nascimento = Convert.ToDateTime(row["Nascimento"]),
                    Sexo = row["Sexo"].ToString(),
                    Email = row["Email"].ToString(),
                    //CreatedAt = DateTime.Parse(row["CreatedAt"].ToString()),
                    //UpdatedAt = DateTime.Parse(row["UpdatedAt"].ToString())
                });
            }
            return lstDadosPessoais;
        }

        //insert
        public async Task<int> Insert(DadosPessoaisDTO dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"DadosPessoais\" (");
            objInsert.Append("  \"Nome\", ");
            objInsert.Append("  \"Cpf\", ");
            objInsert.Append("  \"Rg\", ");
            objInsert.Append("  \"Telefone\", ");
            objInsert.Append("  \"Endereco\", ");
            objInsert.Append("  \"Nascimento\", ");
            objInsert.Append("  \"Sexo\", ");
            objInsert.Append("  \"Email\" ");     
            objInsert.Append(" ) VALUES ( ");
            objInsert.Append($" '{dto.Nome}', ");
            objInsert.Append($" '{dto.Cpf}', ");
            objInsert.Append($" '{dto.Rg}', ");
            objInsert.Append($" '{dto.Telefone}', ");
            objInsert.Append($" '{dto.Endereco}', ");
            objInsert.Append($" '{dto.Nascimento}', ");
            objInsert.Append($" '{dto.Sexo}', ");
            objInsert.Append($" '{dto.Email}' ");
         

            objInsert.Append(" )RETURNING \"Id\"; ");

            var id = await _context.ExecuteNonQuery(objInsert.ToString(), null);

            return id;
        }

        //update
        public async Task<int> Update(DadosPessoaisDTO dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"DadosPessoais\" SET ");
            objUpdate.Append($" \"Nome\" = '{dto.Nome}', ");
            objUpdate.Append($" \"Cpf\" = '{dto.Cpf}', ");
            objUpdate.Append($" \"Rg\" = '{dto.Rg}', ");
            objUpdate.Append($" \"Telefone\" = '{dto.Telefone}', ");
            objUpdate.Append($" \"Endereco\" = '{dto.Endereco}', ");
            objUpdate.Append($" \"Nascimento\" = '{dto.Nascimento:yyyy-MM-dd}', ");
            objUpdate.Append($" \"Sexo\" = '{dto.Sexo}', ");
            objUpdate.Append($" \"Email\" = '{dto.Email}' ");
     
            objUpdate.Append($"WHERE \"Id\" = {dto.Id}; ");

            var id = await _context.ExecuteNonQuery(objUpdate.ToString(), null);

            return id;
        }
    }
}
