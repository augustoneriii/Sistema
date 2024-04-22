//using Microsoft.AspNetCore.Mvc;
//using app.BE;
//using app.Data;
//using Microsoft.AspNetCore.Authorization;
//using app.DTO.UserDTO;

//namespace app.Controllers
//{
//    public class UserController : Controller
//    {
//        private UserBE _be;
//        private AppDbContext _context;

//        public UserController(UserBE be, AppDbContext context)
//        {
//            _be = be;
//            _context = context;
//        }

//        //GET: Users
        
    
//        [Route("getAllUsers")]
//        [HttpGet]
//        public async Task<IActionResult> GetAll(UserDTO dto)
//        {
//            try
//            {
//                var response = await _be.GetAll(dto);
//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }


//        // PATCH: Users
        
//        [Route("updateUsers")]
//        [HttpPatch]
//        public async Task<IActionResult> Update([FromBody] UserDTO users)
//        {
//            try
//            {
//                _context.BeginTransaction();
//                var response = await _be.Update(users);
//                _context.Commit();
//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                _context.Rollback();
//                return BadRequest(ex.Message);
//            }


//        }

//        // DELETE: Users
       
//        [Route("deleteUsers")]
//        [HttpDelete]
//        public async Task<IActionResult> Delete([FromQuery] string id)
//        {
//            try
//            {
//                _context.BeginTransaction();
//                await _be.Delete(id);
//                _context.Commit();
//                return Ok();
//            }
//            catch (Exception ex)
//            {
//                _context.Rollback();
//                return BadRequest(ex.Message);
//            }
//        }


//    }
//}
