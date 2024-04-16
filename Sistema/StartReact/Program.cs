using System;
using System.Diagnostics;

namespace ReactStart
{
    class Program
    {

        //Programa.cs é utilizado para dar start no REACT do Sistema.
        static void Main(string[] args)
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                RedirectStandardInput = true,
                UseShellExecute = false
            };

            using (var process = Process.Start(startInfo))
            {
                using (var sw = process.StandardInput)
                {
                    if (sw.BaseStream.CanWrite)
                    {
                        // Caminho para o diretório do seu aplicativo React
                        sw.WriteLine("cd ..\\..\\..\\..\\WebApplication1\\View");

                        // Comando para iniciar o aplicativo React
                        sw.WriteLine("npm start");
                    }
                }
            }
        }
    }
}
