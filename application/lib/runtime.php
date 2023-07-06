<?php

/**
 * runtime
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: runtime.php UTF-8 , 06-Jun-2013 | 21:02:46 nwdo ε
 */

namespace Nedo;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

/**
 * 
 * @param type $icon
 * @return type
 */
function returnTypeIcon($icon_name)
{
    $prefix = 'file_extension_';
    $iconpath = ASS_PATH . 'icons' . DS . $prefix;
    $iconURI = CLO_DEF_ASS_URI . 'icons/' . $prefix;

    $src = (file_exists($iconpath . $icon_name) ? ($iconURI . $icon_name) : ($iconURI . 'file.png'));

    return $src;
}

function getUploadfile()
{
    global $user_agent;
    $header = '';
    foreach (getallheaders() as $name => $value) {
        $header .= "$name: $value\n";
    }
    $opts = array(
        'http' => array(
            'method'  => 'GET',
            'user_agent' => "Accept-language: en\r\n" .
                "User-Agent: " . $_SERVER['HTTP_USER_AGENT']
        )
    );

    $context = stream_context_create($opts);

    // Open the file using the HTTP headers set above
    return file_get_contents(CLO_DEF_ASS_URI . 'js/upload/upload.php', true, $context);
}

class cmp
{

    var $key;
    var $sort;

    function __construct($key, $sort, $alph = false)
    {
        $this->key = $key;
        $this->sort = $sort;

        $this->alph = $alph;
    }

    function cmp__($a, $b)
    {
        $key = $this->key;
        if ($a[$key] == $b[$key])
            return 0;
        //sort by alphabet
        if ($this->alph) {
            $a = explode(' ', $a[$key]);
            $b = explode(' ', $b[$key]);
            $size = min(count($a), count($b));
            for ($index = 0; $index < $size; ++$index) {
                $a1 = preg_replace("[^A-Za-z0-9]", "", $a[$index]);
                $b1 = preg_replace("[^A-Za-z0-9]", "", $b[$index]);
                $equal = 0;
                $temp = '';

                if ($this->sort != 'asc') {
                    $temp = $a1;
                    $a1 = $b1;
                    $b1 = $temp;
                }

                if (is_numeric($a1) && is_numeric($b1)) {
                    $equal = $a1 - $b1;
                } else {
                    $equal = strcasecmp($a1, $b1);
                }
                if ($equal < 0) {
                    return -1;
                }
                if ($equal > 0) {
                    return 1;
                }
            }
            return count($a[$key]) - count($b[$key]);
        }

        if ($this->sort == 'asc') {
            return (($a[$key] > $b[$key]) ? 1 : -1);
        } else {
            return (($a[$key] < $b[$key]) ? 1 : -1);
        }
    }
}
