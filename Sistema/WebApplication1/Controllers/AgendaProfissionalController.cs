using app.BE;
using app.Data;
using app.DTO;
using app.DTO.Request;
using Microsoft.AspNetCore.Mvc;

namespace app.Controllers
{
    public class AgendaProfissionalController : Controller
    {
        private AgendaProfissionalBE _be;
        private AppDbContext _context;
        private AuthBE _auth;


        public AgendaProfissionalController(AgendaProfissionalBE be, AppDbContext context, AuthBE auth)
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
        [Route("getAllAgendas")]
        public async Task<IActionResult> GetAll([FromQuery] AgendaProfissionalDTO dto)
        {
            var token = ExtractAuthToken();
            UserValidationResponse userLogado = await _auth.CheckUser(token);
            if (userLogado == null || !userLogado.IsAuthenticated)
           {
               return BadRequest(new { Message = "Usuário não autenticado!" });
            }

            var response = await _be.GetAll(dto);
            return Ok(response);
        }

        //Post: AgendaProfissional
        [Route("insertAgenda")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] AgendaProfissionalRequest consulta)
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
                var response = await _be.Insert(consulta);
                _context.Commit();
                return Ok(new { Message = "Agenda cadastrada com sucesso!" });
            }
            catch (Exception ex)
            {
                _context.Rollback();
                return BadRequest(ex.Message);
            }
        }
        // PATCH: AgendaProfissional

        [Route("updateAgenda")]
        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] AgendaProfissionalRequest consulta)
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

        //[Route("deleteAgenda")]
        //[HttpDelete]
        //public async Task<IActionResult> Delete([FromQuery] long id)
        //{
        //    try
        //    {
        //        var token = ExtractAuthToken();

        //        UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
        //        if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
        //        {
        //            return BadRequest(new { Message = "Usuário não autenticado!" });
        //        }

        //        _context.BeginTransaction();
        //        await _be.Delete(id);
        //        _context.Commit();
        //        return Ok();
        //    }
        //    catch (Exception ex)
        //    {
        //        _context.Rollback();
        //        return BadRequest(ex.Message);
        //    }
        //}
    }
}
