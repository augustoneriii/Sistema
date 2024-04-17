using app.DAO;
using app.Data;
using app.DTO;

namespace app.BE
{
    public class ConsultaBE
    {
        private AppDbContext _context;

        public ConsultaBE(AppDbContext context)
        {
            _context = context;
        }

        //get all
        public async Task<List<ConsultaDTO>> GetAll(ConsultaDTO dto)
        {
            var dao = new ConsultaDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<ConsultaDTO> Insert(ConsultaDTO consulta)
        {
            var dao = new ConsultaDAO(_context);
            return await dao.Insert(consulta);
        }

        //update
        public async Task<ConsultaDTO> Update(ConsultaDTO Consulta)
        {
            var dao = new ConsultaDAO(_context);
            return await dao.Update(Consulta);
        }

        //delete
        public async Task Delete(long id)
        {
            var dao = new ConsultaDAO(_context);
            await dao.Delete(id);
        }
    }
}
