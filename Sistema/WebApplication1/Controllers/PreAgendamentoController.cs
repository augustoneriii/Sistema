using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using Microsoft.AspNetCore.Authorization;

namespace app.Controllers
{
    public class PreAgendamentoController : Controller
    {
        private PreAgendamentoBE _be;
        private AppDbContext _context;

        public PreAgendamentoController(PreAgendamentoBE be, AppDbContext context)
        {
            _be = be;
            _context = context;
        }

        // GET: PreAgendamentos
        [Authorize]
        [Route("getAllPreAgendamento")]
        [HttpGet]
        public async Task<IActionResult> GetAll(PreAgendamentoDTO dto)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.GetAll(dto);
                _context.Commit();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: PreAgendamentos
        [Authorize]
        [Route("insertPreAgendamento")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PreAgendamentoDTO preAgendamento)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Insert(preAgendamento);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // PATCH: PreAgendamentos
        [Authorize]
        [Route("updatePreAgendamento")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] PreAgendamentoDTO preAgendamento)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Update(preAgendamento);
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
