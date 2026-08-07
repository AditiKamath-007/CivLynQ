const BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let apiAuthToken = null;

/**
 * Configure the active auth token for API requests.
 * @param {string|null} token 
 */
export function setAuthToken(token) {
  apiAuthToken = token;
}

async function request(endpoint, body = null, method = 'POST') {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (apiAuthToken) {
      headers['Authorization'] = `Bearer ${apiAuthToken}`;
    }

    const config = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.message || `Request to ${endpoint} failed`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      error.message || 'Network error — please check your connection',
      0,
      null
    );
  }
}

/**
 * Generate personalized questions for a user's goal.
 */
export async function generateQuestions(goal) {
  return request('/generate-questions', { goal });
}

/**
 * Generate a step-by-step workflow/roadmap.
 */
export async function generateWorkflow(goal, answers) {
  return request('/generate-workflow', { goal, answers });
}

/**
 * Ask the LynQbot helper a question.
 */
export async function askHelper(question, context = null) {
  return request('/ask-helper', { question, context });
}

/**
 * Draft a document based on a template.
 */
export async function draftDocument(templateType, intakeAnswers, goal) {
  return request('/draft-document', { templateType, intakeAnswers, goal });
}

/**
 * Save user consent for AI drafting.
 */
export async function saveConsent(consented) {
  return request('/user/consent', { consented });
}

/**
 * Retrieve user consent status.
 */
export async function checkConsent() {
  return request('/user/consent', null, 'GET');
}

/**
 * Fetch all saved drafts for the logged-in user.
 */
export async function getUserDrafts() {
  return request('/user/drafts', null, 'GET');
}

/**
 * Save a new draft.
 */
export async function saveUserDraft(draftData) {
  return request('/user/drafts', draftData);
}
