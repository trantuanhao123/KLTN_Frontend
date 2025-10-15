import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import useBanners from "../../hooks/useBanner";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function BannerList() {
  const { banners, loading, deleteBanner, toggleStatus } = useBanners();
  const [zoomImage, setZoomImage] = useState(null); // hình đang zoom

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <Layout>
      <Card title="Quản lý Banner">
        <div className="flex justify-end mb-4">
          <Link to="/banners/new">
            <Button>Thêm Banner</Button>
          </Link>
        </div>

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
                  {item.STATUS}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2">
                <Link to={`/banners/edit/${item.BANNER_ID}`}>
                  <Button className="bg-yellow-500">Sửa</Button>
                </Link>
                <Button
                  className="bg-red-500"
                  onClick={() => {
                    if (window.confirm("Bạn chắc chắn muốn xóa banner này?")) {
                      deleteBanner(item.BANNER_ID);
                    }
                  }}
                >
                  Xóa
                </Button>
                <Button
                  className="bg-blue-500"
                  onClick={() => toggleStatus(item.BANNER_ID)}
                >
                  {item.STATUS === "ACTIVE" ? "Ẩn" : "Hiện"}
                </Button>
              </td>
            </>
          )}
        />

        {/* 🔹 Modal zoom hình */}
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
      </Card>
    </Layout>
  );
}
