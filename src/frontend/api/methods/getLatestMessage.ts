import HttpService from "../HttpService.ts";
import {messageDtoToMessage} from "./transformers/fromDto.ts";
import {MessageDto} from "./dto/message.dto.ts";
import {Message} from "../../domain/Message/types.ts";

function transformResponse(messageDto: MessageDto): Message {
    return messageDtoToMessage(messageDto)
}

export async function getLatestMessage(): Promise<Message> {
    const response = await HttpService.get<MessageDto>("api/poll");
    return transformResponse(response);
}
