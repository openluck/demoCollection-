export function formatHtml (html) {
    //var regex0 = new RegExp("(i?)(\<img)([^\>]+\>)","gmi");
    //正则匹配不含style="" 或 style='' 的img标签
    var regex1 = new RegExp("(i?)(\<img)(?!(.*?style=['\"](.*)['\"])[^\>]+\>)","gmi");
    //给不含style="" 或 style='' 的img标签加上style=""
    html = html.replace(regex1, "$2 style=\"\"$3");
    //正则匹配含有style的img标签
    var regex2 = new RegExp("(i?)(\<img.*?style=['\"])([^\>]+\>)","gmi");
    //在img标签的style里面增加css样式(这里增加的样式：display:block;max-width:100%;height:auto;border:5px solid red;)
    html = html.replace(regex2, "$2display:block;max-width:100%;height:auto;$3");
    return html;

}


export function matchReg(str){
    let reg=/<\/?.+?\/?>/g;
    return str.replace(reg,'')
}


