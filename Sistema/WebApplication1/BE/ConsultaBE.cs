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
        public async Task<int> Insert(ConsultaDTO dto)
        {
            var dao = new ConsultaDAO(_context);
            return await dao.Insert(dto);
        }

        //update
        public async Task<int> Update(ConsultaDTO dto)
        {
            var dao = new ConsultaDAO(_context);
            return await dao.Update(dto);
        }

        //delete
        public async Task Delete(long id)
        {
            var dao = new ConsultaDAO(_context);
            await dao.Delete(id);
        }
    }
}
