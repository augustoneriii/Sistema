using app.BE;
using app.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
                var obj = await authService.Authenticate(user);
                if (obj != null)
                    return Ok(new { User = obj, Token = obj.Token, Message = "Usuário autenticado com sucesso!" });
                else
                    return BadRequest(new { Message = "Usuário ou senha incorretos!" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}