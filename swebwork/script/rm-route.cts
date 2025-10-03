const readline = require("node:readline");
const { existsSync, writeFileSync, rmSync } = require("node:fs");
const { Color, err } = require("#swebwork/cli.mts");
const {
    getRoutes,
    deleteRoute,
    rawGetUrlRoute,
    isRawUrlRouteExist,
} = require("#swebwork/routing.mts");

const urlPath = process.argv[2];
const jsonSpace = process.argv[3] || 4;

if (!urlPath) err(`${Color.OK}usage: ${Color.INFO}npm run rm-route ${Color.WARN}<url_path> ${Color.NOTE}[${Color.WARN}<json_space>${Color.NOTE}]${Color._}`);

const route = getRoutes();

if (!isRawUrlRouteExist(urlPath, route)) err(`${Color.ERR}"${urlPath}" did not exist in "route.json"`, 1);


const file = rawGetUrlRoute(urlPath, route);

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.question(`${Color.ERR}WARNING${Color.INFO}: this will remove "${Color.WARN}${urlPath}${Color.INFO}", its ${Color.WARN}children routes${Color.INFO}, and "${Color.WARN}${file}${Color.INFO}" file.\n${Color.ERR}are u sure?${Color._} `, (y: string) => {
    const eyes = y.toLowerCase().trim();
    for (const ye of [
        "y",
        "ye",
        "yea",
        "yep",
        "yup",
        "yeah",
        "ok",
        "ofc",
    ]) {
        if (eyes === ye) err(`${Color.ERR}"${eyes}" huh, sounds unsure...`, 2);
    }
    for (const yes of [
        "yes",
        "definitely",
        "ofcourse",
    ]) {
        if (eyes === yes) {
            const nRoute = deleteRoute(urlPath, route);
            writeFileSync("routes.json", JSON.stringify(nRoute, undefined, jsonSpace));
            rmSync(file);
            err(`${Color.OK}deleted.`);
        }
    }
    err(`${Color.ERR}ok then.`);
});


