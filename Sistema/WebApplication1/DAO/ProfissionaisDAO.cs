using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using Npgsql;
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

        //get all Profissionais with filters and ProfissionalConvenios by profissionalId
        public async Task<List<ProfissionaisDTO>> GetAll(ProfissionaisDTO filter)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT");
            objSelect.Append("    p.\"Id\" AS \"Id\",");
            objSelect.Append("    p.\"Nome\" AS \"Nome\",");
            objSelect.Append("    p.\"Cpf\" AS \"Cpf\",");
            objSelect.Append("    p.\"Rg\" AS \"Rg\",");
            objSelect.Append("    p.\"Telefone\" AS \"Telefone\",");
            objSelect.Append("    p.\"Endereco\" AS \"Endereco\",");
            objSelect.Append("    p.\"Nascimento\" AS \"Nascimento\",");
            objSelect.Append("    p.\"Sexo\" AS \"Sexo\",");
            objSelect.Append("    p.\"Email\" AS \"Email\",");
            objSelect.Append("    p.\"Conselho\" AS \"Conselho\",");
            objSelect.Append("    p.\"Observacoes\" AS \"Observacoes\",");
            objSelect.Append("    p.\"Ativo\" AS \"Ativo\",");
            objSelect.Append("    c.\"Id\" AS \"ConvenioId\",");
            objSelect.Append("    c.\"Nome\" AS \"ConvenioNome\",");
            objSelect.Append("    c.\"Telefone\" AS \"ConvenioTelefone\",");
            objSelect.Append("    c.\"Email\" AS \"ConvenioEmail\",");
            objSelect.Append("   pr.\"Id\" AS \"ProfissaoId\",");
            objSelect.Append("   pr.\"Nome\" AS \"ProfissaoNome\",");
            objSelect.Append("   pr.\"ConselhoProfissional\" AS \"ConselhoProfissional\"");
            objSelect.Append("FROM");
            objSelect.Append("    \"Sistema\".\"Profissionais\" p ");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ProfissionalConvenios\" pc ON p.\"Id\" = pc.\"ProfissionalId\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ConvenioMedicos\" c ON pc.\"ConvenioId\" = c.\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"Profissoes\" pr ON p.\"ProfissaoId\" = pr.\"Id\";");

            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var list = new List<ProfissionaisDTO>();

            if (dt != null)
            {
                foreach (DataRow row in dt.Rows)
                {
                    int profissionalId = Convert.ToInt32(row["Id"]);
                    var profissional = list.FirstOrDefault(p => p.Id == profissionalId);

                    if (profissional == null)
                    {
                        profissional = new ProfissionaisDTO
                        {
                            Id = profissionalId,
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
                            Ativo = Convert.ToInt32(row["Ativo"]),
                            ConvenioMedicos = new List<ConvenioMedicosDTO>(),
                            Profissoes = new ProfissoesDTO
                            {
                                Id = Convert.ToInt32(row["ProfissaoId"]),
                                Nome = row["ProfissaoNome"].ToString(),
                                ConselhoProfissional = row["ConselhoProfissional"].ToString()
                            }
                        };
                        list.Add(profissional);
                    }

                    // Adicionando convenio ao profissional já existente na lista
                    profissional.ConvenioMedicos.Add(new ConvenioMedicosDTO
                    {
                        Id = Convert.ToInt32(row["ConvenioId"]),
                        Nome = row["ConvenioNome"].ToString(),
                        Telefone = row["ConvenioTelefone"].ToString(),
                        Email = row["ConvenioEmail"].ToString()
                    });
                }
            }

            return list;
        }





        //get ProfissionalConvenios by profissionalId
        public async Task<List<ProfissionalConvenios>> GetProfissionalConvenios(long? profissionalId)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Id\", \"ProfissionalId\", \"ConvenioId\" ");
            objSelect.Append("FROM \"Sistema\".\"ProfissionalConvenios\" ");
            objSelect.Append($"WHERE \"ProfissionalId\" = {profissionalId} ");

            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var lstProfissionalConvenios = new List<ProfissionalConvenios>();

            foreach (DataRow row in dt.Rows)
            {
                lstProfissionalConvenios.Add(new ProfissionalConvenios
                {
                    Id = Convert.ToInt32(row["Id"]),
                    ProfissionalId = Convert.ToInt32(row["ProfissionalId"]),
                    ConvenioId = Convert.ToInt32(row["ConvenioId"])
                });
            }

            return lstProfissionalConvenios;
        }


        //insert
        public async Task<int> Insert(ProfissionaisRequest dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"Profissionais\" ( ");
            objInsert.Append("  \"Nome\"                                  ");
            objInsert.Append(", \"Cpf\"                                   ");
            objInsert.Append(", \"Rg\"                                    ");
            objInsert.Append(", \"Telefone\"                              ");
            objInsert.Append(", \"Endereco\"                              ");
            objInsert.Append(", \"Nascimento\"                            ");
            objInsert.Append(", \"Sexo\"                                  ");
            objInsert.Append(", \"Email\"                                 ");
            objInsert.Append(", \"Conselho\"                              ");
            objInsert.Append(", \"ProfissaoId\"                           ");
            objInsert.Append(", \"Observacoes\"                           ");
            objInsert.Append(", \"Image\"                                 ");
            objInsert.Append(", \"Ativo\"                                 ");
            objInsert.Append(") VALUES (                                  ");
            objInsert.Append($" '{dto.Nome}',                             ");
            objInsert.Append($" '{dto.Cpf}',                              ");
            objInsert.Append($" '{dto.Rg}',                               ");
            objInsert.Append($" '{dto.Telefone}',                         ");
            objInsert.Append($" '{dto.Endereco}',                         ");
            objInsert.Append($" '{dto.Nascimento:yyyy-MM-dd}',            ");
            objInsert.Append($" '{dto.Sexo}',                             ");
            objInsert.Append($" '{dto.Email}',                            ");
            objInsert.Append($" '{dto.Conselho}',                         ");
            objInsert.Append($" '{dto.ProfissaoId}',                      ");
            objInsert.Append($" '{dto.Observacoes}',                      ");
            objInsert.Append($" '{dto.Image}',                            ");
            objInsert.Append($" '{dto.Ativo}'                             ");
            objInsert.Append(") RETURNING \"Id\";                         ");

            // Execute the command and get the new ID
            dto.Id = await _context.ExecuteNonQuery(objInsert.ToString(), null);

            if (dto.ProfissionalConveniosId != null && dto.ProfissionalConveniosId.Any())
            {
                await InsertProfissionaiConvenios(dto);
            }

            return Convert.ToInt32(dto.Id);
        }

        //insert ProfissionalConvenios
        public async Task<List<ProfissionalConvenios>> InsertProfissionaiConvenios(ProfissionaisRequest request)
        {
            var lstProfissionalConvenios = new List<ProfissionalConvenios>();

            foreach (var item in request.ProfissionalConveniosId)
            {
                var objInsert = new StringBuilder();
                objInsert.Append("INSERT INTO \"Sistema\".\"ProfissionalConvenios\" (");
                objInsert.Append("\"ProfissionalId\", \"ConvenioId\") ");
                objInsert.Append("VALUES ");
                objInsert.Append($"( '{request.Id}', '{item}' )");

                var id = await _context.ExecuteNonQuery(objInsert.ToString(), null);

                lstProfissionalConvenios.Add(new ProfissionalConvenios
                {
                    Id = id,
                    ProfissionalId = request.Id,
                    ConvenioId = item
                });
            }

            return lstProfissionalConvenios;
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
            objUpdate.Append($" \"ProfissaoId\" = '{dto.ProfissaoId}', ");
            objUpdate.Append($" \"ProfissionalConveniosId\" = '{dto.ProfissionalConveniosId}', ");
            objUpdate.Append($" \"Observacoes\" = '{dto.Observacoes}', ");
            objUpdate.Append($" \"Image\" = '{dto.Image}', ");
            objUpdate.Append($" \"Ativo\" = '{dto.Ativo}' ");
            objUpdate.Append($" WHERE \"Id\" = '{dto.Id}' ");

            var id = await _context.ExecuteNonQuery(objUpdate.ToString(), null);

            return id;
        }

        //update ProfissionalConvenios
        public async Task<ProfissionalConvenios> UpdateProfissionaiConvenios(ProfissionaisRequest request)
        {
            // Excluir todos os vínculos existentes para o profissional especificado
            var objDelete = new StringBuilder();
            objDelete.Append("DELETE FROM \"Sistema\".\"ProfissionalConvenios\" ");
            objDelete.Append($"WHERE \"ProfissionalId\" = {request.Id} ");

            var paramDel = new
            {
                ProfissionalId = request.Id
            };

            await _context.ExecuteNonQuery(objDelete.ToString(), paramDel);

            // Preparando para re-inserir os novos vínculos
            var objInsert = new StringBuilder();
            int lastInsertedId = 0;  // Variável para armazenar o último ID inserido
            foreach (var convenioId in request.ProfissionalConveniosId)
            {
                objInsert.Clear();
                objInsert.Append("INSERT INTO \"Sistema\".\"ProfissionalConvenios\" (\"ProfissionalId\", \"ConvenioId\") ");
                objInsert.Append($"VALUES ('{request.Id}', '{convenioId}') ");
                objInsert.Append("ON CONFLICT (\"ProfissionalId\", \"ConvenioId\") DO NOTHING;"); // Ignorar conflitos

                var param = new
                {
                    ProfissionalId = request.Id,
                    ConvenioId = convenioId
                };

                // Executar a inserção e capturar o último ID inserido
                lastInsertedId = await _context.ExecuteNonQuery(objInsert.ToString(), param);
            }

            // Retornar o último ProfissionalConvenios modificado ou inserido
            return new ProfissionalConvenios
            {
                Id = lastInsertedId,  // Este ID pode não ser significativo se não houver inserções novas
                ProfissionalId = request.Id,
                ConvenioId = request.ProfissionalConveniosId.FirstOrDefault()  // Retorna o primeiro ID de convenio, se existir
            };
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
