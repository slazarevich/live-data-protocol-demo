import {useCallback, useState, useEffect} from "preact/hooks";

import {wsMessages} from "../../api/methods/wsMessages.ts";
import {Message} from "../../domain/Message/types.ts";

function useWsMessages() {
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

        return wsMessages(onMessage);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribe();
        return () => unsubscribe();
    }, [subscribe]);

    return messages;
}

export default useWsMessages;
