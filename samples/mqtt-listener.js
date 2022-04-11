const mqtt = require('mqtt')
const socket = require('ws')

const client = mqtt.connect('mqtt://localhost:1883');
const availableTopics = require("../samples/topics.json");

for (let topic of availableTopics){
  client.subscribe(topic, function (err){
    if (!err) console.log("Subscribed to", topic);
    else console.log("Error in", topic, " - ", err);
  });
}

client.on('message', function (topic, message) {
  console.log("------------------------------------------------------------------")
  if (topic === 'video-analytics') {
    console.log('This is a video analytics alert')
    forwardAlertToDT(message.toString());
  } else {
    console.log('Topic is', topic, "and message is", message.toString());
  }
});

function forwardAlertToDT (message) {
  const ws = new socket.WebSocket('ws://localhost:3000')
  ws.on('open', function open () {
    console.log('Socket connection is opened')
    ws.send(message, function (err){
      console.log('Alert forwarded to socket');
    });
  });
}