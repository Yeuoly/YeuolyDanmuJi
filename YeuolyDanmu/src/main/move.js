import { screen, ipcMain } from 'electron';

//在一些机器上会出现拖动窗口导致的窗口大小莫名其妙改变的bug，这里采用在移动窗口的时候锁死窗口大小

export const windowMove = (win, id) => {
    let moving_interval = null;

    ipcMain.on('window-move-evt', (sender, data) => {
        if(data['id'] === id && data['move']){
            const win_size = win.getSize();
            const win_pos = win.getPosition();
            const mos_pos = screen.getCursorScreenPoint();
            if(moving_interval){
                clearInterval(moving_interval);
            }
            moving_interval = setInterval(() => {
                const current_pos = screen.getCursorScreenPoint();
                const x = win_pos[0] + current_pos.x - mos_pos.x;
                const y = win_pos[1] + current_pos.y - mos_pos.y;
                win.setBounds({ x: x, y: y, width: win_size[0], height: win_size[1] });
            }, 18);
        }else{
            clearInterval(moving_interval);
        }
    });
}
