export const test = `
# Markdown Parser

> *v0.1.0*  
> *제작* **kimson**  
> *기간* 2 일  
> *Markdown To HTML as JavaScript.*

# 파서 테스트

들여쓰기 단위 (default "4")
<select id="indent">
    <option value="4" selected>선택해주세요</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
</select>  
*실시간으로 변환 됩니다.*

<textarea cols="100" rows="10" class="md-list form-input mt-3" placeholder="테이블과 코드블럭은 작업 중 입니다."></textarea>
## MD To HTML
<div class="md-list converted">
## 블록 & 리스트 혼합 계층

> 현재 파서는 테이블 외 기능을 지원합니다.
    > 계층화도 지원합니다.
        1. 리스트 및 블록이 계층화 대상이 됩니다.
        2. 사용방법은 동일합니다.
    > 포함 범위와 단락을 나누는 기준은 기존의 마크다운과 조금씩 다를 수 있습니다.
> 파싱을 테스트하는 현재 텍스트는 js파일에 작성되어 있으며, 코드가 궁금하시다면 저장소의 코드를 확인 바랍니다.</div>

## Only MD

<div class="md-list origin">
</div>

===

\`단일 코드블럭 테스트\`혼용 테스트  
자바스크립트 코드블럭 테스트

\`\`\`javascript
var test = vart;
let wow = ['aqwe', 123]; // qwe

for(let i = 0; i < 5; i++;){
    console.log(i);
}

function test(a){
    const test = ["a","b"]; // qe
    if(test){
        return qwe;
    }
    return 123;
}
/* qweqwe */

/**
 * test
 * /

let test = (a) => {
    console.log(123);
}
\`\`\`

===

## 헤딩은 기존의 마크다운과 동일한 방식입니다.

### h3

#### h4

##### h5

###### h6

## html 태그 혼용

<div>그냥 혼용해서 사용하시면 됩니다.</div>

## 블록 & 리스트 혼합 계층

> 현재 파서는 테이블 외 기능을 지원합니다.
    > 계층화도 지원합니다.
        1. 리스트 및 블록이 계층화 대상이 됩니다.
        2. 사용방법은 동일합니다.
    > 포함 범위와 단락을 나누는 기준은 기존의 마크다운과 조금씩 다를 수 있습니다.
> 파싱을 테스트하는 현재 텍스트는 js파일에 작성되어 있으며, 코드가 궁금하시다면 저장소의 코드를 확인 바랍니다.

## 계층 리스트

1. 리스트화
    1. 들여쓰거나
2. 당겨 쓰거나
        - 순서가 없는 리스트를 더 들여써도 인식됩니다.
    - 다시 중간으로 당겨 리스트를 만들 수도 있습니다.
3. 기존의 마크다운과 동일한 점은 띄어쓰기 세번이면 줄바꿈이 됩니다.
4. 그리고 단락 변경 또한 줄바꿈 두번으로 단락을 나눌 수 있습니다.

- 이렇게하면 단락이 나누어 집니다.
- 엔터 두 번 내려썼습니다.

## 볼드체 & 이태릭체

*볼드체*

**이태릭**

***이태릭 볼드체***

## 파라그래프

Lorem ipsum dolor sit amet *consectetur adipisicing elit.* Ipsa ex, similique reprehenderit illum ullam veniam quis *quaerat* voluptatibus, voluptatum magni dolorem ad numquam quod dignissimos! Quas nostrum earum *voluptate recusandae?*

## 이미지 & 리스트 이미지

![테스트 이미지](https://picsum.photos/seed/picsum/1200/900 'lorme picsum')

- ![테스트 이미지](https://picsum.photos/seed/picsum/1200/900 'lorme picsum')

## 링크 & 리스트 링크

[Markdown Parser 저장소](https://github.com/kkn1125/markdown-parser)

- [Markdown Parser 저장소](https://github.com/kkn1125/markdown-parser)

## 할 일 목록

- [] 나무 심기
    - [x] 다육이 물 주기

1. 코딩테스트 보기 [x]
2. 계산기 만들기 []
    1. 토이프로젝트 코드 리뷰 [x]
`