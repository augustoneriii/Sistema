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
        RoleManager<IdentityRole> _roleManager;
        private readonly string _key = "uma_chave_muito_secreta_aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";

        public AuthBE(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager, AppDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _roleManager = roleManager;
        }

        public async Task<UserRegisterDTO> RegisterNewUser(UserRegisterDTO user)
        {
            var dao = new AuthDAO(_context);

            var emailExists = await dao.FindByEmail(user.Email);
            if (emailExists != null)
            {
                return new UserRegisterDTO
                {
                    ErrorMessages = "Email already exists"
                };
            }

            if (user.Password != user.ConfirmPassword)
            {
                return new UserRegisterDTO
                {
                    ErrorMessages = "Passwords do not match"
                };
            }


            var role = user.RoleName.ToUpper();
            UserRolesDTO roleExist = await dao.FindByRoleName(role);

            if (roleExist == null)
            {
                return new UserRegisterDTO
                {
                    ErrorMessages = "Role not found"
                };
            }
            var passwordHash = new PasswordHasher<IdentityUser>();
            var hashed = passwordHash.HashPassword(null, user.Password);

            user.Password = hashed;

            UserRegisterDTO newUser = await dao.UserRegister(user);

            var roleAdd = await dao.InsertAspNetUserRoles(newUser.Id, roleExist.Id);
            if (roleAdd == false)
            {
                return new UserRegisterDTO
                {
                    ErrorMessages = "Error adding role"
                };
            }

            return newUser;
        }
        //update user
        public async Task<UserDTO> UpdateUser(UserDTO user)
        {
            var dao = new AuthDAO(_context);

            var emailExists = await dao.FindByEmail(user.Email);
            if (emailExists == null)
            {
                return new UserDTO
                {
                    ErrorMessages = "Email not found"
                };
            }

            var result = await dao.UpdateUser(user);

            if (result != null)
            {
                return result;
            }
            else
            {
                return new UserDTO
                {
                    ErrorMessages = "Error updating user"
                };
            }
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

                UserRolesDTO userRoles = await dao.GetAspNetUserRoles(identityUser.Email);
                if (userRoles != null)
                {
                    return new UserValidationResponse
                    {
                        IsAuthenticated = true,
                        Token = tokenHandler.WriteToken(token),
                        UserName = identityUser.UserName,
                        Email = identityUser.Email,
                        IdUserRole = userRoles.Id,
                        Cpf = identityUser.Cpf
                    };
                }
            }
            return null;
        }

        public async Task<List<GetAllUserResponse>> GetAllUsers()
        {
            var dao = new AuthDAO(_context);

            return await dao.GetAllUsers();
        }

        public async Task<UserChangePasswordDTO> ChangePassword(UserChangePasswordDTO user)
        {
            var dao = new AuthDAO(_context);

            var identityUser = await dao.FindByEmail(user.Email);
            if (identityUser == null)
                return null;

            //decript identityUser.Password
            var passwordHash = new PasswordHasher<IdentityUser>();

            var pwTest = passwordHash.VerifyHashedPassword(null, identityUser.Password, user.CurrentPassword);

            if (pwTest != PasswordVerificationResult.Success)
            {
                return new UserChangePasswordDTO
                {
                    Succeeded = false,
                    Errors = new List<string> { "Current password is incorrect" }
                };
            }

            if (user.CurrentPassword == user.NewPassword)
            {
                return new UserChangePasswordDTO
                {
                    Succeeded = false,
                    Errors = new List<string> { "New password must be different from the current password" }
                };
            }

            //encrypt user.NewPassword
            var hashed = passwordHash.HashPassword(null, user.NewPassword);

            user.NewPassword = hashed;

            var result = await dao.ChangePassword(user);

            if (result.Succeeded)
            {
                return new UserChangePasswordDTO
                {
                    Email = user.Email,
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

        public async Task<UserValidationResponse> CheckUser(string authToken)
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


                var dao = new AuthDAO(_context);

                result.IsAuthenticated = true;
                result.IdUser = identityClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Id armazenado em ClaimTypes.NameIdentifier
                result.UserName = identityClaims.FindFirst(ClaimTypes.Name)?.Value; // UserName armazenado em ClaimTypes.Name
                result.Email = identityClaims.FindFirst(ClaimTypes.Email)?.Value; // Certifique-se de que o e-mail está incluído quando o token é emitido 

                //return AspNetUserRoles from user
                UserRolesDTO userRoles = await dao.GetAspNetUserRoles(result.Email);
                if (userRoles != null)
                {
                    result.IdUserRole = userRoles.Id;
                }

                UserDTO user = await dao.FindByEmail(result.Email);

                result.Cpf = user.Cpf;


                return result;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.Message;
                return result;
            }
        }

        // CreateUserRoles method
        public async Task<UserRolesDTO> CreateUserRoles(UserRolesDTO userRolesDTO)
        {
            string roleName = userRolesDTO.Name.ToUpper();
            var dao = new AuthDAO(_context);

            var roleExists = await dao.FindByRoleName(roleName);
            if (roleExists != null)
            {
                return new UserRolesDTO
                {
                    ErrorMessages = "Role already exists"
                };
            }

            var role = new IdentityRole(roleName);
            var result = await dao.InsertRole(userRolesDTO);
            if (result != null)
            {

                return new UserRolesDTO
                {
                    Id = role.Id,
                    Name = role.Name
                };
            }
            else
            {
                return new UserRolesDTO
                {
                    ErrorMessages = "Error creating role"
                };
            }
        }

        //get all roles
        public async Task<List<UserRolesDTO>> GetAllRoles()
        {
            var dao = new AuthDAO(_context);

            return await dao.GetAllRoles();
        }
    }
}