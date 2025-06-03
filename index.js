const mqtt = require('mqtt');
const config = require('./config');

let mqttClient = null;

function setFanSpeed(distance) {
    // Convert distance to fan speed based on the given rules
    let fanSpeed;
    if (distance <= 10) fanSpeed = 1;
    else if (distance <= 20) fanSpeed = 2;
    else if (distance <= 30) fanSpeed = 3;
    else if (distance <= 40) fanSpeed = 4;
    else if (distance <= 50) fanSpeed = 5;
    else fanSpeed = 0; // Default to 0 if distance is greater than 50cm

    console.log('Setting fan speed to:', fanSpeed);
    return fanSpeed;
}

async function connectToMQTT() {
    try {
        console.log('Attempting to connect to MQTT broker...');
        console.log('Broker URL:', config.mqtt.brokerUrl);
        console.log('Username:', config.mqtt.username);
        
        if (mqttClient) {
            console.log('Existing client found, ending connection...');
            await mqttClient.end();
        }

        const connectionOptions = {
            ...config.mqtt.options,
            clientId: config.mqtt.clientId,
            username: config.mqtt.username,
            password: config.mqtt.password
        };

        console.log('Connection options:', connectionOptions);

        mqttClient = mqtt.connect(config.mqtt.brokerUrl, connectionOptions);

        mqttClient.on('connect', () => {
            console.log('Successfully connected to MQTT broker');
            // Subscribe to default topic if specified
            if (config.mqtt.defaultTopics.subscribe) {
                console.log('Subscribing to topic:', config.mqtt.defaultTopics.subscribe);
                mqttClient.subscribe(config.mqtt.defaultTopics.subscribe);
            }
        });

        mqttClient.on('error', (error) => {
            console.error('MQTT Error:', error);
        });

        mqttClient.on('disconnect', () => {
            console.log('Disconnected from MQTT broker');
        });

        mqttClient.on('message', (topic, message) => {
            try {
                const distance = parseFloat(message.toString());
                console.log('Received distance:', distance, 'units');
                
                // Calculate fan speed based on distance
                const fanSpeed = setFanSpeed(distance);
                
                // Create and publish JSON response
                const responseData = {
                    timestamp: new Date().toISOString(),
                    distance: distance,
                    fan_speed: fanSpeed
                };
                
                mqttClient.publish(config.mqtt.defaultTopics.publish, JSON.stringify(responseData));
                console.log('Published response:', responseData);
                console.log('------------------------');
            } catch (error) {
                console.error('Error parsing message:', error);
                console.log('Raw message:', message.toString());
            }
        });

        return true;
    } catch (error) {
        console.error('MQTT connection error:', error);
        return false;
    }
}

// Connect to MQTT broker when the script starts
connectToMQTT();

// Handle process termination
process.on('SIGINT', () => {
    if (mqttClient) {
        console.log('Disconnecting from MQTT broker...');
        mqttClient.end();
    }
    process.exit();
}); 