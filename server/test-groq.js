require('dotenv').config();
const groqService = require('./services/groqService');

async function test() {
  try {
    const ans = await groqService.askHelper("how tp file a patent", null);
    console.log("SUCCESS:", ans);
  } catch (e) {
    console.error("FAILED:", e);
  }
}

test();
