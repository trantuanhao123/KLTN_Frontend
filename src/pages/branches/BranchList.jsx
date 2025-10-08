import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useBranches from "../../hooks/useBranch";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Layout from "../../components/layouts/Layout";

export default function BranchList() {
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

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Danh sách chi nhánh
          </h1>
          <Link to="/branches/new">
            <Button>+ Thêm mới</Button>
          </Link>
        </div>

        <Card>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
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

        {/* Modal xác nhận xóa */}
        <Modal
          open={showModal}
          title="Xác nhận xóa chi nhánh"
          onClose={handleCancelDelete}
        >
          <p>Bạn có chắc chắn muốn xóa chi nhánh này không?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              className="bg-gray-400 hover:bg-gray-500"
              onClick={handleCancelDelete}
            >
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
