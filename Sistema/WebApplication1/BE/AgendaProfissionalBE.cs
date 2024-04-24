using app.DAO;
using app.Data;
using app.DTO;
using app.DTO.Request;

namespace app.BE
{
    public class AgendaProfissionalBE
    {
        private AppDbContext _context;

        public AgendaProfissionalBE(AppDbContext context)
        {
            _context = context;
        }

        //get all
        public async Task<List<AgendaProfissionalDTO>> GetAll(AgendaProfissionalDTO dto)
        {
            var dao = new AgendaProfissionalDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<int> Insert(AgendaProfissionalRequest dto)
        {
            var dao = new AgendaProfissionalDAO(_context);
            return await dao.Insert(dto);
        }

        //update
        public async Task<int> Update(AgendaProfissionalRequest dto)
        {
            var dao = new AgendaProfissionalDAO(_context);
            return await dao.Update(dto);
        }

        //delete
        public async Task Delete(long id)
        {
            var dao = new AgendaProfissionalDAO(_context);
            await dao.Delete(id);
        }
    }

}

