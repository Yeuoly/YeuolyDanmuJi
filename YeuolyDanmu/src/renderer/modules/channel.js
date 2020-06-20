const ipc = require('electron').ipcRenderer;

export class DialogChannel{
    constructor(id){
        this.id = id;
        this.listeners = [];
    }

    send(message){
        ipc.send('message', {
            from : this.id,
            data : message
        });
    }

    addListener(handler){
        this.listeners.push(handler);
    }

    setWindowMoveState(move){
        ipc.send('window-move-evt',{
            id : this.id,
            move : move
        });
    }

    startServer(succees_hook){
        ipc.send('window-mounted', { 
            window : this.id,
            id : require('electron').remote.getCurrentWindow().id            
        });
        ipc.on('window-mounted-success', () => {
            succees_hook();
        })
        ipc.on('message', (sender, message) => {
            this.listeners.forEach(e => e(message));
        });
    }
}