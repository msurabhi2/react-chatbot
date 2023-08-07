
const dialogflow = require('dialogflow');
const config = require('../config/keys')
const structjson = require('./structjson')
const mongoose = require('mongoose');


const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
    client_email: config.googleClientEmail,
    private_key:
    config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({projectId, credentials});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const Registration = mongoose.model('registration');

module.exports = {
    textQuery: async function(text, parameters = {}){
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: languageCode,
              },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
          };
    
          let responses = await sessionClient.detectIntent(request)
          responses = await self.handleAction(responses);
          return responses;
    },

    eventQuery: async function(event, parameters = {}){
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
              event: {
                // The query to send to the dialogflow agent
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                // The language used by the client (en-US)
                languageCode: languageCode,
              },
            },
          };
    
          let responses = await sessionClient.detectIntent(request)
          responses =  self.handleAction(responses);
          return responses;
    },

    handleAction: function(responses){
      let self = module.exports;
      let queryResult = responses[0].queryResult;
      switch(queryResult.action){
        case 'recommendcourses-yes':
          if(queryResult.allRequiredParamsPresent){
            self.saveRegistration(queryResult.parameters.fields)
          }
          break;
      }
        return responses;
    },

    saveRegistration: async function(fields){
     const registration = new Registration({
         name: fields.name.stringValue,
         phonenumber: fields.phonenumber.stringValue,
         dateSent: Date.now()
     });
     try {
       let reg = await registration.save();
       console.log("Reg", reg)
     } catch (err){
       console.log(err);
     }
    }
}