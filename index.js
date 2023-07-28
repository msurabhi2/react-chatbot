const express = require('express');
const dialogFlow = require('dialogflow');
const config = require('./config/keys')
const bodyParser = require('body-parser');

const sessionClient = new dialogFlow.SessionsClient(config.googleProjectID,
     config.dialogFlowSessionID)

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({'hello': 'there'});
})

app.post('/api/df_text_query', async(req, res) => {
    const request = {
        session: sessionPath,
        queryInput: {
          text: {
            // The query to send to the dialogflow agent
            text: req.body.text,
            // The language used by the client (en-US)
            languageCode: config.dialogFlowSessionLanguageCode,
          },
        },
      };

      let responses = await sessionClient.detectIntent(request)
      res.send(responses[0].queryResult);
})

app.post('/api/df_event_query', async(req, res) => {
    res.send({'do': 'event query'})
})

const PORT = process.env.PORT || 5000;

app.listen(PORT);