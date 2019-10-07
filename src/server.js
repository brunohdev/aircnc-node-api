const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

// Protocolos de Comunicação
// HTTP - Assíncrono (envia req e espera resposta)
// Websocket - Síncrono (recebe resposta, devolve resposta, sem novas reqs)

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@aircnc-2bzqa.mongodb.net/aircnc?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Não indicado para produção 
// (Redis - feito para armazenar infos simples)
const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;

    // socket.emit('hello', 'World');

    // socket.on('omni', data => {
    //     console.log(data);
    // });
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    // Se não colocar, não vai rodar o código abaixo desse
    return next();
});

// req.query = Acessar query params (para filtros)
// req.params = Acessar route params (para edição, delete)
// req.body = Acessar corpo da requisição (para criação, edição)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);