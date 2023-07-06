<?php

/**
 * encryption
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.encryption.php UTF-8 , 22-Jun-2013 | 03:13:15 nwdo ε
 */

namespace Nedo;

if (!defined("_SECURE_PHP"))
   die('Direct access to this location is not allowed.');
?>
<?php

class Encryption
{

   private $skey; // "/application/lib/config.ini.php"

   function __construct($key = false)
   {
      if ($key) {
         $this->skey = $key;
      } else {
         $this->skey = ENC_KEY; // "/application/lib/config.ini.php"
      }
   }

   public function safe_b64encode($string)
   {

      $data = base64_encode($string);
      $data = str_replace(array('+', '/', '='), array('-', '_', ''), $data);
      return $data;
   }

   public function safe_b64decode($string)
   {
      $data = str_replace(array('-', '_'), array('+', '/'), $string);
      $mod4 = strlen($data) % 4;
      if ($mod4) {
         $data .= substr('====', $mod4);
      }
      return base64_decode($data);
   }

   public function encode($value)
   {

      if (!$value) {
         return false;
      }
      $text = $value;
      $iv_size = \mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB);
      $iv = \mcrypt_create_iv($iv_size, MCRYPT_RAND);
      $crypttext = \mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $this->skey, $text, MCRYPT_MODE_ECB, $iv);
      return trim($this->safe_b64encode($crypttext));
   }

   public function decode($value)
   {

      if (!$value) {
         return false;
      }
      $crypttext = $this->safe_b64decode($value);
      $iv_size = \mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB);
      $iv = \mcrypt_create_iv($iv_size, MCRYPT_RAND);
      $decrypttext = \mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $this->skey, $crypttext, MCRYPT_MODE_ECB, $iv);
      return trim($decrypttext);
   }
}

?>
