<?php

/**
 * captcha.image
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: captcha.image.php UTF-8 , 27-Jun-2013 | 01:42:22 nwdo ε
 */

class Captcha
{

    /** Width of the image */
    var $width = 110;

    /** Height of the image */
    var $height = 40;

    /** Dictionary word file (empty for randnom text) */
    var $wordsFile = 'words/en.php';

    var $resourcesPath = 'captcha';

    /** Min word length (for non-dictionary random text generation) */
    var $minWordLength = 4;

    /**
     * Max word length (for non-dictionary random text generation)
     * 
     * Used for dictionary words indicating the word-length
     * for font-size modification purposes
     */
    var $maxWordLength = 5;

    /** Sessionname to store the original text */
    var $session_var = 'uscaptcha';

    /** Background color in RGB-array */
    var $backgroundColor = array(255, 255, 255);

    /** Foreground colors in RGB-array */
    var $colors = array(
        array(27, 78, 181), // blue
    );

    /** Shadow color in RGB-array or null */
    var $shadowColor = null; //array(0, 0, 0);
    var $text;

    /**
     * Font configuration
     *
     * - font: TTF file
     * - spacing: relative pixel space between character
     * - minSize: min font size
     * - maxSize: max font size
     */
    var $fonts = array(
        'Antykwa' => array('spacing' => -1.3, 'minSize' => 20, 'maxSize' => 24, 'font' => 'AntykwaBold.ttf'),
        //'Candice' => array('spacing' => -1.5, 'minSize' => 20, 'maxSize' => 24, 'font' => 'Candice.ttf'),
        //'DingDong' => array('spacing' => -1.5, 'minSize' => 20, 'maxSize' => 24, 'font' => 'Ding-DongDaddyO.ttf'),
        'Duality' => array('spacing' => -1.1, 'minSize' => 20, 'maxSize' => 24, 'font' => 'Duality.ttf'),
        //'Heineken' => array('spacing' => -2, 'minSize' => 20, 'maxSize' => 24, 'font' => 'Heineken.ttf'),
        'Jura' => array('spacing' => -1.1, 'minSize' => 20, 'maxSize' => 24, 'font' => 'Jura.ttf'),
        'StayPuft' => array('spacing' => -1.1, 'minSize' => 20, 'maxSize' => 24, 'font' => 'StayPuft.ttf'),
        'Times' => array('spacing' => -1.1, 'minSize' => 20, 'maxSize' => 24, 'font' => 'TimesNewRomanBold.ttf'),
        'VeraSans' => array('spacing' => -1, 'minSize' => 20, 'maxSize' => 24, 'font' => 'VeraSansBold.ttf'),
    );

    /** Wave configuracion in X and Y axes */
    var $Yperiod = 12;
    var $Yamplitude = 14;
    var $Xperiod = 11;
    var $Xamplitude = 5;

    /** letter rotation clockwise */
    var $maxRotation = 6;

    /**
     * Internal image size factor (for better image quality)
     * 1: low, 2: medium, 3: high
     */
    var $scale = 2;

    /**
     * Blur effect for better image quality (but slower image processing).
     * Better image results with scale=3
     */
    var $blur = true;

    /** Debug? */
    var $debug = false;

    /** Image format: jpeg or png */
    var $imageFormat = 'png';

    /** GD image */
    var $im;

    //   function __construct($config = array()) {
    //       global $core;
    //       
    //       if (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    //         $langs = array('en', 'es');
    //         $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
    //         if (in_array($lang, $langs)) {
    //            $this->wordsFile = "words/$lang.php";
    //         }
    //      }      
    //   }

    public function CreateImage()
    {
        $ini = microtime(true);
        /** Initialization */
        $this->ImageAllocate();

        /** Text insertion */
        $text = $this->GetCaptchaText();
        $fontcfg = $this->fonts[array_rand($this->fonts)];

        $this->text = $text;
        @session_start();
        $_SESSION["uscaptcha"] = $this->text;

        $this->WriteText($text, $fontcfg);

        /** Transformations */
        $this->WaveImage();
        if ($this->blur && function_exists('imagefilter')) {
            imagefilter($this->im, IMG_FILTER_GAUSSIAN_BLUR);
        }
        $this->ReduceImage();


        if ($this->debug) {
            imagestring(
                $this->im,
                1,
                1,
                $this->height - 8,
                "$text {$fontcfg['font']} " . round((microtime(true) - $ini) * 1000) . "ms",
                $this->GdFgColor
            );
        }


        /** Output */
        $this->WriteImage();
        $this->Cleanup();
    }

    /**
     * Creates the image resources
     */
    function ImageAllocate()
    {
        // Cleanup
        if (!empty($this->im)) {
            imagedestroy($this->im);
        }

        $im = $this->im = imagecreatetruecolor($this->width * $this->scale, $this->height * $this->scale);


        // Background color (transparents)
        $almostblack = imagecolorallocate($this->im, 254, 254, 254);

        imagefill($this->im, 0, 0, $almostblack);
        $black = imagecolorallocate($this->im, 0, 0, 0);
        imagecolortransparent($this->im, $almostblack);
        // Foreground color
        $color = $this->colors[mt_rand(0, sizeof($this->colors) - 1)];

        $this->GdFgColor = imagecolorallocate($this->im, $color[0], $color[1], $color[2]);
    }

    /**
     * Text generation
     *
     * @return string Text
     */
    function GetCaptchaText()
    {
        //      $text = $this->GetDictionaryCaptchaText();
        //      if (!$text) {
        //         $text = $this->GetRandomCaptchaText();
        //      }
        return $this->GetRandomCaptchaText();
    }

    /**
     * Random text generation
     *
     * @return string Text
     */
    function GetRandomCaptchaText($length = null)
    {
        if (empty($length)) {
            $length = rand($this->minWordLength, $this->maxWordLength);
        }

        $words = "abcdefghijlmnopqrstvwyz";
        $vocals = "aeiou";

        $text = "";
        $vocal = rand(0, 1);
        for ($i = 0; $i < $length; $i++) {
            if ($vocal) {
                $text .= substr($vocals, mt_rand(0, 4), 1);
            } else {
                $text .= substr($words, mt_rand(0, 22), 1);
            }
            $vocal = !$vocal;
        }
        return $text;
    }

    /**
     * Random dictionary word generation
     *
     * @param boolean $extended Add extended "fake" words
     * @return string Word
     */
    function GetDictionaryCaptchaText($extended = false)
    {
        if (empty($this->wordsFile)) {
            return false;
        }

        // Full path of words file
        if (substr($this->wordsFile, 0, 1) == '/') {
            $wordsfile = $this->wordsFile;
        } else {
            $wordsfile = $this->resourcesPath . '/' . $this->wordsFile;
        }

        $fp = fopen($wordsfile, "r");
        $length = strlen(fgets($fp));
        if (!$length) {
            return false;
        }
        $line = rand(1, (filesize($wordsfile) / $length) - 2);
        if (fseek($fp, $length * $line) == -1) {
            return false;
        }
        $text = trim(fgets($fp));
        fclose($fp);


        /** Change ramdom volcals */
        if ($extended) {
            $text = preg_split('//', $text, -1, PREG_SPLIT_NO_EMPTY);
            $vocals = array('a', 'e', 'i', 'o', 'u');
            foreach ($text as $i => $char) {
                if (mt_rand(0, 1) && in_array($char, $vocals)) {
                    $text[$i] = $vocals[mt_rand(0, 4)];
                }
            }
            $text = implode('', $text);
        }

        return $text;
    }

    /**
     * Text insertion
     */
    function WriteText($text, $fontcfg = array())
    {
        if (empty($fontcfg)) {
            // Select the font configuration
            $fontcfg = $this->fonts[array_rand($this->fonts)];
        }

        // Full path of font file
        $fontfile = $this->resourcesPath . '/fonts/' . $fontcfg['font'];


        /** Increase font-size for shortest words: 9% for each glyp missing */
        $lettersMissing = $this->maxWordLength - strlen($this->text);
        $fontSizefactor = 1 + ($lettersMissing * 0.09);

        // Text generation (char by char)
        $x = 20 * $this->scale;
        $y = round(($this->height * 27 / 40) * $this->scale);

        $length = strlen($this->text);
        for ($i = 0; $i < $length; $i++) {
            $degree = rand($this->maxRotation * -1, $this->maxRotation);
            $fontsize = rand($fontcfg['minSize'], $fontcfg['maxSize']) * $this->scale * $fontSizefactor;
            $letter = substr($this->text, $i, 1);
            $coords = imagettftext($this->im, $fontsize, $degree, $x, $y, $this->GdFgColor, $fontfile, $letter);
            $x += ($coords[2] - $x) + ($fontcfg['spacing'] * $this->scale);
        }
    }

    /**
     * Wave filter
     */
    function WaveImage()
    {
        // X-axis wave generation
        $xp = $this->scale * $this->Xperiod * rand(1, 3);
        $k = rand(0, 100);
        for ($i = 0; $i < ($this->width * $this->scale); $i++) {
            imagecopy($this->im, $this->im, $i - 1, sin($k + $i / $xp) * ($this->scale * $this->Xamplitude), $i, 0, 1, $this->height * $this->scale);
        }

        // Y-axis wave generation
        $k = rand(0, 100);
        $yp = $this->scale * $this->Yperiod * rand(1, 2);
        for ($i = 0; $i < ($this->height * $this->scale); $i++) {
            imagecopy($this->im, $this->im, sin($k + $i / $yp) * ($this->scale * $this->Yamplitude), $i - 1, 0, $i, $this->width * $this->scale, 1);
        }
    }

    /**
     * Reduce the image to the final size
     */
    function ReduceImage()
    {
        $imResampled = imagecreatetruecolor($this->width, $this->height);
        $almostblack = imagecolorallocate($this->im, 254, 254, 254);
        imagefill($imResampled, 0, 0, $almostblack);
        $black = imagecolorallocate($imResampled, 0, 0, 0);
        imagecolortransparent($imResampled, $almostblack);

        imagecopyresampled(
            $imResampled,
            $this->im,
            0,
            0,
            0,
            0,
            $this->width,
            $this->height,
            $this->width * $this->scale,
            $this->height * $this->scale
        );
        imagedestroy($this->im);
        $this->im = $imResampled;
    }

    /**
     * File generation
     */
    function WriteImage()
    {
        if ($this->imageFormat == 'png' && function_exists('imagepng')) {
            header("Content-type: image/png");
            imagepng($this->im);
        } else {
            header("Content-type: image/jpeg");
            imagejpeg($this->im, null, 80);
        }
    }

    /**
     * Cleanup
     */
    function Cleanup()
    {
        imagedestroy($this->im);
    }
}

$captcha = new Captcha();
$captcha->CreateImage();