using app.BE;
using app.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> AuthUser([FromBody]UserLoginDTO user)
        {
            try
            {
                var token = await authService.Authenticate(user);
             
                if (!string.IsNullOrEmpty(token))
                    return Ok(new { Token = token,});
                 
                return Unauthorized(new { Message = "Usuario não autenticado!" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); 
            }
        }
    }
}