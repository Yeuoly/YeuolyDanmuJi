import Stroe from 'electron-store';
const store = new Stroe();

export const getInitialDanmuSize = () => {
    const size = store.get('danmu-size', {
        danmu : { w: 300, h: 730 }
    });
    return { width: size.danmu.w, height: size.danmu.h };
}

export const saveDanmuSize = win => {
    const size = win.getSize();
    store.set('danmu-size', {
        danmu : { w: size[0], h: size[1] }
    });
}