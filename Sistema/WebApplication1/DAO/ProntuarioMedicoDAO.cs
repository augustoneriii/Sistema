using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ProntuarioMedicoDAO
    {

        private AppDbContext _context;

        public ProntuarioMedicoDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProntuarioMedicoDTO>> GetAll(ProntuarioMedicoDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Sistema\".\"ProntuarioMedico\".\"Id\",                               ");
            objSelect.Append("\"Sistema\".\"ProntuarioMedico\".\"PacienteId\",                              ");
            objSelect.Append("\"Sistema\".\"ProntuarioMedico\".\"ProfissionalId\",                          ");
            objSelect.Append("\"ConvenioMedicosPacientes\".\"Nome\" AS \"NomeConvenioPaciente\",");
            objSelect.Append("\"ConvenioMedicosProfissionais\".\"Nome\" AS \"NomeConvenioProfissional\",");
            objSelect.Append("\"Sistema\".\"ProntuarioMedico\".\"PrescricaoMedicamentos\",                                    ");
            objSelect.Append("\"Sistema\".\"ProntuarioMedico\".\"EvolucaoPaciente\",                             ");
            objSelect.Append("\"Sistema\".\"ProntuarioMedico\".\"CreatedAt\",                               ");
            objSelect.Append("\"Sistema\".\"ProntuarioMedico\".\"UpdatedAt\",                               ");
            objSelect.Append("\"Pacientes\".\"Nome\" AS \"NomePacientes\",                           ");
            objSelect.Append("\"Pacientes\".\"Cpf\" AS \"CpfPacientes\",                             ");
            objSelect.Append("\"Pacientes\".\"Telefone\" AS \"TelefonePacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Sexo\" AS \"SexoPacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Endereco\" AS \"EnderecoPacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"TipoSanguineo\" AS \"TipoSanguineoPacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Alergias\" AS \"AlergiasPacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Medicamentos\" AS \"MedicamentosPacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Cirurgias\" AS \"CirurgiasPacientes\",                   ");
            objSelect.Append("\"Pacientes\".\"Historico\" AS \"HistoricoPacientes\",                   ");
            objSelect.Append("\"Profissionais\".\"Nome\" AS \"NomeProfissionais\",                   ");
            objSelect.Append("\"Profissionais\".\"Email\" AS \"EmailProfissionais\",                 ");
            objSelect.Append("\"Profissionais\".\"Conselho\" AS \"ConselhoProfissionais\"                      ");
            objSelect.Append("FROM \"Sistema\".\"ProntuarioMedico\"                                         ");
            objSelect.Append("LEFT JOIN \"Sistema\".\"Pacientes\" ON \"Sistema\".\"ProntuarioMedico\".\"PacienteId\" = \"Pacientes\".\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"Profissionais\" ON \"Sistema\".\"ProntuarioMedico\".\"ProfissionalId\" = \"Profissionais\".\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ConvenioMedicos\" AS \"ConvenioMedicosPacientes\" ON \"Pacientes\".\"ConvenioId\" = \"ConvenioMedicosPacientes\".\"Id\"");
            objSelect.Append("LEFT JOIN \"Sistema\".\"ConvenioMedicos\" AS \"ConvenioMedicosProfissionais\" ON \"Profissionais\".\"ConvenioId\" = \"ConvenioMedicosProfissionais\".\"Id\"");


            objSelect.Append("WHERE 1 = 1 ");


            if (dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = '{dto.Id}'");

            }
            if (!string.IsNullOrEmpty(dto.PrescricaoMedicamentos))
            {
                objSelect.Append($"AND \"PrescricaoMedicamentos\" = '{dto.PrescricaoMedicamentos}'");
            }
            if (!string.IsNullOrEmpty(dto.EvolucaoPaciente))
            {
                objSelect.Append($"AND \"EvolucaoPaciente\" = '{dto.EvolucaoPaciente}' ");
            }    

            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var lstProntuarios = new List<ProntuarioMedicoDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstProntuarios.Add(new ProntuarioMedicoDTO()
                {
                    //Id = Convert.ToInt32(row["Id"]),


                    Id = Convert.ToInt32(row["Id"] != DBNull.Value ? Convert.ToInt32(row["Id"]) : 0), 
                    PrescricaoMedicamentos = row["PrescricaoMedicamentos"].ToString(),
                    EvolucaoPaciente = row["EvolucaoPaciente"].ToString(),
                    
                    Pacientes = new PacientesDTO
                    {
                        Id = Convert.ToInt32(row["PacienteId"] != DBNull.Value ? Convert.ToInt32(row["PacienteId"]) : 0),
                        Nome = row["NomePacientes"] != DBNull.Value ? row["NomePacientes"].ToString() : string.Empty,
                        Cpf = row["CpfPacientes"] != DBNull.Value ? row["CpfPacientes"].ToString() : string.Empty,
                        Telefone = row["TelefonePacientes"] != DBNull.Value ? row["TelefonePacientes"].ToString() : string.Empty,
                        Sexo = row["SexoPacientes"].ToString(),
                        Endereco = row["EnderecoPacientes"] != DBNull.Value ? row["EnderecoPacientes"].ToString() : string.Empty,
                        TipoSanguineo = row["TipoSanguineoPacientes"] != DBNull.Value ? row["TipoSanguineoPacientes"].ToString() : string.Empty,
                        Alergias = row["AlergiasPacientes"] != DBNull.Value ? row["AlergiasPacientes"].ToString() : string.Empty,
                        Medicamentos = row["MedicamentosPacientes"] != DBNull.Value ? row["MedicamentosPacientes"].ToString() : string.Empty,
                        Cirurgias = row["CirurgiasPacientes"] != DBNull.Value ? row["CirurgiasPacientes"].ToString() : string.Empty,
                        Historico = row["HistoricoPacientes"] != DBNull.Value ? row["HistoricoPacientes"].ToString() : string.Empty,
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
                        Conselho = row["ConselhoProfissionais"] != DBNull.Value ? row["ConselhoProfissionais"].ToString() : string.Empty,

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
            return lstProntuarios;
        }

        //insert
        public async Task<int> Insert(ProntuarioMedicoRequest dto)
        {
            var objInsert = new StringBuilder();
            objInsert.Append("INSERT INTO \"Sistema\".\"ProntuarioMedico\" (");
            objInsert.Append("  \"PacienteId\", ");
            objInsert.Append("  \"ProfissionalId\", ");
            objInsert.Append("  \"PrescricaoMedicamentos\", ");
            objInsert.Append("  \"EvolucaoPaciente\" ");

            objInsert.Append(" ) VALUES ( ");
            objInsert.Append($" '{dto.PacienteId}', ");
            objInsert.Append($" '{dto.ProfissionalId}', ");
            objInsert.Append($" '{dto.PrescricaoMedicamentos}', ");
            objInsert.Append($" '{dto.EvolucaoPaciente}' ");
            objInsert.Append(" )RETURNING \"Id\"; ");

            var id = await _context.ExecuteNonQuery(objInsert.ToString(), null);

            return id;
        }

        //update
        public async Task<int> Update(ProntuarioMedicoRequest dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"ProntuarioMedico\" SET ");
            objUpdate.Append($"\"PacienteId\" = '{dto.PacienteId}', ");
            objUpdate.Append($"\"ProfissionalId\" = ' {dto.ProfissionalId}', ");
            objUpdate.Append($"\"PrescricaoMedicamentos\" = '{dto.PrescricaoMedicamentos}', ");
            objUpdate.Append($"\"EvolucaoPaciente\" = '{dto.EvolucaoPaciente}' ");
            objUpdate.Append($"WHERE \"Id\" = {dto.Id};");

            var id = await _context.ExecuteNonQuery(objUpdate.ToString(), null);
            return id;

        }
    }
}
