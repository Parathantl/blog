import { API_BASE_URL } from './config';

// Portfolio API
export const portfolioAPI = {
  // Projects
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects`);
    return response.json();
  },

  getFeaturedProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects/featured`);
    return response.json();
  },

  getProject: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects/${id}`);
    return response.json();
  },

  createProject: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Skills
  getSkills: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/skills`);
    return response.json();
  },

  getSkillsByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/skills/category/${category}`);
    return response.json();
  },

  // Experience
  getExperience: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/experience`);
    return response.json();
  },

  getCurrentExperience: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/experience/current`);
    return response.json();
  },

  // About
  getAbout: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/about`);
    return response.json();
  },
};

// Blog API
export const blogAPI = {
  getPosts: async (filters?: any) => {
    const params = filters ? `?${new URLSearchParams(filters)}` : '';
    const response = await fetch(`${API_BASE_URL}/post${params}`);
    return response.json();
  },

  getPostBySlug: async (slug: string) => {
    const response = await fetch(`${API_BASE_URL}/post/slug/${slug}`);
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/category`);
    return response.json();
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
