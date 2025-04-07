import { v4 as uuid } from "uuid";

const DEFAULT_MAX_INTERVAL = 3000;

type Uuid = string;

type Event = {
    id: number;
    time: Date;
}

class EventSource {
    private events: Event[] = [];

    private subscribers: Map<Uuid, (event: Event) => void> = new Map();

    private maxInterval: number;

    constructor(maxInterval: number = DEFAULT_MAX_INTERVAL) {
        this.maxInterval = maxInterval;
        this.events = this.createObservableArray();
        this.streamEvents();
    }

    private getNextInterval(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    private createEvent() {
        const latestEvent = this.getLatestEvent();

        const event = {
            id: latestEvent ? latestEvent.id + 1 : 1,
            time: new Date()
        }

        this.events.push(event);
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async streamEvents() {
        while (true) {
            await this.sleep(this.getNextInterval(0, this.maxInterval));

            this.createEvent();
        }
    }

    public getLatestEvent() {
        return this.events.at(-1);
    }

    private createObservableArray() {
        const subscribers = this.subscribers;

        return new Proxy(this.events, {
            set(target, property, value) {
                // Set the value on the array
                target[property as any] = value;

                // If the array length is changed, fire the callback
                if (property === "length") {
                    const lastItem = target.at(-1);

                    if (!lastItem) {
                        throw new Error("Missing value");
                    }

                    Array.from(subscribers.entries()).forEach(([_, onEvent]) => {
                        onEvent(lastItem);
                    })
                }

                return true;
            }
        });
    }

    public subscribe(onEvent: (item: Event) => void) {
        const subscriberId = uuid();
        this.subscribers.set(subscriberId, onEvent);

        return subscriberId;
    }

    public unsubscribe(subscriberId: Uuid) {
        this.subscribers.delete(subscriberId);
    }
}

export default new EventSource();
