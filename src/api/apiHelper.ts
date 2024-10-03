import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export async function makeApiRequest<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await axios(config);
  return response.data as T;
}

export async function makeApiRequestWithHeaderResponse<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await axios(config);
  return response as T;
}

// Define a function that creates an API configuration object
export function createApiConfig(
  url: string,
  method: AxiosRequestConfig['method'],
  params?: { [key: string]: any }, // Request parameters
  data?: any, // Request payload
  responseType?: AxiosRequestConfig['responseType'],
): AxiosRequestConfig {
  const config: AxiosRequestConfig = {
    method, // The HTTP method
    url, // The full URL
  };

  if (params) {
    config.params = params; // Add request parameters if they exist
  }

  if (data) {
    config.data = data; // Add request payload if it exists
  }

  if (responseType) {
    config.responseType = responseType; // Add response type
  }

  return config;
}
