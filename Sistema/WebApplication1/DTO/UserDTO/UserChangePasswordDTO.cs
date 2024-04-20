namespace app.DTO.UserDTO
{
    public class UserChangePasswordDTO
    {
        public string Email { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public bool Succeeded { get; internal set; }
        public object? Errors { get; internal set; }
    }
}
