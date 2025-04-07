import {fetchEventSource} from "@microsoft/fetch-event-source";

import RetriableError from "./errors/sse/RetriableError";
import FatalError from "./errors/sse/FatalError";
import ApiService from "./ApiService";
import SseError from "./errors/sse/SseError";
import {BASE_URL} from "./constants.ts";
import logger from "./logger";

const DEFAULT_MAX_RETRIES = 4;

type SseConfig<Message> = {
    onOpen?: () => void;
    onMessage: (message: Message) => void;
    onError: (error: SseError) => void;
    onClose?: () => void;
    retries?: number;
}

class SseService extends ApiService {
    private urlRetryMap: Record<string, number> = {};

    private getRetries(url: string) {
        return this.urlRetryMap[url] ?? 0;
    }

    private incrementRetries(url: string) {
        if (!this.urlRetryMap[url]) {
            this.urlRetryMap[url] = 1;
        }
        this.urlRetryMap[url] += 1;
    }

    private clearRetries(url: string) {
        delete this.urlRetryMap[url];
    }

    public sse<Response>(url: string, config: SseConfig<Response>): () => void {
        const fullUrl = this.baseUrl + "/" + url;
        const maxRetries = config.retries ?? DEFAULT_MAX_RETRIES;
        const abortController = new AbortController();

        fetchEventSource(fullUrl, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            signal: abortController.signal,
            // eslint-disable-next-line require-await
            onopen: async event => {
                logger.info(`Subscribing to ${url}`, "EVENT:", event);

                this.incrementRetries(url);

                if (!event.ok) {
                    const retries = this.getRetries(url);
                    const shouldRetry = retries < maxRetries;

                    if (shouldRetry) {
                        throw new RetriableError(`Attempting to subscribe to ${url} - ${retries} retries`);
                    }
                }

                if (config.onOpen) {
                    config.onOpen();
                }
            },
            onmessage: message => {
                config.onMessage(JSON.parse(message.data));
            },
            onerror: error => {
                const retries = this.getRetries(url);
                const shouldRetry = error instanceof RetriableError && retries < maxRetries;

                if (!shouldRetry) {
                    this.clearRetries(url);

                    const message = `Unable to subscribe to ${url} after ${retries} retries`;

                    logger.error(message, "ERROR:", error);
                    config.onError(error);
                    throw new FatalError(message);
                }

                this.incrementRetries(url);
                config.onError(error);
            },
            onclose: () => {
                logger.info(`Unsubscribed from ${url}`);

                if (config.onClose) {
                    config.onClose();
                }
            }
        });

        return () => {
            logger.info(`Unsubscribing from ${url}`);
            abortController.abort();
        };
    }
}

export default new SseService(BASE_URL);
