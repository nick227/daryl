

function getBgUrl(attr){
    var str = attr.toString();
    var s = "background-image:url('";
    var e = "')";
    var start = str.indexOf(s)+s.length;
    var end = str.indexOf(e);
    var diff = end-start;
    var url = str.substring(start, diff);
    return url;
}
function cleanPastDate(date){
    var res = date.replace(/Past/, '')
                    .replace(/'/g, '')
                    .replace("\n", '')
                    .replace("(", '')
                    .replace(")", '');
    return res.trim();
}
function stripHTML(str){
    if(str == null){return str;}
    return str.replace(/<(?:.|\n)*?>/gm, '')
              .replace(/'/g, '&apos;')
              .replace(/"/g, '&quot;')
              .trim();
}

module.exports = {
    getBgUrl:getBgUrl,
    cleanPastDate:cleanPastDate,
    stripHTML:stripHTML
};