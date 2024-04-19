using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using Microsoft.AspNetCore.Authorization;

namespace app.Controllers
{
    public class ProfissoesController : Controller
    {
        private ProfissoesBE _be;
        private AppDbContext _context;

        public ProfissoesController(ProfissoesBE be, AppDbContext context)
        {
            _be = be;
            _context = context;
        }

        // GET: Profissoes
        [HttpGet]
        [Authorize]
        [Route("getAllProfissoes")]
        public async Task<IActionResult> GetAll(ProfissoesDTO dto)
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

        // POST: Profissoes
        [Authorize]
        [Route("insertProfissoes")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ProfissoesDTO profissoes)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Insert(profissoes);
                _context.Commit();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // PATCH: Profissoes
        [Authorize]
        [Route("updateProfissoes")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] ProfissoesDTO profissoes)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Update(profissoes);
                _context.Commit();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // DELETE: Profissoes
        [Authorize]
        [Route("deleteProfissoes")]
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
