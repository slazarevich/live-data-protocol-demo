import SseService from "../SseService.ts";
import {messageDtoToMessage} from "./transformers/fromDto.ts";
import {MessageDto} from "./dto/message.dto.ts";
import {Message} from "../../domain/Message/types.ts";

export function subscribeToMessages(onMessage: (message: Message) => void): () => void {
    const handleMessage = (response: MessageDto) => {
        onMessage(messageDtoToMessage(response));
    };

    return SseService.sse("api/sse", {onMessage: handleMessage, onError: () => {}});
}
