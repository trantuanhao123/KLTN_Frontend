import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBranch from "../../hooks/useBranch";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function BranchForm() {
  const navigate = useNavigate();
  const { saveBranch, isLoading, error } = useBranch();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    open_time: "08:00:00",
    close_time: "21:00:00",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nếu là latitude/longitude thì convert sang số
    const parsedValue =
      name === "latitude" || name === "longitude"
        ? parseFloat(value) || ""
        : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        open_time: formData.open_time,
        close_time: formData.close_time,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      await saveBranch(payload);
      alert("✅ Thêm chi nhánh mới thành công!");
      navigate("/branches");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <Card title="Thêm chi nhánh mới">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên chi nhánh
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Nhập tên chi nhánh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Nhập địa chỉ chi nhánh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Giờ mở cửa
                </label>
                <input
                  type="time"
                  name="open_time"
                  value={formData.open_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Giờ đóng cửa
                </label>
                <input
                  type="time"
                  name="close_time"
                  value={formData.close_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Vĩ độ (Latitude)
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="21.028511"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kinh độ (Longitude)
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="105.804817"
                />
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                className="bg-gray-400 hover:bg-gray-500"
                onClick={() => navigate("/branches")}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Lưu chi nhánh"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
