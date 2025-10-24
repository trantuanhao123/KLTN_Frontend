import { useState, useCallback } from "react";
import * as paymentApi from "../api/payment";

/**
 * Hook để lấy danh sách chờ hoàn tiền
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
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trả về { data, loading, error, refetch }
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
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return [execute, { loading, error, data }];
};
