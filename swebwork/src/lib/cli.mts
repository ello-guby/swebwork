/**
 * Command Line Interface (CLI) realated stuff
 */

export const Color = {
    OK: "\x1b[32;1m",
    ERR: "\x1b[31;1m",
    WARN: "\x1b[33;1m",
    NOTE: "\x1b[34;1m",
    INFO: "\x1b[35;1m",
    CLEAR: "\x1b[0m",
    _: "\x1b[0m",
}

export function err(msg: string, errno = 0): void {
    console.error(`${msg}${Color._}`);
    process.exit(errno);
}
