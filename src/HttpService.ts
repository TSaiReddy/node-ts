import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export default class HttpService {
  client: AxiosInstance;
  maxRetries: number;
  retryDelay: number;
  authToken: string | null = null;

  constructor(
    baseURL: string,
    timeout: number = 5000,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ) {
    this.client = axios.create({ baseURL, timeout });
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers["Authorization"] = `Bearer ${this.authToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 429 && !originalRequest._retry) {
          originalRequest._retry = true;
          await this.sleep(this.retryDelay);
          return this.client(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    config: AxiosRequestConfig,
    retries: number = 0
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.request<T>(config);
    } catch (error) {
      if (retries < this.maxRetries) {
        await this.sleep(this.retryDelay);
        return this.retryRequest<T>(config, retries + 1);
      }
      throw error;
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest<T>({ ...config, method: "GET", url }).then(
      (response) => response.data
    );
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.retryRequest<T>({ ...config, method: "POST", url, data }).then(
      (response) => response.data
    );
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.retryRequest<T>({ ...config, method: "PUT", url, data }).then(
      (response) => response.data
    );
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest<T>({ ...config, method: "DELETE", url }).then(
      (response) => response.data
    );
  }
}
