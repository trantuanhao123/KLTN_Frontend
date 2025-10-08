import { useState, useEffect, useCallback } from "react";
import branchesApi from "../api/branch";

const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBranches = useCallback(async () => {
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
  }, []);

  const loadBranch = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await branchesApi.getBranchById(id);
      setSelectedBranch(response.data);
      return response.data;
    } catch (err) {
      console.error(`Lỗi tải chi nhánh ID ${id}:`, err);
      setError("Không thể tải chi tiết chi nhánh.");
      throw new Error("Không thể tải chi tiết chi nhánh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveBranch = useCallback(
    async (branchData) => {
      setIsLoading(true);
      setError(null);
      try {
        const branchId =
          branchData.id || (selectedBranch && selectedBranch.BRANCH_ID);
        const payload = {
          ...branchData,
          latitude: Number(branchData.latitude),
          longitude: Number(branchData.longitude),
        };
        if (branchId) {
          payload.id = branchId;
        }
        const response = await branchesApi.createUpdateBranch(payload);
        await fetchBranches();
        if (branchId) setSelectedBranch(null);
        return response.data;
      } catch (err) {
        console.error("Lỗi lưu chi nhánh:", err);
        setError("Lưu chi nhánh thất bại.");
        throw new Error("Lưu chi nhánh thất bại.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedBranch, fetchBranches]
  );

  const removeBranch = useCallback(
    async (id) => {
      setIsLoading(true);
      setError(null);
      try {
        await branchesApi.deleteBranch(id);
        await fetchBranches();
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
    },
    [selectedBranch, fetchBranches]
  );

  const clearSelectedBranch = useCallback(() => setSelectedBranch(null), []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

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
