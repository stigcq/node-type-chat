import { PeerNode } from "./peernode";

export class PeerService {

    request = require("request");

    myCreds: PeerNode = undefined;

    hubPort: number = undefined;

    initialPeers: PeerNode[] = Array();


    constructor(myCreds: PeerNode) {
        this.myCreds = myCreds;
        this.addPeer(myCreds);
    }

    locatePeers() {

        /** Had issue with rejected connection to server without these headers */
        const options = {
            url: "http://127.0.0.1:" + this.hubPort + "/checkin",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            },
            form: {
                "id": this.myCreds.id,
                "displayName": this.myCreds.displayName,
                "port": this.myCreds.listenPort
            }
          };

          console.log("http://127.0.0.1:" + this.hubPort + "/checkin");

          this.request.post(options,
             (error: string, response: any, body: string) => {
            // console.log("Connect error:", error); // Print the error if one occurred
            // console.log("Connect statusCode:", response && response.statusCode); // Print the response status code if a response was received
            console.log("body:", body); // Print the HTML for the Google homepage.

            this.initialPeers = JSON.parse(body);

            console.log("Found " + this.initialPeers.length + " peers");

        });
    }

    addPeers(peers: PeerNode[]) {

        for (const entry of peers) {

            if (!this.hasPeer(entry))
                this.initialPeers.push(entry);

        }
    }

    addPeer(peer: PeerNode) {

        if (!this.hasPeer(peer))
            this.initialPeers.push(peer);

    }

    hasPeer(peer: PeerNode): boolean {

        for (const entry of this.initialPeers) {

            if (peer.id == entry.id)
                return true;

        }

        return false;
    }


    refreshPeers() {

        const options = {
            url: "http://127.0.0.1:" + this.hubPort + "/peers",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            }
          };

          console.log("http://127.0.0.1:" + this.hubPort + "/peers");

          this.request.post(options,
             (error: string, response: any, body: string) => {

            this.addPeers(JSON.parse(body));

        });
    }


    pushToPeers(message: string) {

        for (let i = 0; i < this.initialPeers.length; i++) {
            this.pushToPeer(this.initialPeers[i], message);
        }
    }

    pushToPeer(peer: PeerNode, message: string) {

        // console.log("sending messsage to" + peer.ip);

        const options = {
            url: "http://" + peer.ip + ":" + peer.listenPort + "/message",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            },
            form: {
                "peer_id": this.myCreds.id,
                "message": message,
                "displayName": this.myCreds.displayName
            }
          };

        this.request.post(options,
            function (error: string, response: any, body: string) {

        });
    }



}