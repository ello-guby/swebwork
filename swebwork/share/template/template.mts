import type { IncomingMessage } from "node:http";
import { Response } from "#swebwork/interface.mts";

export function entry(req: IncomingMessage): Response {
    return new Response(200, "text/plain", "hello, world!");
}
