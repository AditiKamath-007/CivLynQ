const Groq = require('groq-sdk');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

async function generateIntakeQuestions(goal) {
  if (!groq) throw new Error('Groq API Key missing');

  const prompt = `You are a legal advisor.
The user's goal is: "${goal}".
Generate ONLY a JSON object with a "questions" array.
Constraint: Max 4 questions. Ask only about eligibility, state, business type, etc.
Each question MUST follow the exact format:
{
  "id": "string",
  "question": "string",
  "type": "radio",
  "options": ["string"]
}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function generateWorkflow(goal, answers) {
  if (!groq) throw new Error('Groq API Key missing');

  const prompt = `You are a legal advisor generating a highly structured roadmap.
Goal: "${goal}".
Intake Answers: ${JSON.stringify(answers)}.
Strict Rules: Never invent laws/documents. Use only statutory fees.
Return ONLY a JSON object with the following schema:
{
  "goal": "string",
  "complexity": "full or simple",
  "summary": "string",
  "totalEstimatedTime": "string",
  "totalEstimatedCost": "string",
  "steps": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "governmentDepartment": "string",
      "estimatedFee": "string",
      "whyThisStepIsRequired": "string",
      "legalJargonSimplified": "string",
      "requiredDocuments": ["string"],
      "prerequisites": ["string"],
      "officialUrl": "string",
      "estimatedDays": "string",
      "tips": "string",
      "commonMistakes": "string",
      "canBeDoneOnline": boolean,
      "subTasks": [
        {
          "id": "string",
          "task": "string",
          "isDocumentDraftable": boolean,
          "draftTemplateType": "string or null"
        }
      ]
    }
  ]
}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function askHelper(question, context) {
  if (!groq) throw new Error('Groq API Key missing');

  const prompt = `You are a contextual chatbot acting as a legal assistant.
Context (the current step the user is looking at): ${JSON.stringify(context)}
User Question: "${question}"

Answer practically and concisely (under 150 words) without inventing legal rules. Do not return JSON.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile'
  });

  return completion.choices[0].message.content;
}

async function draftDocument(templateType, intakeAnswers, goal) {
  if (!groq) throw new Error('Groq API Key missing');

  const prompt = `You are a legal assistant. Draft a formal government letter/declaration.
Template Type: "${templateType}"
Goal: "${goal}"
User Details: ${JSON.stringify(intakeAnswers)}

Use formal language and placeholders (e.g. [Insert Name Here]) for missing information. Return the drafted text. Do not return JSON.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile'
  });

  return completion.choices[0].message.content;
}

module.exports = {
  generateIntakeQuestions,
  generateWorkflow,
  askHelper,
  draftDocument
};
