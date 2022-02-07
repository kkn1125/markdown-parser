// fetch('./markdown/test.md').then(data => {
//     return data.text();
// }).then(data => {
//     Markdown.parse(data);
// })

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
        let md;
        let block;
        let temp;
        let convertedHTML = [];

        this.init = function (view) {
            views = view;
            md = views.getMd();
            this.parse();
            views.renderView(temp, convertedHTML.join(''));
        }

        this.parse = function () {
            this.readBlockUnit();
            this.heading();
            this.unOrderedList();
            this.orderedList();
            this.blockquote();
            this.images();
            this.anchors();
        }

        this.readBlockUnit = function (){
            block = md.split(/\n{2,}/gm);
            temp = [...block];
        }

        this.heading = function (){
            block.forEach((line, id)=>{
                if(line.match(/(\#+)/gm)){
                    convertedHTML[id] = line.replace(/[\s\n]*(\#*)(.+)/gm, (a,$1,$2)=>{
                        let count = $1.split('').length;
                        return `<h${count}>${$2.replace(/[\s]*/g, '')}</h${count}>`
                    });
                    block[id] = '';
                }
            });
        }

        this.unOrderedList = function (){
            let indent = 0, before = -1;
            let count = 0;
            block.forEach((line, id)=>{
                if(line.match(/\s*\-/gm)){
                    convertedHTML[id] = line.split(/\n/gm).filter(x=>x!='').map(x=>{
                        let temp = '';
                        let space = x.match(/(^\s*)/gm)[0];
                        indent = space.length;
                        
                        if(indent > before){
                            count++;
                            temp += `<ul>`;
                        } else if(indent == before) {

                        } else {
                            temp += '</ul>';
                            count--;
                        }

                        if(indent<before){
                            temp += `</ul><ul>`
                        }
                        
                        temp += `<li>${x.replace(/\s*\-\s*/gm, '')}</li>`

                        before = indent;
                        return temp;
                    }).join('\n');
                    convertedHTML[id] += '</ul>'.repeat(count);
                }
                indent = 0;
                before = -1;
                count = 0;
            });
        }

        this.orderedList = function (){
            let indent = 0, before = -1;
            let count = 0;
            block.forEach((line, id)=>{
                if(line.match(/\s*[0-9]+\./gm)){
                    convertedHTML[id] = line.split(/\n/gm).map(x=>{
                        let temp = '';
                        let space = x.match(/(^\s*)/gm)[0];
                        indent = space.length;
                        
                        if(indent > before){
                            count++;
                            temp += `<ol>`;
                        } else if(indent == before) {

                        } else {
                            temp += '</ol>';
                            count--;
                        }

                        if(indent<before){
                            temp += `</ol><ol>`;
                        }
                        
                        temp += `<li>${x.replace(/\s*[0-9]\.\s*/gm, '')}</li>`;

                        before = indent;
                        return temp;
                    }).join('\n');
                    convertedHTML[id] += '</ol>'.repeat(count);
                }
                indent = 0;
                before = -1;
                count = 0;
            });
        }

        this.blockquote = function (){
            let indent = 0, before = -1;
            let count = 0;
            block.forEach((line, id)=>{
                if(line.match(/\s*\>\s/gm)){
                    convertedHTML[id] = line.split(/\n/gm).map(x=>{
                        let temp = '';
                        let space = x.match(/(^\s*)/gm)[0];
                        indent = space.length;
                        
                        if(indent > before){
                            count++;
                            temp += `<blockquote>`;
                        } else if(indent == before) {

                        } else {
                            temp += '</blockquote>';
                            count--;
                        }

                        if(indent<before){
                            temp += `</blockquote><blockquote>`;
                        }
                        
                        temp += `${x.replace(/\s*\>\s/gm, '')}`;

                        before = indent;
                        return temp;
                    }).join('\n');
                    convertedHTML[id] += '</blockquote>'.repeat(count);
                }
                indent = 0;
                before = -1;
                count = 0;
            });
        }

        this.images = function (){
            block.forEach((line, id)=>{
                if(line.match(/^\!\[/gm)){
                    const [a,$1,$2,$3] = line.match(/\!\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
                    convertedHTML[id] = `<img src="${$2}" alt="${$1}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>`
                }
            });
        }

        this.anchors = function (){
            block.forEach((line, id)=>{
                if(line.match(/^\!\[/gm)){
                    const [a,$1,$2,$3] = line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/);
                    convertedHTML[id] = `<a href="${$2}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>${$1}</a>`
                }
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
        parse(str) {
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(str);
            model.init(view);
            controller.init(model);
        }
    }
})();

Markdown.parse(test);