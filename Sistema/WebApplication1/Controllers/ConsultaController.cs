using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using Microsoft.AspNetCore.Authorization;
using app.DTO.Request;


namespace app.Controllers
{
    public class ConsultaController : Controller
    {
        private ConsultaBE _be;
        private AppDbContext _context;

        public ConsultaController(ConsultaBE be, AppDbContext context)
        {
            _be = be;
            _context = context;
        }

        //GET: Consultas
      
        [Route("getAllConsultas")]
        [HttpGet]
        public async Task<IActionResult> GetAll(ConsultaDTO dto)
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

        
        [Route("insertConsulta")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ConsultaRequest consulta)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Insert(consulta);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // PATCH: Consulta
       
        [Route("updateConsulta")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] ConsultaRequest consulta)
        {
            try
            {
                _context.BeginTransaction();
                var response = await _be.Update(consulta);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        //Delete: Consulta
        
        [Route("deleteConsulta")]
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
