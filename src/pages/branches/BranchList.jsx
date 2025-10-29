import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useBranches from "../../hooks/useBranch";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
// 1. Import Modal xác nhận chuẩn
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import Layout from "../../components/layouts/Layout";

export default function BranchList() {
  // --- Logic không đổi ---
  const { branches, isLoading, error, fetchBranches, removeBranch } =
    useBranches();

  const [showModal, setShowModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDeleteClick = (branchId) => {
    setSelectedBranchId(branchId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedBranchId) {
      await removeBranch(selectedBranchId);
      setSelectedBranchId(null);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedBranchId(null);
    setShowModal(false);
  };
  // --- Hết logic không đổi ---

  // Lấy tên chi nhánh để hiển thị trong modal
  const selectedBranchName =
    branches.find((b) => b.BRANCH_ID === selectedBranchId)?.NAME || "";

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý chi nhánh</h1>
        <Link to="/branches/new">
          <Button>Thêm mới</Button>
        </Link>
      </div>

      <Card>
        {/* 4. Đồng bộ style Loading/Error (p-4) */}
        {isLoading ? (
          <p className="p-4 text-gray-500">Đang tải...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <Table
            headers={[
              "STT",
              "Tên chi nhánh",
              "Địa chỉ",
              "Số điện thoại",
              "Hành động",
            ]}
            data={branches}
            renderRow={(branch, idx) => (
              <>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 font-medium">{branch.NAME}</td>
                <td className="px-4 py-2">{branch.ADDRESS}</td>
                <td className="px-4 py-2">{branch.PHONE}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Link to={`/branches/detail/${branch.BRANCH_ID}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm">
                      Chi Tiết
                    </Button>
                  </Link>
                  <Link to={`/branches/edit/${branch.BRANCH_ID}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm">
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm"
                    onClick={() => handleDeleteClick(branch.BRANCH_ID)}
                  >
                    Xóa
                  </Button>
                </td>
              </>
            )}
          />
        )}
      </Card>

      {/* 5. Sử dụng ConfirmDeleteModal đồng bộ */}
      <ConfirmDeleteModal
        isOpen={showModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        carName={selectedBranchName} // Prop này dùng chung cho tên (xe, dịch vụ, chi nhánh)
      >
        Bạn có chắc chắn muốn xóa chi nhánh
        <strong> {selectedBranchName} </strong>
        không? Hành động này không thể hoàn tác.
      </ConfirmDeleteModal>
    </Layout>
  );
}
