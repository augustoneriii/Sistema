using app.BE;
using app.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace app.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly AuthBE authService;
        public AuthController(AuthBE serv)
        {
            authService = serv;
        }

        [HttpPost("register")]
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

        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthUser(UserLoginDTO user)
        {
            try
            {
                var token = await authService.Authenticate(user);
                if (!string.IsNullOrEmpty(token))
                    return Ok(new { Token = token, Message = "Usuário autenticado com sucesso!" });
                return Unauthorized(); // Retorna 401 Unauthorized se a autenticação falhar
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Retorna 400 Bad Request se ocorrer algum erro durante a autenticação
            }
        }

        [HttpGet("findUserByToken")]
        public async Task<IActionResult> FindUserByToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var user = await authService.FindUserByToken(token);
                if (user != null)
                    return Ok(user);
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}