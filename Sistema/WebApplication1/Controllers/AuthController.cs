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
                var isSuccess = await authService.RegisterNewUser(user);
                if (isSuccess)
                    return Ok($"User {user.Email} is registered successfully");
                return BadRequest("Failed to register user");
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
                    return Ok(new { Token = token }); // Retorna o token no corpo da resposta
                return Unauthorized(); // Retorna 401 Unauthorized se a autenticação falhar
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Retorna 400 Bad Request se ocorrer algum erro durante a autenticação
            }
        }

    }
}