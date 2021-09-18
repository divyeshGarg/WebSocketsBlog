const path = require('path');
const http = require('http');
const crypto = require('crypto');
const static = require('node-static');
const constants = require('./src/utils/constants');
const WebSocketServer = require('websocket').server

const PORT = constants.PORT || 8080;
let connections = {};
let counts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0
};
let data = {counts: counts, max: getMax()};

// To deploy to heroku
let file = new(static.Server)(__dirname+'/../frontend/build/');

const server = http.createServer((req, res) => {
    file.serve(req, res);
}).listen(PORT, () => {
    console.log(`backend server started on port ${PORT}`);
});

const websocket = new WebSocketServer({
    'httpServer': server
})

websocket.on('request', request => {
    let connection = request.accept(null, request.origin)
    let userId = ''
    crypto.randomBytes(8, (err, buf) => {
        userId = buf.toString('hex');
        connections[userId] = connection
        // printConnections();
        // Send data when client connects initially
        connection.send(JSON.stringify(data))
    })
    connection.on('close', () => {
        console.log('connection closed', userId)
        delete connections[userId]
        // printConnections();
    })
    connection.on('message', message => {
        console.log('received => ', message['utf8Data'])
        if(message['utf8Data'] == 'clear') {
            clearCounts();
        } else {
            counts[message['utf8Data']] += 1
        }
        data = {counts: counts, max: getMax()}
        for (const id in connections) {
            connections[id].send(JSON.stringify(data))
        }
    })
})

function clearCounts() {
    for (const num in counts) {
        counts[num] = 0;
    }
}

function printConnections() {
    for (const id in connections) {
        console.log('>>>',id)
    }
}

function getMax() {
    let max = 0;
    for (const num in counts) {
        max = max < counts[num] ? counts[num] : max;
    }
    return max;
}

websocket.on('connect', e => {
    console.log('connection accepted')
})
