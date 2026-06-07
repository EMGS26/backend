const WebSocket = require('ws');
const ws = new WebSocket('ws://192.168.0.130:3001');

ws.on('message', (raw) => {
    const data = JSON.parse(raw.toString());
    if (data.type !== 'DATA' || data.cote === 'LESE') return;

    data.cote = 'LESE';
    data.tension = data.tension * 0.7;
    data.amplitude = data.amplitude * 0.6;

    ws.send(JSON.stringify(data));
});