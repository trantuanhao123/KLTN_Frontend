import { useState, useCallback, useEffect } from "react";
import * as paymentApi from "../api/payment";

/**
 * Hook để lấy danh sách chờ hoàn tiền
 * TỰ ĐỘNG fetch khi component mount
 */
export const useAdminGetPendingRefunds = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentApi.adminGetPendingRefunds();

      const refunds = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setData(refunds);
    } catch (err) {
      console.error("Error fetching refunds:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // TỰ ĐỘNG gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook để XÁC NHẬN hoàn tiền
 * Trả về [hàm_để_gọi, { state_đang_xử_lý }]
 */
export const useAdminConfirmRefund = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (paymentId) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await paymentApi.adminConfirmRefund(paymentId);
      console.log("Confirm refund response:", response);

      const result = response.data?.data || response.data;
      setData(result);
      return result;
    } catch (err) {
      console.error("Error confirming refund:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return [execute, { loading, error, data }];
};
