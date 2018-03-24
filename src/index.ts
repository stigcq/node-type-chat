
export interface NodeTypeChatListener {
    message(s: string): boolean;
}

export function addListener(listener: NodeTypeChatListener) {
    console.log("listener added");

    listener.message("successfully added lstener");
}

