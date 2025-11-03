import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import useBanners from "../../hooks/useBanner";
import Table from "../../components/ui/Table";
import Button, {
  ButtonCreate,
  ButtonEdit,
  ButtonDelete,
} from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const STATUS_MAP = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Đã ẩn",
};

export default function BannerList() {
  const { banners, loading, error, deleteBanner, toggleStatus } = useBanners();
  const [zoomImage, setZoomImage] = useState(null);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Banner</h1>
        <Link to="/banners/new">
          <ButtonCreate>Thêm Banner</ButtonCreate>
        </Link>
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="p-4 text-red-500">
            Lỗi tải dữ liệu: {error.message || "Lỗi không xác định"}
          </p>
        ) : !banners || banners.length === 0 ? (
          <p className="p-4 text-gray-500">Không có banner nào.</p>
        ) : (
          <Table
            headers={[
              "ID",
              "Tiêu đề",
              "Mô tả",
              "Hình",
              "Trạng thái",
              "Hành động",
            ]}
            data={banners}
            renderRow={(item) => (
              <>
                {/* [FIX] Xóa 'align-top', để table-cell tự căn giữa */}
                <td className="px-4 py-2">{item.BANNER_ID}</td>
                <td className="px-4 py-2">{item.TITLE}</td>
                <td className="px-4 py-2">{item.DESCRIPTION}</td>
                <td className="px-4 py-2">
                  <img
                    src={`${BACKEND_URL}/images/${item.IMAGE_URL}`}
                    alt="banner"
                    className="w-32 h-20 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                    onClick={() =>
                      setZoomImage(`${BACKEND_URL}/images/${item.IMAGE_URL}`)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.STATUS === "ACTIVE"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {STATUS_MAP[item.STATUS] || item.STATUS}
                  </span>
                </td>

                {/* [FIX] Xóa 'flex' và 'align-top' khỏi <td>
                  Bọc các button vào một <div> với 'flex'
                */}
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link to={`/banners/edit/${item.BANNER_ID}`}>
                      <ButtonEdit className="text-sm px-3 py-1">Sửa</ButtonEdit>
                    </Link>

                    <ButtonDelete
                      className="text-sm px-3 py-1"
                      onClick={() => {
                        if (
                          window.confirm("Bạn chắc chắn muốn xóa banner này?")
                        ) {
                          deleteBanner(item.BANNER_ID);
                        }
                      }}
                    >
                      Xóa
                    </ButtonDelete>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
                      onClick={() => toggleStatus(item.BANNER_ID)}
                    >
                      {item.STATUS === "ACTIVE" ? "Ẩn" : "Hiện"}
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
        )}
      </Card>

      {/* Modal zoom hình (Giữ nguyên) */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative">
            <img
              src={zoomImage}
              alt="Zoomed Banner"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full px-3 py-1 text-sm hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
