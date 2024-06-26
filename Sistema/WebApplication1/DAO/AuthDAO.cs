﻿using app.Data;
using app.DTO.Response;
using app.DTO.UserDTO;
using System.Data;
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

            //get 6 caracteres string id
            string genId = Guid.NewGuid().ToString().Substring(0, 6);
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


            await _context.ExecuteNonQuery(objInsert.ToString(), null);

            UserRegisterDTO obj = new UserRegisterDTO();
            obj.Id = genId;
            obj.UserName = dto.UserName;
            obj.Email = dto.Email;
            obj.Cpf = dto.Cpf;
            obj.Password = dto.Password;
            obj.PhoneNumber = dto.PhoneNumber;

            return obj;
        }

        //get all AspNetUsers
        public async Task<List<GetAllUserResponse>> GetAllUsers()
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT * FROM \"Sistema\".\"AspNetUsers\"");

            var result = await _context.ExecuteQuery(objSelect.ToString(), null);

            List<GetAllUserResponse> list = new List<GetAllUserResponse>();

            foreach (DataRow row in result.Rows)
            {
                GetAllUserResponse obj = new GetAllUserResponse();
                obj.Id = row["id"] != DBNull.Value ? row["id"].ToString() : string.Empty;
                obj.UserName = row["username"] != DBNull.Value ? row["username"].ToString() : string.Empty;
                obj.Email = row["email"] != DBNull.Value ? row["email"].ToString() : string.Empty;
                obj.PhoneNumber = row["phonenumber"] != DBNull.Value ? row["phonenumber"].ToString() : string.Empty;
                obj.Cpf = row["cpf"] != DBNull.Value ? row["cpf"].ToString() : string.Empty;

                list.Add(obj);
            }

            return list;
        }

        //get AspNetUsers by cpf
        public async Task<UserDTO> FindByCpf(string cpf)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT * FROM \"Sistema\".\"AspNetUsers\" ");
            objSelect.Append($"WHERE cpf = '{cpf}'");

            var result = await _context.ExecuteQuery(objSelect.ToString(), null);

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

        public async Task<UserDTO> FindByEmail(string email)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT * FROM \"Sistema\".\"AspNetUsers\" ");
            objSelect.Append($"WHERE email = '{email}'");

            var result = await _context.ExecuteQuery(objSelect.ToString(), null);

            if (result.Rows.Count == 0)
                return null;

            var row = result.Rows[0];

            UserDTO obj = new UserDTO();
            obj.Id = row["id"] != DBNull.Value ? row["id"].ToString() : string.Empty;
            obj.UserName = row["username"] != DBNull.Value ? row["username"].ToString() : string.Empty;
            obj.Email = row["email"] != DBNull.Value ? row["email"].ToString() : string.Empty;
            obj.Cpf = row["cpf"] != DBNull.Value ? row["cpf"].ToString() : string.Empty;
            obj.Password = row["passwordhash"] != DBNull.Value ? row["passwordhash"].ToString() : string.Empty;
            obj.PhoneNumber = row["phonenumber"] != DBNull.Value ? row["phonenumber"].ToString() : string.Empty;

            return obj;
        }

        public async Task<UserRolesDTO> FindByRoleName(string nome)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT id, name, normalizedname, concurrencystamp\r\n\tFROM \"Sistema\".\"AspNetRoles\"");
            objSelect.Append($"WHERE normalizedname = '{nome}'");

            var result = await _context.ExecuteQuery(objSelect.ToString(), null);

            if (result.Rows.Count == 0)
                return null;

            var row = result.Rows[0];

            UserRolesDTO obj = new UserRolesDTO();
            obj.Id = row["id"] != DBNull.Value ? row["id"].ToString() : string.Empty;
            obj.Name = row["name"] != DBNull.Value ? row["name"].ToString() : string.Empty;

            return obj;
        }


        //insert role
        public async Task<UserRolesDTO> InsertRole(UserRolesDTO dto)
        {
            var objInsert = new StringBuilder();

            //gen 6 caracteres string id
            string genId = Guid.NewGuid().ToString().Substring(0, 6);

            objInsert.Append("INSERT INTO \"Sistema\".\"AspNetRoles\"(");
            objInsert.Append("id, name, normalizedname, concurrencystamp)");
            objInsert.Append("VALUES (");
            objInsert.Append($"'{genId}', ");
            objInsert.Append($"'{dto.Name}', ");
            objInsert.Append($"'{dto.Name.ToUpper()}', ");
            objInsert.Append($"'{Guid.NewGuid().ToString()}'");
            objInsert.Append(");");

            await _context.ExecuteNonQuery(objInsert.ToString(), null);

            UserRolesDTO obj = new UserRolesDTO();
            obj.Id = dto.Id;
            obj.Name = dto.Name;

            return obj;
        }

        //get all roles
        public async Task<List<UserRolesDTO>> GetAllRoles()
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT id, name, normalizedname, concurrencystamp\r\n\tFROM \"Sistema\".\"AspNetRoles\"");

            var result = await _context.ExecuteQuery(objSelect.ToString(), null);

            List<UserRolesDTO> list = new List<UserRolesDTO>();

            foreach (DataRow row in result.Rows)
            {
                UserRolesDTO obj = new UserRolesDTO();
                obj.Id = row["id"] != DBNull.Value ? row["id"].ToString() : string.Empty;
                obj.Name = row["name"] != DBNull.Value ? row["name"].ToString() : string.Empty;

                list.Add(obj);
            }

            return list;
        }

        public async Task<bool> InsertAspNetUserRoles(string userId, string roleId)
        {
            try
            {
                var objInsert = new StringBuilder();
                objInsert.Append("INSERT INTO \"Sistema\".\"AspNetUserRoles\"(userid, roleid)\r\n");
                objInsert.Append("VALUES (\r\n");
                objInsert.Append($"'{userId}', ");
                objInsert.Append($"'{roleId}'");
                objInsert.Append(");");

                await _context.ExecuteNonQuery(objInsert.ToString(), null);
                return true;
            }
            catch
            {
                return false;
            }
        }

        //select AspNetUserRoles by user email
        public async Task<UserRolesDTO> GetAspNetUserRoles(string email)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"AspNetRoles\".id, \"AspNetRoles\".name, \"AspNetRoles\".normalizedname, \"AspNetRoles\".concurrencystamp\r\n");
            objSelect.Append("FROM \"Sistema\".\"AspNetUserRoles\"\r\n");
            objSelect.Append("LEFT JOIN \"Sistema\".\"AspNetRoles\" ON \"AspNetUserRoles\".roleid = \"AspNetRoles\".id\r\n");
            objSelect.Append("LEFT JOIN \"Sistema\".\"AspNetUsers\" ON \"AspNetUserRoles\".userid = \"AspNetUsers\".id\r\n");
            objSelect.Append($"WHERE \"AspNetUsers\".email = '{email}'");

            var result = await _context.ExecuteQuery(objSelect.ToString(), null);

            if (result.Rows.Count == 0)
                return null;

            var row = result.Rows[0];

            UserRolesDTO obj = new UserRolesDTO();
            obj.Id = row["id"] != DBNull.Value ? row["id"].ToString() : string.Empty;
            obj.Name = row["name"] != DBNull.Value ? row["name"].ToString() : string.Empty;

            return obj;
        }


        //update AspNetUser 
        public async Task<UserDTO> UpdateUser(UserDTO dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"AspNetUsers\" ");
            objUpdate.Append($"SET username = '{dto.UserName}', ");
            objUpdate.Append($"email = '{dto.Email}', ");
            objUpdate.Append($"cpf = '{dto.Cpf}', ");
            objUpdate.Append($"passwordhash = '{dto.Password}', ");
            objUpdate.Append($"phonenumber = '{dto.PhoneNumber}' ");
            objUpdate.Append($"WHERE id = '{dto.Id}'");

            await _context.ExecuteNonQuery(objUpdate.ToString(), null);

            UserDTO obj = new UserDTO();
            obj.Id = dto.Id;
            obj.UserName = dto.UserName;
            obj.Email = dto.Email;
            obj.Cpf = dto.Cpf;
            obj.Password = dto.Password;
            obj.PhoneNumber = dto.PhoneNumber;

            return obj;
        }


        //change password method
        public async Task<UserChangePasswordDTO> ChangePassword(UserChangePasswordDTO dto)
        {
            var objUpdate = new StringBuilder();
            objUpdate.Append("UPDATE \"Sistema\".\"AspNetUsers\" ");
            objUpdate.Append($"SET passwordhash = '{dto.NewPassword}' ");
            objUpdate.Append($"WHERE email = '{dto.Email}'");

            await _context.ExecuteNonQuery(objUpdate.ToString(), null);

            UserChangePasswordDTO obj = new UserChangePasswordDTO();
            obj.Email = dto.Email;
            obj.NewPassword = dto.NewPassword;
            obj.Succeeded = true;

            return obj;
        }
    }
}
