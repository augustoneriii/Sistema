using app.Data;
using app.DAO;
using app.DTO;

namespace app.BE
{
    public class RelatorioBE
    {
        private AppDbContext _context;

        public RelatorioBE(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context), "AppDbContext não pode ser nulo.");
        }

        // Get all
        public async Task<List<RelatorioDTO>> GetAll(RelatorioDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "O objeto RelatorioDTO não pode ser nulo.");

            var dao = new RelatorioDAO(_context);
            return await dao.GetAll(dto);
        }
    }
}
