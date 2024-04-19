using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using Microsoft.AspNetCore.Authorization;

namespace app.Controllers
{
    public class PacientesController : Controller
    {
        private PacientesBE _be;
        private AppDbContext _context;

        public PacientesController(PacientesBE be, AppDbContext context)
        {
            _be = be;
            _context = context;
        }

        // GET: Pacientes
        [Authorize]
        [Route("getAllPacientes")]
        [HttpGet]
        public async Task<IActionResult> GetAll(PacientesDTO dto)
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

        // POST: Pacientes
        [Authorize]
        [Route("insertPacientes")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PacientesRequest pacientes)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Insert(pacientes);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // PATCH: Pacientes
        [Authorize]
        [Route("updatePacientes")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] PacientesRequest pacientes)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Update(pacientes);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        //Delete: Pacientes
        [Authorize]
        [Route("deletePacientes")]
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
