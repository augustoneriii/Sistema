using app.Data;
using app.DAO;
using app.DTO;
using app.DTO.Request;

namespace app.BE
{
    public class PacientesBE
    {
        private AppDbContext _context;

        public PacientesBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<PacientesDTO>> GetAll(PacientesDTO dto)
        {
            var dao = new PacientesDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<int> Insert(PacientesRequest dto)
        {
            var dao = new PacientesDAO(_context);
            return await dao.Insert(dto);
        }

        //update
        public async Task<int> Update(PacientesRequest dto)
        {
            var dao = new PacientesDAO(_context);

            PacientesRequest paciente = new PacientesRequest();
            paciente.Id = Convert.ToInt64(dto.Id);
            paciente.Nome = Convert.ToString(dto.Nome);
            paciente.Cpf = Convert.ToString(dto.Cpf);
            paciente.Rg = Convert.ToString(dto.Rg);
            paciente.Telefone = Convert.ToString(dto.Telefone);
            paciente.Endereco = Convert.ToString(dto.Endereco);
            paciente.Nascimento = Convert.ToDateTime(dto.Nascimento);
            paciente.Sexo = Convert.ToString(dto.Sexo);
            paciente.Email = Convert.ToString(dto.Email);
            paciente.ConvenioId = Convert.ToInt64(dto.ConvenioId);
            paciente.TipoSanguineo = Convert.ToString(dto.TipoSanguineo);
            paciente.Alergias = Convert.ToString(dto.Alergias);
            paciente.Medicamentos = Convert.ToString(dto.Medicamentos);
            paciente.Cirurgias = Convert.ToString(dto.Cirurgias);
            paciente.Historico = Convert.ToString(dto.Historico);
            paciente.Ativo = Convert.ToInt32(dto.Ativo);

            return await dao.Update(paciente);
        }

        //delete
        /*
        public async Task Delete(long dto)
        {
            var dao = new PacientesDAO(_context);
            await dao.Delete(dto);
        }*/
    }
}

