// Chargement de la librairie AMQPLIB
const amqplib = require('amqplib');

const rabbitmq_url = 'amqp://user:password@rabbitmq:5672'; // Chaîne de connexion à RabbitMQ
const exchange = 'operations'; // Nom de la queue à utiliser
const exchangeFanout= 'all';
const queue = "queueResult";

// Fonction pour envoyer un message
async function send(msg) {
    // Connexion à RabbitMQ
    const conn = await amqplib.connect(rabbitmq_url);

    // Créer un channel (connexion logique à RabbitMQ)
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, {
        durable : false
    })
    // creation de l'exchange 
    await channel.assertExchange(exchange, "direct", {
        durable: false
    })

    
    if (msg.operationType === "all") {
        await channel.assertExchange(exchangeFanout, 'fanout', { durable: false })
        channel.publish(
            exchangeFanout,
            '',
            Buffer.from(JSON.stringify(msg)),
            {
                correlationId : Math.random().toString(),
            }
        )
    } else {
        // Envoyer le message
        channel.publish(
            exchange,
            msg.operationType,
            Buffer.from(JSON.stringify(msg)),
            {
                correlationId : Math.random().toString(),
            }
        );
    }

    console.log('[✓] Message envoyé', JSON.stringify(msg));
}

function getMessage() {
    operationType = ["add", "sub", "mul", "div", "all"];

    return {
        "n1": randomNumber(),
        "n2": randomNumber(),
        "operationType": operationType[Math.floor(Math.random() * (operationType.length))]
    }
}

function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

setInterval( () => {
    const message = getMessage();
    send(message);
}, 5000)
