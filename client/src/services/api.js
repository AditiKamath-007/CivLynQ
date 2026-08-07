const BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, body) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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

    // Network errors, JSON parse errors, etc.
    throw new ApiError(
      error.message || 'Network error — please check your connection',
      0,
      null
    );
  }
}

/**
 * Generate personalized questions for a user's goal.
 * @param {string} goal - The bureaucratic process the user needs help with
 * @returns {Promise<{success: boolean, questions: Array<{id: string, question: string, type: string, options: string[]}>}>}
 */
export async function generateQuestions(goal) {
  return request('/generate-questions', { goal });
}

/**
 * Generate a step-by-step workflow/roadmap.
 * @param {string} goal - The user's goal
 * @param {Object} answers - Key-value map of question IDs to answers
 * @returns {Promise<{success: boolean, workflow: Object}>}
 */
export async function generateWorkflow(goal, answers) {
  return request('/generate-workflow', { goal, answers });
}

/**
 * Ask the LynQbot helper a question.
 * @param {string} question - The user's question
 * @param {Object|null} context - Optional context from a roadmap step
 * @param {string} [context.stepTitle] - Current step title
 * @param {string[]} [context.requiredDocuments] - Documents for this step
 * @returns {Promise<{success: boolean, answer: string}>}
 */
export async function askHelper(question, context = null) {
  return request('/ask-helper', { question, context });
}

/**
 * Draft a document based on a template.
 * @param {string} templateType - The type of document to draft
 * @param {Object} intakeAnswers - User's intake answers
 * @param {string} goal - The user's goal
 * @returns {Promise<{success: boolean, draft: string}>}
 */
export async function draftDocument(templateType, intakeAnswers, goal) {
  return request('/draft-document', { templateType, intakeAnswers, goal });
}
