import {useCallback, useState, useEffect} from "preact/hooks";

import {subscribeToMessages} from "../../api/methods/subscribeToMessages.ts";
import {Message} from "../../domain/Message/types.ts";

function useSseMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    const subscribe = useCallback(() => {
        const onMessage = (message: Message) => {
            setMessages(prevMessages => {
                const messageIds = prevMessages.map(message => message.id);

                if (messageIds.includes(message.id)) {
                    return prevMessages;
                }

                return [...prevMessages, message];
            });
        }

        return subscribeToMessages(onMessage);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribe();
        return () => unsubscribe();
    }, [subscribe]);

    return messages;
}

export default useSseMessages;
