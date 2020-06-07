import Vue from 'vue';
import Utils from '../modules/Utils';

Vue.directive('drag-move',{
    bind(el, binding, vnode){
        binding.value = binding.value || {};
        vnode.drag = vnode.drag || { move : {}, resize : {} };
        setTimeout(() => {
            const parent = binding.value.parent || el.parentElement;
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
                if(target_x <= opts.options.area.width - opts.options.size.width && target_x >= 0){
                    el.style.left = target_x + 'px';
                    opts.position.x = target_x;
                }
                if(target_y <= opts.options.area.height - opts.options.size.height && target_y >= 0){
                    el.style.top = target_y + 'px';
                    opts.position.y = target_y;
                }
            }
            //判断是否移动，如果移动则记录原始坐标并添加移动监听事件
            el.addEventListener('mousedown', ev => {
                const { x, y } = Utils.dom.getEventRelativePosition(ev);
                //以3px为界，没过界则算作resize，过了就算move
                if(x > 3 && y > 3 && x < opts.options.size.width - 3 && y < opts.options.size.height - 3){
                    origin_dom_pos.x = parseInt(el.style.left.replace(/\px/g,''));
                    origin_dom_pos.y = parseInt(el.style.top.replace(/\px/g,''));
                    origin_pos = Utils.dom.getEventPosition(ev);
                    vnode.drag.moving = true;
                    //这里使用body作为监听对象，防止鼠标跳到可行区外
                    document.body.addEventListener('mousemove',mouseMove);
                }
            });
            el.addEventListener('mousemove', ev => {
                if(!vnode.drag.moving && !vnode.drag.resizing){
                    //如果没有正在移动，判断鼠标位置设置鼠标图标
                    const { x , y } = Utils.dom.getEventRelativePosition(ev);
                    if(x > 3 && y > 3 && x < opts.options.size.width - 3 && y < opts.options.size.height - 3){
                        parent.style.cursor = 'move';
                    }else{
                        parent.style.cursor = 'initial';
                    }
                };
            });
            el.addEventListener('mouseleave', ev => {
                if(!vnode.drag.moving){
                    parent.style.cursor = 'initial';
                }
            });
            //为了避免鼠标越界造成移动中断，拖动的停止事件为body上的mouseup
            const remover = () => {
                vnode.drag.moving = false;
                document.body.removeEventListener('mousemove',mouseMove);
            }
            document.body.addEventListener('mouseup', remover);
            vnode.drag.move.mouseup = remover;
        });
    },
    unbind(el, binding, vnode){
        document.body.removeEventListener('mouseup',vnode.drag.move.mouseup);
    }
});

Vue.directive('drag-resize',{
    bind(el, binding, vnode, oldVnode){
        binding.value = binding.value || {};
        vnode.drag = vnode.drag || { move : {}, resize : {} };
        setTimeout(() => {
            const parent = binding.value.parent || el.parentElement;
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
            vnode.drag.resizing = false;
            //判定鼠标样式
            const direction = ({ x, y }) => {
                const res = { dirs : [], cursor : '' };
                if(x < 3){
                    res.dirs.push('left');
                }else if(x > opts.options.size.width - 3){
                    res.dirs.push('right')
                }
                if(y < 3){
                    res.dirs.push('top');
                }else if(y > opts.options.size.height - 3){
                    res.dirs.push('bottom');
                }

                return res;
            }

            el.addEventListener('mousemove', ev => {
                if(!vnode.drag.resizing && !vnode.drag.moving){
                    const dirs = direction(Utils.dom.getEventRelativePosition(ev));
                    
                }
            });
            el.addEventListener('mousedown', ev => {

            });
            document.addEventListener('mouseup', ev => {

            });
        });
    }
});