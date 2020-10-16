import axios, { AxiosInstance } from "axios";
import trim from "lodash/trim";

export const BACKEND_BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3003`
    : `https://liquidnft.com`;

export const sendBackendRequest = async <T = any, U = any>(
  axios: AxiosInstance,
  path: string,
  data: T,
): Promise<U> => {
  const endpoint = `${BACKEND_BASE_URL}/${trim(path, "/")}`;

  let rawResponse;
  let content;
  try {
    rawResponse = await axios.post(endpoint, JSON.stringify(data || {}), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      responseType: `text`,
    });
    // no need to json-parse when setting content-type: application/json?
    content = rawResponse.data;
  } catch (error) {
    let message: string = error?.response?.data || error.message;
    throw new Error(`Server error: ${message}`);
  }

  return content;
};

export const sendBackendUploadRequest = async (
  axios: AxiosInstance,
  formData: FormData,
): Promise<void> => {
  const endpoint = `${BACKEND_BASE_URL}/upload`;

  let rawResponse;
  let content;
  try {
    rawResponse = await axios.post(endpoint, formData, {
      responseType: `text`, // need this instead of json to get errors in response.data
    });
    content = rawResponse.data;
  } catch (error) {
    let message: string = error?.response?.data || error.message;
    throw new Error(`Server error: ${message}`);
  }

  return content;
};
