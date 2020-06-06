const ipc = require('electron').ipcRenderer;

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

    startServer(path, succees_hook, failure_hook, auto_restart){
        auto_restart = auto_restart || true;
        const connect = () => {
            const socket = new WebSocket(`ws://localhost:${this.port}/${path}`);
            socket.onmessage = e => this.listeners.forEach(i => i(e));
            socket.onopen = () => succees_hook();
            socket.onerror = () => {
                typeof failure_hook === 'function' && failure_hook();
                if(auto_restart){
                    setTimeout(() => {
                        this.socket = connect();
                    }, 5000);
                }
            }
            return socket;
        }
        this.socket = connect();
        ipc.on('close-websocket', () => {
            this.socket.close(3140);
            ipc.send('closed-websocket');
        });
    }
}