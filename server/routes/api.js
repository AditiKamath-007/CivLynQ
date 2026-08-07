const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');
const mockWorkflows = require('../data/mockWorkflows');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../services/firebaseService');

// Protected AI Routes
// POST /api/generate-questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { goal } = req.body;
    const questions = await groqService.generateQuestions(goal);
    // client expects { success: true, questions: [...] }
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ success: false, message: 'Failed to generate questions' });
  }
});

// POST /api/generate-workflow
router.post('/generate-workflow', async (req, res) => {
  try {
    const { goal, answers } = req.body;
    const result = await groqService.generateWorkflow(goal, answers);
    // client expects { success: true, workflow: {...} }
    res.json({ success: true, workflow: result });
  } catch (error) {
    console.error('Error generating workflow. Falling back to mock data:', error);
    // CRITICAL FALLBACK: return a static JSON object from local mockWorkflows
    const fallback = mockWorkflows.getMockWorkflow(req.body.goal, req.body.answers);
    res.json({ success: true, workflow: fallback });
  }
});

// POST /api/ask-helper
router.post('/ask-helper', async (req, res) => {
  try {
    const { question, context } = req.body;
    const answer = await groqService.askHelper(question, context);
    // client expects { success: true, answer: "..." }
    res.json({ success: true, answer });
  } catch (error) {
    console.error('Error asking helper:', error);
    res.status(500).json({ success: false, message: 'Failed to ask helper' });
  }
});

// POST /api/draft-document
router.post('/draft-document', async (req, res) => {
  try {
    const { templateType, intakeAnswers, goal } = req.body;
    const draft = await groqService.draftDocument(templateType, intakeAnswers, goal);
    // client expects { success: true, draft: "..." }
    res.json({ success: true, draft });
  } catch (error) {
    console.error('Error drafting document:', error);
    res.status(500).json({ success: false, message: 'Failed to draft document' });
  }
});

// User Database Routes
// POST /api/user/consent
router.post('/user/consent', verifyToken, async (req, res) => {
  try {
    const { consented } = req.body;
    if (consented === undefined) {
      return res.status(400).json({ success: false, message: 'Consented boolean is required' });
    }

    await db.collection('consents').doc(req.user.uid).set({
      consented,
      consentedAt: new Date().toISOString(),
      email: req.user.email || null,
      name: req.user.name || null
    });

    res.json({ success: true, message: 'Consent stored successfully' });
  } catch (error) {
    console.error('Error in /user/consent:', error);
    res.status(500).json({ success: false, message: 'Failed to store consent' });
  }
});

// GET /api/user/consent
router.get('/user/consent', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('consents').doc(req.user.uid).get();
    if (!doc.exists) {
      return res.json({ success: true, consented: false });
    }
    res.json({ success: true, consented: doc.data().consented });
  } catch (error) {
    console.error('Error getting consent:', error);
    res.status(500).json({ success: false, message: 'Failed to check consent' });
  }
});

// GET /api/user/drafts
router.get('/user/drafts', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('drafts').where('userId', '==', req.user.uid).get();
    const drafts = [];
    snapshot.forEach(doc => {
      drafts.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, drafts });
  } catch (error) {
    console.error('Error in GET /user/drafts:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve drafts' });
  }
});

// POST /api/user/drafts
router.post('/user/drafts', verifyToken, async (req, res) => {
  try {
    const { title, templateType, content, goal } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newDraft = {
      userId: req.user.uid,
      title,
      templateType: templateType || 'Custom Draft',
      content,
      goal: goal || '',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('drafts').add(newDraft);
    res.json({ success: true, id: docRef.id, draft: newDraft });
  } catch (error) {
    console.error('Error in POST /user/drafts:', error);
    res.status(500).json({ success: false, message: 'Failed to save draft' });
  }
});

module.exports = router;
