const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');
const mockWorkflows = require('../data/mockWorkflows');

// POST /api/generate-questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { goal } = req.body;
    const result = await groqService.generateIntakeQuestions(goal);
    res.json(result);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// POST /api/generate-workflow
router.post('/generate-workflow', async (req, res) => {
  try {
    const { goal, answers } = req.body;
    const result = await groqService.generateWorkflow(goal, answers);
    res.json(result);
  } catch (error) {
    console.error('Error generating workflow. Falling back to mock data:', error);
    // CRITICAL FALLBACK: return a static JSON object from local mockWorkflows
    // N.B: Since mockWorkflows exports a getMockWorkflow function that returns an object from its static arrays
    const fallback = mockWorkflows.getMockWorkflow(req.body.goal, req.body.answers);
    res.json(fallback);
  }
});

// POST /api/ask-helper
router.post('/ask-helper', async (req, res) => {
  try {
    const { question, context } = req.body;
    const answer = await groqService.askHelper(question, context);
    res.json({ answer });
  } catch (error) {
    console.error('Error asking helper:', error);
    res.status(500).json({ error: 'Failed to ask helper' });
  }
});

// POST /api/draft-document
router.post('/draft-document', async (req, res) => {
  try {
    const { templateType, intakeAnswers, goal } = req.body;
    const document = await groqService.draftDocument(templateType, intakeAnswers, goal);
    res.json({ document });
  } catch (error) {
    console.error('Error drafting document:', error);
    res.status(500).json({ error: 'Failed to draft document' });
  }
});

module.exports = router;
