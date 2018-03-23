# Node Type Chat

A simple test app making a p2p chat with node.js and typescript with chat in CLI.
Its under development. 

For demo purpose it now has 3 clients on 127.0.0.1 on different ports. 
So to test it, start app 3 times and chat (with yourself)

## Getting started
- Clone or download the repository

- Install dependencies
```
cd <project_name>
npm install
```

- Build
```
npm build
```

- Run
```
npm start
```

## What it does

1. When starting first peer start a demohub by writing demohub [port] in shell

2. The demo hub server then listens for clients that connects and respond with a json formatted peer list

3. A new client needs know address of existing peer node, which is set by writing hubport [port] in shell

4. Then the new client connects by writting connect [myownport], where by it contacts first peer and gets a peerlist. The new client also functions as potential hub, so future peers can connect to both peers

4. When a client writes a message (in shell) the client itself sends the message to available peers

5. When a new client connects to a peer, the peer contact existing peers to make them refresh peer list 

## Next up

The code needs a bit cleaning up, and then IPs should be integrated, since right now it assumes 127.0.0.1
for all. Though when a peer connects its IP is read, but in the input to connect to the peer network
needs IP input. 





