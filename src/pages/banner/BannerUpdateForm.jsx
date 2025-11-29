import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import bannerApi from "../../api/banner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function BannerUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "ACTIVE",
    banner_url: "",
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchBanner() {
      const data = await bannerApi.getBannerById(id);
      setForm({
        title: data.TITLE,
        description: data.DESCRIPTION,
        status: data.STATUS,
        banner_url: data.IMAGE_URL,
      });
    }
    fetchBanner();
  }, [id]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("status", form.status);
    if (file) formData.append("banner_url", file);

    // Cập nhật: Bỏ try...catch để bắt lỗi nếu cần
    try {
      await bannerApi.updateBanner(id, formData);
      // alert("Cập nhật banner thành công!"); // <-- ĐÃ XÓA DÒNG NÀY
      navigate("/banners"); // <-- Chỉ còn dòng chuyển hướng
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật banner!");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Cập nhật Banner</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hình hiện tại
            </label>
            {form.banner_url && (
              <img
                src={`${BACKEND_URL}/images/${form.banner_url}`}
                alt="banner cũ"
                className="w-48 h-32 object-cover rounded border"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hình mới (nếu có)
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="preview"
                  className="w-48 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Đã ẩn</option>
            </select>
          </div>

          <Button type="submit" className="bg-blue-600">
            Lưu thay đổi
          </Button>
        </form>
      </Card>
    </Layout>
  );
}
