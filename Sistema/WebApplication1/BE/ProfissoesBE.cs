using app.Data;
using app.DAO;
using app.DTO;

namespace app.BE
{
    public class ProfissoesBE
    {
        private AppDbContext _context;

        public ProfissoesBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<ProfissoesDTO>> GetAll(ProfissoesDTO dto)
        {
            var dao = new ProfissoesDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<ProfissoesDTO> Insert(ProfissoesDTO profissoes)
        {
            var dao = new ProfissoesDAO(_context);
            return await dao.Insert(profissoes);
        }

        //update
        public async Task<ProfissoesDTO> Update(ProfissoesDTO profissoes)
        {
            var dao = new ProfissoesDAO(_context);
            return await dao.Update(profissoes);
        }

        //delete
        public async Task Delete(long id)
        {
            var dao = new ProfissoesDAO(_context);
            await dao.Delete(id);
        }
    }
}
