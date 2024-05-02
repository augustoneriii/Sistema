using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using app.DAO;

namespace app.Controllers
{
    public class ProntuarioMedicoController : Controller
    {
        private ProntuarioMedicoBE _be;
        private AppDbContext _context;
        private AuthBE _auth;


        public ProntuarioMedicoController(ProntuarioMedicoBE be, AppDbContext context, AuthBE auth)
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

        // GET: ProntuariosMedicos
        [Route("getAllProntuarioMedico")]
        [HttpGet]
        public async Task<IActionResult> GetAll(ProntuarioMedicoDTO dto)
        {
            try
            {
                var token = ExtractAuthToken();
                //UserValidationResponse userLogado = await _auth.CheckUser(token);
                //if (userLogado == null || !userLogado.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}

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

        // POST: ProntuariosMedicos
        [Route("insertProntuarioMedico")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ProntuarioMedicoRequest prontuario)
        {
            try
            {
                var token = ExtractAuthToken();

                //UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                //if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}

                _context.BeginTransaction();
                var response = await _be.Insert(prontuario);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // PATCH: ProntuarioMedico
        [Route("updateProntuarioMedico")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] ProntuarioMedicoRequest prontuario)
        {
            try
            {
                var token = ExtractAuthToken();


                //UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                //if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}

                _context.BeginTransaction();
                var response = await _be.Update(prontuario);
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
