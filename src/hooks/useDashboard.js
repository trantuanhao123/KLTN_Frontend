import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboard";
import carApi from "../api/car";

export const useDashboardStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashboardRes, carsRes] = await Promise.all([
          dashboardApi.getFullDashboard(),
          carApi.getAvailableCars(),
        ]);

        setData({
          dashboardData: dashboardRes.data,
          availableCars: carsRes.data,
        });
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
