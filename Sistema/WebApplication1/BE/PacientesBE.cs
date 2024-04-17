using app.Data;
using app.DAO;
using app.DTO;

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
        public async Task<int> Insert(PacientesDTO dto)
        {
            var dao = new PacientesDAO(_context);
            return await dao.Insert(dto);
        }

        //update
        public async Task<int> Update(PacientesDTO dto)
        {
            var dao = new PacientesDAO(_context);
            return await dao.Update(dto);
        }

        //delete
        public async Task Delete(long dto)
        {
            var dao = new PacientesDAO(_context);
            await dao.Delete(dto);
        }
    }
}

