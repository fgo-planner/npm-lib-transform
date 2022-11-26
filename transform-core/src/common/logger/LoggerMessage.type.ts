import { LoggerMessageLevel } from './LoggerMessageLevel.enum';

export type LoggerMessage = {

    level: LoggerMessageLevel;

    timestamp: Date;

    message: any;

};
