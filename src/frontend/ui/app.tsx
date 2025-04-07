import MessageList from "./components/MessageList/MessageList.tsx";
import useWsMessages from "./hooks/useWsMessages.ts";
import useSseMessages from "./hooks/useSseMessages.ts";
import usePollMessages from "./hooks/usePollMessages.ts";
import useLongPollMessages from "./hooks/useLongPollMessages.ts";
import styles from "./styles.module.css";
import "./app.css"

export function App() {
    const polledMessages = usePollMessages();
    const longPolledMessages = useLongPollMessages();
    const sseMessages = useSseMessages();
    const wsMessages = useWsMessages();

    return (
        <main>
            <div className={styles.titles}>
                <p>Polling</p>
                <p>Long polling</p>
                <p>Server-Sent Events</p>
                <p>WebSocket</p>
            </div>
            <div className={styles.lists}>
                <MessageList messages={polledMessages}/>
                <MessageList messages={longPolledMessages}/>
                <MessageList messages={sseMessages}/>
                <MessageList messages={wsMessages}/>
            </div>
        </main>
    )
}
