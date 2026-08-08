require('dotenv').config();
const groqService = require('./services/groqService');

async function run() {
  const goal = "I want to apply for Aadhar card";
  const answers = { "age": "Adult (18+)" };
  try {
    const workflow = await groqService.generateWorkflow(goal, answers, 'hi');
    console.log(workflow);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
