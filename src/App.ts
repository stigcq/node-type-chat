/**
 * This is basicly sample usage how one can use the module.
 *
 */
import { PeerNode } from "./PeerNode";
import { PeerService } from "./PeerService";
import { DemoHub } from "./DemoHub";
import { NodeTypeChatListener } from "./NodeTypeChatListener";


const http = require("http");
const request = require("request");
const chalk = require("chalk");
const querystring = require("querystring");
const md5 = require("md5");


require("string.prototype.startswith");

// create my own peer
const mySelf = new PeerNode();
mySelf.displayName = "Hello world";
mySelf.generateId();

const peerService = new PeerService(mySelf);
const hub = new DemoHub(peerService);

const stdin = process.openStdin();

class MyListener implements NodeTypeChatListener {

    message = function(peer: PeerNode, message: string) {
        console.log(chalk.red.bgWhite(" " + peer.displayName + " ") + " " + message);

    };

    peerJoined = function(peer: PeerNode) {
        console.log(chalk.red.bgWhite(" " + peer.displayName + " joined"));

    };

    peerNameChanged = function(peer: PeerNode, oldName: string) {
        console.log(chalk.red.bgWhite(oldName + " changed name to: " + peer.displayName));

    };

}

hub.addListener(new MyListener());

console.log(">> To set your own port write " + chalk.red.bgWhite(" port [port-to-listen] "));
console.log(">> To set display name write  " + chalk.red.bgWhite(" name [display-name]" ));
console.log(">> To connect network write   " + chalk.red.bgWhite(" connect [ip] [port]" ));
console.log(">> To send message write      " + chalk.red.bgWhite(" # [your-message]" ));
// console.log("To send message to user write " + chalk.red.bgWhite("@[display-name] [your-message]"));



stdin.addListener("data", function(d) {

    const input: string = d.toString().trim();

    if (input.startsWith("name")) {
        const oldname = mySelf.displayName;
        mySelf.displayName = input.substring(5);
        peerService.myNameChanged(oldname);
        console.log(">> Name changed");
    }

    if (input.startsWith("port")) {
        const port = parseInt(input.substring(5));
        mySelf.port = port;
        mySelf.ip = "127.0.0.1";
        hub.startServer(port);

    }


    if (input.startsWith("#")) {
        const myMessage = input.substring(2);
        peerService.pushToPeers(myMessage);
    }

    if (input.startsWith("connect")) {

        if (mySelf.port == 0) {
            console.log("Set your own port first");
            return;
        }

        const ipAndPort: string[] = input.substring(8).split(" ");

        peerService.hubIp = ipAndPort[0].trim();
        peerService.hubPort = parseInt(ipAndPort[1].trim());

        console.log("HUB: " + peerService.hubIp + ":" + peerService.hubPort);

        // TODO this connect also get peerslist. seperate it
        console.log(chalk.blue.bgRed("> Connecting to network... "));
        peerService.connect();

    }


  });




