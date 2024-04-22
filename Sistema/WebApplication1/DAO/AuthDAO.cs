using app.Data;
using app.DTO.UserDTO;
using System.Text;

namespace app.DAO
{
    public class AuthDAO
    {
        private AppDbContext _context;

        public AuthDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserRegisterDTO> UserRegister(UserRegisterDTO dto)
        {
            var objInsert = new StringBuilder();

            string genId = Guid.NewGuid().ToString();

            var PhoneNumberConfirmed = false;

            var EmailConfirmed = false;

            if (dto.PhoneNumber != null)
            {
                PhoneNumberConfirmed = true;
            }

            if (dto.Email != null)
            {
                EmailConfirmed = true;
            }

            objInsert.Append("INSERT INTO \"Sistema\".\"AspNetUsers\"(");
            objInsert.Append("id, username, email, cpf, emailconfirmed, passwordhash, phonenumber, phonenumberconfirmed, twofactorenabled, lockoutenabled, accessfailedcount)");
            objInsert.Append("VALUES (");
            objInsert.Append($"'{genId}', ");
            objInsert.Append($"'{dto.UserName}', ");
            objInsert.Append($"'{dto.Email}', ");
            objInsert.Append($"'{dto.Cpf}', ");
            objInsert.Append($"{EmailConfirmed.ToString().ToLower()}, ");
            objInsert.Append($"'{dto.Password}', ");
            objInsert.Append($"'{dto.PhoneNumber}', ");
            objInsert.Append($"{PhoneNumberConfirmed.ToString().ToLower()}");
            objInsert.Append(", false");
            objInsert.Append(", false");
            objInsert.Append(", 0");
            objInsert.Append(");");


            _context.ExecuteNonQuery(objInsert.ToString());

            UserRegisterDTO obj = new UserRegisterDTO();
            obj.Id = dto.Id;
            obj.UserName = dto.UserName;
            obj.Email = dto.Email;
            obj.Cpf = dto.Cpf;
            obj.Password = dto.Password;
            obj.PhoneNumber = dto.PhoneNumber;

            return obj;
        }

        public async Task<UserDTO> FindByEmail(string email)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT * FROM \"Sistema\".\"AspNetUsers\" ");
            objSelect.Append($"WHERE email = '{email}'");

            var result = _context.ExecuteQuery(objSelect.ToString());

            if (result.Rows.Count == 0)
                return null;

            var row = result.Rows[0];

            UserDTO obj = new UserDTO();
            obj.Id = row["id"] != DBNull.Value ? row["id"].ToString() : string.Empty;
            obj.UserName = row["username"] != DBNull.Value ? row["username"].ToString() : string.Empty;
            obj.Email = row["email"] != DBNull.Value ? row["email"].ToString() : string.Empty;
            obj.Password = row["passwordhash"] != DBNull.Value ? row["passwordhash"].ToString() : string.Empty;
            obj.PhoneNumber = row["phonenumber"] != DBNull.Value ? row["phonenumber"].ToString() : string.Empty;

            return obj;
        }

        //public async Task<UserDTO> AuthLogin (UserLoginDTO loginDTO)
        //{

        //}
    }
}
