import { useEffect, useState, useCallback } from "react";
import bannerApi from "../api/banner";

export default function useBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAll();
      setBanners(data);
    } catch (err) {
      console.error("Lỗi tải banner:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const deleteBanner = async (id) => {
    await bannerApi.deleteBanner(id);
    fetchBanners();
  };

  const toggleStatus = async (id) => {
    await bannerApi.toggleStatus(id);
    fetchBanners();
  };

  return {
    banners,
    loading,
    deleteBanner,
    toggleStatus,
    refresh: fetchBanners,
  };
}
