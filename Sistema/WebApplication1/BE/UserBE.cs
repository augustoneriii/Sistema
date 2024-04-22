using Microsoft.AspNetCore.Mvc;
using app.BE;
using app.Data;
using app.DAO;
using Microsoft.AspNetCore.Authorization;
using app.DTO.UserDTO;

namespace app.BE
{
    public class UserBE
    {
        private AppDbContext _context;

        public UserBE(AppDbContext context)
        {
            _context = context;
        }

        //get all
        public async Task<List<UserDTO>> GetAll(UserDTO dto)
        {
            var dao = new UserDAO(_context);
            return  await dao.GetAll(dto);
        }

        //update
        public async Task<UserDTO> Update(UserDTO users)
        {
            var dao = new UserDAO(_context);
            return await dao.Update(users);
        }

        //delete
        public async Task Delete(string id)
        {
            var dao = new UserDAO(_context);
            await dao.Delete(id);
        }

    }
}
