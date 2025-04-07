import {Message as MessageType} from "../../../../../domain/Message/types.ts";

interface Props {
    message: MessageType;
}

function Message({message}: Props) {
    return (
        <div>
            {message.id}
        </div>
    );
}

export default Message;
