const http = require("http");
const chalk = require("chalk");
const querystring = require("querystring");

require("string.prototype.startswith");

import { PeerNode } from "./peernode";
import { PeerService } from "./peerservice";
import { NodeTypeChatListener } from "./NodeTypeChatListener";


/**
 * A simple local server acting as a hub for new peers
 */
export class DemoHub {

    peerService: PeerService;

    request = require("request");

    listeners: NodeTypeChatListener[] = Array();


    constructor(peerService: PeerService) {
        this.peerService = peerService;
    }


    addListener(myListener: NodeTypeChatListener) {

        this.listeners.push(myListener);
    }


    startServer(port: number) {

        const server = http.createServer((request: any, response: any) => {

            const { headers, method, url } = request;

            /**
             * Some simple basic routing.
             */
            if (url == "/checkin")
                this.handleCheckin(request, response);

            if (url == "/peers")
                this.peerListRequested(request, response);

            if (url == "/message")
                this.messageNotification(request, response);

            if (url == "/clients")
                this.peerNotification(request, response);

            if (url == "/name_change")
                this.peerNameChangeNotification(request, response);

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

            for (const listener of this.listeners)
                listener.peerJoined(peer);

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
    peerListRequested(request: any, response: any) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(this.peerService.peers));
    }

    /**
     * called to notify about a new message
     */
    messageNotification(request: any, response: any) {

        let body: any = [];

        request.on("data", (chunk: any) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();

            const post = querystring.parse(body);

            const peer = this.peerService.getPeer(post.id);

            for (const listener of this.listeners)
                listener.message(peer, post.message);

        });

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("1");
    }

    /**
     * Called to notify that there are new peers
     */
    peerNotification(request: any, response: any) {

        let body: any = [];

        request.on("data", (chunk: any) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();

            const post = querystring.parse(body);

            const peer: PeerNode = JSON.parse(post.message);

            this.peerService.addPeer(peer);

        });

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("1");

        // this.peerService.refreshPeers();
    }

    peerNameChangeNotification(request: any, response: any) {

        let body: any = [];

        request.on("data", (chunk: any) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();

            const post = querystring.parse(body);

            const peer = this.peerService.getPeer(post.id);

            if (peer != undefined) {
                peer.displayName = post.displayName;

                for (const listener of this.listeners)
                    listener.peerNameChanged(peer, post.oldDisplayName);

            } // else probably get peer info from whoever notified

        });

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("1");
    }

}