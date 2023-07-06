<?php

/**
 * class.GoogleUrlShortener
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      Proprietary
 * @contact      nedox@xneda.com
 * @version $Id: class.GoogleUrlShortener.php UTF-8 , 01-Jul-2013 | 23:53:08 nwdo ε
 */
namespace Nedo;
use Nedo\Core;

if (!defined("_SECURE_PHP")){
    die('Direct access to this location is not allowed.');
}

class GoogleURIShortener {

   private $_apiUrl;
   private $_shortUrl;

   // Constructor
   function __construct() {
      $sc = new \Nedo\Core();
      
      $settings = $sc->getSettings(false);
      $apiURL = 'https://www.googleapis.com/urlshortener/v1/url?key=';

      $APIKEY = $settings['google_api_key'];
      // Keep the API Url
      $this->_apiUrl = $apiURL . ($APIKEY ? $APIKEY : 'AIzaSyChvoIdcXIPVus_zJAKm0CVnadp-9QcNfs');
   }

   /**
    * Make shorten url
    *
    * @access public
    * @param string $longUrl long url
    * @return string shorten url
    */
   public function shorten($longUrl) {
      $data = $this->getContent($longUrl);
      $this->_shortUrl = @$data->id;
      return ($this->_shortUrl) ? $data->id : $longUrl;
   }

   /**
    * Expand short url
    *
    * @access public
    * @param string $shortUrl
    * @return string
    */
   public function expand($shortUrl) {
      $data = $this->getContent($shortUrl, "expand");
      $this->_shortUrl = $data->id;
      return ($data->longUrl) ? $data->longUrl : false;
   }

   /**
    * Get number of long url click
    *
    * @access public
    * @return int
    */
   public function getLongUrlCliks() {
      $data = $this->getContent($this->_shortUrl, 'info');
      return $data->analytics->allTime->longUrlClicks;
   }

   /**
    * Get number of short url click
    *
    * @access public
    * @return int
    */
   public function getShortUrlClicks() {
      $data = $this->getContent($this->_shortUrl, 'info');
      return $data->analytics->allTime->shortUrlClicks;
   }

   /**
    * Get data from google api
    *
    * @param string $url
    * @param string $requestType
    * @return string json format
    */
   private function getContent($url, $requestType = "shorten") {
       

      if (function_exists('curl_init')) {
         $response = $this->curl_get_content($url, $requestType);
      } else {
         if ($requestType === "expand") {
            $url = $gourl = $this->_apiUrl . '&shortUrl=' . $url;
         } else if ($requestType === "info") {
            $url = $gourl = $this->_apiUrl . '&shortUrl=' . $url . '&projection=FULL';
         } else {
            $gourl = $this->_apiUrl;
            $opts = array('https' =>
                array(
                    'method'  => 'POST',
                    'header'  => 'Content-type: application/x-www-form-urlencoded',
                    'content' => json_encode(array('longUrl' => $url))
                )
            );

            $context  = stream_context_create($opts);            
            
         }
         $response = file_get_contents($gourl, false, (isset($context) ? $context : NULL));
      }

      //change the response json string to object
      return json_decode($response ? $response : json_encode(array("result" => 0, "message" => "Please check your internet connection!")));
   }
   
   /**
    * 
    * @param type $url
    * @param type $requestType
    * @return type
    */

   private function curl_get_content($url, $requestType = "shorten") {

      $curl = curl_init();

      if ($requestType === "expand") {
         curl_setopt($curl, CURLOPT_URL, $this->_apiUrl . '&shortUrl=' . $url);
      } else if ($requestType === "info") {
         curl_setopt($curl, CURLOPT_URL, $this->_apiUrl . '&shortUrl=' . $url . '&projection=FULL');
      } else {
         curl_setopt($curl, CURLOPT_URL, $this->_apiUrl);
         curl_setopt($curl, CURLOPT_POST, 1);
         curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode(array('longUrl' => $url)));
      }

      curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 20);

      curl_setopt($curl, CURLOPT_TIMEOUT, 40); //give 60 seconds to the google
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($curl, CURLOPT_HEADER, 0);
      curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type:application/json'));
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
      $response = curl_exec($curl);
      curl_close($curl);

      return $response;
   }

}

?>
