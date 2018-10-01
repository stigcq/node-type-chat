import { PeerNode } from "./PeerNode";
import { NodeTypeChatListener } from "./NodeTypeChatListener";


const chalk = require("chalk");


/**
 * Example listener
 */
export class NodeTypeChatListenerImpl implements NodeTypeChatListener {

    constructor() {
    }

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