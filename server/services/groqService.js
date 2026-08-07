const Groq = require('groq-sdk');
const mockWorkflows = require('../data/mockWorkflows');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

if (!groq) {
  console.warn('GROQ_API_KEY is missing. Using mock data fallback.');
}

const MODEL = 'llama3-70b-8192';

async function generateQuestions(goal) {
  try {
    if (!groq) throw new Error('Groq not initialized');

    const prompt = `You are an expert on Indian government and civic processes. 
The user's goal is: "${goal}".
Generate a JSON object with a single key "questions" containing an array of intake questions to determine their exact situation.
Each question should have:
- "id": string (unique identifier)
- "question": string (the question text)
- "type": string (either "single-choice", "multi-choice", or "text")
- "options": array of strings (only if type is single-choice or multi-choice)

Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.questions;
  } catch (error) {
    console.warn('Falling back to mock questions for:', goal);
    return mockWorkflows.getMockQuestions(goal);
  }
}

async function generateWorkflow(goal, answers) {
  try {
    if (!groq) throw new Error('Groq not initialized');

    const answersText = JSON.stringify(answers);
    const prompt = `You are an expert on Indian government and civic processes.
The user's goal is: "${goal}".
Their specific situation (based on intake answers) is: ${answersText}.

Generate a JSON object with a single key "workflow" containing the roadmap.
The "workflow" should have:
- "title": string
- "description": string
- "steps": array of objects, where each object has:
  - "id": string
  - "title": string
  - "description": string
  - "status": string (always "pending")
  - "agency": string (the government body involved)
  - "estimatedTime": string (e.g., "2-3 days")
  - "cost": string (e.g., "Rs. 500")
  - "requiredDocuments": array of strings
  - "tips": array of strings (helpful advice)
  - "links": array of objects with "text" and "url"
  - "templates": array of objects with "type" (e.g., "Affidavit", "Application") and "name"

Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.workflow;
  } catch (error) {
    console.warn('Falling back to mock workflow for:', goal);
    return mockWorkflows.getMockWorkflow(goal, answers);
  }
}

async function askHelper(question, context) {
  try {
    if (!groq) throw new Error('Groq not initialized');

    const contextText = context ? JSON.stringify(context) : 'None';
    const prompt = `You are a helpful assistant for Indian civic processes (LynQbot).
The user asked: "${question}"
Current Context: ${contextText}

Answer the question clearly, concisely, and accurately based on Indian regulations. 
Generate a JSON object with a single key "answer" containing your response as a string.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.answer;
  } catch (error) {
    console.warn('Falling back to mock helper answer');
    return "This is a mock answer from LynQbot because the Groq API key is missing or failed. Context provided: " + (context ? context.stepTitle : 'None');
  }
}

async function draftDocument(templateType, intakeAnswers, goal) {
  try {
    if (!groq) throw new Error('Groq not initialized');

    const prompt = `You are a legal assistant generating a draft for an Indian government process.
Document Type: "${templateType}"
Process/Goal: "${goal}"
User Details: ${JSON.stringify(intakeAnswers)}

Generate a draft document text. 
Return a JSON object with a single key "draft" containing the string text of the draft. Use markdown for formatting.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.draft;
  } catch (error) {
    console.warn('Falling back to mock document draft');
    return `# Draft: ${templateType}\n\nThis is a mock draft generated because the Groq API is unavailable. It would normally contain a filled-out template based on your intake answers for ${goal}.`;
  }
}

module.exports = {
  generateQuestions,
  generateWorkflow,
  askHelper,
  draftDocument
};
