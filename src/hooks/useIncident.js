// src/hooks/useIncidents.js
// [ĐÃ CẬP NHẬT]
import { useState, useEffect, useCallback } from "react";
// 1. Import file API mới (và đổi tên)
import incidentApi from "../api/incident";

/**
 * Hook để lấy danh sách sự cố và xử lý xóa
 */
export const useIncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      // 2. [SỬA] incidentApi.getIncidents() giờ đã trả về mảng
      const incidentsData = await incidentApi.getIncidents();
      setIncidents(incidentsData); // <-- Gán thẳng (trước đây là response.data)
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch incidents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleDeleteIncident = async (id) => {
    try {
      // 3. [SỬA] Dùng incidentApi
      await incidentApi.deleteIncident(id);
      await fetchIncidents();
    } catch (err) {
      console.error("Failed to delete incident:", err);
      throw new Error(
        "Xóa thất bại: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return { incidents, loading, error, handleDeleteIncident };
};

/**
 * Hook để lấy chi tiết và cập nhật trạng thái
 */
export const useIncidentDetail = (id) => {
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // 4. [SỬA] Dùng incidentApi, trả về object
        const incidentData = await incidentApi.getIncidentById(id);
        setIncident(incidentData); // <-- Gán thẳng (trước đây là response.data)
        setError(null);
      } catch (err) {
        setError(err);
        console.error(`Failed to fetch incident ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Hàm cập nhật trạng thái
  const handleUpdateStatus = async (status) => {
    if (!id) throw new Error("No incident ID provided");
    try {
      // 5. [SỬA] Dùng incidentApi
      await incidentApi.updateIncidentStatus(id, status);
    } catch (err) {
      console.error("Failed to update status:", err);
      throw new Error(
        "Cập nhật thất bại: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return { incident, loading, error, handleUpdateStatus };
};
