'use strict';

export const horizontal = function (block, convertedHTML, options){
    block.forEach((line, id)=>{
        if(line.match(/(\-{3,}|\*{3,}|\={3,})/gm)){
            convertedHTML[id] = line.replace(/^(\-{3,}|\={3,}|\*{3,})(?=\s*)$/gm, (a,$1,$2)=>{
                return `<hr class="hr">`
            });
            block[id] = '';
        }
    });
}

export const heading = function (block, convertedHTML, options){
    block.forEach((line, id)=>{
        if(line.match(/(\#+)/gm)){
            convertedHTML[id] = line.replace(/[\s\n]*(\#+)(.+)/gm, (a,$1,$2)=>{
                let count = $1.split('').length;
                return `<h${count}${options.h?` class="h${count}"`:''}>${$2.replace(/^[\s]*/g, '')}</h${count}>`
            });
            block[id] = '';
        }
    });
}

export const blockListify = function (block, convertedHTML, options){
    const array = [];
    const checkbox = (cb)=>{
        let ox = cb.match(/\[\s?(x?)\s?\]/);
        if(ox) return cb.replace(/\[\s?(x?)\s?\]/, `<input disabled type="checkbox"${ox[1]?` checked="true"`:``}>`);
        else return cb;
    }
    let indent = 0, before = -1;
    
    block.forEach((line, id)=>{
        if(line.match(/^\s*\>\s/gm) || line.match(/^\s*\-/gm) || line.match(/^\s*[0-9]+\./gm)){
            convertedHTML[id] = line.split(/\n/gm).filter(x=>x!='').map(li=>{
                let temp = '';
                let space = li.match(/(^\s*)/)[1];
                
                indent = space.length;

                if(indent>before){
                    let gap = 0;
                    if(indent > 0 && before == -1){
                        gap = parseInt(indent/(options.indent||4)) + 1;
                    } else {
                        gap = parseInt((indent - before)/(options.indent||4))+(before>-1?0:1);
                    }
                    for(let i=0; i<gap; i++){
                        if(li.match(/^\s*\-/gm)){
                            array.push('ul');
                        }
                        if(li.match(/^\s*[0-9]+\./gm)){
                            array.push('ol');
                        }
                        if(li.match(/^\s*\>\s/gm)){
                            array.push('blockquote');
                        }
                        temp += `<${array[array.length-1]} class="${options[array[array.length-1]]}">`;
                    }
                } else if(indent < before){
                    let gap = parseInt((before - indent)/(options.indent||4));
                    for(let i=0; i<gap; i++){
                        temp += `</${array.pop()}>`;
                    }
                }

                if(li.match(/^\s*\>\s.+/g)){
                    temp += `${checkbox(li.replace(/^\s*\>\s(.+)/gm, '$1'))}`;
                } else {
                    temp += `<li>${checkbox(li.replace(/^\s*[0-9]\.\s*(.+)/gm, '$1').replace(/^\s*\-\s*(.+)/gm, '$1'))}</li>`;
                }
                
                before = indent;
                return temp;
            }).join('\n');
            while(array.length>0){
                convertedHTML[id] += `</${array.pop()}>`;
            }
            block[id] = '';
        }
        indent = 0;
        before = -1;
        while(array.length>0){
            array.pop();
        }
    });
}

export const images = function(block, convertedHTML, options) {
    block.forEach((line, id)=>{
        if(line.match(/\!\[/gm)){
            const [a,$1,$2,$3] = line.match(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
            convertedHTML[id] = `<figure><img src="${$2}" alt="${$1}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}></figure>`;
            block[id] = '';
        }
    });
}

export const anchors = function(block, convertedHTML, options) {
    block.forEach((line, id)=>{
        if(line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm)){
            const [a,$1,$2,$3] = line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/m);
            convertedHTML[id] = `<a href="${$2}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>${$1}</a>`;
            block[id] = '';
        }
    });
}

export const paragraphs = function(block, convertedHTML, options) {
    block.forEach((line, id)=>{
        if(line!=''){
            convertedHTML[id] = `<p>${line}</p>`;
            // block[id] = '';
        }
    });
}