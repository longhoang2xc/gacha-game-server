import Axios from "axios";
import { logger } from "./logger";
export const axios = Axios.create();
axios.interceptors.request.use(
  async (config: any) => {
    return config;
  },
  error => {
    logger.log({
      level: "error",
      message: `Axios helper error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use((response: any) => {
  return response;
});

export async function setAxiosCommonHeaders(headers: any) {
  axios.defaults.headers.common["X-CULTURE-CODE"] =
    headers["X-CULTURE-CODE"] || headers["x-culture-code"] || "";
  axios.defaults.headers.common["X-TIMESTAMP"] =
    headers["X-TIMESTAMP"] || headers["x-timestamp"] || "";
}

export async function setCommonAuthorizationToken(token: string) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export async function removeCommonAuthorizationToken() {
  delete axios.defaults.headers.common["Authorization"];
}
