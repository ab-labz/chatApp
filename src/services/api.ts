import { API_BASE_URL } from '../config/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async quickLogin(userData: { name: string; email: string }) {
    return this.request('/auth/quick-login', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Room endpoints
  async getRooms() {
    return this.request('/rooms');
  }

  async createRoom(roomData: { name: string; description?: string; type?: string; isPrivate?: boolean }) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async getRoom(roomId: string) {
    return this.request(`/rooms/${roomId}`);
  }

  async updateRoom(roomId: string, updates: { name?: string; description?: string }) {
    return this.request(`/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async joinRoom(roomId: string) {
    return this.request(`/rooms/${roomId}/join`, {
      method: 'POST',
    });
  }

  async leaveRoom(roomId: string) {
    return this.request(`/rooms/${roomId}/leave`, {
      method: 'POST',
    });
  }

  // Message endpoints
  async getMessages(roomId: string, page = 1, limit = 50) {
    return this.request(`/messages/room/${roomId}?page=${page}&limit=${limit}`);
  }

  async sendMessage(messageData: { content: string; roomId: string; type?: string; fileUrl?: string; fileName?: string; fileSize?: number }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async editMessage(messageId: string, content: string) {
    return this.request(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId: string) {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async reactToMessage(messageId: string, emoji: string) {
    return this.request(`/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }
}

export const apiService = new ApiService();