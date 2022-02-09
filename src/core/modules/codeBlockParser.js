export default (function(){
    function Parser(){
        let temp = [], block = [], convertedCode = [], langs, codes;

        this.init = function (code, lang){
            codes = code;
            langs = lang;

            return this.parseCode();
        }

        this.parseCode = function (){
            this.separateRow();
            this.types();
            this.variables();

            return convertedCode.map(code=>
                `<div class="token line">`
                +code.join(`<span class="token sp"> </span>`)
                +`</div>`).join(``);
        }

        this.separateRow = function (){
            block = codes.split(/\n/gm).map(code=>{
                return code.split(/\s/gm);
            });

            convertedCode = block.slice.call([]);
            temp = [...block];
        }

        this.types = function (){
            block.forEach((line,id)=>{
                line.forEach((code, idx)=>{
                    if(convertedCode[id]==undefined) convertedCode[id] = [];
                    if(code.match(/(var|let|const|function|async|class)/g)){
                        convertedCode[id][idx] = `<span class="token t">${code}</span>`;
                        block[id][idx] = '';
                    }
                });
            });
        }

        this.variables = function (){
            block.forEach((line,id)=>{
                line.forEach((code, idx)=>{
                    if(convertedCode[id]==undefined) convertedCode[id] = [];
                    
                    if(code.match(/\=|\-|\>|\<|\+|\*|\/|\/|\||\?/g)){
                        convertedCode[id][idx] = `<span class="token sign">${code}</span>`;
                    } else {
                        if(code.match(/\;/g)){
                            if(isNaN(code.replace(';',''))){
                                if(code.match(/\[|\]/g)){
                                    if(code.match(/\[(.+)\]/g)){
                                        convertedCode[id][idx] = `<span class="token braket">[</span>`+code.replace(/[\;\[\]]+/g,'').split(',').map(x=>{
                                            if(x.match(/\'|\"|\`/g)){
                                                return `<span class="token str">${x.trim()}</span>`;
                                            } else {
                                                return `<span class="token v">${x.trim()}</span>`;
                                            }
                                        }).join('<span class="token comma">,</span>') + `<span class="token braket">]</span><span class="token sc">;</span>`;
                                    } else {
                                        convertedCode[id][idx] = code.replace(/[\;\[\]]+/g,'').split(',').map(x=>{
                                            if(x.match(/\'|\"|\`/g)){
                                                return `<span class="token str">${x.trim()}</span>`;
                                            } else {
                                                return `<span class="token v">${x.trim()}</span>`;
                                            }
                                        }).join('<span class="token comma">,</span>') + `<span class="token braket">]</span><span class="token sc">;</span>`;
                                    }
                                } else {
                                    convertedCode[id][idx] = `<span class="token v">${code.replace(';','')}</span><span class="token sc">;</span>`;
                                }
                            } else {
                                convertedCode[id][idx] = `<span class="token n">${code.replace(';','')}</span><span class="token sc">;</span>`;
                            }
                        } else {
                            if(code!=''){
                                if(isNaN(code)){
                                    if(code.match(/\[|\]/g)){
                                        if(code.match(/\]/g)){
                                            convertedCode[id][idx] = code.replace(/[\;\[\]]+/g,'').split(',').map(x=>{
                                                if(x.match(/\'|\"|\`/g)){
                                                    return `<span class="token str">${x.trim()}</span>`;
                                                } else {
                                                    return `<span class="token v">${x.trim()}</span>`;
                                                }
                                            }).join('<span class="token comma">,</span>') + `<span class="token braket">]</span>`;
                                        } else if(code.match(/\[/g)){
                                            convertedCode[id][idx] = `<span class="token braket">[</span>` + code.replace(/[\;\[\]]+/g,'').split(',').map(x=>{
                                                if(x!='') {
                                                    if(x.match(/\'|\"|\`/g)){
                                                        return `<span class="token str">${x.trim()}</span>`;
                                                    } else {
                                                        return `<span class="token v">${x.trim()}</span>`;
                                                    }
                                                }
                                            }).join('<span class="token comma">,</span>');
                                        } else {
                                            convertedCode[id][idx] = `<span class="token braket">[</span>`+code.replace(/[\;\[\]]+/g,'').split(',').map(x=>{
                                                if(x.match(/\'|\"|\`/g)){
                                                    return `<span class="token str">${x.trim()}</span>`;
                                                } else {
                                                    return `<span class="token v">${x.trim()}</span>`;
                                                }
                                            }).join('<span class="token comma">,</span>') + `<span class="token braket">]</span>`;
                                        }
                                    } else if(code.match(/return|await|static/g)){
                                        convertedCode[id][idx] = `<span class="token sign">${code}</span>`;
                                    } else {
                                        if(code.match(/\W+/g)){
                                            if(code.match(/if|while|do/g)){
                                                code = code.replace(/if|while|do/g, `<span class="token sign">$&</span>`);
                                            } else {
                                                code = code.replace(/[^\(][\w\$\_\-ㄱ-힣\d]+/g, `<span class="token fn">$&</span>`);
                                            }

                                            code = code.replace(/\(([\s\S]+?)\)/g, `(<span class="token params">$1</span>)`);

                                            convertedCode[id][idx] = code.replace(/\(|\)|\{|\}/g, `<span class="token braket">$&</span>`);
                                        } else {
                                            convertedCode[id][idx] = `<span class="token v">${code}</span>`;
                                        }
                                    }
                                } else {
                                    convertedCode[id][idx] = `<span class="token n">${code}</span>`;
                                }
                            }
                        }
                    }

                    block[id][idx] = '';
                });
            });
        }
    }

    return {
        parse(code, lang){
            const parser = new Parser();
            return parser.init(code, lang);
        }
    }
})();