require('dotenv').config();
const groqService = require('./services/groqService');
const fs = require('fs');
const path = require('path');

const schemesFile = fs.readFileSync(path.join(__dirname, '../client/src/data/schemes.js'), 'utf8');

let schemesData = [];
try {
  const arrayString = schemesFile.substring(schemesFile.indexOf('['), schemesFile.lastIndexOf(']') + 1);
  const evalSchemes = eval(arrayString);
  schemesData = evalSchemes.map(s => ({ id: s.id, name: s.name, eligibility: s.eligibility }));
} catch (e) {
  console.log("Failed to parse schemes:", e);
}

const profile = {
  age: '27',
  gender: 'Male',
  occupation: 'Student',
  category: 'General',
  income: 'Below ₹1 Lakh'
};

async function run() {
  console.log("Payload size:", JSON.stringify({ profile, schemesData }).length, "bytes");
  try {
    const result = await groqService.checkEligibility(profile, schemesData);
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
