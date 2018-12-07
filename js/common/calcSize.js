(function (doc, win) {
    //取得html的引用
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            clientWidth = (clientWidth > 640 )  ?  640 : clientWidth ;
            docEl.style.fontSize = 100 * (clientWidth / 640 ) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    recalc();

})(document, window);