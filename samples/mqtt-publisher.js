const mqtt = require('mqtt')

const topic = "another-topic";
const message = "Did you receive my message?";

const client = mqtt.connect("mqtt://localhost:1883")
client.on('connect', function () {
  console.log("Connected to broker");
  client.publish(topic, message);
  console.log("Message published");
})
