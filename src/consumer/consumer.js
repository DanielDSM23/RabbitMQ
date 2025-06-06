
const amqp = require('amqplib');

const url = "amqp://user:password@rabbitmq:5672";
const queue = "queueResult";

async function receive() {
   const conn = await amqp.connect(url);

   const channel = await conn.createChannel();

   await channel.assertQueue(queue,{durable : false});

   channel.consume(queue,consume,{noAck:true});

}

function consume(msg) {
   if (msg != null) {
      const data = JSON.parse(msg.content.toString());
      console.log(`Résultat reçu : ${data.n1} ${data.operationType} ${data.n2} = ${data.res}`);
   }
}

receive()