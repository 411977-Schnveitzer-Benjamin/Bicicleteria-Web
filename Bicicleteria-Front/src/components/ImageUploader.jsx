import { useState } from 'react';
import { Upload, Check, Loader, ImageIcon, RefreshCw } from 'lucide-react';

const ImageUploader = ({ onImageUpload }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // --- CONFIGURACIÓN CLOUDINARY ---
  // Estos datos los sacamos de tu conversación anterior
  const cloudName = "dawjsvwjo"; 
  const uploadPreset = "bicicleteria_preset"; // Asegúrate de que en Cloudinary tu preset se llame así y sea "Unsigned"

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageUpload(data.secure_url); // Enviamos la URL al componente padre (Dashboard)
      } else {
        console.error("Error de Cloudinary:", data);
        alert("Error al subir. Verifica que el 'Upload Preset' en Cloudinary sea 'Unsigned'.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión al subir imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Estado de Carga */}
      {loading && (
        <div className="flex items-center gap-2 text-orange-400 text-sm font-medium animate-pulse mb-3">
          <Loader className="animate-spin" size={16} /> Subiendo a la nube...
        </div>
      )}

      {/* 2. Estado de Vista Previa (Éxito) */}
      {!loading && preview && (
        <div className="relative mb-4 group w-fit mx-auto md:mx-0">
           <img 
             src={preview} 
             alt="Vista previa" 
             className="w-32 h-32 object-cover rounded-lg border-2 border-orange-500/50 shadow-lg"
           />
           <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
             <Check size={14} />
           </div>
           <p className="text-xs text-green-400 mt-1 font-bold text-center">¡Imagen lista!</p>
        </div>
      )}

      {/* 3. Botón / Zona de Click */}
      <label className={`
        flex items-center justify-center gap-2 w-full p-6
        border-2 border-dashed rounded-xl cursor-pointer transition-all
        ${preview 
            ? 'border-gray-600 bg-transparent hover:border-orange-500/50 text-gray-400 hover:text-orange-400' 
            : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-orange-500 text-gray-300 hover:text-white'
        }
      `}>
        <div className="flex flex-col items-center gap-2">
          {loading ? (
             <Loader className="animate-spin text-orange-500" size={24}/>
          ) : preview ? (
             <div className="flex items-center gap-2"><RefreshCw size={18}/> <span>Cambiar imagen</span></div>
          ) : (
             <>
               <Upload size={28} className="text-orange-500 mb-1" />
               <span className="text-sm font-bold">Subir Imagen</span>
               <span className="text-[10px] text-gray-500">Click para explorar archivos</span>
             </>
          )}
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={loading}
        />
      </label>
    </div>
  );
};

export default ImageUploader;