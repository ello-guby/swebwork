/**
 * utility module for swebwork
 */

import { readFileSync, statSync } from "node:fs";

/**
 * allowed file extension for route root
 */
export const allowedRouteRootFileExtension = [
    ".html",
    ".css",
    ".js",
    ".mjs",
    ".mts",
]
/**
 * check whether file string is valid to be a route root
 */
export function isRouteRootFileCompatible(file: string) {
    for (const ext of allowedRouteRootFileExtension) {
        if (file.endsWith(ext)) { return true; }
    }
    return false;
}

/**
 * struct for routes
 */
export type Route = Record<string, any>;

/**
 * return the `routes.json` as `Object` and check the route if there's problem
 * @returns {Object} - The `routes.json`
 */
export function getRoutes(): Route {
    const routes = JSON.parse(readFileSync("./routes.json", {encoding: "utf-8"}));
    checkRoute(routes);
    return routes;
}

/**
 * route check (recursively)
 */
export function checkRoute(route: Route, routeName = "root"): void {
    const checkDirForMod = (file: string, id: string) => {
        try { statSync(file); } catch(e) { throw ReferenceError(`Got error when cheking ${id}, Error log:\n${e}`); }
        if (!isRouteRootFileCompatible(file)) { throw ReferenceError(`Expected a valid file extension in ${id}. valid file extensions are ${allowedRouteRootFileExtension}`); }
    }
    let hasPath = false;
    for (const [key, val] of Object.entries(route)) {
        let k = key;
        if (k.startsWith("@")) {
            k = k.substring(1);
            if (!k) {
                if (typeof val !== 'string') { throw ReferenceError(`Expected type "string" for route root ("@") in "${routeName}", got "${typeof val}" instead.`); }
                checkDirForMod(val, `"@" value in '"${routeName}": { "@": "${val}" }'`);
                hasPath = true;
                continue;
            }
            switch (k) {
                case "pass":
                    break;
                case "dead":
                    checkDirForMod(val, `"@dead" value in '"${routeName}": { "@dead": "${val}" }'`);
                    break;
                default:
                    throw ReferenceError(`"${key}" in "${routeName}" is not a valid special key`);
            }
            continue;
        }
        if (typeof val === 'object') { checkRoute(val, key); }
        else { throw ReferenceError(`Expected type "object" for "${routeName}", but got type "${typeof val}"`); }
    }
    if (!hasPath) {
        throw ReferenceError(`"${routeName}" route did not have route root ("@")`);
    }
}

function extractUrlRoot(url: string): { root: string, trail: string } {
    const urlDir = url.split("/");
    if (url.startsWith("/")) { urlDir.shift(); }
    const root = urlDir.shift();
    const trail = `/${urlDir.join("/")}`;
    return { root, trail };
}

/**
 * get "@" value in routes based of url.
 * make sure route got `checkRoute()`ed first.
 * @param {string} url - the url
 * @param {Route} route - The route to serach url
 * @returns {string} - the "@"
 */
export function getUrlRoute(url: string, route: Route): string {
    const { root, trail } = extractUrlRoot(url);
    if (root === "") { return route["@"] }
    else {
        const r = route[root];
        if (r) {
            try { return getUrlRoute(trail, r); }
            catch{}
        }
        const deadRoute = route["@dead"];
        if (deadRoute) {
            return deadRoute;
        }
        else {
            throw ReferenceError(`"${url}" doesnt exist in the route`);
        }
    }
}

/**
 * wheather the url exist in route
 * @param {string} url - the url
 * @param {Route} route - The route to serach
 * @returns {boolean} - wheather theres "@" or not
 */
export function isUrlRouteExist(url: string, route: Route): boolean {
    try {
        getUrlRoute(url, route);
        return true;
    }
    catch { return false; }
}

/**
 * wheather the url exist in route, excluding "@dead"
 * @param {string} url - the url
 * @param {Route} route - The route to serach
 * @returns {boolean} - wheather theres "@" or not, excluding "@dead"
 */
export function isRawUrlRouteExist(url: string, route: Route): boolean {
    try {
        rawGetUrlRoute(url, route);
        return true;
    }
    catch { return false; }
}

/**
 * get "@" value in routes based of url, excluding "@dead".
 * @param {string} url - the url
 * @param {Route} route - The route to serach url
 * @returns {string} - the "@"
 */
export function rawGetUrlRoute(url: string, route: Route): string {
    const { root, trail } = extractUrlRoot(url);
    if (root === "") { return route["@"]; }
    else {
        const r = route[root];
        if (r) {
            return rawGetUrlRoute(trail, r);
        }
        else {
            throw ReferenceError(`"${url}" doesnt exist in the route`);
        }
    }
}

/**
 * insert or replace an url into a route
 * @param {string} url - the url
 * @param {string} target - path to file to link with url
 * @param {Route} route
 * @returns {Route} - route inserted with url
 */
export function insertRoute(url: string, target: string, route: Route): Route {
    const { root, trail } = extractUrlRoot(url);
    if (root === "") {
        route["@"] = target;
        return route;
    }
    else {
        if (!route[root]) {
            route[root] = {};
        }
        route[root] = insertRoute(trail, target, route[root]);
        if (!route[root]["@"]) { throw ReferenceError(`"${root}" did not have have route root ("@"). inserted deeper then existed.`); }
        return route;
    }
}

/**
 * delete a route
 * @param {string} url - the url
 * @param {Route} route - the route
 * @returns {Route} - route with removed url
 */
export function deleteRoute(url: string, route: Route): Route {
    const { root, trail } = extractUrlRoot(url);
    if (trail === "/") {
        delete route[root];
        return route;
    }
    else {
        if (route[root]) {
            route[root] = deleteRoute(trail, route[root]);
            return route;
        } else {
            throw ReferenceError(`there is no "${url}" in route, checked "${root}"`);
        }
    }
}
