import type { AllocationData } from '../types';
import type { AllocationData as Session } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

type SubjectDTO = {
  _id: string;
  name: string;
  description?: string;
  chapters: Array<{ _id: string; title: string; topics: Array<{ _id: string; title: string; description?: string }> }>;
};

class ApiService {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(phoneNumber: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: string; name: string; phone: string; role: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, password }),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userInfo', JSON.stringify(response.user));
    
    return response;
  }

  async simpleLogin(name: string, phoneNumber: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: string; name: string; phone: string; role: string };
    }>('/auth/simple-login', {
      method: 'POST',
      body: JSON.stringify({ name, phoneNumber, password }),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userInfo', JSON.stringify(response.user));
    
    return response;
  }

  async register(name: string, phone: string, role: string, password?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, role, password }),
    });
  }

  async getAllUsers() {
    return this.request('/auth/users');
  }

  async createMultipleUsers(users: Array<{ name: string; phoneNumber: string; role: string }>) {
    return this.request('/auth/users/bulk', {
      method: 'POST',
      body: JSON.stringify({ users }),
    });
  }

  // User management methods
  async createUser(userData: { name: string; phone: string; role: string }) {
    return this.request<{
      message: string;
      userId: string;
      password: string;
      user: { id: string; name: string; phone: string; role: string };
    }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string, phone: string) {
    return this.request('/users', {
      method: 'DELETE',
      body: JSON.stringify({ userId, phone }),
    });
  }

 async editUser(userId: string, userData: any) {
    // Specify the shape of the user object it returns
    return this.request<{ id: string; name: string; phone: string; role: string }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

 async changePassword(passwordData: { /* ... */ }) {
    // Update the URL to point to the user route
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getStudents() {
    return this.request('/users/students');
  }

  async getTutors() {
    return this.request('/users/tutors');
  }

  async getAdmins() {
    return this.request('/users/admins');
  }

  // Subject methods
  async getSubjects() {
    return this.request<SubjectDTO[]>('/subjects/list');
  }

  async getSubjectById(id: string) {
    return this.request(`/subjects/details/${id}`);
  }

  async createSubject(subjectData: { name: string; description?: string }) {
    return this.request('/subjects/create', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async getChapters(subjectId: string) {
    return this.request<Array<{ _id: string; title: string }>>(`/subjects/chapters/${subjectId}`);
  }

  async addChapter(subjectId: string, chapterData: { title: string }) {
    return this.request(`/subjects/chapters/${subjectId}`, {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  }

  async getTopics(subjectId: string, chapterId: string) {
    return this.request(`/subjects/topics/${subjectId}/${chapterId}`);
  }

  async addTopic(subjectId: string, chapterId: string, topicData: { title: string; description?: string }) {
    return this.request(`/subjects/topics/${subjectId}/${chapterId}`, {
      method: 'POST',
      body: JSON.stringify(topicData),
    });
  }

  async deleteSubject(id: string) {
    return this.request(`/subjects/remove/${id}`, {
      method: 'DELETE',
    });
  }

  // Session methods
  async createSession(sessionData: {
    studentName: string;
    date: string;
    session: string;
    room: string;
    subject: string;
    chapter: string;
    topic?: string;
  }) {
   return this.request<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getAllSessions() {
    return this.request('/sessions');
  }

async getSessionById(id: string) {
    return this.request<Session>(`/sessions/${id}`);
  }

    async getSessionsByStudent(studentId: string) {
    // This <AllocationData[]> part is CRUCIAL. It fixes the error.
    return this.request<AllocationData[]>(`/sessions/student/${studentId}`);
  }

  async getSessionsByTutorId(tutorId: string) {
    // This will return an array of Session objects for the specified tutor
    return this.request<Session[]>(`/sessions/tutor/${tutorId}`);
  }
 
  async getStudentsInSession(sessionId: string) {
    // This will return an array of Session objects for the specified session
    return this.request<Session[]>(`/sessions/${sessionId}/students`);
  }
  
  async getActiveSessionByStudent(studentId: string) {
    // This <AllocationData | null> part is CRUCIAL. It fixes the error.
    return this.request<AllocationData | null>(`/sessions/student/active/${studentId}`);
  }

  async getActiveStudentsForTutor(tutorId: string) {
    // This will return an array of Session objects for the tutor's active session
    return this.request<Session[]>(`/sessions/active/tutor/${tutorId}`);
  }

  // async updateSession(id: string, sessionData: any) {
  //   return this.request(`/sessions/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(sessionData),
  //   });
  // }
  async updateSession(id: string, sessionData: any) {
  // Specify that this endpoint returns a single Session object
  return this.request<Session>(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sessionData),
  });
}

  async getSessionsByTutor(tutorId: string) {
    return this.request<Session[]>(`/sessions/tutor/${tutorId}`);
  }
  

  async endSession(sessionId: string) {
    return this.request(`/sessions/end/${sessionId}`, {
      method: 'PUT',
    });
  }

  async deleteSession(id: string) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat history methods
  async createChatHistory(chatData: {
    sessionId: string;
    studentId: string;
    studentName: string;
    date: string;
    session: string;
    room: string;
    score?: number;
    feedback?: string;
    messages?: any[];
  }) {
    return this.request('/chat-history/create', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  }

  async addMessage(sessionId: string, message: {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    file?: string;
  }) {
    return this.request(`/chat-history/${sessionId}/message`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getChatHistoryBySession(sessionId: string) {
    return this.request(`/chat-history/session/${sessionId}`);
  }

  async getChatHistoriesByStudent(studentId: string) {
    return this.request(`/chat-history/student/${studentId}`);
  }

  async getAllChatHistories() {
    return this.request('/chat-history/all');
  }

  async updateChatHistory(sessionId: string, chatData: {
    score?: number;
    feedback?: string;
    messages?: any[];
  }) {
    return this.request(`/chat-history/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(chatData),
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();