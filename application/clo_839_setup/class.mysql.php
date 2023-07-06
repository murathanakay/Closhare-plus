<?php

/**
 * db.class
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: db.class.php UTF-8 , 21-Jun-2013 | 23:02:21 nwdo ε
 */

if (!defined("_SECURE_PHP"))
   die('Direct access to this location is not allowed.');
/**
 * All interractions with the MySQL Server. Connect, fetch, fetch_all, delete etc...
 */
class Database
{

   private $server = "";
   private $user = "";
   private $pass = "";
   private $database = "";
   public $error = "";
   public $errno = 0;
   protected $affected_rows = 0;
   protected $query_counter = 0;
   protected $link_id = 0;
   protected $query_id = 0;

   /**
    * 
    * @param type $server
    * @param type $user
    * @param type $pass
    * @param type $database
    */
   function __construct($server, $user, $pass, $database)
   {
      $this->server = $server;
      $this->user = $user;
      $this->pass = $pass;
      $this->database = $database;
   }

   /**
    * connect 
    */
   public function connect()
   {
      $this->link_id = $this->connect_db($this->server, $this->user, $this->pass);

      if (!$this->link_id)
         $this->error("<div style='text-align:center'>"
            . "<span style='padding: 5px; border: 1px solid #999; background-color:#EFEFEF;"
            . "font-family: Verdana; font-size: 11px; margin-left:auto; margin-right:auto'>"
            . "<b>Database Error: </b>Connection to Database '" . $this->database . "' failed</span></div>");

      if (!$this->select_db($this->database, $this->link_id))
         $this->error("<div style='text-align:center'>"
            . "<span style='padding: 5px; border: 1px solid #999; background-color: #EFEFEF;"
            . "font-family: Verdana; font-size: 11px; margin-left:auto; margin-right:auto'>"
            . "<b>Database Error: </b>MySQL Database '" . $this->database . "' cannot be selected. Please be sure it exists.</span></div>");

      $this->query("SET NAMES 'utf8'", $this->link_id);
      $this->query("SET CHARACTER SET 'utf8'", $this->link_id);
      $this->query("SET CHARACTER_SET_CONNECTION=utf8", $this->link_id);
      $this->query("SET SQL_MODE = ''", $this->link_id);

      unset($this->password);

      return $this->link_id;
   }


   /**
    * connect 
    */
   public function checkDBConnection()
   {
      $return = 0;
      $this->link_id = $this->connect_db($this->server, $this->user, $this->pass);

      if (!$this->link_id) {
         $return = "<b>Database Error: </b>Connection to Database Server (" . $this->server . ") failed!<br>
            <ul>
            <li><small>Please be sure the MySQL Database Server '" . $this->server . "' is alive & responding on port (3306).</small></li>
            <li><small>OR Access denied for user '{$this->user}' @ '{$this->server}'</small></li>
            </ul>";
      }

      if ($this->link_id && !$this->select_db($this->database, $this->link_id)) {
         $return =  "<b>Database Error: </b>MySQL Database '{$this->database}' cannot be selected!<br>
                <ul>
                <li><small>Please be sure the MySQL Database '" . $this->database . "' exists.</small></li>
                <li><small>Please check your Database User & Password again.</small></li>
                </ul>";
      }

      unset($this->pass);
      return $return;
   }

   /**
    * 
    * @param type $server
    * @param type $user
    * @param type $pass
    * @return type
    */
   private function connect_db($server, $user, $pass)
   {
      return mysql_connect($server, $user, $pass);
   }

   /**
    * 
    * @param type $database
    * @param type $link_id
    * @return type
    */
   private function select_db($database, $link_id)
   {
      return mysql_select_db($database, $link_id);
   }

   /**
    * 
    * @param type $sql
    * @return type
    */
   public function query($sql)
   {
      if (trim($sql != "")) {
         $this->query_counter++;
         $this->query_show .= stripslashes($sql) . "<hr size='1' />";
         $this->query_id = mysql_query($sql, $this->link_id);

         $this->last_query = $sql . '<br />';
      }

      if (!$this->query_id)
         $this->error("MySQL Error while trying to execute the following Query : " . $sql);

      return $this->query_id;
   }

   /**
    * 
    * @param type $string
    * @return type
    */
   public function first($string)
   {
      $query_id = $this->query($string);
      $record = $this->fetch($query_id);
      $this->free($query_id);

      return $record;
   }

   /**
    * 
    * @param type $query_id
    * @return type
    */
   public function fetch($query_id = -1)
   {
      if ($query_id != -1)
         $this->query_id = $query_id;

      if (isset($this->query_id)) {
         $record = mysql_fetch_array($this->query_id, MYSQL_ASSOC);
      } else
         $this->error("Invalid query id: <b>" . $this->query_id . "</b>. Records couldn't be retrieved.");

      return $record;
   }

   /**
    * 
    * @param type $sql
    * @return type
    */
   public function fetch_all($sql)
   {
      $query_id = $this->query($sql);
      $record = array();

      while ($row = $this->fetch($query_id, $sql)) :
         $record[] = $row;
      endwhile;

      $this->free($query_id);

      return $record;
   }

   /**
    * 
    * @param type $query_id
    * @return type
    */
   private function free($query_id = -1)
   {
      if ($query_id != -1)
         $this->query_id = $query_id;

      return mysql_free_result($this->query_id);
   }

   /**
    * 
    * @param type $table
    * @param type $data
    * @return boolean
    */
   public function insert($table = null, $data)
   {
      if ($table === null || empty($data) || !is_array($data)) {
         $this->error("Invalid array for the following table : <b>" . $table . "</b>.");
         return false;
      }
      $query = "INSERT INTO `" . $table . "` ";
      $v = '';
      $k = '';

      foreach ($data as $key => $val) :
         $k .= "`$key`, ";
         if (strtolower($val) == 'null')
            $v .= "NULL, ";
         elseif (strtolower($val) == 'now()')
            $v .= "NOW(), ";
         else
            $v .= "'" . $this->escape($val) . "', ";
      endforeach;

      $query .= "(" . rtrim($k, ', ') . ") VALUES (" . rtrim($v, ', ') . ");";

      if ($this->query($query)) {
         return $this->insertid();
      } else
         return false;
   }

   /**
    * 
    * @param type $table
    * @param type $data
    * @param type $where
    * @return boolean
    */
   public function update($table = null, $data, $where = '1')
   {
      if ($table === null || empty($data) || !is_array($data)) {
         $this->error("Invalid array for the following table: <b>" . $table . "</b>.");
         return false;
      }

      $query = "UPDATE `" . $table . "` SET ";
      foreach ($data as $key => $val) :
         if (strtolower($val) == 'null')
            $query .= "`$key` = NULL, ";
         elseif (strtolower($val) == 'now()')
            $query .= "`$key` = NOW(), ";
         elseif (strtolower($val) == 'default()')
            $query .= "`$key` = DEFAULT($val), ";
         elseif (preg_match("/^inc\((\-?\d+)\)$/i", $val, $m))
            $query .= "`$key` = `$key` + $m[1], ";
         else
            $query .= "`$key`='" . $this->escape($val) . "', ";
      endforeach;
      $query = rtrim($query, ', ') . ' WHERE ' . $where . ';';

      return $this->query($query);
   }

   /**
    * 
    * @param type $table
    * @param type $where
    * @return type
    */
   public function delete($table, $where = '')
   {
      $query = !$where ? 'DELETE FROM ' . $table : 'DELETE FROM ' . $table . ' WHERE ' . $where;
      return $this->query($query);
   }

   /**
    * 
    * @return type
    */
   public function insertid()
   {
      return mysql_insert_id($this->link_id);
   }

   /**
    * 
    * @return type
    */
   public function affected()
   {
      return mysql_affected_rows($this->link_id);
   }

   /**
    * 
    * @param type $query_id
    * @return type
    */
   public function numrows($query_id = -1)
   {
      if ($query_id != -1)
         $this->query_id = $query_id;

      $this->num_rows = mysql_num_rows($this->query_id);
      return $this->num_rows;
   }

   /**
    * 
    * @param type $query_id
    * @return type
    */
   public function fetchrow($query_id = -1)
   {
      if ($query_id != -1)
         $this->query_id = $query_id;

      $this->fetch_row = mysql_fetch_row($this->query_id);
      return $this->fetch_row;
   }

   /**
    * 
    * @param type $query_id
    * @return type
    */
   public function numfields($query_id = -1)
   {
      if ($query_id != -1)
         $this->query_id = $query_id;

      $this->num_fields = mysql_num_fields($this->query_id);
      return $this->num_fields;
   }

   /**
    * 
    * @param type $arr
    */
   public function pre($arr)
   {
      print '<pre>' . print_r($arr, true) . '</pre>';
   }

   /**
    * 
    * @param type $string
    * @return type
    */
   public function escape($string)
   {
      if (is_array($string)) {
         foreach ($string as $key => $value) :
            $string[$key] = $this->escape_($value);
         endforeach;
      } else
         $string = $this->escape_($string);

      return $string;
   }

   /**
    * 
    * @param type $string
    * @return type
    */
   private function escape_($string)
   {
      return mysql_real_escape_string($string, $this->link_id);
   }

   /**
    * 
    * @return type
    */
   public function getDB()
   {
      return $this->database;
   }

   /**
    * 
    * @return type
    */
   public function getServer()
   {
      return $this->server;
   }

   /**
    * 
    * @global type $DEBUG
    * @global type $_SERVER
    * @param type $msg
    */
   private function error($msg = '')
   {
      global $DEBUG, $_SERVER;
      if ($this->link_id > 0) {
         $this->error_desc = mysql_error($this->link_id);
         $this->error_no = mysql_errno($this->link_id);
      } else {
         $this->error_desc = mysql_error();
         $this->error_no = mysql_errno();
      }

      $the_error = "<div style=\"background-color:#FFF; border: 6px solid #000; padding:15px\">";
      $the_error .= "<b>MYSQL WARNING!</b><br />";
      $the_error .= "Database Error: $msg <br /> More Information: <br />";
      $the_error .= "<ul>";
      $the_error .= "<li> Mysql Error no : " . $this->error_no . "</li>";
      $the_error .= "<li> Mysql Error # : " . $this->error_desc . "</li>";
      $the_error .= "<li> Date - Time : " . date("F j, Y, g:i a") . "</li>";
      $the_error .= "<li> Referer URI : " . isset($_SERVER['HTTP_REFERER']) . "</li>";
      $the_error .= "<li> In : " . $_SERVER['REQUEST_URI'] . "</li>";
      $the_error .= '</ul>';
      $the_error .= '</div>';
      if ($DEBUG)
         echo $the_error;
      die();
   }
}
