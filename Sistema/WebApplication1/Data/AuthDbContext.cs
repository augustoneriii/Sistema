using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace app.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Definir o schema padrão para "Sistema"
            builder.HasDefaultSchema("Sistema");
            base.OnModelCreating(builder);
            // Outras personalizações de modelo podem ser colocadas aqui
        }
    }
}
