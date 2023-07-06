<?php

/**
 * ImageWatermark
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: ImageWatermark.php UTF-8 , 22-Oct-2014 | 11:25:03 nwdo ε
 */

namespace Nedo\Image;

class ImageWatermark
{

    /**
     * 
     * @param type $src
     * @param type $watermark
     * @param type $save+
     */
    public static function watermarkText($src, $watermark, $save = NULL)
    {
        list($width, $height) = getimagesize($src);

        $image_p = Image::create($width, $height);

        $image = Image::open($src);

        //imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width, $height);

        Adapter::merge($image_p, 0, 0, $width, $height);

        $txtcolor = imagecolorallocate($image_p, 255, 255, 255);
        $font = 'Jura.ttf';
        $font_size = 50;
        imagettftext($image_p, $font_size, 0, 50, 150, $txtcolor, $font, $watermark);
        if ($save <> '') {
            imagejpeg($image_p, $save, 100);
        } else {
            //header('Content-Type: image/jpeg');
            //imagejpeg($image_p, null, 100);
        }
        imagedestroy($image);
        imagedestroy($image_p);
    }

    /**
     * Function to add image watermark (this function is not ready in version 1.5)
     * 
     * @param type $SourceFile
     * @param type $WaterMark
     * @param type $DestinationFile
     * @param type $opacity
     */
    public static function watermarkImage($SourceFile, $WaterMark, $DestinationFile = NULL, $opacity)
    {

        $main_img = $SourceFile;
        $watermark_img = $WaterMark;
        $padding = 3;
        $opacity = $opacity;

        $watermark = imagecreatefromgif($watermark_img); // create watermark
        $image = imagecreatefromjpeg($main_img); // create main graphic

        if (!$image || !$watermark)
            die("Error: main image or watermark could not be loaded!");

        $watermark_size = getimagesize($watermark_img);
        $watermark_width = $watermark_size[0];
        $watermark_height = $watermark_size[1];

        $image_size = getimagesize($main_img);
        $dest_x = $image_size[0] - $watermark_width - $padding;
        $dest_y = $image_size[1] - $watermark_height - $padding;

        // copy watermark on main image
        imagecopymerge($image, $watermark, $dest_x, $dest_y, 0, 0, $watermark_width, $watermark_height, $opacity);
        if ($DestinationFile <> '') {
            imagejpeg($image, $DestinationFile, 100);
        } else {
            header('Content-Type: image/jpeg');
            imagejpeg($image);
        }
        imagedestroy($image);
        imagedestroy($watermark);
    }
}
