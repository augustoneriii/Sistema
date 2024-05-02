using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DTO;
using Microsoft.AspNetCore.Authorization;

namespace app.Controllers
{
    public class RelatorioController : Controller
    {
        private RelatorioBE _be;
        private AppDbContext _context;
        private AuthBE _auth;

        public RelatorioController(RelatorioBE be, AppDbContext context, AuthBE auth)
        {
            _be = be ?? throw new ArgumentNullException(nameof(be), "RelatorioBE não pode ser nulo.");
            _context = context ?? throw new ArgumentNullException(nameof(context), "AppDbContext não pode ser nulo.");
            _auth = auth ?? throw new ArgumentNullException(nameof(auth), "AuthBE não pode ser nulo.");
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

        // GET: Profissoes
        [HttpGet]
        [Route("getAllRelatorios")]
        public async Task<IActionResult> GetAll(RelatorioDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest("O objeto RelatorioDTO não pode ser nulo.");

                var token = ExtractAuthToken();
                
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
    }
}