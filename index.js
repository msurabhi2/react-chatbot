
require('./models/Registration');
const chatbot = require('./chatbot/chatbot');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/keys')
const app = express();

//connect to mongoose db
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, { useNewUrlParser: true });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

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


if (process.env.NODE_ENV === 'production') {
  // js and css files
  app.use(express.static('client/build'));

  // index.html for all page routes
  const path = require('path');
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT);

//Mongo db part

//mongodb+srv://mishrasurabhi2:<password>@cluster0.jtqd019.mongodb.net/?retryWrites=true&w=majority
//bv0ERmiswtMRD8rc