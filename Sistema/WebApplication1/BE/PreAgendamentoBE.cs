using app.Data;
using app.DAO;
using app.DTO;

namespace app.BE
{
    public class PreAgendamentoBE
    {
        private AppDbContext _context;

        public PreAgendamentoBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<PreAgendamentoDTO>> GetAll(PreAgendamentoDTO dto)
        {
            var dao = new PreAgendamentoDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<PreAgendamentoDTO> Insert(PreAgendamentoDTO preAgendamento)
        {
            var dao = new PreAgendamentoDAO(_context);
            return await dao.Insert(preAgendamento);
        }

        //update
        public async Task<int> Update(PreAgendamentoDTO preAgendamento)
        {
            var dao = new PreAgendamentoDAO(_context);
            return await dao.Update(preAgendamento);
        }

        //delete
        /*
        public async Task Delete(long id)
        {
            var dao = new PreAgendamentoDAO(_context);
            await dao.Delete(id);
        }
        */
    }
}
