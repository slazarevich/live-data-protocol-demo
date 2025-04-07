import {useCallback, useState, useEffect} from "preact/hooks";

import {waitForNextMessage} from "../../api/methods/waitForNextMessage.ts";
import {Message} from "../../domain/Message/types.ts";

function useLongPollMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    const updateMessages = useCallback(async () => {
        const message = await waitForNextMessage();

        setMessages(prevMessages => {
            const messageIds = prevMessages.map(message => message.id);

            if (messageIds.includes(message.id)) {
                return prevMessages;
            }

            return [...prevMessages, message];
        });

        void updateMessages();
    }, []);

    useEffect(() => {
        void updateMessages();
    }, [updateMessages]);

    return messages;
}

export default useLongPollMessages;
