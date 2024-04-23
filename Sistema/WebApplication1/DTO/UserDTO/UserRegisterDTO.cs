using System.Numerics;

namespace app.DTO.UserDTO
{
    public class UserRegisterDTO
    {
        public string? Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Cpf { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime UpdatedDate { get; set; } = DateTime.Now;
        public string RoleName { get; set; } 
        public string ErrorMessages { get; set; }
    }
}
