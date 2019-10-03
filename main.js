const MongoOplog = require('mongo-oplog');
const notifier = require('node-notifier');
const beep = require('beepbeep')

const USER = 'oplogger';
const PWD = '***REMOVED***';
const HOST = '***REMOVED***';

const MEMBERS = [
  {host: HOST, port: '6414'},
  {host: HOST, port: '6416'},
  {host: HOST, port: '6413'}
].map(_member => _member.host + ':' + _member.port).join(',');

const oplog = MongoOplog(`mongodb://${USER}:${PWD}@${MEMBERS}/local?authSource=admin&replicaSet=rs0` , 'MellispheraTest');

oplog.tail();

oplog.on('op', data => {
//  console.log(data);
});

oplog.on('insert', doc => {
  console.log(doc);
  beep(3);
  notifier.notify({
    title: 'Alert',
    message: JSON.stringify(doc.o),
    sound: true, // Only Notification Center or Windows Toasters
  });
});

oplog.on('update', doc => {
  console.log(doc);
});

oplog.on('delete', doc => {
  console.log(doc.o._id);
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
