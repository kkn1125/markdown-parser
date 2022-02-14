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
                    if(code.match(/(var\b|let\b|const\b|function\b|async\b|class\b|for\b)/g)){
                        let temp = code.replace(/([\(\)])/g, `<span class="token braket">$1</span>`);
                        code = temp;
                        code.split(/\<\w+.+\/\w+\>/g).map((x,i)=>temp = temp.replace(x,`<span class="token sign">${x}</span>`));
                        convertedCode[id][idx] = temp;
                        block[id][idx] = '';
                    } else {
                        convertedCode[id][idx] = `<span class="token t">${code}</span>`;
                    }
                });
            });
        }

        this.variables = function (){
            block.forEach((line,id)=>{
                let comment = false;
                let wrapComment = false;
                line.forEach((code, idx)=>{
                    if(convertedCode[id]==undefined) convertedCode[id] = [];
                    
                    if(code.match(/\/\*{1,}[\s\S]+?\*{1,}\//g)){
                        convertedCode[id][idx] = `<span class="token comment">${code}</span>`;
                    } else {
                        if(code.match(/\/*\*{1,}\/*/g) || wrapComment){
                            wrapComment = true;
                            convertedCode[id][idx] = `<span class="token comment">${code.replace(/[\*]/gm, '&ast;')}</span>`;
                        } else if(code.match(/\/\*{1,}/g)) {
                            wrapComment = false;
                        } else {
                            if(code.match(/(\/{2})/gm) || comment){
                                comment = true;
                                convertedCode[id][idx] = `<span class="token comment">${code}</span>`;
                            } else {
                                if(comment){
                                    convertedCode[id][idx] = `<span class="token comment">${code}</span>`;
                                } else if(code == ''){
                                    comment = false;
                                } else {
                                    
                                    if(code.match(/\=|\-|\>|\<|\+|\*|\/|\||\?/g)){
                                        if(code.match(/([\)\{\}\;])/g)){
                                            let temp = code.replace(/([\)\{\}\;])/g, `<span class="token braket">$1</span>`);
                                            code = temp;
                                            code.split(/\<\w+.+\/\w+\>/g).map((x,i)=>temp = temp.replace(x,(z)=>{
                                                let w = z.slice(0,z.indexOf('+'));
                                                let s = z.slice(z.indexOf('+'));
                                                return `<span class="token v">${w}</span>`+`<span class="token sign">${s}</span>`;
                                            }));
                                            convertedCode[id][idx] = temp;
                                            block[id][idx] = '';
                                        } else {
                                            if(!code.match(/\/{2,}/g)){
                                                if(code.match(/\=\>/g)){
                                                    code = code.replace(/([\(\)\{\}])/g, `<span class="token braket">$1</span>`);
                                                    convertedCode[id][idx] = code.replace(/(\=\>)/g, `<span class="token t">$1</span>`);
                                                } else {
                                                    convertedCode[id][idx] = `<span class="token sign">${code}</span>`;
                                                }
                                            }
                                        }
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
                                                                if(isNaN(x))
                                                                return `<span class="token v">${x.trim()}</span>`;
                                                                else
                                                                return `<span class="token n">${x.trim()}</span>`;
                                                            }
                                                        }).join('<span class="token comma">,</span>') + `<span class="token braket">]</span><span class="token sc">;</span>`;
                                                    }
                                                } else {
                                                    if(code.match(/[\w]+\.?[\s\(\)\[\]]+\;?/g)){
                                                        convertedCode[id][idx] = code.split('.')
                                                        .map((token, i, a)=>{
                                                            if(a.length-1 == i) {
                                                                return token.match(/([\w\$\_\-0-9ㄱ-힣]+)(\(.+\))(\[.+\])?(\;)/).slice(1).filter(x=>x).map(x=>{
                                                                    if(!x.match(/[\(\;]/g)){
                                                                        return `<span class="token fn">${token.split('(').shift()}</span>`;
                                                                    } else if(x.match(/\;/g)){
                                                                        return `<span class="token sc">;</span>`
                                                                    } else {
                                                                        return x.replace(/\(([\s\S]+)?\)(\[[\s\S]+\])?/g, (a, $1, $2, $3)=>{
                                                                            return `<span class="token braket">(</span>`
                                                                            + ($1
                                                                            ?`<span class="token ${isNaN($1)?`v`:`n`}">${$1}</span>`
                                                                            :'')
                                                                            + `<span class="token braket">)</span>`
                                                                            + ($2
                                                                            ?`<span class="token braket">[</span>${$2.replace(/[\[\]]/g,'')==''?'':`<span>${$2.replace(/[\[\]]/g,'')}</span>`}<span class="token braket">]</span>`
                                                                            :``);
                                                                        })
                                                                    }
                                                                }).join('')
                                                            } else {
                                                                return `<span class="token subfn">${token}</span>`;
                                                            }
                                                        })
                                                        .join('<span class="token dot">.</span>');
        
                                                    } else {
                                                        if(code.match(/[\'\"]/g)){
                                                            convertedCode[id][idx] = `<span class="token str">${code.replace(';','')}</span><span class="token sc">;</span>`;
                                                        } else {
                                                            convertedCode[id][idx] = `<span class="token v">${code.replace(';','')}</span><span class="token sc">;</span>`;
                                                        }
                                                    }
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
                                                    } else if(code.match(/return\b|await\b|static\b/g)){
                                                        convertedCode[id][idx] = `<span class="token sign">${code}</span>`;
                                                    } else {
                                                        if(code.match(/\W+/g)){
                                                            if(code.match(/if|while|do/g)){
                                                                code = code.replace(/if\b|while\b|do\b/g, `<span class="token sign">$&</span>`);
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
        },
        test(code, lang){
            const parser = new Parser();
            return parser.init(code, lang);
        }
    }
})();