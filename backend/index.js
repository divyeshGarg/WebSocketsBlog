const http = require('http');
const crypto = require('crypto');
const constants = require('./src/utils/constants');
const WebSocketServer = require('websocket').server

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

const server = http.createServer((req, res) => {
    console.log('Server created!')
});

const websocket = new WebSocketServer({
    'httpServer': server
})

websocket.on('request', request => {
    console.log(request.origin)
    let connection = request.accept(null, request.origin)
    let userId = ''
    crypto.randomBytes(8, (err, buf) => {
        userId = buf.toString('hex');
        connections[userId] = connection
        for (const id in connections) {
            console.log('>>>',id)
        }
        // Send data when client connects initially
        connection.send(JSON.stringify(data))
    })
    connection.on('close', () => {
        console.log('connection closed', userId)
        delete connections[userId]
    })
    connection.on('message', message => {
        console.log('received => ', message['utf8Data'])
        counts[message['utf8Data']] += 1
        data = {counts: counts, max: getMax()}
        for (const id in connections) {
            connections[id].send(JSON.stringify(data))
        }
    })
})

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

server.listen(constants.PORT, () => {
    console.log(`backend server started on port ${constants.PORT}`);
});
