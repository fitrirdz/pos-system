const baseURL = 'http://localhost:4000/api';

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = config;
  
  const url = `${baseURL}${endpoint}`;
  
  const fetchConfig: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  
  if (body) {
    fetchConfig.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, fetchConfig);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

const api = {
  get: <T,>(endpoint: string, config?: RequestConfig) => 
    request<T>(endpoint, { ...config, method: 'GET' }),
  post: <T,>(endpoint: string, data?: any, config?: RequestConfig) => 
    request<T>(endpoint, { ...config, method: 'POST', body: data }),
  put: <T,>(endpoint: string, data?: any, config?: RequestConfig) => 
    request<T>(endpoint, { ...config, method: 'PUT', body: data }),
  delete: <T,>(endpoint: string, config?: RequestConfig) => 
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

export default api;
