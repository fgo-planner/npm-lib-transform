import { LoggerMessage, LoggerMessageLevel, TransformLogger } from '../../src/common/logger';

export class DebugTransformLogger<ID extends string | number | symbol = number> extends TransformLogger<ID> {

    get messages(): ReadonlyArray<LoggerMessage> {
        return this._messages;
    }

    get messageMapById(): ReadonlyMap<ID, ReadonlyArray<LoggerMessage>> {
        return this._messageMapById;
    }

    findMessage(level: LoggerMessageLevel, contains: string): LoggerMessage | undefined {
        return this._findMessage(this._messages, level, contains);
    }

    findMessageWithId(id: ID, level: LoggerMessageLevel, contains: string): LoggerMessage | undefined {
        const bucket = this._messageMapById.get(id);
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

}
