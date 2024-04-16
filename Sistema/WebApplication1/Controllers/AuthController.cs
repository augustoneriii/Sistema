using app.BE;
using app.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;

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
                var isSuccess = await authService.Authenticate(user);
                if (isSuccess)
                    return Ok($"User {user.Email} is authenticated successfully");
                return BadRequest("Authentication failed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}