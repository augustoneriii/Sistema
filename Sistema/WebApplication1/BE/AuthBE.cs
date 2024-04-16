using app.DTO;
using Microsoft.AspNetCore.Identity;

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

        public async Task<bool> RegisterNewUser(UserRegisterDTO user)
        {
            var identityUser = new IdentityUser()
            {
                Email = user.Email,
                UserName = user.Email
            };
            var result = await _userManager.CreateAsync(identityUser, user.Password);
            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }

        public async Task<bool> Authenticate(UserLoginDTO user)
        {

            var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, false, true);

            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }
    }
}
