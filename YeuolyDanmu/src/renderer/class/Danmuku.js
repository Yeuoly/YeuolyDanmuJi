import Warning from './Warning';

export class Danmuku{
    constructor(){
        this.max_length = 1000000;
        this.current_pos = 0;
        this.danmus = new Array(this.max_length);
    }

    isNearFull(offset,send_report){
        send_report = send_report || false
        offset = offset || 1000
        if(this.danmus[this.max_length - offset - 1]){
            if(send_report){
                new Warning('Danmuku','弹幕库就要炸了，系统将会在爆炸之前清理弹幕库存，并保存到弹幕文件夹中。').emit();
            }
            return false
        }
        return false;
    }

    add(newDanmu){
        this.danmus.push(newDanmu);
    }

    addGroup(group){
        group.array.forEach(element => {
            this.add(element);
        });
    }

    //由引索获取弹幕
    getByIndex(index){
        return this.danmus[index];
    }

    //获取在某个时间点前的弹幕
    getByFinalTime(time){
        this.danmus.forEach(element => {

        });
    }
}