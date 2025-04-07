import {createLog} from "./methods/createLog";

type Args = Array<string | unknown>;
type LogFn = (...args: Args) => void;
type LogLevel = "info" | "warn" | "error";

interface ILogger {
    info: LogFn;
    warn: LogFn;
    error: LogFn;
}

export function prepareLogMessage(...args: Args): string {
    return args.map(arg => {
        if (typeof arg === "object") {
            return JSON.stringify(arg);
        }
        return arg;
    }).join(" ");
}

export class Logger implements ILogger {
    get info(): LogFn {
        return this.log("info");
    }

    get warn(): LogFn {
        return this.log("warn");
    }

    get error(): LogFn {
        return this.log("error");
    }

    private log(level: LogLevel) {
        const environment = process.env.NODE_ENV ?? "";

        if (!["production", "development", "test"].includes(environment)) {
            throw new Error(`Invalid environment option value: ${environment}.`);
        }

        return environment === "production" ? this.createLogToServer(level) : console[level].bind(console);
    }

    private createLogToServer(type: LogLevel) {
        return (...args: Args) => {
            createLog(type, prepareLogMessage(...args))
                .catch(console.error);
        };
    }
}

export default new Logger();
