const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const events = req.body.events;
  console.log(events);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Line Webhook is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
