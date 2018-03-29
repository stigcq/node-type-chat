const http = require("http");
const chalk = require("chalk");
const querystring = require("querystring");

require("string.prototype.startswith");

import { PeerNode } from "./peernode";
import { PeerService } from "./peerservice";


/**
 * A simple local server acting as a hub for new peers
 */
export class DemoHub {

    peerService: PeerService;

    request = require("request");

    constructor(peerService: PeerService) {
        this.peerService = peerService;
    }


    startServer(port: number) {

        const server = http.createServer((request: any, response: any) => {

            const { headers, method, url } = request;

            if (url == "/checkin")
                this.handleCheckin(request, response);

            if (url == "/peers")
                this.pullPeers(request, response);


            if (url == "/message")
                this.notifyMessage(request, response);


            if (url == "/clients")
                this.notifyClients(request, response);

            if (url == "/name_change")
                this.notifyPeerNameChange(request, response);

        });

        server.listen(port, () => {
            console.log(chalk.blue.bgWhite("Hub server started"));
        });
    }

    /**
     * Called when a new peer connects to network.
     *
     * @param request
     * @param response
     */
    handleCheckin(request: any, response: any) {

        let body: any = [];

        request.on("data", (chunk: any) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();

            const post = querystring.parse(body);

            const peer = new PeerNode();
            peer.port = post.port;
            peer.displayName = post.displayName;
            peer.id = post.id;
            peer.ip = request.connection.remoteAddress;

            if (peer.ip.startsWith("::ffff:"))
                peer.ip = peer.ip.substr(7);

            if (peer.id != undefined)
                this.peerService.addPeer(peer);

            // for first connecting peer set peerservice to use
            // that one as hub or make method findHub
            if (this.peerService.peers.length == 2)
                this.peerService.findHub();

            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(this.peerService.peers));

            // extract to seperate function
            this.peerService.notifyOthersAboutNewPeer(peer);

        });
    }

    /**
     * Called simple to get list of peers
     *
     * @param request
     * @param response
     */
    pullPeers(request: any, response: any) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(this.peerService.peers));
    }

    /**
     * called to notify about a new message
     */
    notifyMessage(request: any, response: any) {

        let body: any = [];

        request.on("data", (chunk: any) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            // console.log(body);

            const post = querystring.parse(body);
            console.log(chalk.red.bgWhite(" " + post.displayName + " ") + " " + post.message);

        });

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("1");
    }

    /**
     * Called to notify that there are new peers
     */
    notifyClients(request: any, response: any) {

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("1");

        this.peerService.refreshPeers();
    }

    notifyPeerNameChange(request: any, response: any) {

        let body: any = [];

        request.on("data", (chunk: any) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();

            const post = querystring.parse(body);

            const peer = this.peerService.getPeer(post.id);

            if (peer != undefined) {
                peer.displayName = post.displayName;
                console.log(chalk.red.bgWhite(post.oldDisplayName) + " changed name to: " + post.displayName);

            } // else probably get peer info from whoever notified

        });

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("1");
    }

}