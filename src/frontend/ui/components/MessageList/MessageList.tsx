import {Message as MessageType} from "../../../domain/Message/types.ts";
import Message from "./components/Message/Message.tsx";

interface Props {
    messages: MessageType[];
}

function MessageList({messages}: Props) {
    return (
        <div>
            {messages.map(message => {
                return <Message key={message.id} message={message}/>
            })}
        </div>
    );
}

export default MessageList;
