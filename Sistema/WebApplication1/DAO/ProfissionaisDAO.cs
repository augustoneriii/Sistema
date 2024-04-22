using app.Data;
using app.DTO;
using app.DTO.Request;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ProfissionaisDAO
    {
        private AppDbContext _context;

        public ProfissionaisDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProfissionaisDTO>> GetAll(ProfissionaisDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT   \"Sistema\".\"Profissionais\".\"Id\"                                     ");
            objSelect.Append("       , \"Sistema\".\"Profissionais\".\"Nome\"                                   ");
            objSelect.Append("	     , \"Cpf\"                                                                  ");
            objSelect.Append("	     , \"Rg\"                                                                   ");
            objSelect.Append("	     , \"Sistema\".\"Profissionais\".\"Telefone\"                               ");
            objSelect.Append("	     , \"Endereco\"                                                             ");
            objSelect.Append("	     , \"Nascimento\"                                                           ");
            objSelect.Append("	     , \"Sexo\"                                                                 ");
            objSelect.Append("	     , \"Sistema\".\"Profissionais\".\"Email\"                                  ");
            objSelect.Append("       , \"Conselho\"                                                             ");
            objSelect.Append("	     , \"ProfissaoId\"                                                          ");
            objSelect.Append("	     , \"ConvenioId\"                                                           ");
            objSelect.Append("	     , \"Observacoes\"                                                          ");
            objSelect.Append("	     , \"Image\"                                                                ");
            objSelect.Append("	     , \"Sistema\".\"Profissoes\".\"Nome\" AS \"NomeProfissao\"                 ");
            objSelect.Append("	     , \"Sistema\".\"Profissoes\".\"ConselhoProfissional\"                      ");
            objSelect.Append("	     , \"Sistema\".\"ConvenioMedicos\".\"Nome\" AS \"NomeConvenio\"             ");
            objSelect.Append("	     , \"Sistema\".\"ConvenioMedicos\".\"Telefone\" AS \"TelefoneConvenio\"     ");
            objSelect.Append("	     , \"Sistema\".\"ConvenioMedicos\".\"Email\" AS \"EmailConvenio\"           ");
            objSelect.Append("	  FROM \"Sistema\".\"Profissionais\"                                            ");
            objSelect.Append("       LEFT JOIN \"Sistema\".\"Profissoes\" ON \"Profissionais\".\"ProfissaoId\" = \"Profissoes\".\"Id\"");
            objSelect.Append("       LEFT JOIN \"Sistema\".\"ConvenioMedicos\" ON \"Profissionais\".\"ConvenioId\" = \"ConvenioMedicos\".\"Id\"");
            objSelect.Append("	 WHERE 1 = 1                                                                    ");

            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = {dto.Id} ");
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
            if (!string.IsNullOrEmpty(dto.Email))
            {
                objSelect.Append($"AND \"Email\" = '{dto.Email}' ");
            }

            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstProfissionais = new List<ProfissionaisDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstProfissionais.Add(new ProfissionaisDTO
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
                    Conselho = row["Conselho"].ToString(),
                    Observacoes = row["Observacoes"].ToString(),
                    Image = row["Image"].ToString(),
                    Profissoes = new ProfissoesDTO
                    {
                        Id = Convert.ToInt32(row["ProfissaoId"] != DBNull.Value ? Convert.ToInt32(row["ProfissaoId"]) : 0),
                        Nome = row["NomeProfissao"] != DBNull.Value ? row["NomeProfissao"].ToString() : string.Empty,
                        ConselhoProfissional = row["ConselhoProfissional"] != DBNull.Value ? row["ConselhoProfissional"].ToString() : string.Empty
                    },
                    ConvenioMedicos = new List<ConvenioMedicosDTO>
                    {
                        new ConvenioMedicosDTO
                        {
                            Id = Convert.ToInt32(row["ConvenioId"] != DBNull.Value ? Convert.ToInt32(row["ConvenioId"]) : 0),
                            Nome = row["NomeConvenio"] != DBNull.Value ? row["NomeConvenio"].ToString() : string.Empty,
                            Telefone = row["TelefoneConvenio"] != DBNull.Value ? row["TelefoneConvenio"].ToString() : string.Empty,
                            Email = row["EmailConvenio"] != DBNull.Value ? row["EmailConvenio"].ToString() : string.Empty
                        }
                    }
                });

            }
            return lstProfissionais;
        }

        //insert
        public async Task<int> Insert(ProfissionaisRequest dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"Profissionais\" (");
            objInsert.Append("  \"Nome\"                                 ");
            objInsert.Append(", \"Cpf\"                                  ");
            objInsert.Append(", \"Rg\"                                   ");
            objInsert.Append(", \"Telefone\"                             ");
            objInsert.Append(", \"Endereco\"                             ");
            objInsert.Append(", \"Nascimento\"                           ");
            objInsert.Append(", \"Sexo\"                                 ");
            objInsert.Append(", \"Email\"                                ");
            objInsert.Append(", \"Conselho\"                             ");
            objInsert.Append(", \"ProfissaoId\"                          ");
            objInsert.Append(", \"ConvenioId\"                           ");
            objInsert.Append(", \"Observacoes\"                          ");
            objInsert.Append(", \"Image\"                                ");
            objInsert.Append(") VALUES (                                 ");
            objInsert.Append($" '{dto.Nome}',                            ");
            objInsert.Append($" '{dto.Cpf}',                             ");
            objInsert.Append($" '{dto.Rg}',                              ");
            objInsert.Append($" '{dto.Telefone}',                        ");
            objInsert.Append($" '{dto.Endereco}',                        ");
            objInsert.Append($" '{dto.Nascimento:yyyy-MM-dd}',           ");
            objInsert.Append($" '{dto.Sexo}',                            ");
            objInsert.Append($" '{dto.Email}',                           ");
            objInsert.Append($" '{dto.Conselho}',                        ");
            objInsert.Append($"  {dto.ProfissaoId},                      ");
            objInsert.Append($"  {dto.ConvenioId},                       ");
            objInsert.Append($" '{dto.Observacoes}',                     ");
            objInsert.Append($" '{dto.Image}'                            ");
            objInsert.Append(") RETURNING \"Id\";                        ");

            var id = _context.ExecuteNonQuery(objInsert.ToString());

            return id;
        }

        //update
        public async Task<int> Update(ProfissionaisRequest dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"Profissionais\" SET ");
            objUpdate.Append($" \"Nome\" = '{dto.Nome}', ");
            objUpdate.Append($" \"Cpf\" = '{dto.Cpf}', ");
            objUpdate.Append($" \"Rg\" = '{dto.Rg}', ");
            objUpdate.Append($" \"Telefone\" = '{dto.Telefone}', ");
            objUpdate.Append($" \"Endereco\" = '{dto.Endereco}', ");
            objUpdate.Append($" \"Nascimento\" = '{dto.Nascimento:yyyy-MM-dd}', ");
            objUpdate.Append($" \"Sexo\" = '{dto.Sexo}', ");
            objUpdate.Append($" \"Email\" = '{dto.Email}', ");
            objUpdate.Append($" \"Conselho\" = '{dto.Conselho}', ");
            objUpdate.Append($" \"ProfissaoId\" = {dto.ProfissaoId}, ");
            objUpdate.Append($" \"ConvenioId\" = {dto.ProfissaoId}, ");
            objUpdate.Append($" \"Observacoes\" = '{dto.Observacoes}', ");
            objUpdate.Append($" \"Image\" = '{dto.Image}' ");
            objUpdate.Append($" WHERE \"Id\" = {dto.Id} ");

            var id = _context.ExecuteNonQuery(objUpdate.ToString());

            return id;
        }

        //delete
        //public async Task Delete(long? id)
        //{
        //    var objDelete = new StringBuilder();
        //    objDelete.Append("DELETE FROM \"Sistema\".\"Profissionais\" ");
        //    objDelete.Append($" WHERE \"Id\" = {id} ");

        //    _context.ExecuteNonQuery(objDelete.ToString());
        //}
    }
}
