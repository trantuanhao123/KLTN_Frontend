import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import bannerApi from "../../api/banner";

export default function BannerForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "ACTIVE",
    banner_url: "",
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !file) {
      alert("Vui lòng nhập tiêu đề và chọn hình banner!");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("banner_url", file);

    try {
      await bannerApi.createBanner(formData);
      alert("Thêm banner thành công!");
      navigate("/banners");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm banner!");
    }
  };

  return (
    <Layout>
      <Card title="Thêm Banner Mới">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập tiêu đề banner..."
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập mô tả..."
            />
          </div>

          {/* Hình banner */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Hình banner
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

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <Button type="submit" className="bg-blue-600">
            Thêm Banner
          </Button>
        </form>
      </Card>
    </Layout>
  );
}
