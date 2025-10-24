import { useState, useCallback } from "react";
import * as orderApi from "../api/rentalOrder";

// --- HOOKS ĐỂ LẤY DỮ LIỆU (GET) ---

/**
 * Hook để lấy danh sách TẤT CẢ đơn hàng
 */
export const useAdminGetAllOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.adminGetAllOrders();
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
 * Hook để lấy CHI TIẾT 1 đơn hàng
 * Sẽ tự động gọi lại khi orderId thay đổi
 */
export const useAdminGetOrderById = (orderId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (id) => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.adminGetOrderById(id);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động gọi khi orderId thay đổi
  // Giống useEffect(() => { fetchData(orderId) }, [orderId, fetchData]);
  // nhưng ở đây ta dùng 1 cách khác để tránh warning (vì fetchData là callback)
  useState(() => {
    fetchData(orderId);
  }, [orderId, fetchData]);

  // Trả về { data, loading, error, refetch: () => fetchData(orderId) }
  return { data, loading, error, refetch: () => fetchData(orderId) };
};

/**
 * Hook để lấy lịch sử đơn của 1 USER
 */
export const useAdminGetUserOrders = (userId) => {
  // Logic tương tự useAdminGetOrderById
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (id) => {
    if (!id) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.adminGetUserOrders(id);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => {
    fetchData(userId);
  }, [userId, fetchData]);

  return { data, loading, error, refetch: () => fetchData(userId) };
};

// --- HOOKS ĐỂ THAY ĐỔI DỮ LIỆU (MUTATIONS) ---

/**
 * Hook để TẠO đơn hàng thủ công
 * Trả về [hàm_để_gọi, { state_đang_xử_lý }]
 */
export const useAdminCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null); // Trả về data nếu thành công

  const execute = useCallback(async (orderDetails) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await orderApi.adminCreateManualOrder(orderDetails);
      setData(response.data);
      return response.data; // Trả về cho .then()
    } catch (err) {
      setError(err);
      throw err; // Trả về cho .catch()
    } finally {
      setLoading(false);
    }
  }, []);

  return [execute, { loading, error, data }];
};

/**
 * Hook để CẬP NHẬT đơn hàng
 */
export const useAdminUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (orderId, updateData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await orderApi.adminUpdateOrder(orderId, updateData);
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

/**
 * Hook để XÓA đơn hàng
 */
export const useAdminDeleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await orderApi.adminHardDeleteOrder(orderId);
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
/**
 * Hook để XÁC NHẬN BÀN GIAO XE (Pickup)
 */
export const useAdminConfirmPickup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (orderId, pickupData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // Sử dụng hàm API mới
      const response = await orderApi.adminConfirmPickup(orderId, pickupData);
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

/**
 * Hook để XÁC NHẬN TRẢ XE (Complete)
 */
export const useAdminCompleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (orderId, completeData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // Sử dụng hàm API mới
      const response = await orderApi.adminCompleteOrder(orderId, completeData);
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
