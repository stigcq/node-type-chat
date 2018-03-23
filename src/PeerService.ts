import { PeerNode } from "./peernode";

export class PeerService {

    request = require("request");

    myCreds: PeerNode = undefined;

    hubPort: number = undefined;

    hubIp: string = "127.0.0.1";

    peers: PeerNode[] = Array();

    hasConnected: boolean = false;


    constructor(myCreds: PeerNode) {
        this.myCreds = myCreds;
        this.addPeer(myCreds);
    }

    locatePeers() {

        /** Had issue with rejected connection to server without these headers */
        const options = {
            url: "http://" + this.hubIp + ":" + this.hubPort + "/checkin",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            },
            form: {
                "id": this.myCreds.id,
                "displayName": this.myCreds.displayName,
                "port": this.myCreds.port
            }
          };

          // console.log("http://" + this.hubIp + ":" + this.hubPort + "/checkin");

          this.request.post(options,
             (error: string, response: any, body: string) => {

                // console.log("body:", body);
                this.peers = JSON.parse(body);
                console.log("Found " + this.peers.length + " peers");
                this.hasConnected = true;

            });
    }

    addPeers(peers: PeerNode[]) {

        for (const entry of peers) {

            if (!this.hasPeer(entry))
                this.peers.push(entry);

        }
    }

    addPeer(peer: PeerNode) {

        if (!this.hasPeer(peer))
            this.peers.push(peer);

    }

    hasPeer(peer: PeerNode): boolean {

        for (const entry of this.peers) {

            if (peer.id == entry.id)
                return true;

        }

        return false;
    }


    findHub() {

        for (const entry of this.peers) {

            if (this.myCreds.id != entry.id)
                this.hubPort = entry.port;

        }
    }

    getPeer(id: string): PeerNode {

        for (const entry of this.peers) {

            if (id == entry.id)
                return entry;

        }

        return undefined;
    }


    myNameChanged(oldDisplayName: string) {

        if (!this.hasConnected)
            return;

        // should traverse all peers
        const options = {
            url: "http://" + this.hubIp + ":" + this.hubPort + "/name_change",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept-Language": "*"
            },
            form: {
                "id": this.myCreds.id,
                "displayName": this.myCreds.displayName,
                "oldDisplayName": oldDisplayName
            }
        };

        this.request.post(options,
            (error: string, response: any, body: string) => {

       });
    }

    refreshPeers() {

        const options = {
            url: "http://" + this.hubIp + ":" + this.hubPort + "/peers",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            }
          };

          console.log("http://" + this.hubIp + ":" + this.hubPort + "/peers");

          this.request.post(options,
             (error: string, response: any, body: string) => {

            this.addPeers(JSON.parse(body));

        });
    }


    pushToPeers(message: string) {

        for (let i = 0; i < this.peers.length; i++) {
            this.pushToPeer(this.peers[i], message);
        }
    }

    pushToPeer(peer: PeerNode, message: string) {

        // console.log("sending messsage to" + peer.ip);

        const options = {
            url: "http://" + peer.ip + ":" + peer.port + "/message",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            },
            form: {
                "id": this.myCreds.id,
                "message": message,
                "displayName": this.myCreds.displayName
            }
          };

        this.request.post(options,
            function (error: string, response: any, body: string) {

        });
    }



}