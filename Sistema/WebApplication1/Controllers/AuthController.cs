using app.BE;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using app.DTO.UserDTO;

namespace app.Controllers
{

    public class AuthController : Controller
    {
        private readonly AuthBE authService;

        public AuthController(AuthBE serv)
        {
            authService = serv;
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


        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO user)
        {
            try
            {
                //var token = ExtractAuthToken();
                //UserValidationResponse userLogado = await authService.CheckUser(token);
                //if (userLogado == null || !userLogado.IsAuthenticated)
                //{
                //    return BadRequest(new { Message = "Usuário não autenticado!" });
                //}
                
                var response = await authService.RegisterNewUser(user);

                if (response.ErrorMessages != null || !string.IsNullOrEmpty(response.ErrorMessages))
                    return BadRequest(response.ErrorMessages);

                return Ok(new { Message = "Usuário cadastrado com sucesso!" });
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
                UserValidationResponse obj = await authService.Authenticate(user);
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

        [HttpPatch]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] UserChangePasswordDTO user)
        {
            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userLogado = await authService.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                var response = await authService.ChangePassword(user);

                if (response.Succeeded == false)
                    return BadRequest(response.Errors);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //update user
        [HttpPatch]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserDTO user)
        {
            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userLogado = await authService.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                var response = await authService.UpdateUser(user);

                if (response.ErrorMessages != null || !string.IsNullOrEmpty(response.ErrorMessages))
                    return BadRequest(response.ErrorMessages);

                return Ok(new { Message = "Usuário atualizado com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }   

        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var token = ExtractAuthToken();


                UserValidationResponse userLogado = await authService.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                var response = await authService.GetAllUsers();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("CreateRoles")]
        public async Task<IActionResult> CreateRoles([FromBody] UserRolesDTO userRolesDTO)
        {

            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userLogado = await authService.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                var response = await authService.CreateUserRoles(userRolesDTO);

                if (response.ErrorMessages != null || !string.IsNullOrEmpty(response.ErrorMessages))
                    return BadRequest(response.ErrorMessages);

                return Ok(new { Message = "Perfil cadastrado com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //get all roles
        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var token = ExtractAuthToken();
                UserValidationResponse userLogado = await authService.CheckUser(token);
                if (userLogado == null || !userLogado.IsAuthenticated)
                {
                    return BadRequest(new { Message = "Usuário não autenticado!" });
                }

                var response = await authService.GetAllRoles();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}