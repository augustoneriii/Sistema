using app.Data;
using app.DAO;
using app.DTO;
using app.DTO.Request;


namespace app.BE
{
    public class ProntuarioMedicoBE
    {
        private AppDbContext _context;

        public ProntuarioMedicoBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<ProntuarioMedicoDTO>> GetAll(ProntuarioMedicoDTO dto)
        {
            var dao = new ProntuarioMedicoDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<int> Insert(ProntuarioMedicoRequest dto)
        {
            var dao = new ProntuarioMedicoDAO(_context);
            return await dao.Insert(dto);
        }

        //update
        public async Task<int> Update(ProntuarioMedicoRequest dto)
        {
            var dao = new ProntuarioMedicoDAO(_context);
            return await dao.Update(dto);
        }

    }
}
