const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');

// POST /api/generate-questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) {
      return res.status(400).json({ success: false, message: 'Goal is required' });
    }
    const questions = await groqService.generateQuestions(goal);
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Error in /generate-questions:', error);
    res.status(500).json({ success: false, message: 'Failed to generate questions' });
  }
});

// POST /api/generate-workflow
router.post('/generate-workflow', async (req, res) => {
  try {
    const { goal, answers } = req.body;
    if (!goal || !answers) {
      return res.status(400).json({ success: false, message: 'Goal and answers are required' });
    }
    const workflow = await groqService.generateWorkflow(goal, answers);
    res.json({ success: true, workflow });
  } catch (error) {
    console.error('Error in /generate-workflow:', error);
    res.status(500).json({ success: false, message: 'Failed to generate workflow' });
  }
});

// POST /api/ask-helper
router.post('/ask-helper', async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }
    const answer = await groqService.askHelper(question, context);
    res.json({ success: true, answer });
  } catch (error) {
    console.error('Error in /ask-helper:', error);
    res.status(500).json({ success: false, message: 'Failed to ask helper' });
  }
});

// POST /api/draft-document
router.post('/draft-document', async (req, res) => {
  try {
    const { templateType, intakeAnswers, goal } = req.body;
    if (!templateType) {
      return res.status(400).json({ success: false, message: 'Template type is required' });
    }
    const draft = await groqService.draftDocument(templateType, intakeAnswers, goal);
    res.json({ success: true, draft });
  } catch (error) {
    console.error('Error in /draft-document:', error);
    res.status(500).json({ success: false, message: 'Failed to draft document' });
  }
});

module.exports = router;
