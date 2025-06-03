// Chargement de la librairie AMQPLIB
const amqplib = require('amqplib');

const rabbitmq_url = 'amqp://user:password@10.101.6.132:5672'; // Chaîne de connexion à RabbitMQ
const queue = 'operationsQueue'; // Nom de la queue à utiliser

// Fonction pour envoyer un message
async function send(msg) {
    // Connexion à RabbitMQ
    const conn = await amqplib.connect(rabbitmq_url);

    // Créer un channel (connexion logique à RabbitMQ)
    const channel = await conn.createChannel();

    // Vérifier que la queue existe (la créer sinon)
    await channel.assertQueue(queue, { 
        durable: false
    });

    // Envoyer le message
    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(msg)), 
        {
            correlationId : Math.random().toString(), 
            operation : "add" 
        }
    );

    console.log('[✓] Message envoyé');
}

function getMessage() {
    return {
        "n1": randomNumber(),
        "n2": randomNumber(),
        "operationType": "add"
    }
}

function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

setInterval( () => {
    const message = getMessage();
    send(message);
}, 5000)
