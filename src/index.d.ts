import { DemoHub as MyDemoHub } from "./DemoHub";
import { PeerService as MyPeerService } from "./PeerService";
import { NodeTypeChatListener } from "./NodeTypeChatListener";
import { PeerNode as MyPeerNode } from "./PeerNode";

export namespace NodeChat {

// export { DemoHub };
// export { PeerService };
// export { NodeTypeChatListener };
// export { PeerNode };

//export const PeerNode = MyPeerNode;
export type PeerNode = MyPeerNode;

//export const DemoHub = MyDemoHub;
export type DemoHub = MyDemoHub;

//export const PeerService = MyPeerService;
export type PeerService = MyPeerService;

}
