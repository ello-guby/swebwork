import type { ServerResponse, IncomingMessage } from "node:http";

const nurl = require("node:url");
const { readFileSync } = require("node:fs");
const { createServer } = require("node:http");

const { Color } = require("#swebwork/cli.mts");
const { Response } = require("#swebwork/interface.mts");
const {
    getRoutes,
    getUrlRoute,
    isUrlRouteExist,
    isRawUrlRouteExist,
} = require("#swebwork/routing.mts");

// fmt!(up_time);
const upTime = new Date(Date.now());
function fmtTime(): string {
    const isDateDiff = (what: string) => {
        const f = `get${what}`;
        return Math.abs(upTime[f]() - now[f]()) !== 0;
    }
    const padNum = (num: number, len = 2) => { return num.toString().padStart(len, "0"); }

    const now = new Date(Date.now());

    let date: string[] = [];
    const mIsDiff = isDateDiff("Month");
    const yIsDiff = isDateDiff("FullYear");
    if (isDateDiff("Date") || mIsDiff || yIsDiff) {
        date.push(padNum(now.getDate()));
    }
    if (mIsDiff || yIsDiff) {
        date.push(padNum(now.getMonth() + 1)); // cus its idx
    }
    if (yIsDiff) {
        date.push(padNum(now.getFullYear(), 4));
    }
    date = date.reverse();
    let dateStr = date.join("-");
    if (dateStr) { dateStr += " "; }

    return `${dateStr}${padNum(now.getHours())}:${padNum(now.getMinutes())}:${padNum(now.getSeconds())}`;
}

// handle(route);
const routes = getRoutes();
function fetch(url: string, req: IncomingMessage): Response {
    if (isUrlRouteExist(url, routes)) {
        const file = getUrlRoute(url, routes);
        const ext = file.substring(file.search(/[a-z0-9]+$/i));
        const textFileExtToMime = {
            html: "text/html",
            css: "text/css",
            js: "application/javascript",
        }
        const targetMime = textFileExtToMime[ext]
        if (!targetMime) {
            return require(`../../${file}`).entry(req); // this very busty
        } else {
            let errno = 200;
            if (!isRawUrlRouteExist(url, routes)) { errno = 404; }
            return new Response(errno, targetMime, readFileSync(file));
        }
    } else {
        return new Response(404, "text/plain", "route not found...");
    }
}


createServer((req: IncomingMessage, res: ServerResponse) => {

    const url = nurl.parse(req.url);
    const r = fetch(url.pathname, req);

    res.writeHead(r.errno, { 'Content-Type': r.mimeType });
    res.end(r.response);
    
    let resColor = Color.OK;
    if (r.errno !== 200) { resColor = Color.ERR };
    console.log(`${Color.INFO}[${fmtTime()}] ${resColor}${r.errno} ${req.method} ${Color.WARN}${req.url}${Color._}`);
}).listen(8080, () => {
console.log(`
    ${Color.OK}Sucessfully created server at:
    ${Color.INFO}http://127.0.0.1:8080/

    ${Color.INFO}Close'em anytime with ${Color.WARN}^C${Color.INFO} or ${Color.WARN}Ctrl-c${Color.INFO}:
${Color._}`);
});
