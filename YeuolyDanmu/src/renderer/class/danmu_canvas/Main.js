/**
 * 这是一个仿物理引擎式的弹幕类
 * 原本弹幕是使用div+css3来完成的，但悲惨的是似乎在弹幕量大的情况下会卡得要死
 * 再加上更改css有时候反应很慢，所以为了更好的弹幕体验，就改用canvas来实现了
 * 由于之前没有写过canvas还是个小白，所以这里的实现可能会有点奇怪
 * 但一直都有写一个js物理引擎的计划，所以这个就算是试个水了
 */

//30帧
const ANIMAL_INTERVAL = 33;

export default class DanmuCanvas{
    canvas_id = ''
    canvas = null
    context = null
    area = {
        width : 300,
        height : 800
    }
    
    //弹幕实体
    danmus = []

    constructor(id,{ width , height }){
        this.canvas_id = id;
        this.area = {
            width : width,
            height : height
        }
        this.canvas = document.getElementById(id);
        this.context = canvas.getContext('2d');
    }

    load(){

    }

    run(){
        
    }

    tick(){
        this.danmus.forEach( e => {
            e.tick();
        });
    }
}