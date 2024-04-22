using app.DAO;
using app.Data;
using app.DTO;

namespace app.BE
{
    public class ConvenioMedicosBE
    {
        private AppDbContext _context;

        public ConvenioMedicosBE(AppDbContext context)
        {
            _context = context;
        }

        //gel all
        public async Task<List<ConvenioMedicosDTO>> GetAll(ConvenioMedicosDTO dto)
        {
            var dao = new ConvenioMedicosDAO(_context);
            return await dao.GetAll(dto);
        }

        //insert
        public async Task<ConvenioMedicosDTO> Insert(ConvenioMedicosDTO convenioMedicos)
        {
            var dao = new ConvenioMedicosDAO(_context);
            return await dao.Insert(convenioMedicos);
        }

        //update
        public async Task<ConvenioMedicosDTO> Update(ConvenioMedicosDTO convenioMedicos)
        {
            var dao = new ConvenioMedicosDAO(_context);
            return await dao.Update(convenioMedicos);
        }

        //delete
        /*public async Task Delete(long id)
        {
            var dao = new ConvenioMedicosDAO(_context);
            await dao.Delete(id);
        }*/

    }
}
