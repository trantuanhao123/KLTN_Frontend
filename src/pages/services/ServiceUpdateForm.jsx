import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useServices from "../../hooks/useService";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function ServiceUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadService, saveService, isLoading } = useServices();

  const [formData, setFormData] = useState({
    SERVICE_ID: id,
    NAME: "",
    DESCRIPTION: "",
  });

  useEffect(() => {
    const load = async () => {
      const data = await loadService(id);
      setFormData({
        SERVICE_ID: data.SERVICE_ID,
        NAME: data.NAME,
        DESCRIPTION: data.DESCRIPTION,
      });
    };
    load();
  }, [id]);

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
      navigate("/services");
    } catch (err) {
      alert("Cập nhật dịch vụ thất bại.");
    }
  };

  return (
    <Layout title="Cập nhật dịch vụ">
      <Card>
        <h2 className="text-lg font-semibold mb-4">Cập nhật dịch vụ</h2>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
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
              <Button type="secondary" onClick={() => navigate("/services")}>
                Hủy
              </Button>
              <Button type="primary" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </Layout>
  );
}

export default ServiceUpdateForm;
