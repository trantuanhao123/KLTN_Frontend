import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useServices from "../../hooks/useService";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function ServiceForm() {
  const navigate = useNavigate();
  const { saveService, isLoading } = useServices();

  const [formData, setFormData] = useState({
    NAME: "",
    DESCRIPTION: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveService(formData);
      alert("Thêm dịch vụ thành công!");
      navigate("/services");
    } catch (err) {
      alert("Thêm dịch vụ thất bại.");
    }
  };

  return (
    <Layout title="Thêm dịch vụ mới">
      <Card>
        <h2 className="text-lg font-semibold mb-4">Thêm dịch vụ mới</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Tên dịch vụ:
            <input
              type="text"
              name="NAME"
              className="border p-2 rounded w-full"
              value={formData.NAME}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mô tả:
            <textarea
              name="DESCRIPTION"
              className="border p-2 rounded w-full"
              rows="3"
              value={formData.DESCRIPTION}
              onChange={handleChange}
            />
          </label>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700"
              onClick={() => navigate("/services")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}

export default ServiceForm;
