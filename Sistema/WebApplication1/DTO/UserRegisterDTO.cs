﻿using System.Numerics;

namespace app.DTO
{
    public class UserRegisterDTO
    {
        public long? Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int? Phone { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
        public DateTime? UpdatedDate { get; set; } = DateTime.Now;

    }
}
