const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { generateScript } = require('../utils/ollama');
const { runAutomation } = require('../utils/playwright-runner');

const upload = multer({ dest: 'uploads/' });

router.post('/generate', upload.any(), async (req, res) => {
  try {
    const { userRequest, contextText } = req.body;
    
    // Read uploaded files
    let knowledgeBase = '';
    let contextContent = contextText || '';
    
    if (req.files) {
      for (const file of req.files) {
        const content = await fs.readFile(file.path, 'utf-8');
        
        if (file.fieldname === 'knowledgeFiles') {
          knowledgeBase += `\n\n[File: ${file.originalname}]\n${content}`;
        } else if (file.fieldname === 'contextFiles') {
          contextContent += `\n\n[File: ${file.originalname}]\n${content}`;
        }
        
        // Clean up
        await fs.unlink(file.path);
      }
    }
    
    const script = await generateScript(userRequest, contextContent, knowledgeBase);
    res.json({ script, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post('/run', async (req, res) => {
  try {
    const { script } = req.body;
    const result = await runAutomation(script);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;