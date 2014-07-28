<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

function print_arr($array)
{
	echo "<pre>";
	print_r($array);
	echo "</pre>";

}


$url_base = 'http://www.maniac-forum.de/forum/';
$url_threadlist = 'pxmboard.php?mode=threadlist&brdid=27';
$content_threadlist = file_get_contents($url_base . $url_threadlist);
file_put_contents('content/threadlist.html', $content_threadlist);

$arr_url_thread = array();
preg_match_all('/pxmboard.php\?mode=thread\&amp;brdid=27\&amp;thrdid=\d+/', $content_threadlist, $arr_url_thread);
$arr_url_thread = end($arr_url_thread);

#print_arr(htmlentities($content_threadlist));
#print_arr($arr_url_thread)

foreach ($arr_url_thread as $url_thread) {
	$url_thread = html_entity_decode($url_thread);
	echo $url_thread . "<br/>";
	$thrdid = str_replace('pxmboard.php?mode=thread&brdid=27&thrdid=', '', $url_thread);
	echo $thrdid . "<br/>";

	$content_thread = file_get_contents($url_base . $url_thread);
	#$content_thread = preg_replace('/css\/pxmboard.css/', '../../css/pxmboard.css', $content_thread);
	#$content_thread = preg_replace('/src="images\/arr_off.gif"/', 'src="../../images/arr_off.gif"', $content_thread);
	$content_thread = str_replace('<!--', '', $content_thread);
	$content_thread = str_replace('-->', '', $content_thread);

	file_put_contents('content/thread/' . $thrdid . '.html', $content_thread);

	echo "<hr/>";

	$arr_url_msg  = array();
	preg_match_all('/pxmboard.php\?mode=message(&amp;|&)brdid=27(&amp;|&)msgid=\d+/', $content_thread, $arr_url_msg);
	$arr_url_msg = $arr_url_msg[0];

	foreach ($arr_url_msg as $url_msg) {
		echo $url_msg . "<br/>";
		$url_msg = html_entity_decode($url_msg);
		$msgid  = str_replace('pxmboard.php?mode=message&brdid=27&msgid=', '', $url_msg);
		echo $msgid . "<br/>";

		$content_msg = file_get_contents($url_base . $url_msg);
		#$content_msg = preg_replace('/css\/pxmboard.css/', '../../css/pxmboard.css', $content_msg);
		$content_msg = preg_replace('/<img src="images\/flat.jpg" border="0" alt="flat">/', '', $content_msg);
		$content_msg = preg_replace('/pxmboard.php\?mode=userprofile/', $url_base . 'pxmboard.php?mode=userprofile', $content_msg);
		#$content_msg = preg_replace('/pxmboard.php\?mode=message&brdid=27&msgid=(\d+)/', 'content/msg/${1}.html', $content_msg);
		$content_msg = preg_replace('/document.write/', '//document.write', $content_msg);
		$content_msg = preg_replace('/<a href="pxmboard.php\?mode=messageform\&brdid=27\&msgid=' . $msgid . '"> antworten<\/a>/', '<s>antworten</s>', $content_msg);

		file_put_contents('content/msg/' . $msgid . '.html', $content_msg);
	}
	#return;
}
