import { PeerNode } from "./PeerNode";

export interface NodeTypeChatListener {

    message(peer: PeerNode, message: string): void;

    peerJoined(peer: PeerNode): void;

    peerNameChanged(peer: PeerNode, oldName: string): void;

}