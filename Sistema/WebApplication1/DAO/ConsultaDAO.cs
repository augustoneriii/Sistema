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
            objSelect.Append("SELECT "                                                                                                             );
            objSelect.Append("\"Sistema\".\"Consultas\".\"Id\", "                                                                                  );
            objSelect.Append("\"Sistema\".\"Consultas\".\"Data\", "                                                                                );
            objSelect.Append("TO_CHAR(\"Sistema\".\"Consultas\".\"Hora\", 'HH24:MI:SS') AS \"Hora\", "                                             );
            objSelect.Append("\"Sistema\".\"Consultas\".\"PacienteId\", "                                                                          );
            objSelect.Append("\"Sistema\".\"Consultas\".\"ProfissionalId\", ");
            
            objSelect.Append("\"Sistema\".\"Consultas\".\"Atendida\", "                                                                            );
            objSelect.Append("\"Sistema\".\"Consultas\".\"Status\", "                                                                              );
            objSelect.Append("\"Sistema\".\"Consultas\".\"Tipo\", "                                                                                );
            objSelect.Append("\"Sistema\".\"Consultas\".\"Observacoes\", "                                                                         );
            objSelect.Append("\"Sistema\".\"Consultas\".\"CreatedAt\", "                                                                           );
            objSelect.Append("\"Sistema\".\"Consultas\".\"UpdatedAt\", "                                                                           );
            objSelect.Append("\"Pacientes\".\"Nome\" AS \"NomePacientes\", "                                                                       );
            objSelect.Append("\"Pacientes\".\"Cpf\" AS \"CpfPacientes\", "                                                                         );
            objSelect.Append("\"Pacientes\".\"Telefone\" AS \"TelefonePacientes\", "                                                               );
            objSelect.Append("\"Profissionais\".\"Nome\" AS \"NomeProfissionais\", "                                                               );
            objSelect.Append("\"Profissionais\".\"Email\" AS \"EmailProfissionais\" "                                                              );
            objSelect.Append("FROM \"Sistema\".\"Consultas\" "                                                                                     );
            objSelect.Append("LEFT JOIN \"Sistema\".\"Pacientes\"     ON \"Sistema\".\"Consultas\".\"PacienteId\"      = \"Pacientes\".\"Id\" "             );
            objSelect.Append("LEFT JOIN \"Sistema\".\"Profissionais\" ON \"Sistema\".\"Consultas\".\"ProfissionalId\" = \"Profissionais\".\"Id\" ");
            
            
            objSelect.Append("WHERE 1 = 1"                                                                                                         );


            if (dto.Id > 0)
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
                    Atendida = Convert.ToBoolean(row["Atendida"]),
                    Status = row["Status"].ToString(),
                    Tipo = row["Tipo"].ToString(),
                    Observacoes = row["Observacoes"].ToString(),
                    Pacientes = new PacientesDTO
                    {
                        Id = Convert.ToInt32(row["PacienteId"] != DBNull.Value ? Convert.ToInt32(row["PacienteId"]) : 0),
                        Nome = row["NomePacientes"] != DBNull.Value ? row["NomePacientes"].ToString() : string.Empty,
                        Cpf = row["CpfPacientes"] != DBNull.Value ? row["CpfPacientes"].ToString() : string.Empty,
                        Telefone = row["TelefonePacientes"] != DBNull.Value ? row["TelefonePacientes"].ToString() : string.Empty,
                        
                    },

                    

                    Profissionais = new ProfissionaisDTO
                    {
                        Id = Convert.ToInt32(row["ProfissionalId"] != DBNull.Value ? Convert.ToInt32(row["ProfissionalId"]) : 0),
                        
                        Nome = row["NomeProfissionais"] != DBNull.Value ? row["NomeProfissionais"].ToString() : string.Empty,
                        Email = row["EmailProfissionais"] != DBNull.Value ? row["EmailProfissionais"].ToString() : string.Empty,
                        
                    }
                    

                }); ;
            }
            return lstConsultas;
        }

        //insert
        public async Task<int> Insert(ConsultaRequest dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"Consultas\" (");
            
            objInsert.Append(" \"Data\", ");
            objInsert.Append(" \"Hora\", ");
            objInsert.Append(" \"Atendida\", ");
            objInsert.Append(" \"Status\", ");
            objInsert.Append(" \"Tipo\", ");
            objInsert.Append(" \"Observacoes\", ");
          
            objInsert.Append(" \"PacienteId\", ");
            objInsert.Append(" \"ProfissionalId\" ");


            objInsert.Append(") VALUES (");
            
            objInsert.Append($" '{dto.Data}', ");
            objInsert.Append($" '{dto.Hora}', ");
            objInsert.Append($" '{dto.Atendida:  1 : 0}', "); // Correção na definição de Atendida
            objInsert.Append($" '{dto.Status}', ");
            objInsert.Append($" '{dto.Tipo}', ");
            objInsert.Append($" '{dto.Observacoes}', ");
            objInsert.Append($" '{dto.PacienteId}', ");
            objInsert.Append($" '{dto.ProfissionalId}' ");


            objInsert.Append(" ); ");
            
            var id = _context.ExecuteNonQuery(objInsert.ToString());

            return id;
        }

        //Update
        public async Task<int> Update(ConsultaRequest dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"Consultas\" SET ");
            objUpdate.Append($" \"Data\" = '{dto.Data:yyyy-MM-dd}', ");
            objUpdate.Append($" \"Hora\" = '{dto.Hora}', ");
            objUpdate.Append($" \"Atendida\" = '{dto.Atendida}', ");
            objUpdate.Append($" \"Status\" = '{dto.Status}', ");
            objUpdate.Append($" \"Tipo\" = '{dto.Tipo}', ");
            objUpdate.Append($" \"Observacoes\" = '{dto.Observacoes}' ");
            
         
            objUpdate.Append($"WHERE \"Id\" = {dto.Id}; ");

            var id = _context.ExecuteNonQuery(objUpdate.ToString());

            return id;
        }

        ////Delete
        //public async Task Delete(long? id)
        //{
        //    var objDelete = new StringBuilder();
        //    objDelete.Append("DELETE FROM \"Sistema\".\"Consultas\" ");
        //    objDelete.Append($" WHERE \"Id\" = {id} ");

        //    _context.ExecuteNonQuery(objDelete.ToString());
        //}
    }
}
