using app.BE;
using app.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace app.Controllers
{

    public class AuthController : Controller
    {
        private readonly AuthBE authService;
       

        public AuthController(AuthBE serv)
        {
            authService = serv;
           
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(UserRegisterDTO user)
        {
            try
            {
                var response = await authService.RegisterNewUser(user);

                if (response.Succeeded == false)
                    return BadRequest(response.Errors);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Authenticate")]
        public async Task<IActionResult> AuthUser([FromBody] UserLoginDTO user)
        {
            try
            {
                var token = await authService.Authenticate(user);
                if (token != null)
                    return Ok(new { Token = token, Message = "Usuário autenticado com sucesso!" });
                else
                    return BadRequest(new { Message = "Usuário ou senha incorretos!" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("checkuser")]
        public IActionResult CheckUser()
        {
          
            if (!HttpContext.Request.Headers.ContainsKey("Authorization"))
            {
               
                return BadRequest(new { Message = "Usuário não está logado!" });
            }

            // Obter o token do cabeçalho da solicitação
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(' ')[1];

            
            return Ok(new { Message = "Usuário logado!" });
        }

    }
}