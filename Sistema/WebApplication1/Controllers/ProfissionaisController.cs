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
        private AuthBE _auth;


        public ProfissionaisController(ProfissionaisBE be, AppDbContext context, AuthBE auth)
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

        // GET: Profissionais
        [Authorize]
        [Route("getAllProfissionais")]
        [HttpGet]
        public async Task<IActionResult> GetAll(ProfissionaisDTO dto)
        {
            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userLogado = _auth.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
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

        // POST: Profissionais
        [Authorize]
        [Route("insertProfissionais")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ProfissionaisRequest profissionais)
        {
            try
            {
                var token = ExtractAuthToken();

                UserValidationResponse userValidationResponse = _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

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
                var token = ExtractAuthToken();

                   
                UserValidationResponse userValidationResponse = _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

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
                var token = ExtractAuthToken();

                UserValidationResponse userValidationResponse = _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

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
