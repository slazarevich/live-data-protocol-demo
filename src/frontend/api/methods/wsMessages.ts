import WsService from "../WsService.ts";
import {messageDtoToMessage} from "./transformers/fromDto.ts";
import {MessageDto} from "./dto/message.dto.ts";
import {Message} from "../../domain/Message/types.ts";

export function wsMessages(onMessage: (message: Message) => void): () => void {
    const handleMessage = (response: MessageDto) => {
        onMessage(messageDtoToMessage(response));
    };

    return WsService.ws("api/ws", {onMessage: handleMessage});
}
