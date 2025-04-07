import {useCallback, useState, useEffect} from "preact/hooks";

import {getLatestMessage} from "../../api/methods/getLatestMessage.ts";
import {useInvokeOnTimer} from "./useInvokeOnTimer.ts";
import {Message} from "../../domain/Message/types.ts";

const POLLING_INTERVAL = 1000;

function usePollMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    const updateMessages = useCallback(() => {
        const request = getLatestMessage();
        request.then(message => setMessages(prevMessages => {
            const messageIds = prevMessages.map(message => message.id);

            if (messageIds.includes(message.id)) {
                return prevMessages;
            }

            return [...prevMessages, message];
        }));
        return request;
    }, []);

    useEffect(() => {
        void updateMessages();
    }, [updateMessages]);

    useInvokeOnTimer(async () => {
        void updateMessages();
    }, POLLING_INTERVAL);

    return messages;
}

export default usePollMessages;
