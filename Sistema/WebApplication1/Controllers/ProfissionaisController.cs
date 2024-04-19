using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace app.Controllers
{
    public class ProfissionaisController : Controller
    {
        private ProfissionaisBE _be;
        private AppDbContext _context;

        public ProfissionaisController(ProfissionaisBE be, AppDbContext context)
        {
            _be = be;
            _context = context;
        }

        // GET: Profissionais
        [Authorize]
        [Route("getAllProfissionais")]
        [HttpGet]
        public async Task<IActionResult> GetAll(ProfissionaisDTO dto)
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

        // POST: Profissionais
        [Authorize]
        [Route("insertProfissionais")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ProfissionaisRequest profissionais)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Insert(profissionais);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // PATCH: Profissionais
        [Authorize]
        [Route("updateProfissionais")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] ProfissionaisRequest profissionais)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Update(profissionais);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // DELETE: Profissionais
        [Authorize]
        [Route("deleteProfissionais")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] long id)
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
