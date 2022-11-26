import { LoggerMessageLevel } from './LoggerMessageLevel.enum';
import { LoggerMessage } from './LoggerMessage.type';

export class TransformLogger<ID extends string | number | symbol = number> {

    protected readonly _messages: Array<LoggerMessage> = [];

    protected readonly _messageMapById: Map<ID, Array<LoggerMessage>> = new Map<ID, Array<LoggerMessage>>();

    private _start?: Date;
    get start(): Date | undefined {
        return this._start;
    }

    private _end?: Date;
    get end(): Date | undefined {
        return this._end;
    }

    get name(): string | undefined {
        return this._name;
    }

    constructor(private _name?: string) {

    }

    setStart(date?: Date): Date | undefined {
        if (!date) {
            date = new Date();
        }
        return this._start = date;
    }

    setEnd(date?: Date): Date | undefined {
        if (!date) {
            date = new Date();
        }
        return this._end = date;
    }

    info(message: string | unknown): void;
    info(id: ID, message: string | unknown): void;
    info(param1: ID | string | unknown, param2?: string | unknown): void {
        this._log(param1, param2);
    }

    warn(message: string | unknown): void;
    warn(id: ID, message: string | unknown): void;
    warn(param1: ID | string | unknown, param2?: string | unknown): void {
        this._log(param1, param2, LoggerMessageLevel.Warn);
    }

    error(message: string | unknown): void;
    error(id: ID, message: string | unknown): void;
    error(param1: ID | string | unknown, param2?: string | unknown): void {
        this._log(param1, param2, LoggerMessageLevel.Error);
    }

    protected _log(param1: ID | string | unknown, param2?: string | unknown, level = LoggerMessageLevel.Info): void {
        let id, message;
        if (param2 !== undefined) {
            id = param1 as ID;
            message = param2;
        } else {
            id = undefined;
            message = param1;
        }
        this._printToConsole(id, message, level);
        const timestamp = new Date();
        this._append(id, timestamp, message, level);
    }

    private _printToConsole(id: ID | undefined, message: string | unknown, level: LoggerMessageLevel): void {
        if (level === LoggerMessageLevel.Info) {
            id === undefined ? console.log(message) : console.log(id, message);
        } else if (level === LoggerMessageLevel.Warn) {
            id === undefined ? console.warn(message) : console.warn(id, message);
        } else if (level === LoggerMessageLevel.Error) {
            id === undefined ? console.error(message) : console.error(id, message);
        }
    }

    private _append(id: ID | undefined, timestamp: Date, message: unknown, level: LoggerMessageLevel): void {
        if (id === undefined) {
            this._messages.push({ level, timestamp, message });
        } else {
            let bucket = this._messageMapById.get(id);
            if (!bucket) {
                this._messageMapById.set(id, bucket = []);
            }
            bucket.push({ level, timestamp, message });
        }
    }

    toJSON(): string {
        const object: any = {};
        if (this._name != null) {
            object.name = this._name;
        }
        if (this._start != null) {
            object.start = this._start;
        }
        if (this._end != null) {
            object.end = this._end;
        }
        object.messages = {
            global: this._messages,
            ...Object.fromEntries(this._messageMapById)
        };
        return object;
    }

}
