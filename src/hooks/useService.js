import { useState, useEffect } from "react";
import servicesApi from "../api/service";

const useServices = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // State cho chi tiết
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // READ (Lấy danh sách)
  const fetchServices = () => {
    setIsLoading(true);
    setError(null);
    servicesApi
      .getServices()
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error("Lỗi tải dịch vụ:", err);
        setError("Không thể tải danh sách dịch vụ.");
      })
      .finally(() => setIsLoading(false));
  };

  // READ (Lấy chi tiết) - NEW
  const loadService = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await servicesApi.getServiceById(id);
      setSelectedService(response.data);
      return response.data;
    } catch (err) {
      console.error(`Lỗi tải dịch vụ ID ${id}:`, err);
      setError("Không thể tải chi tiết dịch vụ.");
      throw new Error("Không thể tải chi tiết dịch vụ.");
    } finally {
      setIsLoading(false);
    }
  };

  // CREATE / UPDATE
  const saveService = async (serviceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await servicesApi.createUpdateService(serviceData);
      // Sau khi tạo/cập nhật thành công, gọi lại hàm fetch để cập nhật danh sách
      fetchServices();
      return response.data;
    } catch (err) {
      console.error("Lỗi lưu dịch vụ:", err);
      setError("Lưu dịch vụ thất bại.");
      throw new Error("Lưu dịch vụ thất bại.");
    }
  };

  // DELETE - NEW
  const removeService = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await servicesApi.deleteService(id);

      // Cập nhật state bằng cách lọc bỏ dịch vụ vừa bị xóa
      setServices((prevServices) =>
        prevServices.filter((s) => s.SERVICE_ID !== id)
      );
      if (selectedService && selectedService.SERVICE_ID === id) {
        setSelectedService(null);
      }
    } catch (err) {
      console.error(`Lỗi xóa dịch vụ ID ${id}:`, err);
      setError("Xóa dịch vụ thất bại.");
      throw new Error("Xóa dịch vụ thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Khởi tạo việc tải danh sách dịch vụ
  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    selectedService,
    isLoading,
    error,
    fetchServices,
    loadService,
    saveService,
    removeService,
  };
};

export default useServices;
