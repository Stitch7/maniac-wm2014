$(function($) {
    // Main page elements
    var $container = $('.layout');
    var $north     = $('.north');
    var $center    = $('.center');
    var $south     = $('.south');

    // jQuery Layout Inits
    function relayout() {
        $container.layout({resize: false});
    }
    relayout();

    $(window).resize(relayout);

    $north.resizable({
        handles: 's',
        stop: relayout
    });

    $south.resizable({
        handles: 'n',
        stop: relayout
    });


    // PXMBoard foo
    var curMsgid, curThrdid;

    var $northContent  = $('<div/>').addClass('content');
    var $centerContent = $('<div/>').addClass('content');
    var $southContent  = $('<div/>').addClass('content');

    $north.append($northContent);
    $center.append($centerContent);
    $south.append($southContent);

    var getQueryStringParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    var changeUrl = function (thrdid, msgid) {
        var url = [];
        
        if (msgid !== undefined) {
            url.push("thrdid=" + thrdid);
        }        
        if (msgid !== undefined) {
            url.push("msgid=" + msgid);
        }
        
        if (url.length > 0) {
            url = "?" + url.join("&");
            History.pushState(null, document.title, url);
        }
    };

    var loadMsg = function (msgid) {
        if (msgid === curMsgid) {
            return;
        }

        if (msgid.length === 0) {
            $southContent.empty();
        } else {
            $southContent.load("content/msg/" + msgid + ".html", {}, function () {
                curMsgid = msgid;
                if (typeof cp === "function") {
                    cp('p' + msgid);
                }
                $south.find("a").each(function () {
                    var $a   = $(this);
                    var href = $a.attr('href');     
                    
                    switch (true) {
                        case href.search(/^pxmboard.php\?mode=message&/) !== -1:
                            var msgid = href.replace("pxmboard.php?mode=message&brdid=27&msgid=", "");
                            $a.click(function (event) {
                                loadMsg(msgid);
                                changeUrl(getQueryStringParameterByName("thrdid"), msgid);
                                event.preventDefault();
                            });
                            break;

                        case href.search(/pxmboard.php\?mode=userprofile&/) !== -1:
                            $a.attr("onmouseout", "").attr("onmouseover", "");
                            break;
                    }
                });
            });
        }
    };

    var loadThread = function (thrdid) {
        if (thrdid === curThrdid) {
            return;
        }

        if (thrdid.length === 0) {
            $centerContent.empty();
        } else {
            $centerContent.load("content/thread/" + thrdid + ".html", {}, function () {
                curThrdid = thrdid;
                $centerContent.find("a").each(function () {
                    var $a = $(this);
                    $a.click(function (event) {
                        var msgid = /\d+/.exec($a.attr("onclick"))[0];
                        loadMsg(msgid);
                        changeUrl(thrdid, msgid);
                        event.preventDefault();
                    });
                });
            });
        }
    };

    var statechange = function () {
        loadThread(getQueryStringParameterByName("thrdid"));
        loadMsg(getQueryStringParameterByName("msgid"));
    };

    $northContent.load("content/threadlist.html", null, function () {
        var $header = $('#header');
        $($header.parents('table').find('tr').get(1)).remove();
        $header
            .removeAttr('valign').removeAttr('align')
            .append('<img style="float: left; margin-right: 10px;" src="images/trophy.png">')
            .append('<p style="margin: 0px; font-size: 16px;">' + document.title + '</p>')
        ;

        $north.find("a[target='middle']").each(function () {
            var $a = $(this);
            $a.click(function (event) {
                var thrdid = $a.attr("href").replace("pxmboard.php?mode=thread&brdid=27&thrdid=", "");
                loadThread(thrdid);             
                changeUrl(thrdid); 
                event.preventDefault();
            });
            
        });
        $north.find("a[target='bottom']").each(function () {
            var $a = $(this);
            $a.click(function (event) {
                var thrdid = /\d+/.exec($a.attr("onclick"))[0];
                var msgid  = $a.attr("href").replace("pxmboard.php?mode=message&brdid=27&msgid=", "");
                loadThread(thrdid);
                loadMsg(msgid);
                changeUrl(thrdid, msgid);
                event.preventDefault();
            });         
        });
    });

    History.Adapter.bind(window, "statechange", statechange);
    statechange();
});
