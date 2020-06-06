import express from 'express';
import http from 'http';

export class DialogSocket{
    constructor(port){
        this.port = port;
        this.listeners = [];
        this.clients = {
            danmu : { ws : null },
            main : { ws : null }
        }
    }

    startServer(){
        const app = express();
        app.use(express.static(__dirname));
        const server = http.createServer(app);
        const WebSocketServer = require('ws').Server;
        const wss = new WebSocketServer({ port : this.port, server });
        wss.on('connection', (ws, req) => {
            if(req.url === '/main'){
                this.clients.main.ws = ws;
                ws.on('message', e => {
                    this.clients.danmu.ws && this.clients.danmu.ws.send(e);
                });
            }else if(req.url === '/danmu'){
                this.clients.danmu.ws = ws;
                ws.on('message', e => {
                    this.clients.main.ws && this.clients.main.ws.send(e);
                });
            }
        });
        wss.on('error', (ws, err) => {});
        app.listen(32862);
        this.wss = wss;
        this.server = server;
    }

    stopServer(next){
        next();
        //this.wss.close(() => next());
    }
}