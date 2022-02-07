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
        const INDENT = 4;
        let views;
        let options;
        let md;
        let block;
        let temp;
        let convertedHTML = [];

        this.init = function (view, option) {
            views = view;
            options = option;
            md = views.getMd();
            this.parse();
            views.renderView(temp, convertedHTML.join(''));
        }

        this.parse = function () {
            this.readBlockUnit();
            this.raw();
            this.heading();
            this.blockListify();
            this.images();
            this.anchors();
            this.paragraphs();
            this.br();
        }

        this.readBlockUnit = function (){
            block = md.split(/\n{2,}/gm);
            temp = [...block];
        }

        this.raw = function (){
            block.forEach((line, id)=>{
                if(line.match(/:raw([\s\S]+):rawend/gm)){
                    convertedHTML[id] = `<p>${line.match(/:raw([\s\S]+):rawend/)[1]}</p>`;
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
            let count = 0;
            let isDouble = 1;
            let tag = '';
            let array = [];

            block.forEach((line, id)=>{
                if(line.match(/\s*\>\s/gm) || line.match(/\s*\-/gm) || line.match(/\s*[0-9]+\./gm)){
                    convertedHTML[id] = line.split(/\n/gm).filter(x=>x!='').map(x=>{
                        let temp = '';
                        let space = x.match(/(^\s*)/gm)[0];
                        
                        indent = space.length;

                        if(indent>0 && before==-1){
                            isDouble++;
                        } else {
                            isDouble = 1;
                        }
                        
                        if(x.match(/^\s*\-/gm)){
                            tag = 'ul';
                            array.push(tag);
                            // tag = '';
                        }
                        if(x.match(/^\s*[0-9]+\./gm)){
                            tag = 'ol';
                            array.push(tag);
                            // tag = '';
                        }
                        if(x.match(/^\s*\>\s/gm)){
                            tag = 'blockquote';
                            array.push(tag);
                            // tag = '';
                        }

                        if(indent > before){
                            count++;
                            temp += `<${array[array.length-1]} ${options[tag]?`class="${options[tag]}"`:''}>`.repeat(isDouble);
                        } else if(indent == before) {

                        } else {
                            let gap = parseInt(before/indent);
                            for(let i=0;i<gap;i++){
                                temp += `</${array.pop()}>`;
                            }
                            temp += `<${array[array.length-1]} ${options[tag]?`class="${options[tag]}"`:''}>`;
                            count--;
                        }

                        
                        if(array[array.length-1] == 'blockquote'){
                            temp += `${this.checkbox(x.replace(/\s*\>\s/gm, ''))}`;
                        } else {
                            temp += `<li ${options.li?`class="${options.li}"`:''}>${this.checkbox(x.replace(/\s*[0-9]\.\s*/gm, '').replace(/\s*\-\s*/gm, ''))}</li>`;
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
                count = 0;
                array = [];
            });
        }

        // this.orderedList = function (){
        //     let indent = 0, before = -1;
        //     let count = 0;
        //     let isDouble = 1;
        //     block.forEach((line, id)=>{
        //         if(line.match(/\s*[0-9]+\./gm)){
        //             convertedHTML[id] = line.split(/\n/gm).map(x=>{
        //                 let temp = '';
        //                 let space = x.match(/(^\s*)/gm)[0];
                        
        //                 indent = space.length;

        //                 if(indent>0 && before==-1){
        //                     isDouble++;
        //                 } else {
        //                     isDouble = 1;
        //                 }
                        
        //                 if(indent > before){
        //                     count++;
        //                     temp += `<ol>`.repeat(isDouble);
        //                 } else if(indent == before) {

        //                 } else {
        //                     temp += '</ol>';
        //                     count--;
        //                 }

        //                 if(indent<before){
        //                     temp += `</ol><ol>`;
        //                 }
                        
        //                 temp += `<li>${this.checkbox(x.replace(/\s*[0-9]\.\s*/gm, ''))}</li>`;

        //                 before = indent;
        //                 isDouble = 1;
        //                 return temp;
        //             }).join('\n');
        //             convertedHTML[id] += '</ol>'.repeat(count+1);
        //             block[id] = '';
        //         }
        //         indent = 0;
        //         before = -1;
        //         count = 0;
        //     });
        // }

        this.checkbox = function(str){
            let ox = str.match(/\[\s?(x?)\s?\]/);
            if(ox) return str.replace(/\[\s?(x?)\s?\]/, `<input disabled type="checkbox"${ox[1]?` checked="true"`:``}>`);
            else return str;
        }

        // this.blockquote = function (){
        //     let indent = 0, before = -1;
        //     let count = 0;
        //     let isDouble = 1;
        //     block.forEach((line, id)=>{
        //         if(line.match(/\s*\>\s/gm)){
        //             convertedHTML[id] = line.split(/\n/gm).map(x=>{
        //                 let temp = '';
        //                 let space = x.match(/(^\s*)/gm)[0];
        //                 indent = space.length;

        //                 if(indent>0 && before==-1){
        //                     isDouble++;
        //                 } else {
        //                     isDouble = 1;
        //                 }
                        
        //                 if(indent > before){
        //                     count++;
        //                     temp += `<blockquote>`.repeat(isDouble);
        //                 } else if(indent == before) {

        //                 } else {
        //                     temp += '</blockquote>';
        //                     count--;
        //                 }

        //                 if(indent<before){
        //                     temp += `</blockquote><blockquote>`;
        //                 }
                        
        //                 temp += `${x.replace(/\s*\>\s/gm, '')}`;

        //                 before = indent;
        //                 return temp;
        //             }).join('\n');
        //             convertedHTML[id] += '</blockquote>'.repeat(count+1);
        //             block[id] = '';
        //         }
        //         indent = 0;
        //         before = -1;
        //         count = 0;
        //     });
        // }

        this.images = function (){
            block.forEach((line, id)=>{
                if(line.match(/^\!\[/gm)){
                    const [a,$1,$2,$3] = line.match(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
                    convertedHTML[id] = `<img src="${$2}" alt="${$1}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>`;
                    block[id] = '';
                }
            });
        }

        this.anchors = function (){
            block.forEach((line, id)=>{
                if(line.match(/^\!\[/gm)){
                    const [a,$1,$2,$3] = line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
                    convertedHTML[id] = `<a href="${$2}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>${$1}</a>`;
                    block[id] = '';
                }
            });
        }

        this.paragraphs = function (){
            block.forEach((line, id)=>{
                if(line!=''){
                    convertedHTML[id] = `<p>${line}</p>`;
                    block[id] = '';
                }
            });
        }

        this.br = function (){
            convertedHTML = convertedHTML.map(x=>{
                return x.replace(/\s{3,}/gm, '<br>');
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
            document.body.insertAdjacentHTML('beforeend', md.join('<br>'));
            document.body.insertAdjacentHTML('beforeend', convertedHTML);
        }
    }
    return {
        parse(str, options) {
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(str);
            model.init(view, options);
            controller.init(model);
        }
    }
})();

Markdown.parse(test, {
    ol: 'list-group reset',
    ul: 'list-group reset',
    li: 'list-item',
    blockquote: 'blockquote blockquote-info',
    h: true,
});