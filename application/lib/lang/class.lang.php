<?php

/**
 * lang
 * @package      Closhare+plus app
 * @copyright    2015
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: lang.class.php UTF-8 , 22.July.2015 | 04:24:37 nwdo ε
 */ ?>
<?php

namespace Nedo;

use \Exception;
use Nedo\Cache\Cache;

class Lang
{

    private $UserLng;
    private $langSelected;
    public $lang = array();
    private $path;
    private $langfile;
    private $cachedFile;
    private $cachedFilePath;

    public function __construct($userLanguage = "en")
    {

        $this->UserLng = $userLanguage;
        $this->langfile = LIB_PATH . "lang" . DS . "translate" . DS . $this->UserLng . '.ini';
        $this->set();
    }

    /**
     * Set Language file on
     * return include $lang file
     */
    private function set()
    {

        $this->cachedFile = $this->UserLng . '.cached.php';

        $this->cachedFilePath = LIB_PATH . "lang" . DS . "translate" . DS . "cache" . DS . $this->UserLng . '.cached.php';

        $cache = new Cache;

        $cache->setCacheDirectory(LIB_PATH . "lang" . DS . "translate" . DS . "cache");

        $data = $cache->getOrCreate($this->cachedFile, array(
            'younger-than' => $this->langfile
        ), function () {

            if (!file_exists($this->langfile)) {
                throw new \RuntimeException("Language could not be loaded"); //or default to a language
            }

            $this->lang = parse_ini_file($this->langfile);

            $cachedContent = '';

            foreach ($this->lang as $key => $value) {
                $cachedContent .= 'define("' . $key . '", "' . $value . '");' . "\n";
            }

            $date = date('d-M-Y');
            $time = date('H:s:i');

            $trimmedContent = trim($cachedContent, "\n");

            $content =
                <<<EOF
<?php

/**
* $this->UserLng.cache
* @package      Closhare+plus app
* @copyright    2015
* @license      MIT
* @contact      murathan@xneda.com
* @version \$Id: $this->UserLng.cache.php UTF-8 , $date | $time nwdo ε / created automatically.
*/
$trimmedContent
?>
EOF;

            file_put_contents($this->cachedFilePath, $content);
        }, false, false, $this->cachedFile);

        include_once $this->cachedFilePath;
    }

    /**
     * 
     * @param type $str
     * @param type $replace
     * @return type
     */

    static function get($str, $replace = false)
    {

        $string = "";
        if (defined($str)) {
            $string = constant($str);

            if ($replace)
                $string = is_array($replace) ? \mb_vsprintf($string, $replace, 'UTF-8') : mb_sprintf($string, $replace, 'UTF-8');
        }

        return $string;
    }

    /**
     * 
     * @param type $array
     * @return type
     */

    static function getMulti($array)
    {

        $string = "";
        foreach ($array as $key) :

            if (defined($key))
                $string .= constant($key);

        endforeach;

        return $string;
    }

    /**
     * 
     * @return type
     */

    public function userLanguage()
    {
        return $this->lang;
    }
}
