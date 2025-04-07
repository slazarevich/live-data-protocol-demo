import HttpService from "../HttpService.ts";

type LogLevel = "info" | "warn" | "error";

type Request = {
    level: LogLevel;
    message: string;
}

export async function createLog(level: LogLevel, message: string): Promise<void> {
    return HttpService.post<void, Request>("/api/log", {level, message});
}
