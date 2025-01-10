const dgram = require('node:dgram');
const dnsPacket = require('dns-packet');
const { type } = require('node:os');
const server = dgram.createSocket('udp4')

const db = {
   'www.google.com':{
     type: 'A',  
     data: '1.2.3.4'
   },
   'www.facebook.com': {
      type: 'A',
      data: '4.5.6.7'
   },
   'www.youtube.com': {
      type: 'A',
      data: '7.8.9.10'
   }
}

server.on('message',(msg, rinfo)=>{
   const incomingReq = dnsPacket.decode(msg);
   const ipFromDb = db[incomingReq.questions[0].name];

   const ans = dnsPacket.encode  ({
      type:'response',  
      id: incomingReq.id,
      flags: dnsPacket.AUTHORITATIVE_ANSWER,
      questions: incomingReq.questions,
      answers: [{
         name: incomingReq.questions[0].name,
         type: ipFromDb.type,
         class: 'IN',
         ttl: 300,
         data: ipFromDb.data,
      }],
})

server.send(ans, rinfo.port, rinfo.address, (err) => {
   if (err) {
      console.log(err)
   }
})
})

server.bind(5300, () => console.log('My DNS-SERVER is running on port 5300'))
