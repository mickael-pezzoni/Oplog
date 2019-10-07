const MongoOplog = require('mongo-oplog');
const notifier = require('node-notifier');
const beep = require('beepbeep');
const app = require('express')();
const Socket = require('./Socket');
const server = app.listen(3000);
const io = require('socket.io')(server, { origins: '*:*' });

const USER = 'oplogger';
const PWD = '***REMOVED***';
const HOST = '***REMOVED***';

const MEMBERS = [
  { host: HOST, port: '6414' },
  { host: HOST, port: '6416' },
  { host: HOST, port: '6413' }
].map(_member => _member.host + ':' + _member.port).join(',');

const oplog = MongoOplog(`mongodb://${USER}:${PWD}@${MEMBERS}/local?authSource=admin&replicaSet=rs0`, 'MellispheraTest');

let socketClient = [];

io.on('connect', (socket) => {
  socket.on('connectionClient', (userId) => {
    console.log('new client -> ' + socket.id);
    socketClient.push({userId: userId, socketId: socket.id});
  });
});

oplog.tail();

oplog.on('op', data => {
  //  console.log(data);
});

oplog.on('insert', doc => {
  console.log(doc.o);
  if (socketClient.length > 0) {
    consoleLog(socketClient);
    const client = socketClient.findIndex(_client => _client.userId === doc.o.idUser);
    console.log(client);
    if (socket.id === client.socketId) {
      client.socket.emit('insert', JSON.stringify(doc.o));
    }

/*     socketClient.forEach(_elt => {
      _elt.getSocket().emit('insert', JSON.stringify(doc.o));
    }); */
    //socketClient[0].getSocket().broadcast.emit('test', {value: doc});
  }
});

oplog.on('update', doc => {
  console.log('UPDATE');
});

oplog.on('delete', doc => {
  console.log('Delete ->' + doc.o._id);
});

oplog.on('error', error => {
  console.log(error);
});

oplog.on('end', () => {
  console.log('Stream ended');
});

oplog.stop(() => {
  console.log('server stopped');
});

