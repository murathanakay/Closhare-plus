<?php

/**
 * redirect
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: redirect.php UTF-8 , 22-Jun-2013 | 02:20:59 nwdo ε
 */
// Pick a date in the past
header("Expires: Thu, 17 May 2001 10:17:17 GMT");
// set it as always modified
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// set header as HTTP/1.1
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
ob_start();
