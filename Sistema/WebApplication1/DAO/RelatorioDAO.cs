using app.BE;
using app.Data;
using app.DTO;
using System.Data;
using System.Text;


namespace app.DAO
{
    public class RelatorioDAO
    {
        private AppDbContext _context;

        public RelatorioDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<RelatorioDTO>> GetAll(RelatorioDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Sistema\".\"Consultas\".\"Id\",                               ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"Data\",                                    ");
            objSelect.Append("TO_CHAR(\"Sistema\".\"Consultas\".\"Hora\", 'HH24:MI') AS \"Hora\", ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"PacienteId\",                              ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"ProfissionalId\",                          ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"Atendida\",                                ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"Status\",                                  ");
            objSelect.Append("\"ConvenioMedicosPacientes\".\"Nome\" AS \"NomeConvenioPaciente\",");
            objSelect.Append("\"ConvenioMedicosProfissionais\".\"Nome\" AS \"NomeConvenioProfissional\",");
            objSelect.Append("\"Sistema\".\"Consultas\".\"Tipo\",                                    ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"Observacoes\",                             ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"CreatedAt\",                               ");
            objSelect.Append("\"Sistema\".\"Consultas\".\"UpdatedAt\",                               ");
            objSelect.Append("\"Pacientes\".\"Nome\" AS \"NomePacientes\",                           ");
            objSelect.Append("\"Pacientes\".\"Cpf\" AS \"CpfPacientes\",                             ");
            objSelect.Append("\"Pacientes\".\"Telefone\" AS \"TelefonePacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Sexo\" AS \"SexoPacientes\",                   ");
            objSelect.Append("\"Profissionais\".\"Nome\" AS \"NomeProfissionais\",                   ");
            objSelect.Append("\"Profissionais\".\"Email\" AS \"EmailProfissionais\",                 ");
            objSelect.Append("\"Profissionais\".\"Cpf\" AS \"CpfProfissionais\"                      ");
            objSelect.Append("FROM \"Sistema\".\"Consultas\"                                         ");
            objSelect.Append("LEFT JOIN \"Sistema\".\"Pacientes\" ON \"Sistema\".\"Consultas\".\"PacienteId\" = \"Pacientes\".\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"Profissionais\" ON \"Sistema\".\"Consultas\".\"ProfissionalId\" = \"Profissionais\".\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ConvenioMedicos\" AS \"ConvenioMedicosPacientes\" ON \"Pacientes\".\"ConvenioId\" = \"ConvenioMedicosPacientes\".\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ConvenioMedicos\" AS \"ConvenioMedicosProfissionais\" ON \"Profissionais\".\"ConvenioId\" = \"ConvenioMedicosProfissionais\".\"Id\"");


            objSelect.Append("WHERE 1 = 1 ");


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
            if (!string.IsNullOrEmpty(dto.Observacoes))
            {
                objSelect.Append($"AND \"Observacoes\" = '{dto.Observacoes}' ");
            }

            if (!string.IsNullOrEmpty(dto.Profissionais?.Cpf))
            {
                objSelect.Append($"AND \"Profissionais\".\"Cpf\" = '{dto.Profissionais.Cpf}' ");
            }

            var dt = _context.ExecuteQuery(objSelect.ToString());

            var lstRelatorios = new List<RelatorioDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstRelatorios.Add(new RelatorioDTO()
                {
                    //Id = Convert.ToInt32(row["Id"]),

                    
                        Id = Convert.ToInt32(row["Id"] != DBNull.Value ? Convert.ToInt32(row["Id"]) : 0),
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
                            Sexo = row["SexoPacientes"].ToString(),
                            Convenio = new ConvenioMedicosDTO
                            { 
                                Nome = row["NomeConvenioPaciente"].ToString() // Obtém o nome do convênio
                            }
                        },
                        Profissionais = new ProfissionaisDTO
                        {
                            Id = Convert.ToInt32(row["ProfissionalId"] != DBNull.Value ? Convert.ToInt32(row["ProfissionalId"]) : 0),

                            Nome = row["NomeProfissionais"] != DBNull.Value ? row["NomeProfissionais"].ToString() : string.Empty,
                            Email = row["EmailProfissionais"] != DBNull.Value ? row["EmailProfissionais"].ToString() : string.Empty,
                            Cpf = row["CpfProfissionais"] != DBNull.Value ? row["CpfProfissionais"].ToString() : string.Empty,

                            ConvenioMedicos = new List<ConvenioMedicosDTO>
                            {
                                new ConvenioMedicosDTO
                                {

                                    Nome = row["NomeConvenioProfissional"] != DBNull.Value ? row["NomeConvenioProfissional"].ToString() : string.Empty,
                                }
                            }
                        }
                    
                    
                }); ;
            }
            return lstRelatorios;
        }
    }
}
