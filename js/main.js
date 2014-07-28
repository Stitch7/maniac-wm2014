$(function($) {
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

    // pxmboard foo
    var $northContent = $('<div/>').addClass('content');
    var $southContent = $('<div/>').addClass('content');

    $north.append($northContent);
    $south.append($southContent);

    var loadMsg = function (event, msgid) {
        event.preventDefault();
        $southContent.load("content/msg/" + msgid + ".html", {}, function () {
            $south.find("a").each(function () {
                var $a   = $(this);
                var href = $a.attr('href');     
                
                switch (true) {
                    case href.search(/^pxmboard.php\?mode=message&/) !== -1:
                        var msgid = href.replace("pxmboard.php?mode=message&brdid=27&msgid=", "");
                        $a.click(function (event) {
                            loadMsg(event, msgid);
                            cp('p' + msgid);

                            return false;
                        });
                        break;

                    case href.search(/pxmboard.php\?mode=userprofile&/) !== -1:
                        $a.attr("onmouseout", "").attr("onmouseover", "");
                        break;
                }
            });
        });
    };

    var loadThread = function (event, thrdid) {
        event.preventDefault();
        $center.load("content/thread/" + thrdid + ".html", {}, function () {
            $center.find("a").each(function () {
                var $a = $(this);
                $a.click(function (event) {
                    var msgid = /\d+/.exec($a.attr("onclick"))[0];
                    loadMsg(event, msgid);

                    return false;
                });
            });
        });
    };

    $northContent.load("content/threadlist.html", null, function () {

        var $header = $('#header');
        $($header.parents('table').find('tr').get(1)).remove();
        $header
            .removeAttr('valign').removeAttr('align')
            .append('<img style="float: left; margin-right: 10px;" src="images/trophy.png">')
            .append('<p style="margin: 0px; font-size: 16px;">man!ac WM-Forum 2014 Archiv</p>')
        ;

        $north.find("a[target='middle']").each(function () {
            var $a = $(this);
            $a.click(function (event) {
                var thrdid = $a.attr("href").replace("pxmboard.php?mode=thread&brdid=27&thrdid=", "");
                loadThread(event, thrdid);              

                return false;
            });
            
        });
        $north.find("a[target='bottom']").each(function () {
            var $a = $(this);

            $a.click(function (event) {
                var thrdid = /\d+/.exec($a.attr("onclick"))[0];
                var msgid  = $a.attr("href").replace("pxmboard.php?mode=message&brdid=27&msgid=", "");
                loadThread(event, thrdid);
                loadMsg(event, msgid);

                return false;
            });         
        });
    });
});
