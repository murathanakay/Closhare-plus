<?php

/**
 * content
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.content.php UTF-8 , 22-Jun-2013 | 23:48:02 nwdo ε
 */

namespace Nedo;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

class archive
{

    var $WathArchive = array(
        '.zip' => 'zip',
        '.tar' => 'tar',
        '.gz' => 'gz',
        '.gzip' => 'gz',
        '.bzip' => 'bz',
        '.bz' => 'bz',
        '.bzip2' => 'bz',
        '.bz2' => 'bz',
        '.tgz' => 'gz',
        '.tgzip' => 'gz',
        '.tbzip' => 'bz',
        '.tbz' => 'bz',
        '.tbzip2' => 'bz',
        '.tbz2' => 'bz',
    );

    function download($src, $name)
    {
        header('Content-Type: application/force-download');
        header("Content-Transfer-Encoding: binary");
        header("Cache-Control: no-cache, must-revalidate, max-age=60");
        header("Expires: Sat, 01 Jan 2000 12:00:00 GMT");
        header('Content-Disposition: attachment;filename="' . $name . "\"\n");
        $data = $this->make($src, $name, false);
        header("Content-Length: " . strlen($data));
        print($data);
    }

    function make($src, $name = "Archive.tgz", $returnFile = true)
    {
        $ext = '.' . pathinfo($name, PATHINFO_EXTENSION);
        foreach ($this->WathArchive as $key => $val)
            if (stripos($ext, $key) !== false)
                $comp = $val;
        if ($comp == 'zip') {
            $zip = new zip;
            if ($returnFile)
                $result = $zip->makeZip($src, $dest);
            else {
                $tmpZip = './' . md5(serialize($src)) . '.zip';
                $result = $zip->makeZip($src, $tmpZip);
                $result = file_get_contents($tmpZip);
                unlink($tmpZip);
            }
            return $result;
        } elseif (strlen($comp) > 1) {
            if (count($src) > 1 || is_dir($src[0]) || $comp == 'tar') {
                $tar = new tar;
                $src = $tar->makeTar($src);
            }
            if ($comp == 'bz') {
                $bzip2 = new bzip2;
                $src = $bzip2->makeBzip2($src);
            } elseif ($comp == 'gz') {
                $gzip = new gzip;
                $src = $gzip->makeGzip($src);
            }
            if ($returnFile) {
                file_put_contents($dest, $src);
                return $dest;
            }
            return $src;
        } else
            return 'Specifie a valid format at the end of ' . $name . ' filename ! ';
    }

    function infos($src, $data = false)
    {
        $ext = '.' . pathinfo($src, PATHINFO_EXTENSION);
        foreach ($this->WathArchive as $key => $val)
            if (stripos($ext, $key) !== false)
                $comp = $val;
        if ($comp == 'zip') {
            $zip = new zip;
            $zipresult = $zip->infosZip($src, $data);
            $result['Items'] = count($zipresult);
            $result['UnCompSize'] = 0;
            foreach ($zipresult as $key => $val)
                $result['UnCompSize'] += $zipresult[$key]['UnCompSize'];
            $result['Size'] = filesize($src);
            $result['Ratio'] = $result['UnCompSize'] ? round(100 - $result['Size'] / $result['UnCompSize'] * 100, 1) : false;
        } elseif (strlen($comp) > 1) {
            $tar = new tar;
            if ($comp == 'bz') {
                $bzip2 = new bzip2;
                $result = $bzip2->infosBzip2($src, true);
                $src = $result['Data'];
            } elseif ($comp == 'gz') {
                $gzip = new gzip;
                $result = $gzip->infosGzip($src, true);
                $src = $result['Data'];
            }
            if ($tar->is_tar($src) || is_file($src)) {
                $tarresult = $tar->infosTar($src, false);
                $result['Items'] = count($tarresult);
                $result['UnCompSize'] = 0;
                if (empty($result['Size']))
                    $result['Size'] = is_file($src) ? filesize($src) : strlen($src);
                foreach ($tarresult as $key => $val)
                    $result['UnCompSize'] += $tarresult[$key]['size'];
                $result['Ratio'] = $result['UnCompSize'] ? round(100 - $result['Size'] / $result['UnCompSize'] * 100, 1) : false;
            }
            if (!$data)
                unset($result['Data']);
        } else
            return false;
        return array('Items' => $result['Items'], 'UnCompSize' => $result['UnCompSize'], 'Size' => $result['Size'], 'Ratio' => $result['Ratio'],);
    }

    function extract($src, $dest = false)
    {
        $path_parts = pathinfo($src);
        if (!$dest)
            $dest = $path_parts['dirname'] . '/';
        $ext = '.' . $path_parts['extension'];
        $name = $path_parts['filename'];
        foreach ($this->WathArchive as $key => $val)
            if (stripos($ext, $key) !== false)
                $comp = $val;
        if ($comp == 'zip') {
            $zip = new zip;
            return $zip->extractZip($src, $dest);
        } elseif (strlen($comp) > 1) {
            $tar = new tar;
            if ($comp == 'bz') {
                $bzip2 = new bzip2;
                $src = $bzip2->extractBzip2($src);
            } elseif ($comp == 'gz') {
                $gzip = new gzip;
                $src = $gzip->extractGzip($src);
            }
            if ($tar->is_tar($src) || is_file($src)) {
                return $tar->extractTar($src, $dest);
            } else
                file_put_contents($dest . $name, $src);
            return $dest;
        }
        return false;
    }
}

class zip
{

    /**
      // You can use this class like that.
      $test = new zip;
      $test->makeZip('./','./toto.zip');
      var_export($test->infosZip('./toto.zip'));
      $test->extractZip('./toto.zip', './new/');
     * */
    private $exclude = array();

    function infosZip($src, $data = true)
    {
        if (($zip = zip_open(realpath($src)))) {
            while (($zip_entry = @zip_read($zip))) {
                $path = zip_entry_name($zip_entry);
                if (zip_entry_open($zip, $zip_entry, "r")) {
                    $content[$path] = array(
                        'Ratio' => zip_entry_filesize($zip_entry) ? round(100 - zip_entry_compressedsize($zip_entry) / zip_entry_filesize($zip_entry) * 100, 1) : false,
                        'Size' => zip_entry_compressedsize($zip_entry),
                        'UnCompSize' => zip_entry_filesize($zip_entry),
                        'name' => basename(zip_entry_name($zip_entry))
                    );
                    if ($data)
                        $content[$path]['Data'] = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
                    zip_entry_close($zip_entry);
                } else
                    $content[$path] = false;
            }
            @zip_close($zip);
            return $content;
        }
        return false;
    }


    function extractZip($src, $dest)
    {
        $zip = new \ZipArchive;
        if ($zip->open($src) === true) {
            $zip->extractTo($dest);
            $zip->close();
            return true;
        }
        return false;
    }

    function makeZip($src, $dest)
    {
        global $fhand;
        $zip = new \ZipArchive;
        $src = is_array($src) ? $src : array($src);
        if ($zip->open($dest, \ZipArchive::CREATE) === true) {
            foreach ($src as $item) {
                if (is_dir($item)) {
                    $item = mb_str_replace("/", DS, $item);

                    $this->addZipItem($zip, realpath(dirname($item)), realpath($item));
                } elseif (is_file($item)) {
                    $zip->addFile(realpath($item), basename(realpath($item)));
                }
            }
            $zip->close();
            return true;
        }
        return false;
    }

    function set_exclude($array = array())
    {

        if (!empty($array)) {
            $this->exclude = $array;
        }
    }

    function addZipItem($zip, $racine, $dir, $exclude = array())
    {
        if (is_dir($dir)) {
            $zip->addEmptyDir(mb_str_replace($racine . DS, "", $dir));
            $lst = scandir($dir);
            array_shift($lst);
            array_shift($lst);
            foreach ($lst as $item) {
                if (in_array($item, $this->exclude)) continue;

                $this->addZipItem($zip, $racine, $dir . DS . $item . (is_dir($dir . $item) ? '/' : ''));
            }
        } else {
            $fname = pathinfo($dir, PATHINFO_FILENAME);
            if (!in_array($fname, $this->exclude)) {

                $to = mb_str_replace($racine . DS, '', $dir);
                $zip->addFile($dir, $to);
            }
        }
    }
}
