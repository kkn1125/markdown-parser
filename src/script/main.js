import {test} from './test.js'
import {Markdown} from '../core/mdParser.js'

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

    document.querySelector('div.converted').innerHTML = Markdown.test(document.querySelector("body > main > textarea").value||'Markdown Test', {
        ol: 'list-group reset',
        ul: 'list-group reset',
        li: 'list-item',
        blockquote: 'blockquote blockquote-info',
        h: false,
        indent: optionIndent,
        raw: false,
    });
    
    document.querySelector('div.origin').innerHTML = Markdown.test(document.querySelector('textarea.md-list').value||'Markdown Test', {
        ol: 'list-group reset',
        ul: 'list-group reset',
        li: 'list-item',
        blockquote: 'blockquote blockquote-info',
        h: false,
        indent: optionIndent,
        raw: true,
    });
});