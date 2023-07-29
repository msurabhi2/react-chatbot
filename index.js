
const chatbot = require('./chatbot/chatbot');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({'hello': 'there'});
})

app.post('/api/df_text_query', async(req, res) => {
  let responses = await chatbot.textQuery(req.body.text, req.body.parameters);
  res.send(responses[0].queryResult);
})

app.post('/api/df_event_query', async(req, res) => {
    let responses = await chatbot.eventQuery(req.body.event, req.body.parameters);
  res.send(responses[0].queryResult);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT);