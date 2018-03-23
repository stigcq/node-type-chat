import { PeerNode } from "./peernode";

export class PeerService {

    request = require("request");

    myCreds: PeerNode = undefined;

    initialPeers: PeerNode[];


    constructor(myCreds: PeerNode) {
        this.myCreds = myCreds;
    }

    locatePeers() {

        /** Had issue with rejected connection to server without these headers */
        const options = {
            url: "http://itselskabet.nu/peers.json",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept-Language": "*"
            }
          };

        this.request(options,
             (error: string, response: any, body: string) => {
            // console.log("Connect error:", error); // Print the error if one occurred
            // console.log("Connect statusCode:", response && response.statusCode); // Print the response status code if a response was received
            // console.log("body:", body); // Print the HTML for the Google homepage.

            this.initialPeers = JSON.parse(body);

            console.log("Found " + this.initialPeers.length + " peers");

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