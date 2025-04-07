import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import expressWs from "express-ws";

import eventSource from "./eventSource.ts";

const PORT = 3000;

const server = expressWs(express());
const app = server.app;

app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:5173"}));

app.get("/api/poll", (_req, res) => {
    res.send(eventSource.getLatestEvent());
});

app.get("/api/long-poll", (_req, res) => {
    const subscriptionId = eventSource.subscribe(event => {
        res.send(event);
        eventSource.unsubscribe(subscriptionId);
    });
});

class ServerEvent {
    data = "";

    addData(data: string) {
        this.data += "data:" + data + "\n";
    }

    get payload() {
        let payload = "";

        payload += this.data;
        return payload + "\n";
    }
}

app.get("/api/sse", (_req, res) => {
    eventSource.subscribe(function(event){
        const messageEvent = new ServerEvent();
        messageEvent.addData(JSON.stringify(event));
        res.write(messageEvent.payload);
    });

    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });

    res.write("retry: 10000\n");
});

app.ws("/api/ws", function(ws, req) {
    ws.on("message", function(msg) {
        console.log("MESSAGE", msg);
    });
    ws.on("upgrade", (msg) => {
        console.log("UPGRADE", msg);
    });
    ws.on("close", (msg) => {
        console.log("CLOSE", msg);
    });
    ws.on("error", (msg) => {
        console.log("ERROR", msg);
    });
    ws.on("ping", (msg) => {
        console.log("PING", msg);
    });
    ws.on("pong", (msg) => {
        console.log("PONG", msg);
    });
    ws.on("unexpected-response", (msg) => {
        console.log("UNEXPECTED-RESPONSE", msg);
    });
    ws.on("open", () => {
        console.log("OPEN");
    })

    eventSource.subscribe(function(event){
        ws.send(JSON.stringify(event));
    });

    console.log("socket", req);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});
