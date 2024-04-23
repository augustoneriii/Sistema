using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;

namespace app.Controllers
{
    public class PacientesController : Controller
    {
        private PacientesBE _be;
        private AppDbContext _context;
        private AuthBE _auth;


        public PacientesController(PacientesBE be, AppDbContext context, AuthBE auth)
        {
            _be = be;
            _context = context;
            _auth = auth;
        }

        private string ExtractAuthToken()
        {
            if (HttpContext.Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                var tokenParts = authHeader.ToString().Split(' ');
                if (tokenParts.Length == 2 && tokenParts[0].Equals("Bearer", StringComparison.OrdinalIgnoreCase))
                {
                    return tokenParts[1].Trim('"');
                }
            }
            return null;
        }

        // GET: Pacientes
        [Route("getAllPacientes")]
        [HttpGet]
        public async Task<IActionResult> GetAll(PacientesDTO dto)
        {
            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                var response = await _be.GetAll(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: Pacientes
        [Route("insertPacientes")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PacientesRequest pacientes)
        {
            try
            {
                var token = ExtractAuthToken();

                UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                /*if (userValidationResponse.IdUserRole != null || userValidationResponse.IdUserRole == "c8fffd")
                {
                    return BadRequest(new { Message = "Usuário não autorizado!" });
                }*/

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
        [Route("updatePacientes")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] PacientesRequest pacientes)
        {
            try
            {
                var token = ExtractAuthToken();

                UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                /*if (userValidationResponse.IdUserRole != null || userValidationResponse.IdUserRole == "c8fffd")
                {
                    return BadRequest(new { Message = "Usuário não autorizado!" });
                }*/

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

        //[Route("deletePacientes")]
        //[HttpDelete]
        ////public async Task<IActionResult> Delete([FromQuery] long id)
        ////{
        ////    try
        ////    {
        ////        var token = ExtractAuthToken();

        ////        UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
        ////        if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
        ////        {
        ////            return BadRequest(new { Message = "Usuário não autenticado!" });
        ////        }

        ////        _context.BeginTransaction();
        ////        await _be.Delete(id);
        ////        _context.Commit();
        ////        return Ok();
        ////    }
        ////    catch (Exception ex)
        ////    {
        ////        _context.Rollback();
        ////        return BadRequest(ex.Message);
        ////    }
        ////}

    }
}