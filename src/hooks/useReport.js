import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboard";

export const useReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi song song các API cho trang reports
        const [revenueCatRes, mostRentedRes] = await Promise.all([
          dashboardApi.getRevenueByCategory(),
          dashboardApi.getMostRentedCars(),
        ]);

        setData({
          revenueByCategory: revenueCatRes.data,
          mostRentedCars: mostRentedRes.data,
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
