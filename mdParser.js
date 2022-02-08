/**
 * @author kimson
 * @since 2022. 02. 07
 * @license MITLicense
 * @description 아직 정리 중 입니다.  미비한 부분이 많습니다.
 */

import {test} from './markdown/test.js'

const Markdown = (function () {
    function Controller() {
        let models;

        this.init = function (model) {
            models = model;
        }
    }

    function Model() {
        let INDENT = 4;
        let views;
        let options;
        let md;
        let block;
        let temp;
        let convertedHTML = [];

        this.init = function (view, option) {
            views = view;
            options = option;

            if(options.hasOwnProperty('indent')) INDENT = options.indent;
            md = views.getMd();
            this.parse();
            if(options.raw){
                return views.renderView(convertedHTML.join(''), temp);
            } else {
                return views.renderView(temp, convertedHTML.join(''));
            }
            // return convertedHTML.join('');
        }

        this.parse = function () {
            this.readBlockUnit();
            // this.raw();
            this.heading();
            this.blockListify();
            this.images();
            this.anchors();
            this.paragraphs();
            this.br();
            this.italicBold();
            this.altImages();
            this.altAnchors();
        }

        this.readBlockUnit = function (){
            block = md.split(/\n{2,}/gm);
            temp = [...block];
        }

        this.raw = function (){
            block.forEach((line, id)=>{
                console.log(line)
                if(line.match(/\:raw([\s\S]+)\:endraw/gm)){
                    convertedHTML[id] = `<p>${line.match(/\:raw([\s\S]+)\:endraw/)[1]}</p>`;
                    block[id] = '';
                }
            });
        }

        this.heading = function (){
            block.forEach((line, id)=>{
                if(line.match(/(\#+)/gm)){
                    convertedHTML[id] = line.replace(/[\s\n]*(\#*)(.+)/gm, (a,$1,$2)=>{
                        let count = $1.split('').length;
                        return `<h${count}${options.h?` class="h${count}"`:''}>${$2.replace(/^[\s]*/g, '')}</h${count}>`
                    });
                    block[id] = '';
                }
            });
        }

        this.blockListify = function (){
            let indent = 0, before = -1;
            let array = [];

            block.forEach((line, id)=>{
                if(line.match(/^\s*\>\s/gm) || line.match(/^\s*\-/gm) || line.match(/^\s*[0-9]+\./gm)){
                    convertedHTML[id] = line.split(/\n/gm).filter(x=>x!='').map(li=>{
                        let temp = '';
                        let space = li.match(/(^\s*)/)[1];
                        
                        indent = space.length;

                        if(indent>before){
                            let gap = 0;
                            if(indent > 0 && before == -1){
                                gap = parseInt(indent/INDENT) + 1;
                            } else {
                                gap = parseInt((indent - before)/INDENT)+(before>-1?0:1);
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
                            let gap = parseInt((before - indent)/INDENT);
                            for(let i=0; i<gap; i++){
                                temp += `</${array.pop()}>`;
                            }
                        }

                        if(li.match(/^\s*\>\s.+/g)){
                            temp += `${this.checkbox(li.replace(/^\s*\>\s(.+)/gm, '$1'))}`;
                        } else {
                            temp += `<li>${this.checkbox(li.replace(/^\s*[0-9]\.\s*(.+)/gm, '$1').replace(/^\s*\-\s*(.+)/gm, '$1'))}</li>`;
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
                array = [];
            });
        }

        this.checkbox = function(str){
            let ox = str.match(/\[\s?(x?)\s?\]/);
            if(ox) return str.replace(/\[\s?(x?)\s?\]/, `<input disabled type="checkbox"${ox[1]?` checked="true"`:``}>`);
            else return str;
        }

        this.images = function (){
            block.forEach((line, id)=>{
                if(line.match(/\!\[/gm)){
                    const [a,$1,$2,$3] = line.match(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
                    convertedHTML[id] = `<figure><img src="${$2}" alt="${$1}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}></figure>`;
                    block[id] = '';
                }
            });
        }

        this.altImages = function (){
            convertedHTML.forEach((line, id)=>{
                if(line.match(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm)){
                    const [a,$1,$2,$3] = line.match(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
                    convertedHTML[id] = convertedHTML[id].replace(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm, `<figure><img src="${$2}" alt="${$1}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}></figure>`);
                    // block[id] = '';
                }
            });
        }

        this.anchors = function (){
            block.forEach((line, id)=>{
                if(line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm)){
                    const [a,$1,$2,$3] = line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/m);
                    convertedHTML[id] = `<a href="${$2}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>${$1}</a>`;
                    block[id] = '';
                }
            });
        }

        this.altAnchors = function (){
            convertedHTML.forEach((line, id)=>{
                if(line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm)){
                    const [a,$1,$2,$3] = line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/m);
                    convertedHTML[id] = convertedHTML[id].replace(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm,`<a href="${$2}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>${$1}</a>`);
                    // block[id] = '';
                }
            });
        }

        this.paragraphs = function (){
            block.forEach((line, id)=>{
                if(line!=''){
                    convertedHTML[id] = `<p>${line}</p>`;
                    // block[id] = '';
                }
            });
        }

        this.br = function (){
            convertedHTML = convertedHTML.map(x=>{
                return x.replace(/\s{3,}/gm, '<br>');
            });
        }

        this.italicBold = function (){
            convertedHTML = convertedHTML.map(x=>{
                if(/(\*+)([\s\S]+?)\*+/g)
                return x.replace(/(\*{1,3})([\s\S]+?)\*{1,3}/g, (a,$1,$2)=>{
                    return `${$1.length==2?`<em>`:`<b>${$1.length==3?`<em>`:``}`}${$2}${$1.length!=2?`</b>${$1.length==3?`</em>`:``}`:`</em>`}`
                });
                else return x;
            });
        }
    }

    function View() {
        let parts;

        this.init = function (part) {
            parts = part;
        }

        this.getMd = function () {
            return parts;
        }

        this.renderView = function (md, convertedHTML) {
            return convertedHTML;
        }
    }
    return {
        parse(str, options) {
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(str);
            let a = model.init(view, options);
            controller.init(model);
            return a;
        },
        parsed(str, options) {
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(str);
            let a = model.init(view, options);
            controller.init(model);
            return a;
        }
    }
})();

document.querySelector('main').innerHTML = Markdown.parse(test, {
    ol: 'list-group reset',
    ul: 'list-group reset',
    li: 'list-item',
    blockquote: 'blockquote blockquote-info',
    h: false,
    indent: 4,
});

document.querySelector('textarea.md-list').value = `## 블록 & 리스트 혼합 계층

> 현재 파서는 테이블 외 기능을 지원합니다.
    > 계층화도 지원합니다.
        1. 리스트 및 블록이 계층화 대상이 됩니다.
        2. 사용방법은 동일합니다.
    > 포함 범위와 단락을 나누는 기준은 기존의 마크다운과 조금씩 다를 수 있습니다.
> 파싱을 테스트하는 현재 텍스트는 js파일에 작성되어 있으며, 코드가 궁금하시다면 저장소의 코드를 확인 바랍니다.`;

document.querySelector('div.origin').innerHTML = `
## 블록 & 리스트 혼합 계층

> 현재 파서는 테이블 외 기능을 지원합니다.
    > 계층화도 지원합니다.
        1. 리스트 및 블록이 계층화 대상이 됩니다.
        2. 사용방법은 동일합니다.
    > 포함 범위와 단락을 나누는 기준은 기존의 마크다운과 조금씩 다를 수 있습니다.
> 파싱을 테스트하는 현재 텍스트는 js파일에 작성되어 있으며, 코드가 궁금하시다면 저장소의 코드를 확인 바랍니다.`

let optionIndent = 4;

document.querySelector('#indent').addEventListener('change', (ev)=>{
    const sel = ev.target.value;
    optionIndent = parseInt(sel);
    document.querySelector('div.md-list').innerHTML = '';
    document.querySelector('div.md-list').innerHTML = Markdown.parsed(document.querySelector('textarea.md-list').value||'Markdown Test', {
        ol: 'list-group reset',
        ul: 'list-group reset',
        li: 'list-item',
        blockquote: 'blockquote blockquote-info',
        h: false,
        indent: optionIndent,
    });
})

window.addEventListener('keyup', (ev)=>{
    const target = ev.target;
    document.querySelector('div.md-list').innerHTML = '';
    document.querySelector('div.converted').innerHTML = Markdown.parsed(document.querySelector('textarea.md-list').value||'Markdown Test', {
        ol: 'list-group reset',
        ul: 'list-group reset',
        li: 'list-item',
        blockquote: 'blockquote blockquote-info',
        h: false,
        indent: optionIndent,
        raw: false,
    });
    
    document.querySelector('div.origin').innerHTML = Markdown.parsed(document.querySelector('textarea.md-list').value||'Markdown Test', {
        ol: 'list-group reset',
        ul: 'list-group reset',
        li: 'list-item',
        blockquote: 'blockquote blockquote-info',
        h: false,
        indent: optionIndent,
        raw: true,
    });
});