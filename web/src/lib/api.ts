import { ApiErrorResponse, ApiSuccessResponse } from './types';

export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]> | string[];

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.errors = response.errors;
  }
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiSuccessResponse<T>> => {
  const url = `${getBaseUrl()}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  // Only set Content-Type to JSON if it's not a FormData instance
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        statusCode: response.status,
        message: 'Ocorreu um erro inesperado',
      };
    }
    throw new ApiError(errorData);
  }

  // Not all successful responses have body, e.g., 204
  if (response.status === 204) {
    return { success: true, data: null as unknown as T, message: 'Sucesso' };
  }

  const data: ApiSuccessResponse<T> = await response.json();
  return data;
};
