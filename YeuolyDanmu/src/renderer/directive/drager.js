import Vue from 'vue';
import Utils from '../modules/Utils';

//这里有个很蛋疼的问题，当多个drag对象位于一个parent下的时候不同drag对象之间会互相干扰，所以需要设置当一个对象在移动的时候其他对象不受干扰
const parents = [];

const getParentStates = dom => {
    for(const i of parents){
        if(i.dom === dom) return i.states;
    }
    const i = { dom : dom, states : { resizing : false, moving : false } }
    parents.push(i);
    return i.states;
}

Vue.directive('drag-move',{
    bind(el, binding, vnode){
        console.log(vnode);
        binding.value = binding.value || {};
        vnode.drag = vnode.drag || { move : {}, resize : {} };
        vnode.drag.move.on = true;
        setTimeout(() => {
            const parent = binding.value.parent || el.parentElement;
            const states = getParentStates(parents);
            const default_binding = {
                position : { x : 0, y : 0, immediate : false },
                options : {
                    area : { 
                        width : parent.offsetWidth,
                        height : parent.offsetHeight,
                    },
                    size : {
                        width : el.offsetWidth,
                        height : el.offsetHeight,
                        immediate : false
                    }
                }
            }
            Utils.fillDefaultOptions(binding.value, default_binding);
            const opts = binding.value;
            parent.style.position = 'relative';
            el.style.position = 'absolute';
            el.style.top = opts.position.y + 'px';
            el.style.left = opts.position.x + 'px';
            el.style.width = opts.options.size.width + 'px';
            el.style.height = opts.options.size.height + 'px';
            //记录点击时的鼠标绝对坐标，用于计算位移量
            let origin_pos = { x : 0, y : 0 };
            //记录原始DOM的坐标，为后面位移做准备
            let origin_dom_pos = { x : 0, y : 0};
            let barrier = { x : 0, y : 0 };
            vnode.drag.moving = false;
            const mouseMove = ev => {
                //获取当前鼠标绝对坐标，与ORIGIN_POS做差获取位移差
                const { x, y } = Utils.dom.getEventPosition(ev);
                const movement_x = x - origin_pos.x;
                const movement_y = y - origin_pos.y;
                //用原始DOM坐标加上位移量计算当前坐标
                const target_x = origin_dom_pos.x + movement_x;
                const target_y = origin_dom_pos.y + movement_y;
                //判断是否过界
                if(target_x <= barrier.x && target_x >= 0){
                    el.style.left = target_x + 'px';
                    if(opts.position.immediate){
                        opts.position.x = target_x;
                    }
                }
                if(target_y <= barrier.y && target_y >= 0){
                    el.style.top = target_y + 'px';
                    if(opts.position.immediate){
                        opts.position.y = target_y;
                    }
                }
            }
            //判断是否移动，如果移动则记录原始坐标并添加移动监听事件
            el.addEventListener('mousedown', ev => {
                const { x, y } = Utils.dom.getEventRelativePosition(ev);
                //以3px为界，没过界则算作resize，过了就算move
                if(x < opts.options.size.width - 3 && y < opts.options.size.height - 3){
                    origin_dom_pos.x = parseInt(el.style.left.replace(/\px/g,''));
                    origin_dom_pos.y = parseInt(el.style.top.replace(/\px/g,''));
                    barrier.x = opts.options.area.width - opts.options.size.width;
                    barrier.y = opts.options.area.height - opts.options.size.height;
                    origin_pos = Utils.dom.getEventPosition(ev);
                    vnode.drag.moving = true;
                    states.moving = true;
                    //这里使用body作为监听对象，防止鼠标跳到可行区外
                    document.body.addEventListener('mousemove',mouseMove);
                }
            });
            el.addEventListener('mousemove', ev => {
                if(!states.moving && !states.resizing){
                    //如果没有正在移动，判断鼠标位置设置鼠标图标
                    const { x , y } = Utils.dom.getEventRelativePosition(ev);
                    if(x < opts.options.size.width - 3 && y < opts.options.size.height - 3){
                        parent.style.cursor = 'move';
                    }else{
                        parent.style.cursor = 'initial';
                    }
                };
            });
            el.addEventListener('mouseleave', ev => {
                if(!states.moving && !states.resizing){
                    parent.style.cursor = 'initial';
                }
            });
            //为了避免鼠标越界造成移动中断，拖动的停止事件为body上的mouseup
            const remover = () => {
                states.moving = false;
                vnode.drag.moving = false;
                document.body.removeEventListener('mousemove',mouseMove);
                opts.position.x = parseInt(el.style.left.replace(/\px/g,''));
                opts.position.y = parseInt(el.style.top.replace(/\px/g,''));
            }
            document.body.addEventListener('mouseup', remover);
            vnode.drag.move.mouseup = remover;
        });
    },
    unbind(el, binding, vnode){
        document.body.removeEventListener('mouseup',vnode.drag.move.mouseup);
    }
});

/**
 * 这里先说明一下，因为第一个懒，第二个为了降低逻辑复杂度和提高性能
 * 只提供左右和右下三个方向的resize
 */
Vue.directive('drag-resize',{
    bind(el, binding, vnode, oldVnode){
        binding.value = binding.value || {};
        vnode.drag = vnode.drag || { move : {}, resize : {} };
        vnode.drag.resize.on = true;
        setTimeout(() => {
            const parent = binding.value.parent || el.parentElement;
            const states = getParentStates(parents);
            const default_binding = {
                position : { x : 0, y : 0 },
                options : {
                    area : { 
                        width : parent.offsetWidth,
                        height : parent.offsetHeight
                    },
                    size : {
                        width : el.offsetWidth,
                        height : el.offsetHeight
                    }
                }
            }
            Utils.fillDefaultOptions(binding.value, default_binding);
            const opts = binding.value;
            // Object.defineProperties(opts ,{
            //     'options.size.width' : {
            //         set(v){
            //             console.log(123);
            //             if(!states.resizing){
            //                 el.style.width = v + 'px';
                            
            //             }
            //         }
            //     }
            // });
            vnode.drag.resizing = false;
            let origin_mouse_pos = { x : 0, y :0 };
            let origin_size = { width : 0, height :0 };
            let barrier = { width : 0, height : 0 };
            let direction = '';
            const resize = ev => {
                const { x, y } = Utils.dom.getEventPosition(ev);
                if(direction.includes('w')){
                    const movement_x = x - origin_mouse_pos.x;
                    const target_width = origin_size.width + movement_x;
                    if(target_width >= 10 && target_width <= barrier.width){
                        el.style.width = target_width + 'px';
                        if(opts.options.size.immediate){
                            opts.options.size.width = target_width;
                        }
                    }
                }
                if(direction.includes('h')){
                    const movement_y = y - origin_mouse_pos.y;
                    const target_height = origin_size.height + movement_y;
                    if(target_height >= 10 && target_height <= barrier.height){
                        el.style.height = target_height + 'px';
                        if(opts.options.size.immediate){
                            opts.options.size.height = target_height;
                        }
                    }
                }
            }
            //x y为相对坐标
            const direct = ({ x, y }) => {
                let res = '';
                if(x >= opts.options.size.width - 3){
                    res += 'w';    
                }
                if(y >= opts.options.size.height - 3){
                    res += 'h';
                }
                return res;
            }
            el.addEventListener('mousemove', ev => {
                if(!states.moving && !states.resizing){
                    const { x, y } = Utils.dom.getEventRelativePosition(ev);
                    direction = direct({x, y});
                    let style;
                    switch(direction){
                        case '': if(!vnode.drag.move.on) style = 'initial'; break;
                        case 'w': style = 'e-resize'; break;
                        case 'h': style = 'n-resize'; break;
                        case 'wh': style = 'nw-resize'; break;
                    }
                    parent.style.cursor = style;
                }
            });
            el.addEventListener('mousedown', ev => {
                const { x, y } = Utils.dom.getEventRelativePosition(ev);
                if(x >= opts.options.size.width - 3 || y >= opts.options.size.height - 3){
                    states.moving = true;
                    vnode.drag.resizing = true;
                    direction = direct({x, y});
                    origin_size.width = parseInt(el.style.width.replace(/\px/g,''));
                    origin_size.height = parseInt(el.style.height.replace(/\px/g,''));
                    barrier.width = opts.options.area.width - opts.position.x;
                    barrier.height = opts.options.area.height - opts.position.y;
                    document.body.addEventListener('mousemove', resize);
                }
            });
            const remover = () => {
                states.moving = false;
                vnode.drag.resizing = false;
                document.body.removeEventListener('mousemove', resize);
                opts.options.size.width = parseInt(el.style.width.replace(/\px/g,''));
                opts.options.size.height = parseInt(el.style.height.replace(/\px/g,''));
            }
            vnode.drag.resize.mouseup = remover;
            el.addEventListener('mouseleave', ev => {
                if(!states.moving && !states.resizing){
                    parent.style.cursor = 'initial';
                }
            });
            el.addEventListener('mousedown', ev => {
                origin_mouse_pos = Utils.dom.getEventPosition(ev);
            });
            document.body.addEventListener('mouseup', remover);
        });
    },
    unbind(el, binding, vnode){
        document.body.removeEventListener('mouseup', vnode.drag.resize.mouseup);
    }
});