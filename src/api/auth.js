import axiosClient from "./axiosClient";

const authApi = {
  loginAdmin: (credentials) => {
    const url = "/user/loginAdmin";
    return axiosClient.post(url, credentials);
  },
  sendOtpForReset: (payload) => {
    const url = "/auth/request-reset";
    return axiosClient.post(url, payload);
    //payload = {email}
  },

  resetPassword: (payload) => {
    const url = "/auth/verify-otp";
    return axiosClient.post(url, payload);
  },
};

export default authApi;
