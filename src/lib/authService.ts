import { apiPost, ApiError } from '../utils/apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token?: string;
    user?: User;
    expires_in?: number;
  } | string;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string; user?: User }> {
    try {

      const result: AuthResponse = await apiPost('/v1.0/auth/login', credentials);

      if (result.success && typeof result.data === 'object' && result.data.token) {

        this.setToken(result.data.token);
        this.setUser(result.data.user!);

        this.scheduleTokenRefresh(result.data.expires_in || 3600);

        return { success: true, user: result.data.user };
      } else {
        return { 
          success: false, 
          message: typeof result.data === 'string' ? result.data : 'Login gagal'
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof ApiError) {
        return { 
          success: false, 
          message: error.message || 'Terjadi kesalahan saat login'
        };
      }

      return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {

        await apiPost('/v1.0/auth/logout', {});
      }
    } catch (error) {
      console.error('Logout error:', error);

    } finally {
      this.clearAuth();
    }
  }

  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {

      const result: AuthResponse = await apiPost('/v1.0/auth/verify', {});
      return result.success;
    } catch (error) {
      console.error('Token verification error:', error);

      if (error instanceof ApiError) {

        if (error.status === 401 || error.status === 403) {

          this.clearAuth();
        }
      }

      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {

      const result: AuthResponse = await apiPost('/v1.0/auth/refresh', {});

      if (result.success && typeof result.data === 'object' && result.data.token) {
        this.setToken(result.data.token);
        this.scheduleTokenRefresh(result.data.expires_in || 3600);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);

      if (error instanceof ApiError) {

        if (error.status === 401 || error.status === 403) {
          this.clearAuth();
        }
      }

      return false;
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  private scheduleTokenRefresh(expiresIn: number): void {

    const refreshTime = (expiresIn - 300) * 1000; 

    setTimeout(async () => {
      const refreshed = await this.refreshToken();
      if (!refreshed) {

        this.clearAuth();
        window.location.href = '/login';
      }
    }, refreshTime);
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {

      const result = await apiPost('/v1.0/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (result.success) {
        return { success: true, message: 'Password berhasil diubah' };
      } else {
        return { 
          success: false, 
          message: typeof result.data === 'string' ? result.data : 'Gagal mengubah password'
        };
      }
    } catch (error) {
      console.error('Change password error:', error);

      if (error instanceof ApiError) {
        return { 
          success: false, 
          message: error.message || 'Terjadi kesalahan saat mengubah password'
        };
      }

      return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  }
}

export const authService = new AuthService();

export { AuthService };

export type { User, LoginCredentials, AuthResponse };