import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import useCategory from "../../hooks/useCategory";

function CategoryForm() {
  const { saveCategory, isLoading, error } = useCategory();

  const [formData, setFormData] = useState({
    CODE: "",
    NAME: "",
    DESCRIPTION: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCategory(formData);
      alert("✅ Thêm danh mục thành công!");
      setFormData({ CODE: "", NAME: "", DESCRIPTION: "" });
    } catch {
      alert("❌ Thêm danh mục thất bại!");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Thêm danh mục mới
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
                placeholder="VD: SUV, SEDAN..."
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
                placeholder="Tên hiển thị (VD: Xe SUV)"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <textarea
                name="DESCRIPTION"
                value={formData.DESCRIPTION}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Mô tả danh mục..."
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu danh mục"}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default CategoryForm;
