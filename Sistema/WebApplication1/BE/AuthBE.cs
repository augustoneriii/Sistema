using app.DTO.Response;
using app.DTO.UserDTO;
using app.DAO;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using app.Data;
using Microsoft.AspNetCore.Http.HttpResults;

namespace app.BE
{
    public class AuthBE
    {
        private AppDbContext _context;

        UserManager<IdentityUser> _userManager;
        SignInManager<IdentityUser> _signInManager;
        private readonly string _key = "uma_chave_muito_secreta_aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";

        public AuthBE(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager, AppDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        public async Task<UserRegisterDTO> RegisterNewUser(UserRegisterDTO user)
        {

            //var identityUser = new IdentityUser()
            //{
            //    Email = user.Email,
            //    UserName = user.UserName,
            //    PhoneNumber = user.PhoneNumber
            //};

            //check if email already exists
            var dao = new AuthDAO(_context);

            var emailExists = await dao.FindByEmail(user.Email);
            if (emailExists != null)
            {
                return new UserRegisterDTO
                {
                    ErrorMessages = "Email already exists"
                };
            }

            //var result = await _userManager.CreateAsync(identityUser, user.Password);

            //criptografar senha antes de salvar
            var passwordHash = new PasswordHasher<IdentityUser>();
            var hashed = passwordHash.HashPassword(null, user.Password);

            user.Password = hashed;

            return await dao.UserRegister(user);
        }

        public async Task<UserValidationResponse> Authenticate(UserLoginDTO user)
        {
            var dao = new AuthDAO(_context);

            var identityUser = await dao.FindByEmail(user.Email);
            if (identityUser == null)
                return null;

            //decript identityUser.Password
            var passwordHash = new PasswordHasher<IdentityUser>();

            var result = passwordHash.VerifyHashedPassword(null, identityUser.Password, user.Password);

            if (result == PasswordVerificationResult.Success)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var keyBytes = Encoding.ASCII.GetBytes(_key); // Use a chave estática correta aqui

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, identityUser.UserName), // UserName
                        new Claim(ClaimTypes.Email, identityUser.Email), // Email
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);

                return new UserValidationResponse
                {
                    IsAuthenticated = true,
                    Token = tokenHandler.WriteToken(token),
                    UserName = identityUser.UserName,
                    Email = identityUser.Email
                };
            }
            return null;
        }

        public async Task<List<GetAllUserResponse>> GetAllUsers()
        {
            var users = _userManager.Users;
            var usersDTO = new List<GetAllUserResponse>();
            foreach (var user in users)
            {
                usersDTO.Add(new GetAllUserResponse
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber
                });
            }
            return usersDTO;
        }

        public async Task<UserChangePasswordDTO> ChangePassword(UserChangePasswordDTO user)
        {
            var identityUser = _userManager.FindByEmailAsync(user.Email).Result;
            if (identityUser == null)
                return null;

            var result = _userManager.ChangePasswordAsync(identityUser, user.CurrentPassword, user.NewPassword).Result;

            if (result.Succeeded)
            {
                return new UserChangePasswordDTO
                {
                    Email = identityUser.Email,
                    CurrentPassword = user.CurrentPassword,
                    NewPassword = user.NewPassword,
                    Succeeded = true,
                    Errors = null
                };
            }
            return new UserChangePasswordDTO
            {
                Succeeded = false,
                Errors = result.Errors
            };
        }

        public UserValidationResponse CheckUser(string authToken)
        {
            var result = new UserValidationResponse();
            if (string.IsNullOrEmpty(authToken))
            {
                result.ErrorMessage = "No token provided.";
                return result;
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
                var identityClaims = (ClaimsIdentity)principal.Identity;

                result.IsAuthenticated = true;
                result.UserName = identityClaims.FindFirst(ClaimTypes.Name)?.Value; // UserName armazenado em ClaimTypes.Name
                result.Email = identityClaims.FindFirst(ClaimTypes.Email)?.Value; // Certifique-se de que o e-mail está incluído quando o token é emitido

                return result;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.Message;
                return result;
            }
        }

    }
}