export class DialogSocket{
    constructor(port){
        this.port = port;
        this.listeners = [];
    }

    send(message){
        this.socket.send(message);
    }

    addListener(handler){
        this.listeners.push(handler);
    }

    startServer(path, succees_hook){
        this.socket = new WebSocket('ws://localhost:' + this.port + '/' + path);
        this.socket.onopen = e => {
            succees_hook();
        };
        this.socket.onmessage = e => {
            this.listeners.forEach( i => {
                i(e);
            });
        };
        this.socket.onerror = ev => {
            
        };
    }
}