using app.Data;
using app.DAO;
using app.DTO;

namespace app.BE
{
    public class DadosPessoaisBE
    {
        private AppDbContext _context;

        public DadosPessoaisBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<DadosPessoaisDTO>> GetAll(DadosPessoaisDTO dto)
        {
            var dao = new DadosPessoaisDAO(_context);
            return await dao.GetAll(dto);
        }
        //insert
        public async Task<int> Insert(DadosPessoaisDTO dto)
        {
            var dao = new DadosPessoaisDAO(_context);
            return await dao.Insert(dto);
        }
        //update
        public async Task<int> Update(DadosPessoaisDTO dto)
        {
            var dao = new DadosPessoaisDAO(_context);
            return await dao.Update(dto);
        }
    }
}
