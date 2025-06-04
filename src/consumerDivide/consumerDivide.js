const amqplib = require('amqplib');

// const connectionString = "amqp://user:password@efrei20250602.hopto.org:5678";
const connectionString = "amqp://user:password@rabbitmq:5672";
const queueResult = "queueResult";
const exchangeDirect = "operations";
const exchangeFanout = "all";
const key = "div";
let chann;

async function connectRabbitMQServer(connectionString){
    const conn = await amqplib.connect(connectionString);
    return conn;
}

async function createChannel(connection){
    const channel = await connection.createChannel();
    return channel;
}

async function receive(){
    const rabbitServer = await connectRabbitMQServer(connectionString);
    chann = await createChannel(rabbitServer);
    const { queue } = await chann.assertQueue("", {durable:false,exclusive: true})
    await chann.assertExchange(exchangeDirect, "direct", {
        durable: false
    })
    chann.bindQueue(queue, exchangeDirect, key);
    await chann.assertExchange(exchangeFanout, "fanout",{durable:false});
    chann.bindQueue(queue, exchangeFanout, "");

    chann.consume(queue, add, {noAck : true});
}

function add(msg){
    if(msg != null){
        const operationData = JSON.parse(msg.content);
        const result = operationData.n2 == 0 ? "impossible" :  operationData.n1 / operationData.n2;
        const opType = msg.properties.operation;
        const correlationId = msg.properties.correlationId;
        let dataToSend = {
            ...operationData,
            op: opType, 
            res: result
        };
        chann.sendToQueue(queueResult, Buffer.from(JSON.stringify(dataToSend)), {correlationId});
    }
}

receive();