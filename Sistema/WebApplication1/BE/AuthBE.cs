using app.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace app.BE
{
    public class AuthBE
    {
        UserManager<IdentityUser> _userManager;
        SignInManager<IdentityUser> _signInManager;

        public AuthBE(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IdentityResult> RegisterNewUser(UserRegisterDTO user)
        {

            var identityUser = new IdentityUser()
            {
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber
            };
            var result = await _userManager.CreateAsync(identityUser, user.Password);

            if (!result.Succeeded)
            {
                return result;
            }
            return result;
        }

        public async Task<string> Authenticate(UserLoginDTO user)
        {
            var identityUser = await _userManager.FindByEmailAsync(user.Email);
            if (identityUser == null)
                return "Usuário não encontrado"; // Retorna uma mensagem de erro se o usuário não for encontrado 

            var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, false, true);

            if (result.Succeeded)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = new byte[32]; // Ajuste o tamanho da chave conforme necessário
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(key); // Preenche a chave com valores aleatórios
                }

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.Name, identityUser.Email),
                        // Adicione outras reivindicações do usuário aqui, se necessário
                    }),
                    Expires = DateTime.UtcNow.AddHours(1), // Tempo de expiração do token.
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            return "Falha na autenticação"; // Retorna uma mensagem de erro se a autenticação falhar
        }

        //find user by token
        public async Task<IdentityUser> FindUserByToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new byte[32]; // Ajuste o tamanho da chave conforme necessário
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(key); // Preenche a chave com valores aleatórios
            }

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);

            var email = principal.FindFirst(ClaimTypes.Name).Value;
            var user = await _userManager.FindByEmailAsync(email);
            return user;
        }


    }
}