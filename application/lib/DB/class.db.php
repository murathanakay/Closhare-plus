<?php

/**
 * DB.class
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: db.class.php UTF-8 , 17-Jun-2015 | 23:02:21 nwdo ε
 */

namespace Nedo;

use \PDO;
use DateTime;

class DB
{

    private $pdo;
    private $sQuery;
    private $settings;
    private $bConnected = false;
    private $log;
    private $parameters;

    public function __construct()
    {

        require_once LIB_PATH . 'DB' . DS . "class.log.php";
        $this->log = new \Nedo\Log();

        $this->Connect();
        $this->parameters = array();
    }

    /**
     * 	This method makes connection to the database.
     * 	
     * 	1. Reads the database settings from a ini file. 
     * 	2. Puts  the ini content into the settings array.
     * 	3. Tries to connect to the database.
     * 	4. If connection failed, exception is displayed and a log file gets created.
     */
    private function Connect()
    {

        $this->settings = array(
            "dbname" => DB_DATABASE,
            "host" => DB_SERVER,
            "user" => DB_USER,
            "password" => DB_PASS
        );

        $dsn = 'mysql:dbname=' . $this->settings["dbname"] . ';host=' . $this->settings["host"] . '';

        /**
         * Sync both PHP and MySQL Server Times
         */
        $now = new \DateTime();
        $mins = $now->getOffset() / 60;
        $sgn = ($mins < 0 ? -1 : 1);
        $mins = abs($mins);
        $hrs = floor($mins / 60);
        $mins -= $hrs * 60;
        $offset = sprintf('%+d:%02d', $hrs * $sgn, $mins);

        try {
            # Read settings from INI file, set UTF8
            $this->pdo = new \PDO($dsn, $this->settings["user"], $this->settings["password"]);

            $this->pdo->exec("SET time_zone='$offset';");
            $this->pdo->exec("SET NAMES 'utf8';");

            # We can now log any exceptions on Fatal error. 
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            # Disable emulation of prepared statements, use REAL prepared statements instead.
            $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            # Connection succeeded, set the boolean to true.
            $this->bConnected = true;
        } catch (PDOException $e) {
            # Write into log
            echo $this->ExceptionLog($e->getMessage());
            die();
        }
    }

    /*
     *   You can use this little method if you want to close the PDO connection
     *
     */

    public function CloseConnection()
    {
        # Set the PDO object to null to close the connection
        # http://www.php.net/manual/en/pdo.connections.php
        $this->pdo = null;
    }

    /**
     * 	Every method which needs to execute a SQL query uses this method.
     * 	
     * 	1. If not connected, connect to the database.
     * 	2. Prepare Query.
     * 	3. Parameterize Query.
     * 	4. Execute Query.	
     * 	5. On exception : Write Exception into the log + SQL query.
     * 	6. Reset the Parameters.
     */
    private function Init($query, $parameters = "")
    {
        # Connect to database
        if (!$this->bConnected) {
            $this->Connect();
        }
        try {
            # Prepare query
            $this->sQuery = $this->pdo->prepare($query);

            # Add parameters to the parameter array	
            $this->bindMore($parameters);

            # Bind parameters
            if (!empty($this->parameters)) {
                foreach ($this->parameters as $param) {
                    $parameters = explode("\x7F", $param);
                    $this->sQuery->bindParam($parameters[0], $parameters[1]);
                }
            }

            # Execute SQL 
            $this->succes = $this->sQuery->execute();
        } catch (PDOException $e) {
            # Write into log and display Exception
            echo $this->ExceptionLog($e->getMessage(), $query);
            die();
        }

        # Reset the parameters
        $this->parameters = array();
    }

    /**
     * 	@void 
     *
     * 	Add the parameter to the parameter array
     * 	@param string $para  
     * 	@param string $value 
     */
    public function bind($para, $value)
    {
        $this->parameters[sizeof($this->parameters)] = ":" . $para . "\x7F" . ($value);
    }

    /**
     * 	@void
     * 	
     * 	Add more parameters to the parameter array
     * 	@param array $parray
     */
    public function bindMore($parray)
    {
        if (empty($this->parameters) && is_array($parray)) {
            $columns = array_keys($parray);
            foreach ($columns as $i => &$column) {
                $this->bind($column, $parray[$column]);
            }
        }
    }

    /**
     *   	If the SQL query  contains a SELECT or SHOW statement it returns an array containing all of the result set row
     * 	If the SQL statement is a DELETE, INSERT, or UPDATE statement it returns the number of affected rows
     *
     *   	@param  string $query
     * 	@param  array  $params
     * 	@param  int    $fetchmode
     * 	@return mixed
     */
    public function query($query, $params = null, $fetchmode = PDO::FETCH_ASSOC)
    {
        $query = trim($query);

        $this->Init($query, $params);

        $rawStatement = explode(" ", $query);

        $NOW = "NOW()";

        # Which SQL statement is used 
        $statement = strtolower($rawStatement[0]);

        if ($statement === 'select' || $statement === 'show') {
            return $this->sQuery->fetchAll($fetchmode);
        } elseif ($statement === 'insert' || $statement === 'update' || $statement === 'delete') {
            return $this->sQuery->rowCount();
        } elseif ($statement === 'alter') {
            return $this->sQuery->rowCount();
        } else {
            return NULL;
        }
    }

    /**
     * Short usage of an Insert clause
     * 
     * @param type $table
     * @param string $info
     * @return type
     */
    public function insert($table, $info)
    {

        $fields = $this->filter($table, $info);

        $fieldsVal = $fields;

        //search for a now();
        foreach ($fieldsVal as $key => $field) {

            if (strtolower($info[$field]) == ":now()") {

                $fieldsVal[$key] = ":now()";
            }
        }

        $preSQL = (implode(", ", array_map(function ($v, $k) {
            return $v == ':now()' ? "NOW()" : (':' . $v);
        }, $fieldsVal, array_keys($fieldsVal))));

        $sql = "INSERT INTO " . $table . " (" . implode($fields, ", ") . ") VALUES ({$preSQL});";

        $bind = array();
        foreach ($fields as $field) {

            $bind["$field"] = $info[$field];

            if (strtolower($info[$field]) == ":now()") {
                unset($bind["$field"]);
            }
        }
        return $this->query($sql, $bind);
    }

    /**
     * Short usage of an update progress
     * @param type $table
     * @param type $info
     * @param type $where
     * @param type $bind
     * @return type
     */
    public function update($table, $info, $where, $bind = "")
    {
        $fields = $this->filter($table, $info);
        $fieldSize = sizeof($fields);

        $sql = "UPDATE " . $table . " SET ";
        for ($f = 0; $f < $fieldSize; ++$f) {

            if ($f > 0)
                $sql .= ", ";

            if (strtolower($info[$fields[$f]]) != ":now()") {

                $sql .= $fields[$f] . " = :update_" . $fields[$f];
            } else {

                $sql .= $fields[$f] . " = NOW()";
            }
        }
        if ($where)
            $sql .= " WHERE " . $where . ";";


        $bind = $this->cleanup($bind);

        foreach ($fields as $field) {

            $bind["update_$field"] = $info[$field];

            if (strtolower($info[$field]) == ':now()') {
                unset($bind["update_$field"]);
                $info[$field] = "NOW()";
            }
        }

        return $this->query($sql, $bind);
    }

    /**
     * Short usage of a delete clause
     * 
     * @param type $table
     * @param type $where
     * @param type $bind
     */
    public function delete($table, $where, $bind = "")
    {
        $sql = "DELETE FROM " . $table . " WHERE " . $where . ";";
        return $this->query($sql, $bind);
    }

    /**
     *  Returns the last inserted id.
     *  @return string
     */
    public function lastInsertId()
    {
        return $this->pdo->lastInsertId();
    }

    /**
     * 	Returns an array which represents a column from the result set 
     *
     * 	@param  string $query
     * 	@param  array  $params
     * 	@return array
     */
    public function column($query, $params = null)
    {
        $this->Init($query, $params);
        $Columns = $this->sQuery->fetchAll(PDO::FETCH_NUM);

        $column = null;

        foreach ($Columns as $cells) {
            $column[] = $cells[0];
        }

        return $column;
    }

    /**
     * 	Returns an array which represents a row from the result set 
     *
     * 	@param  string $query
     * 	@param  array  $params
     *   	@param  int    $fetchmode
     * 	@return array
     */
    public function row($query, $params = null, $fetchmode = PDO::FETCH_ASSOC)
    {
        $this->Init($query, $params);
        return $this->sQuery->fetch($fetchmode);
    }

    /**
     * 	Returns the value of one single field/column
     *
     * 	@param  string $query
     * 	@param  array  $params
     * 	@return string
     */
    public function single($query, $params = null)
    {
        $this->Init($query, $params);
        return $this->sQuery->fetchColumn();
    }

    /**
     * 
     * @param type $table
     * @param type $info
     * @return type
     */
    private function filter($table, $info)
    {

        $driver = $this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

        if ($driver == 'sqlite') {
            $sql = "PRAGMA table_info('" . $table . "');";
            $key = "name";
        } elseif ($driver == 'mysql') {
            $sql = "DESCRIBE " . $table . ";";
            $key = "Field";
        } else {
            $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = '" . $table . "';";
            $key = "column_name";
        }

        if (false !== ($list = $this->run($sql))) {
            $fields = array();
            foreach ($list as $record)
                $fields[] = $record[$key];
            return array_values(array_intersect($fields, array_keys($info)));
        }
        return array();
    }

    /**
     * 
     * @param type $sql
     * @param type $bind
     * @return boolean
     */
    private function run($sql, $bind = "")
    {
        $this->sql = trim($sql);
        $this->bind = $this->cleanup($bind);
        $this->error = "";

        try {
            $pdostmt = $this->pdo->prepare($this->sql);
            if ($pdostmt->execute($this->bind) !== false) {
                if (preg_match("/^(" . implode("|", array("select", "describe", "pragma")) . ") /i", $this->sql))
                    return $pdostmt->fetchAll(PDO::FETCH_ASSOC);
                elseif (preg_match("/^(" . implode("|", array("delete", "insert", "update")) . ") /i", $this->sql))
                    return $pdostmt->rowCount();
            }
        } catch (PDOException $e) {
            echo $this->ExceptionLog($e->getMessage(), $query);
            return false;
        }
    }

    /**
     * 
     * @param type $bind
     * @return array
     */
    private function cleanup($bind)
    {
        if (!is_array($bind)) {
            if (!empty($bind))
                $bind = array($bind);
            else
                $bind = array();
        }
        return $bind;
    }

    /**
     * Check db connection and return any error to the browser
     * 
     * @return string
     */
    public function checkDBConnection()
    {
        $return = 0;

        if (!$this->bConnected) {
            $return = "<b>Database Error: </b>Connection to Database Server (" . $this->settings["dbhost"] . ") failed or Database does not exists!<br>
            <ul>
            <li><small>Please be sure the MySQL Database Server '" . $this->settings["dbhost"] . "' is alive & responding on port (3306).</small></li>
            <li><small>OR Access denied for user '{$this->settings["dbuser"]}' @ '{$this->settings["dbhost"]}'</small></li>
            </ul>";

            return $return;
        }

        return true;
    }

    /** 	
     * Writes the log and returns the exception
     *
     * @param  string $message
     * @param  string $sql
     * @return string
     */
    private function ExceptionLog($message, $sql = "")
    {
        $exception = 'Unhandled Exception. <br />';
        $exception .= $message;
        $exception .= "<br /> You can find the error back in the log.";

        if (!empty($sql)) {
            # Add the Raw SQL to the Log
            $message .= "\r\nRaw SQL : " . $sql;
        }

        if (CLO_DEBUG) {
            # Write into log
            $this->log->write($message);
        }
        return $exception;
    }
}
