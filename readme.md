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

1. Start a demohub server runnng local by writing demohub in shell

2. The demo hub server then listens for clients that connects and respond with a json formatted peer list

3. The clients each run their own server to listen for incoming messages

4. When a client writes a message (in shell) the client itself sends the message to available peers

5. When a new client connects to demohub, the demohub contact existing clients to make them refresh peer list 

## Next up

Well the demohub should be integrated so that every client has the hub functionality, so that one client can checkin with another client and pull a list of peers from this client. So when starting a client one is polled for IP:port of an existing client, which then is entry point of new client.




