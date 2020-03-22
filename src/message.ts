// could use an enum, but this is easier
export type MessageSeverity =  "info" | "error"

export class Message {

    public message: string;
    public severity?: MessageSeverity;

    constructor(message: string, severity?: MessageSeverity) {
        this.message = `[${new Date().toLocaleTimeString()}] ${message}`;
        if (severity) {
            this.severity = severity;
        } else {
            this.severity = "info";
        }
    }
}