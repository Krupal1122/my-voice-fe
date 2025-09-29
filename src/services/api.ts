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

 