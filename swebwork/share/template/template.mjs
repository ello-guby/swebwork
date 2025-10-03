import { Response } from "#swebwork/interface.mts";

export function entry(req) {
    return new Response(200, "text/plain", "hello world!");
}
