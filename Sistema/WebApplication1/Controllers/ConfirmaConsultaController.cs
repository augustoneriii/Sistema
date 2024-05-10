using app.BE;
using app.Data;
using app.DTO;
using Microsoft.AspNetCore.Mvc;

namespace app.Controllers
{
    public class ConfirmaConsultaController : Controller
    {
        private ConfirmaConsultaBE _be;
        private AppDbContext _context;
        private AuthBE _auth;

        public ConfirmaConsultaController(ConfirmaConsultaBE be, AppDbContext context, AuthBE auth)
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

        [HttpGet]
        [Route("getAllConfirmaConsultas")]
        public async Task<IActionResult> GetAll(ConfirmaConsultaDTO dto)
            {
/*            var token = ExtractAuthToken();
            UserValidationResponse userLogado = await _auth.CheckUser(token);
            if (userLogado == null || !userLogado.IsAuthenticated)
            {
                return BadRequest(new { Message = "Usuário não autenticado!" });
            }*/
            _context.BeginTransaction();
            var response = await _be.GetAll(dto);
            _context.Commit();
            return Ok(response);
        }

        [Route("insertConfirmaConsulta")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ConfirmaConsultaDTO consulta)
        {
           /* var token = ExtractAuthToken();
            UserValidationResponse userLogado = await _auth.CheckUser(token);
            if (userLogado == null || !userLogado.IsAuthenticated)
            {
                return BadRequest(new { Message = "Usuário não autenticado!" });
            }*/
            _context.BeginTransaction();
            var response = await _be.Insert(consulta);
            _context.Commit();
            return Ok(response);
        }
    }
}
