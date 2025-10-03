const { writeFileSync, cpSync, existsSync } = require("node:fs");
const { err, Color } = require("#swebwork/cli.mts");
const {
    getRoutes,
    insertRoute,
    isRawUrlRouteExist,
    isRouteRootFileCompatible,
} = require("#swebwork/routing.mts");

const urlPath = process.argv[2];
const filePath = process.argv[3];
const jsonSpace = process.argv[4] || 4;

if (!filePath || !urlPath) err(`${Color.OK}usage: ${Color.INFO}npm run mk-route ${Color.WARN}<url_path> <file_path> ${Color.NOTE}[${Color.WARN}<json_spaces>${Color.NOTE}]\n${Color.OK}info: ${Color.NOTE}create a route for ${Color.WARN}<url_path>${Color.NOTE} with ${Color.WARN}<file_path>${Color.NOTE} as the route root. and format ${Color.INFO}routes.json${Color.NOTE}'s tab space with ${Color.WARN}<json_space>${Color.NOTE}, default ${Color.INFO}4`);


if (!isRouteRootFileCompatible(filePath)) err(`${Color.ERR}"${filePath}" is not campatible to be route root file.`, 1);

if (existsSync(filePath)) err(`${Color.ERR}"${filePath}" is obstructed.`, 2);


const route = getRoutes();
if (isRawUrlRouteExist(urlPath, route)) {
    err(`"${urlPath}" is already existed.`, 3);
} else {
    try {
        writeFileSync("./routes.json", JSON.stringify(insertRoute(urlPath, filePath, route), undefined, jsonSpace));
    }
    catch(e) {
        err(`${Color.ERR}You might try to put the url deeper then existed. ${Color.INFO}Put the upper level url first.\n${Color.WARN}Error log:${Color._}\n${e}`, 4);
    }
}



const fileExt = filePath.substring(filePath.search(/[a-z0-9]+$/i)).toLowerCase();
cpSync(`./swebwork/share/template/template.${fileExt}`, filePath);
