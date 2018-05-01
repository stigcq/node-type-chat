# Node Type Chat

A simple test app making a p2p chat with node.js and typescript with chat in CLI.


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

## How to use

1. When starting a peer first input a port number this peer will listen on. 
```
port 1200
```
2. Input a chatname for this peer
```
name JoeDoe
```
3. Then connect to network again by specifying ip andport to connect to. For first peer, choose to connect to itself (no others to connect to yet)
```
connect 127.0.0.1 1200
```
4. For second peer do the same, but when connecting choose the ip and port of first peer
```
port 1300
name IamSecondPeer
connect 127.0.0.1 1200
```
5. For third or more peer(s) choose any ip and port of an existing peer.

## How it works

Each peer functions both as a server and a client. A server/peer then offers methods which other peers can call:
* Checkin to network for first time
* Notify of new (chat) message
* Notify of new peer(s)
* Getting list of peers this peer has
* Notify of peer changed (chat) name

The peer itself offers these methods, and also use them from other peers


## Next up

Make an index.js which exports the functions so can be used as a module. The CLI interface should be possible to build with this module. Which also means some of the current output, like a message, shouldnt be outputted in the module, so I guess incoming messages or other stuff needs some listener interface, where the module user is notified and can react upon those events. 







