// const axios = require('axios');

// const OLLAMA_URL = 'http://localhost:11434/api/generate';

// async function generateScript(userRequest, context = '', knowledgeBase = '') {
//   const systemPrompt = `You are an expert Playwright automation script generator. 
// You understand web automation, browser interactions, and testing.
// Generate production-ready Playwright scripts.`;

//   const knowledgeSection = knowledgeBase ? `\n\nKNOWLEDGE BASE:\n${knowledgeBase}` : '';
//   const contextSection = context ? `\n\nCONTEXT:\n${context}` : '';

//   const prompt = `${systemPrompt}

// USER REQUEST: ${userRequest}${contextSection}${knowledgeSection}

// Generate a Playwright automation script that:
// - Uses async/await
// - Has proper error handling with try-catch
// - Includes console.log for each major step
// - Uses headless: false for visible browser
// - Returns only the JavaScript code, no markdown, no explanations

// Script:`;

//   try {
//     const response = await axios.post(OLLAMA_URL, {
//       model: 'mistral', // Change to your model
//       prompt: prompt,
//       stream: false,
//       temperature: 0.3, // Lower for more consistent code
//     });

//     return response.data.response;
//   } catch (error) {
//     throw new Error(`Ollama error: ${error.message}`);
//   }
// }

// module.exports = { generateScript };



const axios = require('axios');

// Replace with your Gemini API key


const GEMINI_API_KEY = 
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
async function generateScript(userRequest, context = '', knowledgeBase = '') {
  const systemPrompt = `You are an expert Playwright automation script generator. 
You understand web automation, browser interactions, and testing.
Generate production-ready Playwright scripts.`;

  const knowledgeSection = knowledgeBase ? `\n\nKNOWLEDGE BASE:\n${knowledgeBase}` : '';
  const contextSection = context ? `\n\nCONTEXT:\n${context}` : '';

  const prompt = `${systemPrompt}

USER REQUEST: ${userRequest}${contextSection}${knowledgeSection}

Generate a Playwright automation script that:
- Uses async/await
- Has proper error handling with try-catch
- Includes console.log for each major step
- Uses headless: false for visible browser
- Returns ONLY the JavaScript code, no markdown, no explanations, no code blocks

Script:`;

  try {
    const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract text from Gemini response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // Clean up markdown if present
    let cleanedScript = generatedText
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return cleanedScript;
  } catch (error) {
    throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

module.exports = { generateScript };
