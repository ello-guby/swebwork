/**
 * A module to help frontend
 */

export class Response {
    errno: number
    mimeType: string
    response: string|Buffer
    constructor(errno: number, mimeType: string, response: string|Buffer) {
        this.errno = errno;
        this.mimeType = mimeType;
        this.response = response;
    }
}
