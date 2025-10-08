import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCategory from "../../hooks/useCategory";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

function CategoryList() {
  const { categories, isLoading, error, removeCategory } = useCategory();

  // Trạng thái modal xóa
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    targetId: null,
    targetName: "",
  });

  // Trạng thái lỗi xóa riêng biệt
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Mở modal xác nhận
  const handleOpenDelete = (category) => {
    setDeleteError(""); // Reset lỗi khi mở modal mới
    setDeleteModal({
      open: true,
      targetId: category.CATEGORY_ID,
      targetName: category.NAME,
    });
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    try {
      setDeleteError(""); // Reset lỗi trước khi xóa
      setIsDeleting(true);
      await removeCategory(deleteModal.targetId);
      setDeleteModal({ open: false, targetId: null, targetName: "" });
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      // Lấy message từ backend hoặc dùng message mặc định
      const backendMsg =
        err?.response?.data?.message ||
        "Không thể xóa danh mục. Danh mục này vẫn còn chứa xe.";

      // Lưu lỗi vào state thay vì dùng alert
      setDeleteError(backendMsg);

      // Đóng modal sau khi hiển thị lỗi
      setDeleteModal({ open: false, targetId: null, targetName: "" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setDeleteModal({ open: false, targetId: null, targetName: "" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Quản lý danh mục
          </h3>
          <Link to="/categories/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1">
              + Thêm danh mục
            </Button>
          </Link>
        </div>
        {deleteError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <strong className="font-bold">Lỗi xóa danh mục: </strong>
                <span className="block sm:inline">
                  Không thể xóa danh mục. Vẫn còn xe thuộc danh mục.
                </span>
              </div>
              <button
                onClick={() => setDeleteError("")}
                className="ml-4 text-red-700 hover:text-red-900"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        {/* --- Bảng danh mục --- */}
        <Card>
          {isLoading ? (
            <p className="p-4 text-gray-500">Đang tải danh sách danh mục...</p>
          ) : error ? (
            <p className="p-4 text-red-500">Lỗi tải dữ liệu: {error}</p>
          ) : categories.length === 0 ? (
            <p className="p-4 text-gray-500">
              Chưa có danh mục nào trong hệ thống.
            </p>
          ) : (
            <Table
              headers={[
                "STT",
                "Tên danh mục",
                "Mô tả",
                "Số lượng xe",
                "Hành động",
              ]}
              data={categories}
              renderRow={(item, idx) => (
                <>
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{item.NAME}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.DESCRIPTION || "-"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-800 font-medium">
                    {item.total_cars ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Link to={`/categories/edit/${item.CATEGORY_ID}`}>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1">
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                        onClick={() => handleOpenDelete(item)}
                        disabled={isDeleting}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </>
              )}
            />
          )}
        </Card>
        {/* ✅ CHỈ 1 MODAL DUY NHẤT */}
        <ConfirmDeleteModal
          isOpen={deleteModal.open}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
          error={null}
          carName={deleteModal.targetName}
        />
      </div>
    </Layout>
  );
}

export default CategoryList;
