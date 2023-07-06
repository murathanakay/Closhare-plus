<?php

/**
 * functions
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: functions.php UTF-8 , 21-Jun-2013 | 23:02:46 nwdo ε
 */

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

/**
 * Easy usage for global $_POST variable. Returns false if does not isset.
 * @example code post("variable_name")
 * @param string $var
 * @return boolean
 */
function post($var)
{

    if (isset($_POST[$var])) {
        return ($_POST[$var] ? $_POST[$var] : false);
    }

    return false;
}
/**
 * Easy usage for global $_GET variable. Returns false if does not isset.
 * @example code post("variable_name")
 * @param string $var
 * @return boolean
 */
function get($var)
{

    if (isset($_GET[$var])) {
        return ($_GET[$var] ? $_GET[$var] : false);
    }
    return false;
}

function debugASS()
{
    return CLO_DEBUG ? ('?' . time()) : '';
}
/**
 * Sanitize given string.
 * 
 * @param type $string
 * @param type $trim
 * @param type $intager
 * @param type $str
 * @return type string
 */
function sanitise($string, $trim = false, $intager = false, $str = false)
{
    $string = filter_var($string, FILTER_SANITIZE_STRING);
    $string = trim($string);
    $string = stripslashes($string);
    $string = strip_tags($string);
    $string = str_replace(array('‘', '’', '“', '”'), array("'", "'", '"', '"'), $string);

    if ($trim)
        $string = substr($string, 0, $trim);
    if ($intager)
        $string = preg_replace("/[^0-9\s]/", "", $string);
    if ($str)
        $string = preg_replace("/[^a-zA-Z\s]/", "", $string);

    return $string;
}
/**
 * Clear given string.
 * @param type $string
 * @param type $nowrap
 * @return type
 */
function clear($string, $nowrap = false)
{
    if ($nowrap) {
        $string = str_replace(array("\n", "\r", "\t"), '', $string);
    } else {
        $string = str_replace(array("\n", "\r", "\t"), ' ', $string);
    }
    $str = preg_replace('/>\s+/', '> ', $string);
    $str = preg_replace('/\s+</', ' <', $string);
    return $str;
}

/**
 * 
 * @param type $Arr
 * @param type $nested
 * @param type $val
 * @return int
 */
function countByKeyVal($Arr, $nested, $val)
{
    $count = 0;
    foreach ($Arr as $childs) {
        if ($childs[$nested] == $val) {
            $count++;
        }
    }
    return $count;
}
/**
 * Check if the given string is a valid email address or not.
 * @param type $email
 * @return boolean
 */
function isValidEmail($email)
{
    if (function_exists('filter_var')) {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else
            return false;
    } else
        return preg_match('/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/', $email);
}
/**
 * Redirect page to the given url. ( forces header code to be 302).
 * @param type $loc
 */
function redirectPage_to($loc)
{
    if (!headers_sent()) {
        header('Location: ' . $loc, TRUE, 302);
        exit;
    } else
        echo '<script type="text/javascript">';
    echo 'window.location.href="' . $loc . '";';
    echo '</script>';
    echo '<noscript>';
    echo '<meta http-equiv="refresh" content="0;url=' . $loc . '" />';
    echo '</noscript>';
}
/**
 * Close the current popup page and redirect parent page to the given url.
 * @param type $url
 */
function closeAndRedirect($url)
{
    print '<script language="javascript">' . ($url ? 'opener.location.href = "' . $url . '";' : '');
    print 'window.self.close(); </script>';
}
/**
 * Replace ### to li items inside ul tag
 * 
 * @param type $string
 * @return string
 */
function addLiItems($string)
{
    if (strpos($string, '###') !== false) {
        $string = '<ul>' . $string;
        $string = str_replace('###', '</li><li>', $string);
        $string .= '</ul>';
    }
    return $string;
}
/**
 * Create a valid url slug with the given phrase.
 * @param type $phrase
 * @param type $maxLength
 * @param type $cap
 * @return type
 */
function makeSlug($phrase, $maxLength = false, $cap = false)
{

    $old = array("þ", "Þ", "Ð", "ð", "Ý", "ý", "Ç", "ç", "Ö", "ö", "ğ", "Ğ", "ş", "Ş", "ü", "Ü", "ı", "İ", "/");
    $new = array("s", "s", "g", "g", "i", "i", "C", "c", "O", "o", "g", "G", "s", "S", "u", "U", "i", "I", "_");
    $result = str_replace($old, $new, $phrase);

    //another hard way
    $result = cleaner($result);

    $result = trim(preg_replace('!\_!', "", $result));

    $result = trim(preg_replace('!\#!', "", $result));
    $result = trim(preg_replace('!\,!', "", $result));

    $result = preg_replace('!\s+!', ' ', $result);

    if ($maxLength)
        $result = trim(substr($result, 0, $maxLength));
    $result = preg_replace("/\s/", "-", $result);

    $result = preg_replace('/[-]+/', '-', $result);

    if ($cap) {
        $result = mb_strtolower($result, "UTF-8");

        $result = mb_convert_case($result, MB_CASE_TITLE, "UTF-8");
    }
    return $result;
}
/**
 * Truncate string with the given lenght and from middle or/en of string option.
 * @param type $string
 * @param type $maxChars
 * @param type $fromend
 * @return type
 */
function trunc($string, $maxChars, $fromend = false)
{

    $textLength = mb_strlen($string, "UTF-8");
    if ($fromend) {
        $return = ($textLength > $maxChars) ? (mb_substr($string, 0, $maxChars, "UTF-8") . '...') : $string;
    } else {
        $return = ($textLength > $maxChars) ? mb_substr_replace($string, '...', floor($maxChars / 2), $textLength - $maxChars, "UTF-8") : $string;
    }

    return $return;
}
/**
 * Encrypt given string with sha1 and return first six characters of it.
 * @param type $string
 * @param type $length
 * @return type
 */
function return6charsha1($string, $length = false)
{
    $length = ($length ? (int) $length : 6);
    return substr(sha1($string), 0, 6);
}

/**
 * Choose between messages by the user level.( Administrator or client)
 * @global type $user
 * @todo This function will be more useful when json messages will be categorized by user level. ( Currently only a few functions use this )
 * @param type $msg
 * @return type
 */
function returnMsgbyUserlevel($msg)
{
    global $user;
    if ($user->isAdmin()) {
        return $msg[0];
    } else {
        return $msg[1];
    }
}

/**
 * Count records from DB with the given table,where and what values.
 * @deprecated since version 1.0.5
 * 
 * @global type $db
 * @param type $table
 * @param type $where
 * @param type $what
 * @param type $multi
 * @return type
 */
function countDataDB($table, $where = '', $what = '', $multi = false, $against = false, $bind = false)
{
    global $db;

    if ($against) {

        $q = "SELECT COUNT(*) as count FROM " . $table . " WHERE MATCH (" . $where . ") AGAINST ('" . $what . "*' IN BOOLEAN MODE)";
    } else {
        if ($multi) {
            $q = "SELECT COUNT(*) as count FROM " . $table . "  WHERE " . $multi . " LIMIT 1";
        } else {
            if (!empty($where) && isset($what)) {
                $q = "SELECT COUNT(*) as count FROM " . $table . "  WHERE " . $where . " = '" . $what . "' LIMIT 1";
            } else
                $q = "SELECT COUNT(*) as count FROM " . $table . " LIMIT 1";
        }
    }
    if (!empty($bind)) {
        $db->bindMore($bind);
    }
    $total = $db->row($q);

    return !empty($total) ? $total["count"] : $total;
}

/**
 * @deprecated since version 1.0.5
 * @param type $title
 * @return type
 */
function helpIcon($title, $size = false, $placement = false, $container = false, $class = false)
{
    return ' <i' . ($size ? ' style="font-size:' . $size . 'px"' : '') . ($placement ? ' data-placement="' . $placement . '"' : '') . ($container ? 'data-container="' . $container . '"' : false) . '" class="icon icon-question-circle curdef' . ($class ? (' ' . $class) : '') . '" rel="tip" title="' . htmlspecialchars($title) . '"></i>';
}
/**
 * @deprecated since version 1.0.5
 * @param type $title
 * @return type
 */
function infoIcon($title, $size = false, $placement = false, $container = false, $class = false)
{
    return ' <i' . ($size ? ' style="font-size:' . $size . 'px"' : '') . ($placement ? ' data-placement="' . $placement . '"' : '') . ' data-container="' . ($container ? $container : 'item') . '" class="icon icon-info-circle curdef' . ($class ? (' ' . $class) : '') . '" rel="tip" title="' . htmlspecialchars($title) . '"></i>';
}

function pl()
{
    return ' <i class="icon-puzzle-piece curdef" title="This feature will have more flexibilty in development process."></i> ';
}

/**
 * Check user for auth. it also tests it must be an admin or not.
 * @global type $core
 * @global type $user
 * @param type $admin
 */
function checkauth($admin = false)
{
    global $core, $user;
    if ($user->logged_in && $admin) {
        if (!$user->isAdmin()) {
            $core->jsonE['auth'] = 2;
            $core->jsonE['message'] = '<i class="icon-signin"></i><strong style="font-size:13px;"> You don\'t have right permissions to view this area<span id="countrd" class="ul" style="margin-left:10px;"></span></strong>';
            $user->logout();
            echo $core->returnJson();
            die();
        }
    } else {
        if (!$user->logged_in) {
            $core->jsonE['auth'] = 0;
            $core->jsonE['message'] = '<i class="icon-signin"></i><strong style="font-size:13px;"> You need to login to continue. Redirecting...<span id="countrd" class="ul" style="margin-left:10px;"></span></strong>';
            echo $core->returnJson();
            die();
        }
    }
}

/**
 * Creates or checks permission rights on the given path dir
 * @param type $dir
 */
function checkDir($dir)
{
    if (!is_dir($dir)) {
        echo "given path does not exist<br/>";
        $dirs = explode('/', $dir);
        $tempDir = $dirs[0];
        $check = false;

        for ($i = 1; $i < count($dirs); $i++) {
            echo " Checking " . $tempDir . "<br/>";
            if (is_writeable($tempDir)) {
                $check = true;
            } else {
                $error = $tempDir;
            }

            $tempDir .= '/' . $dirs[$i];
            if (!is_dir($tempDir)) {
                if ($check) {
                    echo " Creating " . $tempDir . "<br/>";
                    @mkdir($tempDir, 0755);
                    @chmod($tempDir, 0755);
                } else
                    echo " Not enough permissions";
            }
        }
    }
}

/**
 * Create an index.php file to the new created folders
 * 
 * @param type $times
 * @param type $path
 */
function createIndexFile($times, $path)
{
    global $core;
    $pathback = '';

    for ($i = 1; $i <= $times; $i++) {
        $pathback .= '../';
    }
    $init = $pathback . 'init.php';
    $date = date('d-M-Y');
    $time = date('H:s:i');
    $index = <<<EOF
<?php

/**
 * index
 * @package      Closhare $core->clo_version
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version \$Id: index.php UTF-8 , $date | $time nwdo ε / created automatically.
 */
define("_SECURE_PHP", true);
?>
<?php
include_once '$init';
redirectPage_to("$pathback");
?>
EOF;
    $indexFile = $path . '/' . 'index.php';
    if (!file_exists($indexFile)) {
        if (file_put_contents($path . '/' . 'index.php', $index)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * File is writable or not?
 * @param type $file
 * @return type
 */

function writable($file)
{
    clearstatcache();
    return is_writable($file);
}

/**
 * Check for chmod, return as numbers
 * 
 * @param type $path
 * @param type $chmod
 * @return type
 */
function checkChmod($path, $chmod = 0777)
{
    clearstatcache();
    return ($chmod === (fileperms($path) & 0777));
}
/**
 * Check for unix system file permissions
 * 
 * @param type $file
 * @param type $num
 * @return type
 */
function filePerm($file, $num = false)
{
    clearstatcache();
    $perms = fileperms($file);

    if (($perms & 0xC000) == 0xC000) {
        // Socket
        $info = 's';
    } elseif (($perms & 0xA000) == 0xA000) {
        // Symbolic Link
        $info = 'l';
    } elseif (($perms & 0x8000) == 0x8000) {
        // Regular
        $info = '-';
    } elseif (($perms & 0x6000) == 0x6000) {
        // Block special
        $info = 'b';
    } elseif (($perms & 0x4000) == 0x4000) {
        // Directory
        $info = 'd';
    } elseif (($perms & 0x2000) == 0x2000) {
        // Character special
        $info = 'c';
    } elseif (($perms & 0x1000) == 0x1000) {
        // FIFO pipe
        $info = 'p';
    } else {
        // Unknown
        $info = 'u';
    }

    // Owner
    $info .= (($perms & 0x0100) ? 'r' : '-');
    $info .= (($perms & 0x0080) ? 'w' : '-');
    $info .= (($perms & 0x0040) ?
        (($perms & 0x0800) ? 's' : 'x') : (($perms & 0x0800) ? 'S' : '-'));

    // Group
    $info .= (($perms & 0x0020) ? 'r' : '-');
    $info .= (($perms & 0x0010) ? 'w' : '-');
    $info .= (($perms & 0x0008) ?
        (($perms & 0x0400) ? 's' : 'x') : (($perms & 0x0400) ? 'S' : '-'));

    // World
    $info .= (($perms & 0x0004) ? 'r' : '-');
    $info .= (($perms & 0x0002) ? 'w' : '-');
    $info .= (($perms & 0x0001) ?
        (($perms & 0x0200) ? 't' : 'x') : (($perms & 0x0200) ? 'T' : '-'));

    clearstatcache();
    return $info . (($num) ? (' (' . (fileperms($file) & 0777) . ') ') : '');
}

/**
 * 
 * @param type $string
 * @return type
 */

function cleanerArr($inreverse = false)
{
    return array(
        "Ã€" => "A",
        "Ã�" => "A",
        "Ã‚" => "A",
        "Ãƒ" => "A",
        "Ã„" => "AE",
        "Ã…" => "A",
        "Ä€" => "A",
        "Ä‚" => "A",
        "Ä„" => "A",
        "Çž" => "A",
        "Ç " => "A",
        "Çº" => "A",
        "È€" => "A",
        "È‚" => "A",
        "È¦" => "A",
        "á¸€" => "A",
        "áº¢" => "A",
        "áº¤" => "A",
        "áº¦" => "A",
        "áº¨" => "A",
        "áºª" => "A",
        "áº¬" => "A",
        "áº®" => "A",
        "áº°" => "A",
        "áº²" => "A",
        "áº´" => "A",
        "áº¶" => "A",
        "Ã…" => "A",
        "Ã†" => "AE",
        "Ç¼" => "AE",
        "Ç¢" => "AE",
        "á¸‚" => "B",
        "Æ�" => "B",
        "á¸„" => "B",
        "á¸†" => "B",
        "Æ‚" => "B",
        "Æ„" => "B",
        "Ä†" => "C",
        "Äˆ" => "C",
        "ÄŠ" => "C",
        "ÄŒ" => "C",
        "Æ‡" => "C",
        "Ã‡" => "C",
        "á¸ˆ" => "C",
        "á¸Š" => "D",
        "ÆŠ" => "D",
        "á¸Œ" => "D",
        "á¸Ž" => "D",
        "á¸�" => "D",
        "á¸’" => "D",
        "ÄŽ" => "D",
        "Ä�" => "D",
        "Æ‰" => "D",
        "Ãˆ" => "E",
        "Ã‰" => "E",
        "ÃŠ" => "E",
        "áº¼" => "E",
        "Ä’" => "E",
        "Ä”" => "E",
        "Ä–" => "E",
        "Ã‹" => "E",
        "áºº" => "E",
        "Äš" => "E",
        "È„" => "E",
        "È†" => "E",
        "áº¸" => "E",
        "È¨" => "E",
        "Ä˜" => "E",
        "á¸˜" => "E",
        "á¸š" => "E",
        "á»€" => "E",
        "áº¾" => "E",
        "á»„" => "E",
        "á»‚" => "E",
        "á¸”" => "E",
        "á¸–" => "E",
        "á»†" => "E",
        "á¸œ" => "E",
        "ÆŽ" => "E",
        "Æ�" => "E",
        "á¸ž" => "F",
        "Æ‘" => "F",
        "Ç´" => "G",
        "Äœ" => "G",
        "á¸ " => "G",
        "Äž" => "G",
        "Ä " => "G",
        "Ç¦" => "G",
        "Æ“" => "G",
        "Ä¢" => "G",
        "Ç¤" => "G",
        "Ä¤" => "H",
        "á¸¢" => "H",
        "á¸¦" => "H",
        "Èž" => "H",
        "Ç¶" => "H",
        "á¸¤" => "H",
        "á¸¨" => "H",
        "á¸ª" => "H",
        "Ä¦" => "H",
        "ÃŒ" => "I",
        "Ã�" => "I",
        "ÃŽ" => "I",
        "Ä¨" => "I",
        "Äª" => "I",
        "Ä¬" => "I",
        "Ä°" => "I",
        "Ã�" => "I",
        "á»ˆ" => "I",
        "Ç�" => "I",
        "á»Š" => "I",
        "Ä®" => "I",
        "ÈŠ" => "I",
        "á¸¬" => "I",
        "á¸¬" => "I",
        "Æ—" => "I",
        "á¸®" => "I",
        "Ã¨" => "è",
        "Ä²" => "J",
        "Ä´" => "J",
        "á¸°" => "K",
        "Ç¨" => "K",
        "á¸´" => "K",
        "Æ˜" => "K",
        "á¸²" => "K",
        "Ä¶" => "K",
        "á¸º" => "L",
        "á¸¶" => "L",
        "á¸¶" => "L",
        "Ä»" => "L",
        "á¸¼" => "L",
        "Ä½" => "L",
        "Ä¿" => "L",
        "Å�" => "L",
        "á¸¸" => "L",
        "á¸¾" => "M",
        "á¹€" => "M",
        "á¹‚" => "M",
        "Æœ" => "M",
        "Ç¸" => "N",
        "Åƒ" => "N",
        "Ã‘" => "N",
        "á¹„" => "N",
        "Å‡" => "N",
        "ÅŠ" => "N",
        "Æ�" => "N",
        "á¹†" => "N",
        "Å…" => "N",
        "á¹Š" => "N",
        "á¹ˆ" => "N",
        "È " => "N",
        "Ã–" => "O",
        "Ã’" => "O",
        "Ã“" => "O",
        "Ã”" => "O",
        "Ã•" => "O",
        "ÅŒ" => "O",
        "ÅŽ" => "O",
        "ÈŒ" => "O",
        "ÈŽ" => "OE",
        "Æ " => "O",
        "Çª" => "O",
        "á»Œ" => "O",
        "ÆŸ" => "O",
        "Ã˜" => "OE",
        "á»’" => "O",
        "á»�" => "O",
        "á»–" => "O",
        "á»”" => "O",
        "È°" => "O",
        "Èª" => "O",
        "È¬" => "O",
        "á¹Œ" => "O",
        "á¹Ž" => "O",
        "á¹�" => "O",
        "á¹’" => "O",
        "á»œ" => "O",
        "á»š" => "O",
        "á» " => "O",
        "á»ž" => "O",
        "Ç¬" => "O",
        "á»˜" => "O",
        "Ç¾" => "OE",
        "Æ†" => "O",
        "Å’" => "OE",
        "á¹”" => "P",
        "á¹–" => "P",
        "Æ¤" => "P",
        "Å”" => "R",
        "á¹˜" => "R",
        "Å˜" => "R",
        "È�" => "R",
        "È’" => "R",
        "á¹š" => "R",
        "Å–" => "R",
        "á¹ž" => "R",
        "á¹œ" => "R",
        "Æ¦" => "R",
        "Åš" => "S",
        "Åœ" => "S",
        "á¹ " => "S",
        "Å " => "S",
        "á¹¢" => "S",
        "È˜" => "S",
        "Åž" => "S",
        "á¹¤" => "S",
        "á¹¦" => "S",
        "á¹¨" => "S",
        "á¹ª" => "T",
        "Å¤" => "T",
        "Æ¬" => "T",
        "Æ®" => "T",
        "á¹¬" => "T",
        "Èš" => "T",
        "Å¢" => "T",
        "á¹°" => "T",
        "á¹®" => "T",
        "Å¦" => "T",
        "Ã™" => "U",
        "Ãš" => "U",
        "Ã›" => "U",
        "Å¨" => "U",
        "Åª" => "U",
        "Å¬" => "U",
        "Ãœ" => "U",
        "á»¦" => "U",
        "Å®" => "U",
        "Å°" => "U",
        "Ç“" => "U",
        "È”" => "U",
        "È–" => "U",
        "Æ¯" => "U",
        "á»¤" => "U",
        "á¹²" => "U",
        "Å²" => "U",
        "á¹¶" => "U",
        "á¹´" => "U",
        "á¹¸" => "U",
        "á¹º" => "U",
        "Ç›" => "U",
        "Ç—" => "U",
        "Ç•" => "U",
        "Ç™" => "U",
        "á»ª" => "U",
        "á»¨" => "U",
        "á»®" => "U",
        "á»¬" => "U",
        "á»°" => "U",
        "á¹¼" => "V",
        "á¹¾" => "V",
        "Æ²" => "V",
        "áº€" => "W",
        "áº‚" => "W",
        "Å´" => "W",
        "áº†" => "W",
        "áº„" => "W",
        "áºˆ" => "W",
        "áºŠ" => "X",
        "áºŒ" => "X",
        "á»²" => "Y",
        "Ã�" => "Y",
        "Å¶" => "Y",
        "á»¸" => "Y",
        "È²" => "Y",
        "áºŽ" => "Y",
        "Å¸" => "Y",
        "á»¶" => "Y",
        "Æ³" => "Y",
        "á»´" => "Y",
        "Å¹" => "Z",
        "áº�" => "Z",
        "Å»" => "Z",
        "Å½" => "Z",
        "È¤" => "Z",
        "áº’" => "Z",
        "áº”" => "Z",
        "Æµ" => "Z",
        "Ã " => "a",
        "Ã¡" => "a",
        "Ã¢" => "a",
        "Ã£" => "a",
        "Ä�" => "a",
        "Äƒ" => "a",
        "È§" => "a",
        "Ã¤" => "ae",
        "áº£" => "a",
        "Ã¥" => "a",
        "ÇŽ" => "a",
        "È�" => "a",
        "Èƒ" => "a",
        "áº¡" => "a",
        "á¸�" => "a",
        "áºš" => "a",
        "áº§" => "a",
        "áº¥" => "a",
        "áº«" => "a",
        "áº©" => "a",
        "áº±" => "a",
        "áº¯" => "a",
        "áºµ" => "a",
        "áº³" => "a",
        "Ç¡" => "a",
        "ÇŸ" => "a",
        "Ç»" => "a",
        "áº­" => "a",
        "áº·" => "a",
        "Ç½" => "a",
        "á¸ƒ" => "b",
        "É“" => "b",
        "á¸…" => "b",
        "á¸‡" => "b",
        "Æ€" => "b",
        "Æƒ" => "b",
        "Æ…" => "b",
        "c" => "c",
        "Ä‡" => "c",
        "Ä‰" => "c",
        "Ä‹" => "c",
        "Ä�" => "c",
        "Æˆ" => "c",
        "Ã§" => "ç",
        "á¸‰" => "c",
        "á¸�" => "d",
        "á¸�" => "d",
        "á¸‘" => "d",
        "á¸“" => "d",
        "Ä�" => "d",
        "Ä‘" => "d",
        "ÆŒ" => "d",
        "È¡" => "d",
        "Ã¨" => "e",
        "Ã©" => "e",
        "Ãª" => "e",
        "áº½" => "e",
        "Ä“" => "e",
        "Ä•" => "e",
        "Ä—" => "e",
        "Ã«" => "e",
        "Ä›" => "e",
        "È…" => "e",
        "È‡" => "e",
        "áº¹" => "e",
        "È©" => "e",
        "Ä™" => "e",
        "á¸™" => "e",
        "á»�" => "e",
        "áº¿" => "e",
        "á»…" => "e",
        "á»ƒ" => "e",
        "á¸•" => "e",
        "á¸—" => "e",
        "á»‡" => "e",
        "á¸�" => "e",
        "Ç�" => "e",
        "É›" => "e",
        "á¸Ÿ" => "f",
        "Æ’" => "f",
        "Çµ" => "g",
        "Ä�" => "g",
        "á¸¡" => "g",
        "ÄŸ" => "g",
        "Ä¡" => "g",
        "Ç§" => "g",
        "É " => "g",
        "Ä£" => "g",
        "Ç¥" => "g",
        "Ä¥" => "h",
        "á¸£" => "h",
        "á¸§" => "h",
        "ÈŸ" => "h",
        "Æ•" => "h",
        "á¸¥" => "h",
        "á¸©" => "h",
        "á¸«" => "h",
        "áº–" => "h",
        "Ä§" => "h",
        "Ã¬" => "i",
        "Ã­" => "i",
        "Ã®" => "i",
        "Ä©" => "i",
        "Ä«" => "i",
        "Ä­" => "i",
        "Ä±" => "i",
        "Ã¯" => "i",
        "á»‰" => "i",
        "Ç�" => "i",
        "á»‹" => "i",
        "Ä¯" => "i",
        "È‰" => "i",
        "È‹" => "i",
        "á¸­" => "i",
        "É¨" => "i",
        "á¸¯" => "i",
        "Ä³" => "i",
        "Äµ" => "j",
        "Ç°" => "j",
        "á¸±" => "k",
        "Ç©" => "k",
        "á¸µ" => "k",
        "Æ™" => "k",
        "á¸³" => "k",
        "Ä·" => "k",
        "Äº" => "l",
        "á¸»" => "l",
        "á¸·" => "l",
        "Ä¼" => "l",
        "á¸½" => "l",
        "Ä¾" => "l",
        "Å€" => "l",
        "Å‚" => "l",
        "Æš" => "l",
        "á¸¹" => "l",
        "È´" => "l",
        "á¸¿" => "m",
        "á¹�" => "m",
        "á¹ƒ" => "m",
        "É¯" => "m",
        "Ç¹" => "n",
        "Å„" => "n",
        "Ã±" => "n",
        "á¹…" => "n",
        "Åˆ" => "n",
        "Å‹" => "n",
        "É²" => "n",
        "á¹‡" => "n",
        "Å†" => "n",
        "á¹‹" => "n",
        "á¹‰" => "n",
        "Å‰" => "n",
        "Æž" => "n",
        "Èµ" => "n",
        "Ã²" => "o",
        "Ã³" => "o",
        "Ã´" => "o",
        "Ãµ" => "o",
        "Å�" => "o",
        "Å�" => "o",
        "È¯" => "o",
        "Ã¶" => "oe",
        "á»�" => "o",
        "Å‘" => "o",
        "Ç’" => "o",
        "È�" => "o",
        "È�" => "o",
        "Æ¡" => "o",
        "Ç«" => "o",
        "á»�" => "o",
        "Éµ" => "o",
        "Ã¸" => "oe",
        "á»“" => "o",
        "á»‘" => "o",
        "á»—" => "o",
        "á»•" => "o",
        "È±" => "o",
        "È«" => "o",
        "È­" => "o",
        "á¹�" => "o",
        "á¹�" => "o",
        "á¹‘" => "o",
        "á¹“" => "o",
        "á»�" => "o",
        "á»›" => "o",
        "á»¡" => "o",
        "á»Ÿ" => "o",
        "á»£" => "o",
        "Ç­" => "o",
        "á»™" => "o",
        "Ç¿" => "o",
        "É”" => "o",
        "Å“" => "oe",
        "á¹•" => "p",
        "á¹—" => "p",
        "Æ¥" => "p",
        "Å•" => "p",
        "á¹™" => "p",
        "Å™" => "p",
        "È‘" => "p",
        "È“" => "p",
        "á¹›" => "p",
        "Å—" => "p",
        "á¹Ÿ" => "p",
        "á¹�" => "p",
        "Å›" => "s",
        "Å�" => "s",
        "á¹¡" => "s",
        "Å¡" => "s",
        "á¹£" => "s",
        "È™" => "s",
        "ÅŸ" => "s",
        "á¹¥" => "s",
        "á¹§" => "s",
        "á¹©" => "s",
        "ÃŸ" => "ss",
        "Å¿" => "t",
        "áº›" => "t",
        "á¹«" => "t",
        "áº—" => "t",
        "Å¥" => "t",
        "Æ­" => "t",
        "Êˆ" => "t",
        "Æ«" => "t",
        "á¹­" => "t",
        "È›" => "t",
        "Å£" => "t",
        "á¹±" => "t",
        "á¹¯" => "t",
        "Å§" => "t",
        "È¶" => "t",
        "Ã¹" => "u",
        "Ãº" => "u",
        "Ã»" => "u",
        "Å©" => "u",
        "Å«" => "u",
        "Å­" => "u",
        "Ã¼" => "u",
        "á»§" => "u",
        "Å¯" => "u",
        "Å±" => "u",
        "Ç”" => "u",
        "È•" => "u",
        "È—" => "u",
        "Æ°" => "u",
        "á»¥" => "u",
        "á¹³" => "u",
        "Å³" => "u",
        "á¹·" => "u",
        "á¹µ" => "u",
        "á¹¹" => "u",
        "á¹»" => "u",
        "Ç–" => "u",
        "Çœ" => "u",
        "Ç˜" => "u",
        "Ç–" => "u",
        "Çš" => "u",
        "á»«" => "u",
        "á»©" => "u",
        "á»¯" => "u",
        "á»­" => "u",
        "á»±" => "u",
        "á¹½" => "v",
        "á¹¿" => "u",
        "áº�" => "w",
        "áºƒ" => "w",
        "Åµ" => "w",
        "áº‡" => "w",
        "áº…" => "w",
        "áº˜" => "w",
        "áº‰" => "w",
        "áº‹" => "x",
        "áº�" => "x",
        "á»³" => "y",
        "Ã½" => "y",
        "Å·" => "y",
        "á»¹" => "y",
        "È³" => "y",
        "áº�" => "y",
        "Ã¿" => "y",
        "á»·" => "y",
        "áº™" => "y",
        "Æ´" => "y",
        "á»µ" => "y",
        "Åº" => "z",
        "áº‘" => "z",
        "Å¼" => "z",
        "Å¾" => "z",
        "È¥" => "z",
        "áº“" => "z",
        "áº•" => "z",
        "Æ¶" => "z",
        "/" => "-",
        "Ğ" => "G",
        "ğ" => "g",
        "ş" => "s",
        "Ş" => "S",
        "ı" => "i",
        "İ" => "I",
        "ü" => "u",
        "Ü" => "U",
        "ö" => "o",
        "Ö" => "O",
        "ç" => "c",
        "Ç" => "C",
        "ý" => "i",
        "Ý" => "I",
        "þ" => "s",
        "ð" => "g"
        //        "," => "-",
        //        "," => "-",
        //        ";" => "-",
        //        " " => "-"
    );
}

function replaceSpecialChars($string, $reverse = false)
{
    $chars = cleanerArr($reverse);
    $string = strtr($string, $chars);
    return $string;
}

function cleaner($string, $reverse = false)
{
    $chars = cleanerArr(false);
    $string = strtr($string, $chars);
    $string = preg_replace("/&([a-zA-Z])(uml|acute|grave|circ|tilde|ring),/", "", $string);
    //    $string = preg_replace("/[^a-zA-Z0-9_.- ]/", "", $string); 
    //$string = str_replace(array('---', '--'), '-', $string);
    //$string = str_replace(array('..','.'),'', $string);
    return $string;
}


function w1250_to_utf8($text)
{
    // map based on:
    // http://konfiguracja.c0.pl/iso02vscp1250en.html
    // http://konfiguracja.c0.pl/webpl/index_en.html#examp
    // http://www.htmlentities.com/html/entities/
    $map = array(
        chr(0x8A) => chr(0xA9),
        chr(0x8C) => chr(0xA6),
        chr(0x8D) => chr(0xAB),
        chr(0x8E) => chr(0xAE),
        chr(0x8F) => chr(0xAC),
        chr(0x9C) => chr(0xB6),
        chr(0x9D) => chr(0xBB),
        chr(0xA1) => chr(0xB7),
        chr(0xA5) => chr(0xA1),
        chr(0xBC) => chr(0xA5),
        chr(0x9F) => chr(0xBC),
        chr(0xB9) => chr(0xB1),
        chr(0x9A) => chr(0xB9),
        chr(0xBE) => chr(0xB5),
        chr(0x9E) => chr(0xBE),
        chr(0x80) => '&euro;',
        chr(0x82) => '&sbquo;',
        chr(0x84) => '&bdquo;',
        chr(0x85) => '&hellip;',
        chr(0x86) => '&dagger;',
        chr(0x87) => '&Dagger;',
        chr(0x89) => '&permil;',
        chr(0x8B) => '&lsaquo;',
        chr(0x91) => '&lsquo;',
        chr(0x92) => '&rsquo;',
        chr(0x93) => '&ldquo;',
        chr(0x94) => '&rdquo;',
        chr(0x95) => '&bull;',
        chr(0x96) => '&ndash;',
        chr(0x97) => '&mdash;',
        chr(0x99) => '&trade;',
        chr(0x9B) => '&rsquo;',
        chr(0xA6) => '&brvbar;',
        chr(0xA9) => '&copy;',
        chr(0xAB) => '&laquo;',
        chr(0xAE) => '&reg;',
        chr(0xB1) => '&plusmn;',
        chr(0xB5) => '&micro;',
        chr(0xB6) => '&para;',
        chr(0xB7) => '&middot;',
        chr(0xBB) => '&raquo;',
    );
    return html_entity_decode(mb_convert_encoding(strtr($text, $map), 'UTF-8', 'ISO-8859-9'), ENT_QUOTES, 'UTF-8');
}

if (function_exists('mb_substr_replace') === false) {

    function mb_substr_replace($string, $replacement, $start, $length = null, $encoding = null)
    {
        if (extension_loaded('mbstring') === true) {
            $string_length = (is_null($encoding) === true) ? mb_strlen($string) : mb_strlen($string, $encoding);

            if ($start < 0) {
                $start = max(0, $string_length + $start);
            } else if ($start > $string_length) {
                $start = $string_length;
            }

            if ($length < 0) {
                $length = max(0, $string_length - $start + $length);
            } else if ((is_null($length) === true) || ($length > $string_length)) {
                $length = $string_length;
            }

            if (($start + $length) > $string_length) {
                $length = $string_length - $start;
            }

            if (is_null($encoding) === true) {
                return mb_substr($string, 0, $start) . $replacement . mb_substr($string, $start + $length, $string_length - $start - $length);
            }

            return mb_substr($string, 0, $start, $encoding) . $replacement . mb_substr($string, $start + $length, $string_length - $start - $length, $encoding);
        }

        return (is_null($length) === true) ? substr_replace($string, $replacement, $start) : substr_replace($string, $replacement, $start, $length);
    }
}

if (!function_exists('mb_str_replace')) {

    function mb_str_replace($search, $replace, $subject, &$count = 0)
    {
        if (!is_array($subject)) {
            // Normalize $search and $replace so they are both arrays of the same length
            $searches = is_array($search) ? array_values($search) : array($search);
            $replacements = is_array($replace) ? array_values($replace) : array($replace);
            $replacements = array_pad($replacements, count($searches), '');

            foreach ($searches as $key => $search) {
                $parts = mb_split(preg_quote($search), $subject);
                $count += count($parts) - 1;
                $subject = implode($replacements[$key], $parts);
            }
        } else {
            // Call mb_str_replace for each subject in array, recursively
            foreach ($subject as $key => $value) {
                $subject[$key] = mb_str_replace($search, $replace, $value, $count);
            }
        }

        return $subject;
    }
}

if (!function_exists('mb_sprintf')) {
    function mb_sprintf($format)
    {
        $argv = func_get_args();
        array_shift($argv);
        return mb_vsprintf($format, $argv);
    }
}
if (!function_exists('mb_vsprintf')) {
    /**
     * Works with all encodings in format and arguments.
     * Supported: Sign, padding, alignment, width and precision.
     * Not supported: Argument swapping.
     */
    function mb_vsprintf($format, $argv, $encoding = null)
    {
        if (is_null($encoding))
            $encoding = mb_internal_encoding();

        // Use UTF-8 in the format so we can use the u flag in preg_split
        $format = mb_convert_encoding($format, 'UTF-8', $encoding);

        $newformat = ""; // build a new format in UTF-8
        $newargv = array(); // unhandled args in unchanged encoding

        while ($format !== "") {

            // Split the format in two parts: $pre and $post by the first %-directive
            // We get also the matched groups
            @list($pre, $sign, $filler, $align, $size, $precision, $type, $post) =
                preg_split(
                    "!\%(\+?)('.|[0 ]|)(-?)([1-9][0-9]*|)(\.[1-9][0-9]*|)([%a-zA-Z])!u",
                    $format,
                    2,
                    PREG_SPLIT_DELIM_CAPTURE
                );

            $newformat .= mb_convert_encoding($pre, $encoding, 'UTF-8');

            if ($type == '') {
                // didn't match. do nothing. this is the last iteration.
            } elseif ($type == '%') {
                // an escaped %
                $newformat .= '%%';
            } elseif ($type == 's') {
                $arg = array_shift($argv);
                $arg = mb_convert_encoding($arg, 'UTF-8', $encoding);
                $padding_pre = '';
                $padding_post = '';

                // truncate $arg
                if ($precision !== '') {
                    $precision = intval(substr($precision, 1));
                    if ($precision > 0 && mb_strlen($arg, $encoding) > $precision)
                        $arg = mb_substr($precision, 0, $precision, $encoding);
                }

                // define padding
                if ($size > 0) {
                    $arglen = mb_strlen($arg, $encoding);
                    if ($arglen < $size) {
                        if ($filler === '')
                            $filler = ' ';
                        if ($align == '-')
                            $padding_post = str_repeat($filler, $size - $arglen);
                        else
                            $padding_pre = str_repeat($filler, $size - $arglen);
                    }
                }

                // escape % and pass it forward
                $newformat .= $padding_pre . str_replace('%', '%%', $arg) . $padding_post;
            } else {
                // another type, pass forward
                $newformat .= "%$sign$filler$align$size$precision$type";
                $newargv[] = array_shift($argv);
            }
            $format = strval($post);
        }
        // Convert new format back from UTF-8 to the original encoding
        $newformat = mb_convert_encoding($newformat, $encoding, 'UTF-8');
        return vsprintf($newformat, $newargv);
    }
}

function rgb_from_hex($color)
{
    $color = str_replace('#', '', $color);
    // Convert shorthand colors to full format, e.g. "FFF" -> "FFFFFF"
    $color = preg_replace('~^(.)(.)(.)$~', '$1$1$2$2$3$3', $color);

    $rgb['R'] = hexdec($color{
    0} . $color{
    1});
    $rgb['G'] = hexdec($color{
    2} . $color{
    3});
    $rgb['B'] = hexdec($color{
    4} . $color{
    5});
    return $rgb;
}

function hex_lighter($color, $factor = 30)
{
    $base = rgb_from_hex($color);
    $color = '#';

    foreach ($base as $k => $v) {
        $amount = 255 - $v;
        $amount = $amount / 100;
        $amount = round($amount * $factor);
        $new_decimal = $v + $amount;

        $new_hex_component = dechex($new_decimal);
        if (strlen($new_hex_component) < 2) {
            $new_hex_component = "0" . $new_hex_component;
        }
        $color .= $new_hex_component;
    }

    return $color;
}
function hex_darker($color, $factor = 30)
{
    $base  = rgb_from_hex($color);
    $color = '#';

    foreach ($base as $k => $v) {
        $amount      = $v / 100;
        $amount      = round($amount * $factor);
        $new_decimal = $v - $amount;

        $new_hex_component = dechex($new_decimal);
        if (strlen($new_hex_component) < 2) {
            $new_hex_component = "0" . $new_hex_component;
        }
        $color .= $new_hex_component;
    }

    return $color;
}
function light_or_dark($color, $dark = '#000000', $light = '#FFFFFF')
{

    $hex = str_replace('#', '', $color);

    $c_r = hexdec(substr($hex, 0, 2));
    $c_g = hexdec(substr($hex, 2, 2));
    $c_b = hexdec(substr($hex, 4, 2));

    $brightness = (($c_r * 299) + ($c_g * 587) + ($c_b * 114)) / 1000;

    return $brightness > 155 ? $dark : $light;
}

function replace_vars($template, $vars, $to)
{

    return str_replace(
        $vars,
        $to,
        $template
    );
}
function mb_strcasecmp($str1, $str2, $encoding = null)
{
    if (null === $encoding) {
        $encoding = mb_internal_encoding();
    }
    return strcmp(mb_strtoupper($str1, $encoding), mb_strtoupper($str2, $encoding));
}
function disable_gzip()
{
    @ini_set('zlib.output_compression', 'Off');
    @ini_set('output_buffering', 'Off');
    @ini_set('output_handler', '');
    @apache_setenv('no-gzip', 1);
}

function checkAlphabetic($string)
{

    $input = mb_str_replace(" ", "", $string);
    if (!preg_match("/^[a-zA-ZÇçĞğÜüÖöİıŞş\s]*$/i", $input))
        return false;

    return true;
}

function getUrlDirectoryRoot()
{
    global $core;

    $protocol = 'http';
    $port = '';

    if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
        $protocol .= "s";
    }
    $current_url = $core->current_page_url(true);

    if ((substr($current_url, 0, 10) == "http://www" || substr($current_url, 0, 11) == "https://www") && (substr(CLO_URL, 0, 10) != "http://www" || substr(CLO_URL, 0, 11) != "https://www")) {
        $current_url = mb_str_replace("$protocol://www.", "", $current_url);
    }

    if ($_SERVER["SERVER_PORT"] != "80") {
        $port = ":" . $_SERVER["SERVER_PORT"];
    }

    $replaced = mb_str_replace($protocol . "://" . $_SERVER['SERVER_NAME'] . $port, "", $current_url);

    return rtrim($replaced, "/") . "/";
}
