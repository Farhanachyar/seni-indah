import { authService } from './authService';

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const authHeaders = authService.getAuthHeader();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });
};

export const getProtectedData = async (endpoint: string) => {
  try {
    const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);

    if (response.status === 401) {

      authService.clearAuth();
      window.location.href = '/login';
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Protected API call failed:', error);
    return null;
  }
};

export const getAdminData = async (endpoint: string) => {
  const user = authService.getUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return getProtectedData(endpoint);
};