const MongoOplog = require('mongo-oplog');
const USER = 'oplogger';
const PWD = '***REMOVED***';
const HOST = '***REMOVED***';

const MEMBERS = [
  {host: HOST, port: '6414'},
  {host: HOST, port: '6416'},
  {host: HOST, port: '6413'}
]

const MEMBERS_STR = MEMBERS.map(_member => _member.host + ':' + _member.port).join(',');
console.log(`mongodb://${USER}:${PWD}@${MEMBERS_STR}/local?authSource=admin&replicaSet=rs0`);

const oplog = MongoOplog(`mongodb://${USER}:${PWD}@${MEMBERS_STR}/local?authSource=admin&replicaSet=rs0` , 'Cefirc');


// const oplog = MongoOplog(`mongodb://${USER}:${PWD}@${MEMBERS[0].host}:${MEMBERS[1].port}/local?authSource=admin` , 'Cefirc');
// const oplog = MongoOplog('mongodb://***REMOVED***:6413/local','Cefirc')

oplog.tail();

oplog.on('op', data => {
  console.log(data);
});

oplog.on('insert', doc => {
  console.log(doc);
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