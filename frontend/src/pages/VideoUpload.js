import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

const MAX_VIDEOS = 2;

const VideoUpload = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [myVideos, setMyVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = async () => {
    try {
      const res = await api.get("videos/my-videos");
      setMyVideos(res.data);
    } catch (err) {
      console.error("Ошибка загрузки видео:", err);
      toast.error("Не удалось загрузить список видео");
    }
  };

  const videoCount = myVideos.length;

  // ---------- upload ----------

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Файл слишком большой. Максимум 100MB");
      return;
    }
    if (!file.type.startsWith("video/")) {
      toast.error("Пожалуйста, выберите видео файл");
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Пожалуйста, выберите видео файл");
      return;
    }
    if (videoCount >= MAX_VIDEOS) {
      toast.error(`Максимум ${MAX_VIDEOS} видео на игрока`);
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("video", selectedFile);
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);

      await api.post("videos/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Видео успешно загружено!");

      setFormData({ title: "", description: "" });
      setSelectedFile(null);

      await fetchMyVideos();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка загрузки видео");
    } finally {
      setUploading(false);
    }
  };

  // ---------- delete ----------

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить это видео?")) return;

    try {
      await api.delete(`videos/${id}`);
      toast.success("Видео удалено");
      await fetchMyVideos();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка удаления видео");
    }
  };

  // ---------- edit ----------

  const startEdit = (video) => {
    setEditingId(video.id);
    setEditingData({
      title: video.title || "",
      description: video.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({ title: "", description: "" });
  };

  const handleEditChange = (e) => {
    setEditingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`videos/${id}`, editingData);
      toast.success("Видео обновлено");
      setEditingId(null);
      await fetchMyVideos();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка обновления видео");
    }
  };

  // ---------- UI ----------

  return (
    <div className="bg-app min-h-[80vh]">
      <div className="app-container py-8 space-y-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
          Мои видео
        </h1>

        <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          {/* Левая колонка — загрузка */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Загрузить новое видео</h2>

            {videoCount >= MAX_VIDEOS && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm">
                <p className="text-yellow-800">
                  Вы уже загрузили максимальное количество видео ({MAX_VIDEOS}).
                  Удалите существующее видео, чтобы загрузить новое.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Название видео
                </label>
                <input
                  type="text"
                  name="title"
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Например: Мои лучшие голы"
                  disabled={videoCount >= MAX_VIDEOS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="input-field"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Краткое описание видео..."
                  disabled={videoCount >= MAX_VIDEOS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Видео файл *
                </label>

                {!selectedFile ? (
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="btn-primary inline-block">
                        Выбрать видео файл
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={videoCount >= MAX_VIDEOS}
                      />
                    </label>
                    <p className="text-sm text-muted mt-2">
                      Максимум 100MB, рекомендуемая длительность 1–2 минуты
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-50">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-muted">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-400 hover:text-red-500"
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
                  <li>• Длительность: 1–2 минуты</li>
                  <li>• Покажите разные навыки: дриблинг, передачи, удары</li>
                  <li>• Хорошее качество и освещение</li>
                  <li>• Разные игровые ситуации</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={
                    uploading || !selectedFile || videoCount >= MAX_VIDEOS
                  }
                  className="btn-primary disabled:opacity-50"
                >
                  {uploading ? "Загрузка..." : "Загрузить видео"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/player-dashboard")}
                  className="btn-secondary"
                >
                  Назад в панель
                </button>
              </div>
            </form>
          </div>

          {/* Правая колонка — список видео */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Мои видео</h2>
              <span className="text-xs text-muted">
                {videoCount}/{MAX_VIDEOS}
              </span>
            </div>

            {myVideos.length === 0 ? (
              <p className="text-sm text-muted">
                Пока нет загруженных видео. Добавьте своё первое видео, чтобы
                скауты могли вас заметить.
              </p>
            ) : (
              <div className="space-y-3">
                {myVideos.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-lg bg-slate-800/70 px-4 py-3 space-y-2"
                  >
                    {editingId === v.id ? (
                      <>
                        <input
                          type="text"
                          name="title"
                          className="input-field mb-2"
                          value={editingData.title}
                          onChange={handleEditChange}
                          placeholder="Название"
                        />
                        <textarea
                          name="description"
                          rows="2"
                          className="input-field mb-2"
                          value={editingData.description}
                          onChange={handleEditChange}
                          placeholder="Описание"
                        />
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => saveEdit(v.id)}
                            className="btn-primary px-3 py-1 text-xs"
                          >
                            Сохранить
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="btn-secondary px-3 py-1 text-xs"
                          >
                            Отмена
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-medium text-slate-50">
                              {v.title || "Без названия"}
                            </p>
                            <p className="text-xs text-muted line-clamp-2">
                              {v.description || "Без описания"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {new Date(v.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <a
                              href={v.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary px-3 py-1 text-xs"
                            >
                              Смотреть
                            </a>
                            <button
                              type="button"
                              onClick={() => startEdit(v)}
                              className="btn-secondary px-3 py-1 text-xs"
                            >
                              Редактировать
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(v.id)}
                              className="inline-flex items-center rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-500/20"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
