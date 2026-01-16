const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const automationRoutes = require('./routes/automation');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

app.use('/api', automationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Make sure Ollama is running at http://localhost:11434`);
});