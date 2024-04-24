public class UserValidationResponse
{
    public bool IsAuthenticated { get; set; }
    public string IdUser { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Cpf { get; set; }
    public string ErrorMessage { get; set; }
    public string Token { get; set; }
    public string IdUserRole { get; set; }
}
