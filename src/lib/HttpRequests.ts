export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class HttpRequests {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultTimeout = 10000; 
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  setAuthToken(token: string): void {
    this.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  }

  removeAuthToken(): void {
    const { Authorization, ...rest } = this.defaultHeaders;
    this.defaultHeaders = rest;
  }

  private encryptPayload(payload: any): any {

    return payload;
  }

  private decryptResponse(response: any): any {

    return response;
  }

  private async makeRequest<T>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.baseUrl + endpoint;

      const encryptedData = data ? this.encryptPayload(data) : undefined;

      const headers = {
        ...this.defaultHeaders,
        ...config?.headers,
      };

      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: config?.withCredentials ? 'include' : 'same-origin',
      };

      if (encryptedData && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(encryptedData);
      }

      const timeout = config?.timeout || this.defaultTimeout;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      requestOptions.signal = controller.signal;

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      let responseData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();

        responseData = this.decryptResponse(responseData);
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          status: response.status,
          message: 'Request successful'
        };
      } else {
        return {
          success: false,
          error: responseData?.message || responseData || 'Request failed',
          status: response.status,
          message: `HTTP ${response.status}: ${response.statusText}`
        };
      }

    } catch (error: any) {

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
          message: 'Request was aborted due to timeout'
        };
      }

      return {
        success: false,
        error: error.message || 'Network error occurred',
        message: 'Failed to complete request'
      };
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PATCH', endpoint, data, config);
  }

  async uploadFile<T>(
    endpoint: string, 
    file: File, 
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.baseUrl + endpoint;
      const formData = new FormData();

      formData.append(fieldName, file);

      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }

      const { 'Content-Type': _, ...headersWithoutContentType } = this.defaultHeaders;
      const headers = {
        ...headersWithoutContentType,
        ...config?.headers,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: config?.withCredentials ? 'include' : 'same-origin',
      });

      let responseData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        return {
          success: true,
          data: this.decryptResponse(responseData),
          status: response.status,
          message: 'File uploaded successfully'
        };
      } else {
        return {
          success: false,
          error: typeof responseData === 'object' ? responseData?.message || 'Upload failed' : responseData || 'Upload failed',
          status: response.status,
          message: `HTTP ${response.status}: ${response.statusText}`
        };
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload error occurred',
        message: 'Failed to upload file'
      };
    }
  }
}

const ApiService = new HttpRequests(process.env.NEXT_PUBLIC_API_BASE_URL || '');

export default ApiService;