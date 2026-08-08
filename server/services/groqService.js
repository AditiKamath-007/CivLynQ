const Groq = require('groq-sdk');
const mockWorkflows = require('../data/mockWorkflows');

let groq = null;

function getGroqClient() {
  if (!groq) {
    if (process.env.GROQ_API_KEY) {
      groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } else {
      console.warn('GROQ_API_KEY is missing. Using mock data fallback.');
      return null;
    }
  }
  return groq;
}

const MODEL = 'llama-3.1-8b-instant';

async function generateQuestions(goal, language = 'en') {
  try {
    const client = getGroqClient();
    if (!client) throw new Error('Groq not initialized');

    const prompt = `You are a strict legal and civic expert on Indian government processes. 
The user's goal is: "${goal}".
IMPORTANT: You MUST generate your response natively in the following language code: ${language}.
Generate a JSON object with a single key "questions" containing an array of intake questions to determine their exact situation.

CRITICAL RULES FOR QUESTIONS:
1. QUANTITY: You must generate between 1 to 3 questions minimum, and an absolute maximum of 5 to 6 questions.
2. SPECIFICITY: Keep the questions balanced—neither too highly niche/technical, nor too basic/generic. Ask just enough to cover the essential details needed for personalization of their roadmap.
3. COMMON SENSE FILTER: Do NOT ask highly intrusive, illogical, or extreme corner-case questions for basic administrative tasks (e.g., do not ask about criminal convictions for a simple Aadhar card update). Assume standard citizen circumstances unless the user's goal explicitly involves those extreme situations.
4. LOGICAL INDEPENDENCE: Because all questions are asked at the same time, no question should depend on or contradict the answer to a previous question. Ask independent questions.
5. AGE SIMPLICITY: If age is relevant, do not use arbitrary brackets (e.g., 18-25, 25-35). Just ask if they are a minor (<18) or adult (18+) unless a specific law requires exact age brackets.

Each question should have:
- "id": string (unique identifier)
- "question": string (the question text)
- "type": string (either "single-choice", "multi-choice", or "text")
- "options": array of strings (only if type is single-choice or multi-choice)

Return ONLY valid JSON.`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.questions;
  } catch (error) {
    console.warn('Falling back to mock questions for:', goal);
    return mockWorkflows.getMockQuestions(goal);
  }
}

async function generateWorkflow(goal, answers, language = 'en') {
  try {
    const client = getGroqClient();
    if (!client) throw new Error('Groq not initialized');

    const answersText = JSON.stringify(answers);
    const prompt = `You are an expert government, legal, and compliance advisor on Indian processes.
The user's goal is: "${goal}".
Their specific situation (based on intake answers) is: ${answersText}.
IMPORTANT: You MUST generate your response natively in the following language code: ${language}.

CRITICAL DOCUMENT RULES (FAILURE IS UNACCEPTABLE):
1. ZERO HALLUCINATIONS: You must NEVER invent documents. Only list documents that are strictly required by official, real-world procedures.
2. NO CONSULTANT FEES: Do not require documents or steps for hiring consultants/lawyers unless legally mandated.
3. SPECIFICITY: Do not say "Identity Proof". Say exactly what is accepted (e.g., "Aadhaar Card, PAN Card, or Passport").

--- CHAIN OF THOUGHT PROCESS ---
Before generating the steps, you must mentally create a "Master Document List" required for the entire goal. Include ALL basic mandatory documents AND EXACT, highly specific documents.
Then, as you generate the 'steps' array, you must take documents from that Master List and assign them ONLY to the specific step where the user actually needs to upload or submit them. 
DO NOT list all documents in Step 1.
If a step requires no documents (e.g., "Wait for approval"), the 'requiredDocuments' array MUST be empty [].

Generate a JSON object with a single key "workflow" containing the roadmap.
The "workflow" should have:
- "title": string
- "description": string
- "masterRequiredDocuments": array of strings (the master list of all documents needed across all steps)
- "steps": array of objects, where each object has:
  - "id": string
  - "title": string
  - "description": string
  - "status": string (always "pending")
  - "agency": string (the government body involved)
  - "estimatedTime": string (e.g., "2-3 days")
  - "cost": string (e.g., "Rs. 500")
  - "requiredDocuments": array of strings (pulled from masterRequiredDocuments, only for this specific step)
  - "prerequisites": array of strings (actions, not files)
  - "tips": array of strings (helpful advice)
  - "links": array of objects with "text" and "url". CRITICAL RULE: For any step requiring an online action, you MUST provide the DEEP, DIRECT ACTION LINK to the exact application form or login portal (e.g., "https://foscos.fssai.gov.in" for FSSAI registration, NOT a generic informational page about the license). NEVER provide a vague website just to learn about the process. If a step involves applying/registering, give the exact link to start that action.
  - "templates": array of objects with "type" (e.g., "Affidavit", "Application") and "name"

Return ONLY valid JSON.`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.workflow;
  } catch (error) {
    console.warn('Falling back to mock workflow for:', goal);
    return mockWorkflows.getMockWorkflow(goal, answers);
  }
}

async function askHelper(question, context, language = 'en') {
  try {
    const client = getGroqClient();
    if (!client) throw new Error('Groq not initialized');

    const contextText = context ? JSON.stringify(context) : 'None';
    const prompt = `You are LynQbot, a strict and helpful assistant for Indian civic processes.
The user asked: "${question}"
Current Context (Roadmap Step): ${contextText}
IMPORTANT: You MUST generate your response natively in the following language code: ${language}.

CRITICAL RESTRICTIONS:
1. ONLY answer questions related to the "Current Context" OR general Indian government/civic/bureaucratic processes.
2. If the user asks about ANYTHING else, politely decline and say you can only assist with civic processes.

STYLE GUIDELINES (CRITICAL):
1. SIMPLICITY: Use very simple, everyday language. Avoid complex jargon.
2. CONCISENESS: Keep answers extremely brief. 
3. STRUCTURE: Use markdown bullet points. **Bold** the most important keywords for easy scanning. Use spacing between points.

Return ONLY a valid JSON object matching this exact structure (with the markdown string in "answer"):
{
  "answer": "your response string here"
}`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.answer;
  } catch (error) {
    console.error('Groq askHelper Error:', error.message || error);
    console.warn('Falling back to mock helper answer');
    return mockWorkflows.getMockHelperAnswer(question, context);
  }
}

async function draftDocument(templateType, intakeAnswers, goal, language = 'en') {
  try {
    const client = getGroqClient();
    if (!client) throw new Error('Groq not initialized');

    const prompt = `You are a legal assistant generating a draft for an Indian government process.
Document Type: "${templateType}"
Process/Goal: "${goal}"
User Details: ${JSON.stringify(intakeAnswers)}
IMPORTANT: You MUST generate your response natively in the following language code: ${language}.

Generate a draft document text. 
Return a JSON object with a single key "draft" containing the string text of the draft. Use markdown for formatting.`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.draft;
  } catch (error) {
    console.warn('Falling back to mock document draft');
    return mockWorkflows.getMockDraft(templateType, intakeAnswers, goal);
  }
}

async function getDocumentGuide(documentName, language = 'en') {
  try {
    const client = getGroqClient();
    if (!client) throw new Error('Groq not initialized');

    const prompt = `You are a helpful assistant for Indian civic processes.
The user wants to know how to obtain or renew the following document: "${documentName}"
IMPORTANT: You MUST generate your response natively in the following language code: ${language}.

Provide a short, simple guide.
CRITICAL: Include the exact, direct official Indian government portal URL where the user can apply for or renew this document online. If it cannot be done online, provide the official informational link or a relevant portal.

Return a JSON object with EXACTLY this structure:
{
  "steps": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "link": "https://..."
}`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.warn('Falling back to mock document guide');
    return mockWorkflows.getMockDocumentGuide(documentName);
  }
}

async function checkEligibility(profile, schemesData, language = 'en') {
  try {
    const client = getGroqClient();
    if (!client) throw new Error('Groq not initialized');

    const prompt = `You are an expert government assessor.
The user profile is: ${JSON.stringify(profile)}.
Here is a list of available government schemes and their eligibility rules: ${JSON.stringify(schemesData)}.

Evaluate the user profile against every scheme.
IMPORTANT: You MUST generate your response natively in the following language code: ${language}.

Return a JSON object with a single key "eligibleSchemeIds" containing an array of strings. Each string must be the "id" of a scheme the user is definitely or highly likely eligible for. If they are not eligible for any, return an empty array.

Return ONLY valid JSON matching this structure:
{
  "eligibleSchemeIds": ["scheme-id-1", "scheme-id-2"]
}`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.eligibleSchemeIds || [];
  } catch (error) {
    console.error('Error checking eligibility via Groq:', error);
    // Fallback: return empty array if AI fails
    return [];
  }
}

module.exports = {
  generateQuestions,
  generateWorkflow,
  askHelper,
  draftDocument,
  getDocumentGuide,
  checkEligibility
};
