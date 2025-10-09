import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  priority?: number;
  status?: 'draft' | 'published';
  views?: number;
  helpful?: { yes: number; no: number };
  createdBy?: { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface Study {
  _id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'available' | 'completed' | 'paused';
  participants: number;
  targetParticipants: number;
  maxParticipants?: number;
  reward: number;
  duration: number;
  category: string;
  deadline?: string;
  endDate?: string;
  startDate?: string;
  image: string;
  requirements?: string;
  instructions?: string;
  tags?: string[];
  isActive?: boolean;
  createdBy?: { _id: string; name: string };
  createdAt: string;
  updatedAt?: string;
}

export interface Gift {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image: string;
  availability: 'available' | 'limited' | 'out-of-stock';
  originalPrice?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const api = axios.create({ baseURL: BASE_URL + '/api' });

export const faqAPI = {
  getAllFAQs() {
    return api.get<{ faqs: FAQ[] }>('/faqs');
  },
  createFAQ(data: { question: string; answer: string; category: string }) {
    return api.post('/faqs', data);
  },
  updateFAQ(id: string, data: Partial<Pick<FAQ, 'question' | 'answer' | 'category' | 'priority' | 'status'>>) {
    return api.put(`/faqs/${id}`, data);
  },
  deleteFAQ(id: string) {
    return api.delete(`/faqs/${id}`);
  },
};

export const studiesAPI = {
  getAllStudies() {
    return api.get<{ studies: Study[] }>('/studies');
  },
  getActiveStudies() {
    return api.get<{ studies: Study[] }>('/studies/active');
  },
  getStudy(id: string) {
    return api.get<{ study: Study }>(`/studies/${id}`);
  },
  createStudy(data: Partial<Study>) {
    return api.post('/studies', data);
  },
  updateStudy(id: string, data: Partial<Study>) {
    return api.put(`/studies/${id}`, data);
  },
  deleteStudy(id: string) {
    return api.delete(`/studies/${id}`);
  },
  participateInStudy(id: string) {
    return api.patch(`/studies/${id}/participate`);
  },
};

export const giftsAPI = {
  getAllGifts() {
    return api.get<{ success: boolean; gifts: Gift[]; total: number }>('/gifts');
  },
  getGift(id: string) {
    return api.get<{ success: boolean; gift: Gift }>(`/gifts/${id}`);
  },
  createGift(data: Partial<Gift>) {
    return api.post('/gifts', data);
  },
  updateGift(id: string, data: Partial<Gift>) {
    return api.put(`/gifts/${id}`, data);
  },
  deleteGift(id: string) {
    return api.delete(`/gifts/${id}`);
  },
  getGiftStats() {
    return api.get<{ success: boolean; stats: any }>('/gifts/stats/summary');
  },
};

 