const mqtt = require('mqtt')

const topic = "video-analytics";

const data = {
  camera_id: 1,
  message: "Someone entered the danger zone"
};

const message = {
  from: "video-analytics",
  data: data
}

const client = mqtt.connect("mqtt://localhost:1883")
client.on('connect', function () {
  console.log("Connected to broker");
  client.publish(topic, JSON.stringify(message));
  console.log("Message published");
})
