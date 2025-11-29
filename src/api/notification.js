import axiosClient from "./axiosClient";

const notificationApi = {
  getMyNotifications: () => {
    return axiosClient.get("/notification");
  },

  createForUser: (data) => {
    // data = { userId, title, content }
    return axiosClient.post("/notification/user", data);
  },

  createForAll: (data) => {
    // data = { title, content }
    return axiosClient.post("/notification/all-users", data);
  },

  markAsRead: (id) => {
    return axiosClient.patch(`/notification/read/${id}`);
  },

  markAllAsRead: () => {
    return axiosClient.patch("/notification/read-all");
  },
};

export default notificationApi;
