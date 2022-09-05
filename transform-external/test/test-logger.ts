import { ReadonlyRecord } from '@fgo-planner/common-types';
import { BaseLogger, LoggerMessageLevel } from '../src/logger';

type LoggerMessage = Readonly<{
    level: LoggerMessageLevel;
    timestamp: Date;
    message: any;
}>;

export class TestLogger extends BaseLogger<number> {

    private readonly _messages: Array<LoggerMessage> = [];
    get messages(): ReadonlyArray<LoggerMessage> {
        return this._messages;
    }

    private readonly _messageMapById: Record<number, Array<LoggerMessage>> = {};
    get messageMapById(): ReadonlyRecord<number, ReadonlyArray<LoggerMessage>> {
        return this._messageMapById;
    }

    protected _append(id: number | undefined, timestamp: Date, message: unknown, level: LoggerMessageLevel): void {
        if (id === undefined) {
            this._messages.push({ level, timestamp, message });
        } else {
            let bucket = this._messageMapById[id];
            if (!bucket) {
                this._messageMapById[id] = bucket = [];
            }
            bucket.push({ level, timestamp, message });
        }
    }

    findMessage(level: LoggerMessageLevel, contains: string): LoggerMessage | undefined {
        return this._findMessage(this._messages, level, contains);
    }

    findMessageWithId(id: number, level: LoggerMessageLevel, contains: string): LoggerMessage | undefined {
        const bucket = this._messageMapById[id];
        if (!bucket) {
            return undefined;
        }
        return this._findMessage(bucket, level, contains);
    }

    private _findMessage(bucket: Array<LoggerMessage>, level: LoggerMessageLevel, contains: string): LoggerMessage | undefined {
        for (const message of bucket) {
            if (message.level !== level) {
                continue;
            }
            let messageString: string;
            if (typeof message.message === 'string') {
                messageString = message.message;
            } else {
                messageString = String(message.message);
            }
            if (messageString.includes(contains)) {
                return message;
            }
        }
        return undefined;
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
            ...this._messageMapById
        };
        return object;
    }

}