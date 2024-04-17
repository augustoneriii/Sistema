using app.BE;
using app.Data;
using app.DTO;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class PacientesDAO
    {
        private AppDbContext _context;

        public PacientesDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PacientesDTO>> GetAll(PacientesDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT   \"Sistema\".\"Pacientes\".\"Id\", ");
            objSelect.Append("         \"Sistema\".\"Pacientes\".\"Nome\", ");
            objSelect.Append("         \"Cpf\", ");
            objSelect.Append("         \"Rg\", ");
            objSelect.Append("         \"Sistema\".\"Pacientes\".\"Telefone\", ");
            objSelect.Append("         \"Endereco\", ");
            objSelect.Append("         \"Nascimento\", ");
            objSelect.Append("         \"Sexo\", ");
            objSelect.Append("         \"Sistema\".\"Pacientes\".\"Email\", ");
            objSelect.Append("         \"ConvenioId\", ");
            objSelect.Append("         \"TipoSanguineo\", ");
            objSelect.Append("         \"Alergias\", ");
            objSelect.Append("         \"Medicamentos\", ");
            objSelect.Append("         \"Cirurgias\", ");
            objSelect.Append("         \"Historico\", ");
            objSelect.Append("         \"Sistema\".\"Pacientes\".\"UserId\" AS \"UserIdPaciente\", ");
            objSelect.Append("         \"AspNetUsers\".\"Id\" AS \"AspUsersId\" ");
            objSelect.Append("FROM     \"Sistema\".\"Pacientes\" ");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ConvenioMedicos\" ON \"Sistema\".\"Pacientes\".\"ConvenioId\" = \"ConvenioMedicos\".\"Id\" ");
            objSelect.Append("LEFT JOIN \"public\".\"AspNetUsers\" ON \"Sistema\".\"Pacientes\".\"UserId\"::text = \"AspNetUsers\".\"Id\" ");
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
            if (!string.IsNullOrEmpty(dto.TipoSanguineo))
            {
                objSelect.Append($"AND \"TipoSanguineo\" = '{dto.TipoSanguineo}' ");
            }
            if (!string.IsNullOrEmpty(dto.Alergias))
            {
                objSelect.Append($"AND \"Alergias\" = '{dto.Alergias}' ");
            }
            if (!string.IsNullOrEmpty(dto.Medicamentos))
            {
                objSelect.Append($"AND \"Medicamentos\" = '{dto.Medicamentos}' ");
            }
            if (!string.IsNullOrEmpty(dto.Cirurgias))
            {
                objSelect.Append($"AND \"Cirugias\" = '{dto.Cirurgias}' ");
            }
            if (!string.IsNullOrEmpty(dto.Historico))
            {
                objSelect.Append($"AND \"Historico\" = '{dto.Historico}' ");
            }

            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstPacientes = new List<PacientesDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstPacientes.Add(new PacientesDTO
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
                    Convenio = new ConvenioMedicosDTO
                    {
                        Id = Convert.ToInt32(row["ConvenioId"] != DBNull.Value ? Convert.ToInt32(row["ConvenioId"]) : 0),
                    },
                    TipoSanguineo = row["TipoSanguineo"].ToString(),
                    Alergias = row["Alergias"].ToString(),
                    Medicamentos = row["Medicamentos"].ToString(),
                    Cirurgias = row["Cirurgias"].ToString(),
                    Historico = row["Historico"].ToString(),
                    User = new UserDTO
                    {
                        Id = row["Id"] != DBNull.Value ? row["Id"].ToString() : ""

                    }
                    //CreatedAt = DateTime.Parse(row["CreatedAt"].ToString()),
                    //UpdatedAt = DateTime.Parse(row["UpdatedAt"].ToString())
                });
            }
            return lstPacientes;
        }

        //insert
        public async Task<int> Insert(PacientesDTO dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"Pacientes\" (");
            objInsert.Append("  \"Nome\", ");
            objInsert.Append("  \"Cpf\", ");
            objInsert.Append("  \"Rg\", ");
            objInsert.Append("  \"Telefone\", ");
            objInsert.Append("  \"Endereco\", ");
            objInsert.Append("  \"Nascimento\", ");
            objInsert.Append("  \"Sexo\", ");
            objInsert.Append("  \"Email\", ");
            objInsert.Append("  \"TipoSanguineo\", ");
            objInsert.Append("  \"Alergias\", ");
            objInsert.Append("  \"Medicamentos\", ");
            objInsert.Append("  \"Cirurgias\", ");
            objInsert.Append("  \"Historico\" ");
            objInsert.Append(" ) VALUES ( ");
            objInsert.Append($" '{dto.Nome}', ");
            objInsert.Append($" '{dto.Cpf}', ");
            objInsert.Append($" '{dto.Rg}', ");
            objInsert.Append($" '{dto.Telefone}', ");
            objInsert.Append($" '{dto.Endereco}', ");
            objInsert.Append($" '{dto.Nascimento:yyyy-MM-dd}', ");
            objInsert.Append($" '{dto.Sexo}', ");
            objInsert.Append($" '{dto.Email}', ");
            objInsert.Append($" '{dto.TipoSanguineo}', ");
            objInsert.Append($" '{dto.Alergias}', ");
            objInsert.Append($" '{dto.Medicamentos}', ");
            objInsert.Append($" '{dto.Cirurgias}', ");
            objInsert.Append($" '{dto.Historico}' ");
            objInsert.Append(" ); ");

            var id = _context.ExecuteNonQuery(objInsert.ToString());

            return id;
        }

        //update
        public async Task<int> Update(PacientesDTO dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"Pacientes\" SET ");
            objUpdate.Append($" \"Nome\" = '{dto.Nome}', ");
            objUpdate.Append($" \"Cpf\" = '{dto.Cpf}', ");
            objUpdate.Append($" \"Rg\" = '{dto.Rg}', ");
            objUpdate.Append($" \"Telefone\" = '{dto.Telefone}', ");
            objUpdate.Append($" \"Endereco\" = '{dto.Endereco}', ");
            objUpdate.Append($" \"Nascimento\" = '{dto.Nascimento:yyyy-MM-dd}', ");
            objUpdate.Append($" \"Sexo\" = '{dto.Sexo}', ");
            objUpdate.Append($" \"Email\" = '{dto.Email}', ");
            objUpdate.Append($" \"TipoSanguineo\" = '{dto.TipoSanguineo}', ");
            objUpdate.Append($" \"Alergias\" = '{dto.Alergias}', ");
            objUpdate.Append($" \"Medicamentos\" = '{dto.Medicamentos}', ");
            objUpdate.Append($" \"Cirurgias\" = '{dto.Cirurgias}', ");
            objUpdate.Append($" \"Historico\" = '{dto.Historico}' ");
            objUpdate.Append($"WHERE \"Id\" = {dto.Id}; ");

            var id = _context.ExecuteNonQuery(objUpdate.ToString());

            return id;
        }

        //delete
        public async Task Delete(long? id)
        {
            var objDelete = new StringBuilder();
            objDelete.Append("DELETE FROM \"Sistema\".\"Pacientes\" ");
            objDelete.Append($"WHERE \"Id\" = {id} ");

            _context.ExecuteNonQuery(objDelete.ToString());
        }

    }
}

