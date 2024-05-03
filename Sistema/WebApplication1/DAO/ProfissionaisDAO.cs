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
            objSelect.Append("SELECT p.*, pc.\"ProfissionalConveniosId\" ");
            objSelect.Append("FROM \"Sistema\".\"Profissionais\" p ");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ProfissionalConvenios\" pc ON p.\"Id\" = pc.\"ProfissionalId\" ");
            objSelect.Append("WHERE 1 = 1 ");

            var parameters = new List<NpgsqlParameter>();

            if (filter.Id != null)
            {
                objSelect.Append(" AND p.\"Id\" = @Id ");
                parameters.Add(new NpgsqlParameter("@Id", filter.Id));
            }

            if (!string.IsNullOrEmpty(filter.Nome))
            {
                objSelect.Append(" AND p.\"Nome\" LIKE @Nome ");
                parameters.Add(new NpgsqlParameter("@Nome", $"%{filter.Nome}%"));
            }

            if (!string.IsNullOrEmpty(filter.Cpf))
            {
                objSelect.Append(" AND p.\"Cpf\" LIKE @Cpf ");
                parameters.Add(new NpgsqlParameter("@Cpf", $"%{filter.Cpf}%"));
            }

            if (!string.IsNullOrEmpty(filter.Email))
            {
                objSelect.Append(" AND p.\"Email\" LIKE @Email ");
                parameters.Add(new NpgsqlParameter("@Email", $"%{filter.Email}%"));
            }

            var dt = await _context.ExecuteQuery(objSelect.ToString(), parameters.ToArray());

            var lstProfissionais = new List<ProfissionaisDTO>();
            var profissionalConvenios = new Dictionary<long, List<long>>();

            foreach (DataRow row in dt.Rows)
            {
                long profissionalId = Convert.ToInt64(row["Id"]);
                if (!lstProfissionais.Any(p => p.Id == profissionalId))
                {
                    lstProfissionais.Add(new ProfissionaisDTO
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
                        Observacoes = row["Observacoes"].ToString(),
                        Image = row["Image"].ToString(),
                        Ativo = Convert.ToInt32(row["Ativo"]),
                        ConvenioMedicos = new List<ConvenioMedicosDTO>()
                    });
                }

                if (row["ProfissionalConveniosId"] != DBNull.Value)
                {
                    long convenioId = Convert.ToInt64(row["ProfissionalConveniosId"]);
                    profissionalConvenios[profissionalId] ??= new List<long>();
                    if (!profissionalConvenios[profissionalId].Contains(convenioId))
                    {
                        profissionalConvenios[profissionalId].Add(convenioId);
                        lstProfissionais.First(p => p.Id == profissionalId).ConvenioMedicos.Add(new ConvenioMedicosDTO { Id = convenioId });
                    }
                }
            }

            return lstProfissionais;
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
