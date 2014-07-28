var request = null;
var target = null;
var url = null;

function createRequest() {
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (request != null) {
        var t = new Date().getTime();
        request.open("GET", url + "&t=" + t, true);
        request.onreadystatechange = readychange;
        request.send(null);

    }
    return
}

function readychange() {
    if (request.readyState == 4) {
        document.getElementById(target).innerHTML = request.responseText;
    }
}

function getText(filename) {
    url = filename;
    target = "NetworkIDs";
    createRequest();
}

function showLayer() {
    var layer = document.getElementById("NetworkIDs");
    layer.style.visibility = "visible";
}

function hideLayer() {
    var layer = document.getElementById("NetworkIDs");
    layer.style.visibility = "hidden";
}

function openProfile(url) {
    window.open(url, 'profile', 'width=600,height=600,scrolling=auto,scrollbars=1,resizable=1');
}

function changeFS(layout) {
    var x = parent.document.getElementById('boardFrameset');
    if (layout == '3f') {
        x.rows = "27%,*,55%";
        x.cols = "";
        x.innerHTML = '<frame src="pxmboard.php?mode=threadlist&brdid=1" name="top"/><frame src="pxmboard.php?mode=thread&brdid=1" name="middle"/><frame src="pxmboard.php?mode=message&brdid=1" name="bottom"/>';
    }
    else if (layout == "2f1f") {
        x.cols = "50%,50%";
        x.rows = "";
        x.innerHTML = '<frame src="pxmboard.php?mode=threadlist&brdid=1" name="top"/><frameset rows="50%,*"><frame src="pxmboard.php?mode=thread&brdid=1" name="middle"><frame src="pxmboard.php?mode=message&brdid=1" name="bottom"/></frameset>'
    }
    else if (layout == "1f2f") {
        x.cols = "50%,50%";
        x.rows = "";
        x.innerHTML = '<frameset rows="50%,*"><frame src="pxmboard.php?mode=thread&brdid=1" name="middle"><frame src="pxmboard.php?mode=message&brdid=1" name="bottom"/></frameset><frame src="pxmboard.php?mode=threadlist&brdid=1" name="top"/>'
    }
}

function checkImgWidth(img) {
    if (img.width > 750) {
        img.width = 750;
        img.addEventListener('dblclick', function() {
            var win = window.open(img.src, '_blank');
            win.focus();
        });
    }
}

function spoiler(obj) {
    if (obj.nextSibling.style.display === 'none') {
        obj.nextSibling.style.display = 'inline';
    }
    else {
        obj.nextSibling.style.display = 'none';
    }
}

function submitBoardSelect(brdid)
{
    $("[name=brdid]").val(brdid);
    $("[name=sort]").val( $("[name=sortorder]:checked").val() );
    $("#boardlistform").submit();
}