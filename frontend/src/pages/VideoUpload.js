import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoCount, setVideoCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideoCount();
  }, []);

  const fetchVideoCount = async () => {
    try {
      const response = await api.get("/videos/my-videos");
      setVideoCount(response.data.length);
    } catch (error) {
      console.error("Error fetching video count:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB
        toast.error("Файл слишком большой. Максимум 100MB");
        return;
      }
      if (!file.type.startsWith("video/")) {
        toast.error("Пожалуйста, выберите видео файл");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Пожалуйста, выберите видео файл");
      return;
    }

    if (videoCount >= 2) {
      toast.error("Максимум 2 видео на игрока");
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("video", selectedFile);
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);

      await api.post("/videos/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      toast.success("Видео успешно загружено!");
      navigate("/player-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка загрузки видео");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Загрузить видео</h1>

        {videoCount >= 2 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Вы уже загрузили максимальное количество видео (2). Удалите
              существующее видео, чтобы загрузить новое.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название видео
              </label>
              <input
                type="text"
                name="title"
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Мои лучшие голы"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                name="description"
                rows="3"
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                placeholder="Краткое описание видео..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Видео файл *
              </label>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="btn-primary inline-block">
                      Выбрать видео файл
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Максимум 100MB, рекомендуемая длительность 1-2 минуты
                  </p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Рекомендации для видео:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Длительность: 1-2 минуты</li>
                <li>• Покажите разные навыки: дриблинг, передачи, удары</li>
                <li>• Хорошее качество и освещение</li>
                <li>• Разные игровые ситуации</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="btn-primary disabled:opacity-50"
              >
                {uploading ? "Загрузка..." : "Загрузить видео"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/player-dashboard")}
                className="btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
