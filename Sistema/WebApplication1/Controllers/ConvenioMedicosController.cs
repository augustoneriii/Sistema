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
        private AuthBE _auth;


        public ConvenioMedicosController(ConvenioMedicosBE be, AppDbContext context, AuthBE auth)
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


        // GET: ConvenioMedicos

        [Route("getAllConvenioMedicos")]
        [HttpGet]
        public async Task<IActionResult> GetAll(ConvenioMedicosDTO dto)
        {
            try
            {
                var token = ExtractAuthToken();

                UserValidationResponse userLogado = await _auth.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

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


        [HttpPost]
        [Route("insertConvenioMedicos")]
        public async Task<IActionResult> Insert([FromBody] ConvenioMedicosDTO convenioMedicos)
        {
            try
            {
                var token = ExtractAuthToken();

                UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

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
        [Route("updateConvenioMedicos")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] ConvenioMedicosDTO convenioMedicos)
        {
            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

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
    }
}