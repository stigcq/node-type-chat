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

I think theres an issue if a connecting client doesnt have a public IP or is behind
some firewall. Then first node try to connect to new one and fails. Need test and
adjust accordingly. 

One can consider if such a node should be able to connect at all, but well the issue
is basicly the node trying to connect to a hub needs some try catch to see if
theres a valid response from the IP it connects to. 

I am testing it on AWS. Succeeded setting it up but with 2 issues:
1. Well the guide here doesnt say node version required, probably should
2. Some import statements didnt use cap letters which meant it couldnt find
the classes/modules on a linux. 







