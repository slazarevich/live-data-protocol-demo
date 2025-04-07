import {Message} from "../../../domain/Message/types.ts";
import {MessageDto} from "../dto/message.dto.ts";

export function messageDtoToMessage(dto: MessageDto): Message {
    return {
        id: dto.id,
        date: new Date(dto.time)
    }
}
