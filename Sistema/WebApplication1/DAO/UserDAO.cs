using app.Data;
using app.DTO.UserDTO;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class UserDAO
    {
        private AppDbContext _context;

        public UserDAO(AppDbContext context)
        {
            _context = context;
        }


        //GetAll
        public async Task<List<UserDTO>> GetAll(UserDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Id\",\"UserName\", \"Email\", \"PhoneNumber\"");
            objSelect.Append(" FROM \"public\".\"AspNetUsers\"");
            objSelect.Append(" WHERE 1 = 1");

            if (!string.IsNullOrEmpty(dto.Id))
            {
                objSelect.Append($" AND \"Id\" = {dto.Id} ");
            }
            if (!string.IsNullOrEmpty(dto.UserName))
            {
                objSelect.Append($" AND \"Nome\" = '{dto.UserName}' ");
            }
            if (!string.IsNullOrEmpty(dto.Email))
            {
                objSelect.Append($" AND \"Email\" = '{dto.Email}' ");
            }
            if (!string.IsNullOrEmpty(dto.PhoneNumber))
            {
                objSelect.Append($" AND \"PhoneNumber\" = '{dto.PhoneNumber}' ");
            }

            var dt = await _context.ExecuteQuery(objSelect.ToString(), null);

            var lstUsers = new List<UserDTO>();

            foreach (DataRow row in dt.Rows)
            {
                lstUsers.Add(new UserDTO
                {
                    Id = (row["Id"]).ToString(),
                    UserName = row["UserName"].ToString(),
                    Email = row["Email"].ToString(),
                    PhoneNumber = row["PhoneNumber"].ToString(),
                });
            }
            return lstUsers;
        }


        //Update
        public async Task<UserDTO> Update(UserDTO users)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"public\".\"AspNetUsers\" ");
            objUpdate.Append("SET ");
            objUpdate.Append($"\"UserName\" = '{users.UserName}', ");
            objUpdate.Append($"\"Email\" = '{users.Email}', ");
            objUpdate.Append($"\"PhoneNumber\" = '{users.PhoneNumber}', ");
            
            objUpdate.Append($"WHERE \"Id\" = {users.Id}; ");

            await _context.ExecuteNonQuery(objUpdate.ToString(), null);
            return users;
        }

        //Update Password

        //Delete
        public async Task Delete(string id)
        {
            var objDelete = new StringBuilder();
            objDelete.Append("DELETE FROM \"public\".\"AspNetUsers\" ");
            objDelete.Append($"WHERE \"Id\" = {id} ");

          await  _context.ExecuteNonQuery(objDelete.ToString(), null);
        }

        

    }
}
