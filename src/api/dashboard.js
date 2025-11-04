import axiosClient from "./axiosClient";

export const dashboardApi = {
  getFullDashboard: () => {
    return axiosClient.get("dashboard/all");
  },
  getRevenueByCategory: () => {
    return axiosClient.get("dashboard/revenue/by-category");
  },
  getMostRentedCars: () => {
    return axiosClient.get("dashboard/cars/most-rented");
  },
};
