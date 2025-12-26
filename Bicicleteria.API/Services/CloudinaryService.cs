using Bicicleteria.API.Services.Interface;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Bicicleteria.API.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:dawjsvwjo"],
                config["Cloudinary:158123558499723"],
                config["Cloudinary:O6i9Bv5GPSlJLsi_ScelKvdIkzc"]
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> SubirImagen(IFormFile file, string carpeta)
        {
            if (file.Length == 0) return null;

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = carpeta, // Ej: "bicicletas"
                Overwrite = true
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }

        public async Task<string> SubirImagenPorUrl(string url, string carpeta)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(url),
                Folder = carpeta
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }
    }
}

