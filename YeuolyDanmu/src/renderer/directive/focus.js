import Vue from 'vue';

Vue.directive('focus',{
    bind(el){
        const focus = { on : false };
        document.body.addEventListener('mousedown', ev => {
            focus.on = false;
        });
        el.addEventListener('mousedown', ev => {
            setTimeout(() => {
                focus.on = true;
            });
        });
        Object.defineProperty(focus,'on',{
            set(v){
                if(v){
                    el.style.backgroundColor = 'red';
                }else{
                    el.style.backgroundColor = 'white';
                }
            }
        });
    }
});