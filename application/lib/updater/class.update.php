<?php

/**
 * index
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: index.php UTF-8 , 05-Oct-2014 | 23:02:46 nwdo ε
 */

/*
 * Set the script max execution time
 */
ini_set('max_execution_time', 0);

define('UPDATE_DIR_TEMP', LIB_PATH . 'updater' . DS . 'temp');
define('UPDATE_DIR_INSTALL', NEDOXROOT);
/**
 * Handle Upgrade/update process of Closhare+plus.
 */
class AutoUpdate
{
	/*
	 * Enable logging
	 */
	private $_log = false;

	/* 
	 * Log file
	 */
	public $logFile = '.updatelog';

	/*
	 * The last error
	 */
	private $_lastError = null;

	/*
	 * Current version
	 */
	public $currentVersion = 0;

	/*
	 * Name of the latest version
	 */
	public $latestVersionName = '';

	/*
	 * The latest version
	 */
	public $latestVersion = null;

	/*
	 * Url to the latest version of the update
	 */
	public $latestUpdate = null;

	/*
	 * Url to the update folder on the server
	 */
	public $updateUrl = 'http://closhare.xneda.com/static/update_server/';

	/*
	 * Version filename on the server
	 */
	public $updateIni = 'update.ini';

	/*
	 * Temporary download directory
	 */
	public $tempDir = UPDATE_DIR_TEMP;

	/*
	 * Remove temprary directory after installation
	 */
	public $removeTempDir = true;

	/*
	 * Install directory
	 */
	public $installDir = UPDATE_DIR_INSTALL;

	/*
	 * Create new folders with this privileges
	 */
	public $dirPermissions = 0755;

	/*
	 * Update script filename
	 */
	public $updateScriptName = '_autoupdate.handler.php';

	/*
	 * Create new instance
	 *
	 * @param bool $log Default: false
	 */
	public function __construct($log = false)
	{
		$this->_log = $log;
	}

	/* 
	 * Log a message if logging is enabled
	 *
	 * @param string $message The message
	 *
	 * @return void
	 */
	public function log($message)
	{
		if ($this->_log) {
			$this->_lastError = $message;

			$log = fopen($this->logFile, 'a');

			if ($log) {
				$message = date('<Y-m-d H:i:s>') . $message . "\n";
				fputs($log, $message);
				fclose($log);
			} else {
				die('Could not write log file!');
			}
		}
	}

	/*
	 * Get the latest error
	 *
	 * @return string Last error
	 */
	public function getLastError()
	{
		if (!is_null($this->_lastError))
			return $this->_lastError;
		else
			return false;
	}

	private function _removeDir($dir)
	{
		if (is_dir($dir)) {
			$objects = scandir($dir);
			foreach ($objects as $object) {
				if ($object != "." && $object != "..") {
					if (is_dir($dir . $object))
						$this->_removeDir($dir . $object);
					else
						unlink($dir . $object);
				}
			}
			reset($objects);
			rmdir($dir);
		}
	}

	/*
	 * Check for a new version
	 *
	 * @return string The latest version
	 */
	public function checkUpdate()
	{

		global $updateKey;

		$this->log('Checking for a new update. . .');

		echo "Checking for a new update. . .<br>";
		sleep(1);

		$updateFile = $this->updateUrl . '/update.ini';

		$update = @file_get_contents($updateFile);
		if ($update === false) {
			$this->log('Could not retrieve update file `' . $updateFile . '`');
			return false;
		} else {
			$versions = parse_ini_string($update, true);

			if (is_array($versions)) {
				$keyOld = $this->currentVersion;
				$latest = 0;
				$update = '';
				$keyNew = $keyOld;

				//var_dump($versions, $_SESSION, $keyOld);

				foreach ($versions as $key => $version) {
					if ($key > $keyOld) {
						$keyNew = $key;
						$latest = $version['version'];
						$update = $version['url'];
						break;
					}
				}

				$this->latestVersion = $keyNew;
				$this->latestVersionName = $versions[$keyNew]["version"];
				$this->latestUpdate = $update;

				if ($keyOld > $this->currentVersion) {

					$this->log('New version found `' . $latest . '`.');
				} else {

					$this->log('Current version of Closhare+plus(v' . $this->latestVersionName . ') is up to date!');
				}

				return $keyNew;
			} else {
				$this->log('Unable to parse update file!');
				return false;
			}
		}
	}

	/*
	 * Download the update
	 *
	 * @param string $updateUrl Url where to download from
	 * @param string $updateFile Path where to save the download
	 */
	public function downloadUpdate($updateUrl, $updateFile)
	{

		$this->log('Downloading update...');

		echo 'Downloading update. . .<br>';

		$update = @file_get_contents($updateUrl);

		if ($update === false) {
			$this->log('Could not download update `' . $updateUrl . '`!');

			echo "Could not download update file!<br>";

			return false;
		}

		$handle = fopen($updateFile, 'w');

		if (!$handle) {
			$this->log('Could not save update file `' . $updateFile . '`!');

			echo "Could not save update file file!<br>";
			return false;
		}

		if (!fwrite($handle, $update)) {

			$this->log('Could not write to update file `' . $updateFile . '`!');

			echo "Could not write to update file file!<br>";

			return false;
		}

		usleep(700000);

		fclose($handle);

		return true;
	}

	/*
	 * Install update
	 *
	 * @param string $updateFile Path to the update file
	 */
	public function install($updateFile)
	{
		$zip = zip_open($updateFile);

		$runscriptPath = "";

		while ($file = zip_read($zip)) {
			$filename = zip_entry_name($file);
			$foldername = $this->installDir . dirname($filename);

			$this->log('Updating `' . $filename . '`!');

			if ($filename != $this->updateScriptName) {
				echo "Updating `" . $filename . "`<br>";
				usleep(50000);
			}
			if (!is_dir($foldername)) {
				if (!mkdir($foldername, $this->dirPermissions, true)) {
					$this->log('Could not create folder `' . $foldername . '`!');
				}
			}

			$contents = zip_entry_read($file, zip_entry_filesize($file));

			//Skip if entry is a directory
			if (substr($filename, -1, 1) == "/")
				continue;

			//check file is existance else create it
			//                        if(!file_exists($this->installDir.$filename)){
			//                            
			//                            @file_put_contents($this->installDir.$filename, "success");
			//                            @chmod($tar, 0755);
			//                            
			//                            $this->log('New file creating... `'.$this->installDir.$filename.'`!');
			//                            
			//                        }
			//Write to file


			$updateHandle = @fopen($this->installDir . $filename, 'w');

			if (!$updateHandle) {
				$this->log('Could not update file `' . $this->installDir . $filename . '`!');
				return false;
			}

			if (!is_writable($this->installDir . $filename)) {
				$this->log('Could not update `' . $this->installDir . $filename . '`, not writeable!');
				return false;
			}

			if (!fwrite($updateHandle, $contents)) {
				$this->log('Could not write to file `' . $this->installDir . $filename . '`!');
				return false;
			}

			fclose($updateHandle);

			//If file is a update script, include
			if ($filename == $this->updateScriptName) {

				$runscriptPath = $this->installDir . $filename;
			}
		}

		zip_close($zip);

		sleep(1);

		if ($runscriptPath) :
			// run update script
			$this->log('Try to include update script `' . $runscriptPath . '`.');
			require_once $runscriptPath;
			//setup
			echo "Configuring other stuff. . .<br>";

			$this->log('Update script `' . $runscriptPath . '` included!');
			usleep(400000);

			unlink($runscriptPath);
		endif;

		if ($this->removeTempDir) {
			$this->log('Temporary directory `' . $this->tempDir . '` deleted.');
			$this->_removeDir($this->tempDir);
		}

		$this->log('Update `' . $this->latestVersionName . '` installed successfully.');

		return true;
	}


	/*
	 * Update to the latest version
	 */
	public function update()
	{
		//Check for latest version
		if ((is_null($this->latestVersion)) or (is_null($this->latestUpdate))) {
			$this->checkUpdate();
		}

		if ((is_null($this->latestVersion)) or (is_null($this->latestUpdate))) {
			return false;
		}

		//Update
		if ($this->latestVersion > $this->currentVersion) {

			$this->log('Updating...');

			echo "Updating...<br>";
			usleep(700000);

			//Add slash at the end of the path
			if ((substr($this->tempDir, -1, 1) != DS))
				$this->tempDir = $this->tempDir . DS;

			if ((!is_dir($this->tempDir)) and (!mkdir($this->tempDir, 0777, true))) {
				$this->log('Temporary directory `' . $this->tempDir . '` does not exist and could not be created!');
				return false;
			}

			if (!is_writable($this->tempDir)) {
				$this->log('Temporary directory `' . $this->tempDir . '` is not writeable!');
				return false;
			}

			$updateFile = $this->tempDir . DS . $this->latestVersion . '.zip';
			$updateUrl = $this->updateUrl . '/?fetch=' . $this->latestVersion . '.zip';

			//Download update
			if (is_file($updateFile)) {
				unlink($updateFile);
			}
			if (!is_file($updateFile)) {
				if (!$this->downloadUpdate($updateUrl, $updateFile)) {
					$this->log('Failed to download update!');
					return false;
				}

				$this->log('Latest update downloaded to `' . $updateFile . '`.');
			} else {
				$this->log('Latest update already downloaded to `' . $updateFile . '`.');
			}

			//Unzip
			return $this->install($updateFile);
		} else {
			$this->log('No update available!');
			return false;
		}
	}
}
