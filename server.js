// // server.js
// import express from 'express';
// import cors from 'cors';
// import Groq from 'groq-sdk';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve static files from 'public'
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // API endpoint
// app.post('/api', async (req, res) => {
//   const { message } = req.body; // user name from client
//   if (!message) return res.status(400).json({ response: 'No message provided' });

//   try {
//     const completion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: `You are Yamic AI Assistant. Speak confidently, directly, and helpfully.`
//         },
//         { role: 'user', content: message }
//       ],
//       model: 'llama-3.1-8b-instant'
//     });

//     const botResponse = completion.choices?.[0]?.message?.content || 'No response';
//     res.json({ response: botResponse });

//   } catch (err) {
//     console.log('Groq API error:', err.message);
//     res.status(500).json({ response: 'Server error: ' + err.message });
//   }
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api', async (req, res) => {
  const { message, name } = req.body;

  if (!message) {
    return res.status(400).json({ response: 'No message provided' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are Yamic AI. Always reply confidently and helpfully. The user's name is ${name}. Personalize responses using their name naturally when needed. `
        },
        {
          role: 'user',
          content: `${name}: ${message}`
        }
      ]
    });

    const botResponse =
      completion.choices?.[0]?.message?.content || 'No response';

    res.json({ response: botResponse });

  } catch (err) {
    res.status(500).json({ response: 'Server error: ' + err.message });
  }
});

app.listen(3000, () =>
  console.log('Server running on http://localhost:3000')
);
