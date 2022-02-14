/**
 * @author kimson
 * @since 2022. 02. 07
 * @license MITLicense
 * @description 아직 정리 중 입니다.  미비한 부분이 많습니다.
 */

import * as modules from './modules/package.js'
import codeBlockParser from './modules/codeBlockParser.js'

const Markdown = (function () {
    function Parser() {
        let options, markdown, block, temp, bundle;
        let convertedHTML = [];

        this.init = function (md, option) {
            markdown = md;
            options = option;

            this.parse();

            if(options.raw){
                return temp
            } else {
                let body = new DOMParser().parseFromString(convertedHTML.join(''), 'text/html').body
                body.querySelectorAll('.parse-code [lang="javascript"] .token.sc').forEach(el=>{
                    let prev = el.previousElementSibling;
                    if(prev.classList.contains('sp')) prev.remove();
                });

                return body.innerHTML;
            }
        }

        this.parse = function () {
            this.readBlockUnit();
            // this.raw();
            modules.horizontal(...bundle);
            modules.heading(...bundle);
            modules.blockListify(...bundle);
            modules.images(...bundle);
            modules.anchors(...bundle);
            modules.table(...bundle);
            modules.paragraphs(...bundle);
            this.br();
            this.italicBold();
            this.altImages();
            this.altAnchors();
        }

        this.readBlockUnit = function (){
            markdown = this.codeBlock(markdown);
            block = markdown.split(/\n{2,}/gm);
            temp = [...block];
            bundle = [block, convertedHTML, options];
        }

        this.raw = function (){
            block.forEach((line, id)=>{
                if(line.match(/\:raw([\s\S]+)\:endraw/gm)){
                    convertedHTML[id] = `<p>${line.match(/\:raw([\s\S]+)\:endraw/)[1]}</p>`;
                    block[id] = '';
                }
            });
        }

        this.codeBlock = function(md){
            if(md.match(/(\`+)([\s\S]+)(\`+)|(\~+)[^\s]([\s\S]+)[^\s](\~+)/gm)){
                return md.replace(/(\`+)([\w]+\n)?([\s\S]+?)(\`+)/gm, (a,dotted,lang,content)=>{
                    let count = dotted.split('').length;
                    let contents = codeBlockParser.parse(content.trim(), lang);
                    let lines = [...new DOMParser().parseFromString(contents, 'text/html').body.children];
                    let lcount = 1;
                    if(!lang && count<3){
                        return `<kbd>${content.trim()}</kbd>`;
                    } else {
                        return `<pre class="parse-code"><code class="number" lang="${lang.trim()}">${new Array(lines.length).fill(0).map((l,i)=>`<div class="token line">${lines[i].innerHTML==''?'':lcount++}</div>`).join('')}</code><code lang="${lang.trim()}">${contents}</code></pre>`;
                    }
                }).replace(/(\~+)[^\s]([\w]+\n)?([\s\S]+?)[^\s](\~+)/gm, (a,dotted,lang,content)=>{
                    let count = dotted.split('').length;
                    let contents = codeBlockParser.parse(content.trim(), lang);
                    let lines = [...new DOMParser().parseFromString(contents, 'text/html').body.children];
                    let lcount = 1;
                    if(!lang && count<3){
                        return `<kbd>${content}</kbd>`;
                    } else {
                        return `<pre class="parse-code"><code class="number" lang="${lang.trim()}">${new Array(lines.length).fill(0).map((l,i)=>`<div class="token line">${lines[i].innerHTML==''?'':lcount++}</div>`).join('')}</code><code lang="${lang.trim()}">${contents}</code></pre>`;
                    }
                });
            } else return md;
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

        this.altAnchors = function (){
            convertedHTML.forEach((line, id)=>{
                if(line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm)){
                    const [a,$1,$2,$3] = line.match(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/m);
                    convertedHTML[id] = convertedHTML[id].replace(/\[(.+)\]\(([A-z0-9\.\:\@\/\-\_ㄱ-힣]+)(\s.+)?\)/gm,`<a href="${$2}"${$3?` title="${$3.replace(/[\'\"]+/gm,'').trim()}"`:''}>${$1}</a>`);
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

        this.addClass = function (str){
            let classes;
            if(str.match(/\{\:(.+)\}/g)){
                classes = str.match(/\{\:(.+)\}/)[1];
                str = str.replace(/\{\:(.+)\}/g,'');

                return classes.split('.').filter(x=>x!='').join(' ');
            } else {
                return null;
            }
        }
    }

    return {
        parse(str, options) {
            const parser = new Parser();

            return parser.init(str, options);
        },
        test(str, options) {
            const parser = new Parser();
            return parser.init(str, options);
        }
    }
})();

window.Markdown = Markdown;