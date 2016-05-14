var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(process.env.PORT);


app.get('/hello', function (req, res) {
    res.send('Hello World!');
});

// to verify
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === '<secret key>') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

//reply message
var token = "<token>";

function sendTextMessage(sender, text) {
    messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

// should do the things we want to do
app.post('/webhook/', function (req, res) {
    console.log('test');
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        console.log(event.sender.id + 'sofi');
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            console.log(text);
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
        }
    }
    res.sendStatus(200);
});





