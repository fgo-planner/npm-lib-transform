import { LoggerMessageLevel } from './logger-message-level.enum';

export abstract class BaseLogger<ID = string | number | symbol> {

    protected _start?: Date;
    get start(): Date | undefined {
        return this._start;
    }

    protected _end?: Date;
    get end(): Date | undefined {
        return this._end;
    }

    get name(): string | undefined {
        return this._name;
    }

    constructor(protected _name?: string) {

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

    protected _log(param1: number | string | unknown, param2?: string | unknown, level = LoggerMessageLevel.Info): void {
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

    protected _printToConsole(id: ID | undefined, message: string | unknown, level: LoggerMessageLevel): void {
        if (level === LoggerMessageLevel.Info) {
            id === undefined ? console.log(message) : console.log(id, message);
        } else if (level === LoggerMessageLevel.Warn) {
            id === undefined ? console.warn(message) : console.warn(id, message);
        } else if (level === LoggerMessageLevel.Error) {
            id === undefined ? console.error(message) : console.error(id, message);
        }
    }
    
    protected abstract _append(_id: ID | undefined, timestamp: Date, message: string | unknown, level: LoggerMessageLevel): void;

    abstract toJSON(): string;

}