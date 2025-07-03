import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomDemoConfig } from "@/context/CustomDemoConfigContext";

const CustomCounterConfig: React.FC = () => {
  const navigate = useNavigate();
  const {
    bannerText, setBannerText,
    counterColor, setCounterColor,
    counterSize, setCounterSize,
    uploadedVideos, setUploadedVideos,
    bannerTextSize, setBannerTextSize,
    videoPlayerSize, setVideoPlayerSize,
    theme, setTheme,
    AVAILABLE_COLORS,
    AVAILABLE_BANNER_TEXT_SIZES, AVAILABLE_VIDEO_PLAYER_SIZES, AVAILABLE_THEMES
  } = useCustomDemoConfig();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const videoUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      videoUrls.push(URL.createObjectURL(files[i]));
    }
    setUploadedVideos([...uploadedVideos, ...videoUrls]);
  };

  const handleRemove = (url: string) => {
    setUploadedVideos(uploadedVideos.filter(v => v !== url));
  };

  const handleTxtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBannerText(ev.target?.result as string);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleCounterSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 1000) {
      setCounterSize(`${value}px`);
    }
  };

  const handleBackToDemo = () => {
    navigate('/custom-demo');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme === "dark" ? "from-gray-900 via-blue-900 to-gray-900" : "from-gray-100 via-blue-100 to-gray-50"} p-4 transition-colors`}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Configurar Demo del Contador
          </h1>
          <p className="text-lg text-gray-300 mb-4">Personaliza los controles del demo.</p>
          <Button 
            variant="outline" 
            className="mb-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            onClick={handleBackToDemo}
          >
            ← Volver al Demo
          </Button>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-6 mx-auto max-w-xl shadow-lg space-y-6">
          {/* Subir/Texto banner */}
          <div>
            <label className="block text-white text-sm mb-1">Texto del Banner</label>
            <Input
              value={bannerText}
              onChange={e => setBannerText(e.target.value)}
              className="bg-slate-700 text-white border-slate-600 mb-2"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() => document.getElementById('txt-banner-upload')?.click()}
                className="bg-indigo-600 hover:bg-indigo-700"
                type="button"
              >
                <FileText className="w-4 h-4 mr-2" />
                Cargar desde TXT
              </Button>
              <input
                id="txt-banner-upload"
                type="file"
                accept=".txt"
                onChange={handleTxtUpload}
                className="hidden"
              />
              <span className="text-gray-400 text-xs">
                Puedes subir un archivo .txt para el banner.
              </span>
            </div>
          </div>
          {/* Tamaño del texto del banner */}
          <div>
            <label className="block text-white text-sm mb-1">Tamaño del texto del Banner</label>
            <select
              value={bannerTextSize}
              onChange={e => setBannerTextSize(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-md w-full p-2"
            >
              {AVAILABLE_BANNER_TEXT_SIZES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {/* Color contador */}
          <div>
            <label className="block text-white text-sm mb-1">Color del contador</label>
            <select
              value={counterColor}
              onChange={e => setCounterColor(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-md w-full p-2"
            >
              {AVAILABLE_COLORS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          {/* Tamaño del contador - Manual input */}
          <div>
            <label className="block text-white text-sm mb-1">Tamaño del contador (píxeles)</label>
            <Input
              type="number"
              min="0"
              max="1000"
              value={parseInt(counterSize.replace('px', ''))}
              onChange={handleCounterSizeChange}
              className="bg-slate-700 text-white border-slate-600"
              placeholder="Ingresa un valor de 0 a 1000"
            />
            <span className="text-gray-400 text-xs mt-1 block">
              Valor actual: {counterSize} (rango: 0-1000px)
            </span>
          </div>
          {/* Tamaño del reproductor de video */}
          <div>
            <label className="block text-white text-sm mb-1">Tamaño del reproductor de video</label>
            <select
              value={videoPlayerSize}
              onChange={e => setVideoPlayerSize(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-md w-full p-2"
            >
              {AVAILABLE_VIDEO_PLAYER_SIZES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {/* Subir videos (playlist) */}
          <div>
            <label className="block text-white text-sm mb-1">Subir videos (playlist)</label>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => document.getElementById('video-config-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700"
                type="button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir Videos
              </Button>
              <input
                id="video-config-upload"
                type="file"
                accept="video/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
              <span className="text-gray-400 text-xs">
                {uploadedVideos.length
                  ? `${uploadedVideos.length} en la lista`
                  : "O usa el playlist por defecto."}
              </span>
            </div>
            {uploadedVideos.length > 0 && (
              <div className="grid grid-cols-1 gap-2 mt-4">
                {uploadedVideos.map((url, idx) => (
                  <div key={url} className="flex items-center gap-2 bg-black/40 p-2 rounded">
                    <video src={url} className="rounded shadow max-h-20" controls />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleRemove(url)}
                      aria-label={`Eliminar video ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <span className="text-gray-300 text-xs ml-2">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Tema */}
          <div>
            <label className="block text-white text-sm mb-1">Tema visual general</label>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-md w-full p-2"
            >
              {AVAILABLE_THEMES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          {/* Restablecer */}
          <Button
            variant="secondary"
            onClick={() => {
              setBannerText("🎯 Custom Counter Demo • All features enabled • Digital Counter, Spanish Voice, Video Upload, Custom Styling!");
              setCounterColor("green-400");
              setCounterSize("160px");
              setBannerTextSize("text-lg");
              setVideoPlayerSize("h-64");
              setTheme("dark");
              setUploadedVideos([]);
            }}
            className="w-full mt-2"
          >
            Restaurar valores por defecto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomCounterConfig;
