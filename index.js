const dgram = require('node:dgram');
const dnsPacket = require('dns-packet');

const server = dgram.createSocket('udp4')

server.on('message',(msg, rinfo)=>{
   const incomingReq = dnsPacket.decode(msg);
   console.log({
    question: incomingReq.questions,
    rinfo
   })
})

server.bind(53, () => console.log('My DNS-SERVER is running on port 53'))
