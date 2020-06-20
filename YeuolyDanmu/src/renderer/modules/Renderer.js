const opts = {
    options : {
        type : 'null',
        css : {
            backgroundColor : 'rgba(0,0,0,0.1)'
        },
        position : { x : 0, y : 0, immediate : true },
        size : { width : 625, height: 400, immediate : true },
        animation : {
            before($el, $data){},
            after($el, $data){}            }
    },
    index : 0
}

export default {
    rendererDanmuFactory(opt){
        let renderer = '$ => {';
        const data = (function(){
            switch(opts.options.type){
                case 'null':
                    return '';
                case '':
                    return '';
            }
        })();
    }
}