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
                return null; 

            var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, false, true);

            if (result.Succeeded)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = new byte[32];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(key);
                }

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.Name, identityUser.Email),
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            return null; 
        }

    }
}