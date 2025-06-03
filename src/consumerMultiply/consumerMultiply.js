const amqplib = require('amqplib');

// const connectionString = "amqp://user:password@efrei20250602.hopto.org:5678";
const connectionString = "amqp://user:password@rabbitmq:5672";
let chann;
const queueResult = 'queueResult';
const operationsQueue = 'operationsQueue';

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
    await chann.assertQueue(queueResult, {durable:false})
    const opQueue = await chann.assertQueue(operationsQueue, {durable:false})
    chann.consume(opQueue.queue, add, {noAck : true});
}

function add(msg){
    if(msg != null){
        console.log(`Message reçu : ${msg.content.toString()}`);
        const operationData = JSON.parse(msg.content);
        const result = operationData.n1 * operationData.n2;
        const opType = msg.properties.operation;
        console.table(msg.properties);
        const correlationId = msg.properties.correlationId;

        let dataToSend = {
            ...operationData,
            op: opType, 
            res: result
        };
        console.log(`Message reçu : ${JSON.stringify(dataToSend)}`);
        chann.sendToQueue(queueResult, Buffer.from(JSON.stringify(dataToSend)), {correlationId});
    }
}

receive();