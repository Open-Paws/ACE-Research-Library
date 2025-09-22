// API Configuration for Knowva Application
// Centralized endpoint management

const API_BASE_URL = 'https://nandinisingh18.app.n8n.cloud/webhook';

// API Endpoints
export const API_ENDPOINTS = {
  // Chat API
  CHAT: `${API_BASE_URL}/chat`,
  
  // Keywords API
  KEYWORDS: `${API_BASE_URL}/keywords`,
  
  // Papers API
  PAPERS: `${API_BASE_URL}/papers`,
  APPROVED_PAPERS: `${API_BASE_URL}/approved-papers`,
  APPROVE: `${API_BASE_URL}/approve`,
  
  // Future endpoints can be added here
  // COLLECTIONS: `${API_BASE_URL}/collections`,
  // USERS: `${API_BASE_URL}/users`,
};

// API Service Functions
export const apiService = {
  // Chat API
  async sendChatMessage(query, topK = 5) {
    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          top_k: topK
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },

  // Keywords API
  async getKeywords() {
    try {
      const response = await fetch(API_ENDPOINTS.KEYWORDS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get keywords API error:', error);
      throw error;
    }
  },

  async addKeyword(keyword, priority = 'Medium', status = 'Active') {
    try {
      const response = await fetch(API_ENDPOINTS.KEYWORDS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          priority,
          status
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Add keyword API error:', error);
      throw error;
    }
  },

  // Papers API
  async getPapers() {
    try {
      const response = await fetch(API_ENDPOINTS.PAPERS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get papers API error:', error);
      throw error;
    }
  },

  async getApprovedPapers() {
    try {
      const response = await fetch(API_ENDPOINTS.APPROVED_PAPERS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get approved papers API error:', error);
      throw error;
    }
  },

  async approvePaper(paperId, status, comments, notes = '') {
    try {
      const response = await fetch(API_ENDPOINTS.APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paper_id: paperId,
          status,
          comments,
          notes
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Approve paper API error:', error);
      throw error;
    }
  }
};

// Constants for form validation
export const KEYWORD_CONSTANTS = {
  PRIORITIES: ['High', 'Medium', 'Low'],
  STATUSES: ['Active', 'Disabled'],
  MAX_KEYWORD_LENGTH: 100,
  MIN_KEYWORD_LENGTH: 2
};

export const PAPER_CONSTANTS = {
  STATUSES: ['Approved', 'Rejected', 'Pending'],
  INTERVENTIONS: ['Research - Farmed animal welfare science', 'Research - Wild animal welfare'],
  OUTCOMES: ['Improvement of Welfare Standards', 'Increased Knowledge/Skills for Animal Advocacy'],
  ITEMS_PER_PAGE: 12
};

export default apiService;
