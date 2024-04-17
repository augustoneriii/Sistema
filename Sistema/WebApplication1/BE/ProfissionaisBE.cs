using app.DAO;
using app.Data;
using app.DTO;

namespace app.BE
{
    public class ProfissionaisBE
    {
        private AppDbContext _context;

        public ProfissionaisBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<ProfissionaisDTO>> GetAll(ProfissionaisDTO dto)
        {
            var dao = new ProfissionaisDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<int> Insert(ProfissionaisDTO dto)
        {
            var dao = new ProfissionaisDAO(_context);
            return await dao.Insert(dto);
        }

        //update
        public async Task<int> Update(ProfissionaisDTO dto)
        {
            var dao = new ProfissionaisDAO(_context);
            return await dao.Update(dto);
        }

        //delete
        public async Task Delete(ProfissionaisDTO dto)
        {
            var dao = new ProfissionaisDAO(_context);
             await dao.Delete(dto.Id);
        }
    }
}
