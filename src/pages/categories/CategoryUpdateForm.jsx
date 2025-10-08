import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import useCategory from "../../hooks/useCategory";

function CategoryUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadCategory, saveCategory, isLoading, error } = useCategory();

  const [formData, setFormData] = useState({
    CATEGORY_ID: null,
    CODE: "",
    NAME: "",
    DESCRIPTION: "",
  });

  // Load chi tiết danh mục
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await loadCategory(id);
        setFormData(data);
      } catch {
        alert("Không thể tải thông tin danh mục!");
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCategory(formData);
      alert("✅ Cập nhật thành công!");
      navigate("/category");
    } catch {
      alert("❌ Cập nhật thất bại!");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Cập nhật danh mục
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mã danh mục
              </label>
              <input
                type="text"
                name="CODE"
                value={formData.CODE}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên danh mục
              </label>
              <input
                type="text"
                name="NAME"
                value={formData.NAME}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <textarea
                name="DESCRIPTION"
                value={formData.DESCRIPTION || ""}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-between">
              <Button
                type="button"
                className="bg-gray-400 hover:bg-gray-500"
                onClick={() => navigate("/category")}
              >
                Quay lại
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default CategoryUpdateForm;
