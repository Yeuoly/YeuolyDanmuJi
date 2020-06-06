import Vue from 'vue';
import Utils from '../modules/Utils';

Vue.directive('drag-move',{
    bind(el, binding, vnode, oldVnode){
        binding.value = binding.value || {};
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
            el.style.cursor = 'move';
            let origin_pos = { x : 0, y : 0 };
            let origin_dom_pos = { x : 0, y : 0};
            let allow_offset = { x : 0, y : 0 };
            const mouseMove = ev => {
                const { x, y } = Utils.dom.getEventPosition(ev);
                const movement_x = x - origin_pos.x;
                const movement_y = y - origin_pos.y;
                const target_x = origin_dom_pos.x + movement_x;
                const target_y = origin_dom_pos.y + movement_y;
                if(target_x <= opts.options.area.width - opts.options.size.width && target_x >= 0){
                    el.style.left = target_x + 'px';
                    opts.position.x = target_x;
                }
                if(target_y <= opts.options.area.height - opts.options.size.height && target_y >= 0){
                    el.style.top = target_y + 'px';
                    opts.position.y = target_y;
                }
            }
            el.addEventListener('mousedown', ev => {
                const { x, y } = Utils.dom.getEventRelativePosition(ev);
                if(x > 3 && y > 3 && x < opts.options.size.width - 3 && y < opts.options.size.height - 3){
                    origin_dom_pos.x = parseInt(el.style.left.replace(/\px/g,''));
                    origin_dom_pos.y = parseInt(el.style.top.replace(/\px/g,''));
                    parent.addEventListener('mousemove',mouseMove);
                }
            });
            parent.addEventListener('mousedown', ev => {
                origin_pos = Utils.dom.getEventPosition(ev);
            });
            document.body.addEventListener('mouseup', () => {
                parent.removeEventListener('mousemove',mouseMove);
            });
        });
    },
    unbind(el){
        el.removeEventListener('mousedown');
        el.parentElement.removeEventListener('mousedown');
        
    }
});

Vue.directive('drag-resize',{
    bind(el, binding, vnode, oldVnode){
        
    }
});