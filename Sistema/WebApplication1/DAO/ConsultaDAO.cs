using app.Data;
using app.DTO;
using app.DTO.Request;
using System.Data;
using System.Text;

namespace app.DAO
{
    public class ConsultaDAO
    {
        private AppDbContext _context;

        public ConsultaDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConsultaDTO>> GetAll(ConsultaDTO dto)
        {
            var objSelect = new StringBuilder();
            objSelect.Append("SELECT \"Sistema\".\"Consultas\".\"Id\"     ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Data\"        ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Hora\"        ");
            //SELECIONAR O PACIENTEID
            objSelect.Append(", \"UserId\"                                ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Atendida\"    ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Status\"      ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Tipo\"        ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"Observacoes\" ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"CreatedAt\"   ");
            objSelect.Append(", \"Sistema\".\"Consultas\".\"UpdateAt\"    ");

            if(dto.Id > 0)
            {
                objSelect.Append($"AND \"Id\" = {dto.Id}");

            }
            if (!string.IsNullOrEmpty(dto.Data));
        }
    }
}
