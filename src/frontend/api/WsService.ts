import ApiService from "./ApiService";
import {BASE_WS_URL} from "./constants.ts";
import logger from "./logger";

type WsConfig<Message> = {
    onOpen?: () => void;
    onMessage: (message: Message) => void;
    onClose?: () => void;
    retries?: number;
}

class WsService extends ApiService {
    public ws<Response>(url: string, config: WsConfig<Response>): () => void {
        const fullUrl = this.baseUrl + "/" + url;

        const webSocket = new WebSocket(fullUrl);

        logger.info(`Subscribing to ${url}`);

        webSocket.onmessage = (event) => {
            logger.info(`Received message from ${event}`);
            config.onMessage(JSON.parse(event.data));
        };

        return () => {
            logger.info(`Unsubscribed from ${url}`);
            webSocket.close();
        }
    }
}

export default new WsService(BASE_WS_URL);
