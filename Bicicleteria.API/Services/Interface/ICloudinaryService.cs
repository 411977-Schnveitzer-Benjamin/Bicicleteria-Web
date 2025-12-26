namespace Bicicleteria.API.Services.Interface
{
    public interface ICloudinaryService
    {
        Task<string> SubirImagen(IFormFile file, string carpeta);
        Task<string> SubirImagenPorUrl(string url, string carpeta); // Opcional, si quieres re-subir URLs externas
    }
}
