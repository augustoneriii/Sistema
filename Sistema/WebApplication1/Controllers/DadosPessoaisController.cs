using app.BE;
using app.Data;
using Microsoft.AspNetCore.Mvc;
using app.DTO;

namespace app.Controllers
{
    public class DadosPessoaisController : Controller
    {
        private DadosPessoaisBE _be;
        private AppDbContext _context;
        private AuthBE _auth;

        public DadosPessoaisController(DadosPessoaisBE be, AppDbContext context, AuthBE auth)
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

        // GET: DadosPessoais
        [Route("getAllDadosPessoais")]
        [HttpGet]
        public async Task<IActionResult> GetAll(DadosPessoaisDTO dto)
        {
            try
            {
                var token = ExtractAuthToken();
                //UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                //if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}

                var response = await _be.GetAll(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: DadosPessoais
        [Route("insertDadosPessoais")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] DadosPessoaisDTO dadosPessoais)
        {
            try
            {
                var token = ExtractAuthToken();

                //UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                //if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}

                /*if (userValidationResponse.IdUserRole != null || userValidationResponse.IdUserRole == "c8fffd")
                {
                    return BadRequest(new { Message = "Usuário não autorizado!" });
                }*/

                _context.BeginTransaction();
                var response = await _be.Insert(dadosPessoais);
                _context.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }
        // PATCH: DadosPessoais
        [Route("updateDadosPessoais")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] DadosPessoaisDTO dadosPessoais)
        {
            try
            {
                var token = ExtractAuthToken();

                //UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                //if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}

                /*if (userValidationResponse.IdUserRole != null || userValidationResponse.IdUserRole == "c8fffd")
                {
                    return BadRequest(new { Message = "Usuário não autorizado!" });
                }*/

                _context.BeginTransaction();
                var response = await _be.Update(dadosPessoais);
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
