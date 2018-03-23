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
3. Then connect to network again by specifying a port to connect to. For first peer, choose its own port so it connect to itself (no others to connect to yet)
```
connect 1200
```
4. For second peer do the same, but when connecting choose the port of first peer
```
port 1300
name IamSecondPeer
connect 1200
```
5. For third or more peer(s) choose any port of an existing peer.

Currently it only takes ports and use 127.0.0.1 as IP, soon IPs will be added to this input

## How it works

Each peer functions both as a server and a client. A server/peer then offers methods which other peers can call:
* Checkin to network for first time
* Notify of new (chat) message
* Notify of new peer(s)
* Getting list of peers this peer has
* Notify of peer changed (chat) name

The peer itself offers these methods, and also use them from other peers


## Next up

The code needs a bit cleaning up, and then IPs should be integrated, since right now it assumes 127.0.0.1
for all. Though when a peer connects its IP is read, but in the input to connect to the peer network
needs IP input. 





