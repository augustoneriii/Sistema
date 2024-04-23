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
        private AuthBE _auth;


        public ConsultaController(ConsultaBE be, AppDbContext context, AuthBE auth)
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
        [Route("getAllConsultas")]
        public async Task<IActionResult> GetAll(ConsultaDTO dto)
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

        //Post: Consulta
        [Route("insertConsulta")]
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ConsultaRequest consulta)
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
                var response = await _be.Insert(consulta);
                _context.Commit();
                return Ok(new { Message = "Consulta cadastrada com sucesso!" });
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
                var token = ExtractAuthToken();

                UserValidationResponse userValidationResponse = await _auth.CheckUser(token);
                if (userValidationResponse == null || !userValidationResponse.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }
                //if (userValidationResponse.IdUserRole != null || userValidationResponse.IdUserRole == "c8fffd")
                //{
                //    return BadRequest(new { Message = "Usuário não autorizado!" });
                //}

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

        //[Route("deleteConsulta")]
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