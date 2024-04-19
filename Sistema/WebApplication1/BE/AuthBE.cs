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
        private readonly string _key = "uma_chave_muito_secreta_aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"; 

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
                return null;

            var result = await _signInManager.PasswordSignInAsync(identityUser.UserName, user.Password, false, true);

            if (result.Succeeded)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var keyBytes = Encoding.ASCII.GetBytes(_key); // Use a chave estática correta aqui

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.Name, identityUser.Email),
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            return null;
        }


        public bool CheckUser(string authToken)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                return false;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_key)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true, 
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = tokenHandler.ValidateToken(authToken, validationParameters, out SecurityToken validatedToken);
                return true; 
            }
            catch
            {
                return false; 
            }
        }
    }
}