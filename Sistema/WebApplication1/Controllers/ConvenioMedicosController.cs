using app.BE;
using app.Data;
using app.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace app.Controllers
{
    
    public class ConvenioMedicosController : Controller
    {
        private ConvenioMedicosBE _be;
        private AppDbContext _context;

        public ConvenioMedicosController(ConvenioMedicosBE be, AppDbContext context)
        {
            _be = be;
            _context = context;
        }

        // GET: ConvenioMedicos
        //* [Authorize]
        [Route("getAllConvenioMedicos")]
        [HttpGet]
        public async Task<IActionResult> GetAll(ConvenioMedicosDTO dto)
        {
            try
            {
                var response = await _be.GetAll(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: ConvenioMedicos


        //* [Authorize]
        [HttpPost]
        [Route("insertConvenioMedicos")]
        public async Task<IActionResult> Insert([FromBody] ConvenioMedicosDTO convenioMedicos)
        {
            try
            {
                _context.BeginTransaction();  
                var response = await _be.Insert(convenioMedicos);
                _context.Commit();  
                return Ok(response);
            }
            catch (Exception ex)
            {
                _context.Rollback();  
                return BadRequest(ex.Message);
            }
        }

        // PATCH: ConvenioMedicos
        // [Authorize]
        [Route("updateConvenioMedicos")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] ConvenioMedicosDTO convenioMedicos)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Update(convenioMedicos);
                _context.Commit();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // DELETE: ConvenioMedicos
        // [Authorize]
        [Route("deleteConvenioMedicos")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int id)
        {
            try
            {
                _context.BeginTransaction();
                await _be.Delete(id);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }
    }
}
