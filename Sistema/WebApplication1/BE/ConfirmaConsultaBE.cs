using app.DAO;
using app.Data;
using app.DTO;

namespace app.BE
{
    public class ConfirmaConsultaBE
    {
        private AppDbContext _context;

        public ConfirmaConsultaBE(AppDbContext context)
        {
            _context = context;
        }

        //get all
        public async Task<List<ConfirmaConsultaDTO>> GetAll(ConfirmaConsultaDTO dto)
        {
            var dao = new ConfirmaConsultaDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<long> Insert(ConfirmaConsultaDTO dto)
        {
            var dao = new ConfirmaConsultaDAO(_context);
            return await dao.Insert(dto);
        }
    }
}
