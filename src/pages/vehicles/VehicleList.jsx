import React from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";
import useCars from "../../hooks/useCars";

const BACKEND_URL = "http://localhost:8080";

export default function VehicleList() {
  const { cars, loading, error } = useCars();

  const headers = [
    "STT",
    "Hình ảnh",
    "Loại / Model",
    "Trạng thái",
    "Giá (VNĐ/ngày)",
    "Hành động",
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Quản lý xe</h3>
        <Link to="/vehicles/new">
          <Button>+ Thêm xe</Button>
        </Link>
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải danh sách xe...</p>
        ) : error ? (
          <p className="p-4 text-red-500">Lỗi: {error}</p>
        ) : cars.length === 0 ? (
          <p className="p-4 text-gray-500">Chưa có xe nào trong hệ thống.</p>
        ) : (
          <Table
            headers={headers}
            data={cars}
            renderRow={(row, idx) => (
              <>
                <td className="px-4 py-2">{idx + 1}</td>

                <td className="px-4 py-2">
                  <img
                    src={
                      row.mainImageUrl
                        ? `${BACKEND_URL}/images/${row.mainImageUrl}`
                        : "/no-image.jpg"
                    }
                    alt={row.MODEL}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>

                <td className="px-4 py-2">
                  <div>
                    {row.BRAND} {row.MODEL}
                    <div className="text-xs text-gray-500">
                      Biển số: {row.LICENSE_PLATE}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      row.STATUS === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.STATUS}
                  </span>
                </td>

                <td className="px-4 py-2 font-medium">
                  {Number(row.PRICE_PER_DAY).toLocaleString("vi-VN")}₫
                </td>

                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link to={`/vehicles/${row.CAR_ID}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1">
                        Chi tiết
                      </Button>
                    </Link>

                    {/* Sửa: dẫn tới /vehicles/edit/:id */}
                    <Link to={`/vehicles/edit/${row.CAR_ID}`}>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-1">
                        Sửa
                      </Button>
                    </Link>

                    <Button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1">
                      Xóa
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
        )}
      </Card>
    </Layout>
  );
}
