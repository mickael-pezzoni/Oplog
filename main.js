const MongoOplog = require('mongo-oplog');
const notifier = require('node-notifier');
const beep = require('beepbeep');
const app = require('express')();
const Socket = require('./Socket');
const server = app.listen(3000);
const io = require('socket.io')(server, { origins: '*:*' });

const USER = 'oplogger';
const PWD = '';
const HOST = '';

const MEMBERS = [
  { host: HOST, port: '6414' },
  { host: HOST, port: '6416' },
  { host: HOST, port: '6413' }
].map(_member => _member.host + ':' + _member.port).join(',');

const oplog = MongoOplog(`mongodb://${USER}:${PWD}@${MEMBERS}/local?authSource=admin&replicaSet=rs0`, 'MellispheraTest');

let socketClient = [];

io.on('connect', (socket) => {
  socket.on('connectionClient', (connection) => {
    console.log('new client -> ' + socket.id);
    socketClient.push({userId: connection.userId, socket: socket, role: connection.role});
  });
});

io.on('disconnect', (socket) => {
  const index = socketClient.findIndex(_client => _client.socket.id === socket.id);
  socketClient.splice(index, 1);
});

oplog.tail();
oplog.on('op', data => {
  //  console.log(data);
});

oplog.on('insert', doc => {
  if (socketClient.length > 0) {
    const targets = socketClient.filter(_client => _client.userId === doc.o.idUser);
    const admin = socketClient.filter(_client => _client.role.indexOf('ROLE_ADMIN') !== -1);
    console.log('Send to => ' + targets.map(_elt => _elt.userId));
    console.log(targets.concat(admin));
    console.log(admin);
    if (targets.length > 0) {
      targets.concat(admin).forEach(_client => {
        _client.socket.emit('insert', doc.o);
      })
    }
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

