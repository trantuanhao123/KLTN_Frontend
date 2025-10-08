import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useBranches from "../../hooks/useBranch";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Layout from "../../components/layouts/Layout";

// Memoize DetailRow to prevent unnecessary re-renders
const DetailRow = React.memo(({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium text-gray-600 w-1/3">{label}:</span>
    <span className="text-gray-800 font-semibold w-2/3">{value}</span>
  </div>
));

export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadBranch, isLoading, error, selectedBranch } = useBranches();

  useEffect(() => {
    if (id) {
      let mounted = true;
      const fetchDetail = async () => {
        try {
          await loadBranch(id);
        } catch (err) {
          console.error("Không thể tải chi tiết chi nhánh:", err);
        }
      };
      fetchDetail();
      return () => {
        mounted = false; // Prevent state updates on unmounted component
      };
    }
  }, [id, loadBranch]);

  const handleGoBack = () => {
    navigate("/branches");
  };

  if (isLoading || !selectedBranch) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-gray-600">Đang tải chi tiết chi nhánh...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <Card title="Lỗi tải dữ liệu" className="w-full">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={handleGoBack}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Quay lại danh sách
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Chi tiết Chi nhánh: {selectedBranch.NAME}
        </h1>

        <Card title="Thông tin cơ bản" className="mb-6">
          <div className="space-y-4 text-sm">
            <DetailRow label="ID" value={selectedBranch.BRANCH_ID} />
            <DetailRow label="Tên chi nhánh" value={selectedBranch.NAME} />
            <DetailRow label="Địa chỉ" value={selectedBranch.ADDRESS} />
            <DetailRow label="Điện thoại" value={selectedBranch.PHONE} />
          </div>
        </Card>

        <Card title="Thời gian & Vị trí" className="mb-6">
          <div className="space-y-4 text-sm">
            <DetailRow
              label="Giờ hoạt động"
              value={`${
                selectedBranch.OPEN_TIME
                  ? selectedBranch.OPEN_TIME.substring(0, 5)
                  : "N/A"
              } - ${
                selectedBranch.CLOSE_TIME
                  ? selectedBranch.CLOSE_TIME.substring(0, 5)
                  : "N/A"
              }`}
            />
            <DetailRow
              label="Tọa độ"
              value={`Latitude: ${selectedBranch.LATITUDE}, Longitude: ${selectedBranch.LONGITUDE}`}
            />
            <DetailRow
              label="Ngày tạo"
              value={
                selectedBranch.CREATED_AT
                  ? new Date(selectedBranch.CREATED_AT).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>
        </Card>

        <div>
          <Button
            onClick={handleGoBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            &larr; Quay lại
          </Button>
        </div>
      </div>
    </Layout>
  );
}
