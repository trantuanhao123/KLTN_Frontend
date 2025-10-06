import { useState, useEffect } from "react";
import branchesApi from "../api/branch";

const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // READ (Lấy danh sách)
  const fetchBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await branchesApi.getAllBranches();
      setBranches(res.data);
    } catch (err) {
      console.error("Lỗi tải chi nhánh:", err);
      setError("Không thể tải danh sách chi nhánh.");
    } finally {
      setIsLoading(false);
    }
  };

  // READ (Lấy chi tiết theo ID)
  const loadBranch = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await branchesApi.getBranchById(id);
      setSelectedBranch(response.data); // Đặt dữ liệu vào state để dùng cho form chỉnh sửa
      return response.data;
    } catch (err) {
      console.error(`Lỗi tải chi nhánh ID ${id}:`, err);
      setError("Không thể tải chi tiết chi nhánh.");
      throw new Error("Không thể tải chi tiết chi nhánh.");
    } finally {
      setIsLoading(false);
    }
  };

  // CREATE / UPDATE (Lưu)
  const saveBranch = async (branchData) => {
    setIsLoading(true);
    setError(null);
    try {
      const isUpdate = !!branchData.id;
      const response = await branchesApi.createUpdateBranch(branchData);

      // Cập nhật lại danh sách để hiển thị dữ liệu mới nhất
      await fetchBranches();

      if (isUpdate) {
        setSelectedBranch(null); // Xóa dữ liệu chi tiết sau khi cập nhật
      }
      return response.data;
    } catch (err) {
      console.error("Lỗi lưu chi nhánh:", err);
      setError("Lưu chi nhánh thất bại.");
      throw new Error("Lưu chi nhánh thất bại.");
    }
  };

  // DELETE (Xóa)
  const removeBranch = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này không?"))
      return;

    setIsLoading(true);
    setError(null);
    try {
      await branchesApi.deleteBranch(id);

      // Cập nhật state bằng cách lọc bỏ chi nhánh vừa bị xóa
      setBranches((prevBranches) => prevBranches.filter((b) => b.id !== id));
      if (selectedBranch && selectedBranch.id === id) {
        setSelectedBranch(null);
      }
    } catch (err) {
      console.error(`Lỗi xóa chi nhánh ID ${id}:`, err);
      setError("Xóa chi nhánh thất bại.");
      throw new Error("Xóa chi nhánh thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm để component bên ngoài có thể xóa trạng thái chi nhánh đang được chỉnh sửa
  const clearSelectedBranch = () => setSelectedBranch(null);

  // Tải danh sách chi nhánh khi hook được khởi tạo
  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    selectedBranch,
    isLoading,
    error,
    fetchBranches,
    loadBranch,
    saveBranch,
    removeBranch,
    clearSelectedBranch,
  };
};

export default useBranches;
