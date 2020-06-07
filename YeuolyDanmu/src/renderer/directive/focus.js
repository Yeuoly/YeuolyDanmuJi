import Vue from 'vue';

Vue.directive('focus',{
    bind(el, binding, vnode){
        const focus = { on : false, left : false };
        const mouseFunc = [
            () => { if(focus.left) focus.on = false; else focus.on = true; },
            () => { focus.left = true; },
            () => { focus.left = false; }
        ]
        binding.func = mouseFunc;
        document.body.addEventListener('mousedown', mouseFunc[0]);
        el.addEventListener('mouseleave', mouseFunc[1]);
        el.addEventListener('mouseenter', mouseFunc[2]);
        const image = require('../assets/blue-point.png');
        const line = `url(${image}), url(${image}), url(${image}),
                      url(${image}), url(${image}), url(${image}),
                      url(${image}), url(${image}), url(${image}),
                      url(${image}), url(${image}), url(${image})
        `;
        const position = `50% 0, 0 50%, 100% 50%, 50% 100%, 0 0, 0 0, 100% 0, 0 100%, 0 0, 100% 0, 0 100%, 100% 100%`;
        const size = `4px 4px, 4px 4px, 4px 4px, 4px 4px, 100% 1px, 1px 100%, 1px 100%, 100% 1px, 4px 4px, 4px 4px, 4px 4px, 4px 4px `;
        el.style.backgroundPosition = position;
        el.style.backgroundSize = size;
        el.style.backgroundRepeat = 'no-repeat';
        console.log(require('../assets/blue-point.png'));
        Object.defineProperty(focus, 'on', {
            set(v){
                if(v){
                    el.style.backgroundImage = line;
                }else{
                    el.style.backgroundImage = '';
                }
            }
        });
    },
    unbind(el, binding){
        const mouseFunc = binding.func;
        document.body.removeEventListener('mouseleave', mouseFunc[0]);
        el.removeEventListener('mouseleave', mouseFunc[1]);
        el.removeEventListener('mouseenter', mouseFunc[2]);
    }
});