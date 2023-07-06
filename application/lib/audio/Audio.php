<?php

/**
 * Audio
 * @package      Closhare+plus app
 * @copyright    2015
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: Audio.php UTF-8 , 22-Feb-2015 | 21:53:08 nwdo ε
 */

namespace Nedo;

use \stdClass;

/**
 * Read/Guess basic Id3 tags from a supported audio file( Currently Beta, unclear version of this file)
 * 
 * @todo This file will be cleared (Human readable, more understandable) non mandatory methods,vars and statements will be removed.
 */
class Audio
{

    private $wave_id;
    private $wave_type;
    private $wave_compression;
    private $wave_channels;
    private $wave_length;
    private $audio_framerate;
    private $audio_byterate;
    private $audio_bits;
    private $audio_size;
    private $wave_filename;
    private $audio_duration;
    private $id3_tag;
    private $id3_title;
    private $id3_artist;
    private $id3_album;
    private $id3_year;
    private $id3_comment;
    private $id3_genre;
    private $id3v2info;
    private $visual_graph_color; // HTML-Style: "#rrggbb"
    private $visual_background_color;
    private $visual_grid_color;
    private $visual_border_color;
    private $visual_grid; // true/false
    private $visual_border; // true/false
    private $visual_width; // width in pixel
    private $visual_height; // height in pixel
    private $visual_graph_mode; // 0|1
    private $visual_fileformat; // "jpeg","png", everything & else default = "png"
    private $data = array();

    /**
     * mp3info extracts the attributes of mp3-files
     * 
     * @return \Nedo\Audio
     */
    function mp3info($short)
    {

        ob_clean();
        ob_flush();

        $byte = array();

        $this->data = (object) $this->data;

        $version = array("MPEG Version 2.5", false, "MPEG Version 2 (ISO/IEC 13818-3)", "MPEG Version 1 (ISO/IEC 11172-3)");
        $version_bitrate = array(1, false, 1, 0);
        $version_sampling = array(2, false, 1, 0);
        $layer = array(false, "Layer III", "Layer II", "Layer I");
        $layer_bitrate = array(false, 2, 1, 0);
        $layer_lengt = array(false, 1, 1, 0);
        $protection = array("Protected by CRC (16bit crc follows header)", "Not protected");
        $byterate = array(
            array(
                array("free", 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, "bad"),
                array("free", 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, "bad"),
                array("free", 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, "bad")
            ),
            array(
                array("free", 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, "bad"),
                array("free", 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, "bad"),
                array("free", 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, "bad")
            )
        );
        $samplingrate = array(
            array(44100, 48000, 32000, false),
            array(22050, 24000, 16000, false),
            array(11025, 12000, 8000, false)
        );
        $cannel_mode = array("Stereo", "Joint stereo (Stereo)", "Dual channel (Stereo)", "Single channel (Mono)");
        $copyright = array("Audio is not copyrighted", "Audio is copyrighted ");
        $original = array("Copy of original media", "Original media");
        $emphasis = array("none", "50/15 ms", false, "CCIT J.17 ");

        //id3-stuff

        $genre = array(
            "Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B",
            "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop",
            "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "Alternative Rock",
            "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial",
            "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta", "Top 40", "Christian Rap", "Pop/Funk", "Jungle",
            "Native US", "Cabaret", "New Wave", "Psychadelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro",
            "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast Fusion", "Bebob", "Latin", "Revival", "Celtic", "Bluegrass",
            "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic",
            "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club",
            "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhytmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "Acapella", "Euro-House",
            "Dance Hall", "Goa", "Drum & Bass", "Club-House", "Hardcore", "Terror", "Indie", "BritPop", "Negerpunk", "Polsk Punk", "Beat", "Christian Gangsta Rap",
            "Heavy Metal", "Black Metal", "Crossover", "Contemporary Christian", "Christian Rock", "Merengue", "Salsa", "Trash Metal", "Anime", "Jpop", "Synthpop"
        );

        //id3v2 check----------------------------
        $footer = 0;
        $header = 0;
        $v1tag = 0;
        $fp = fopen($this->wave_filename, "r");
        $tmp = fread($fp, 3);
        $this->getId3v2 = null;

        if ($tmp == "ID3") {
            // id3v2 tag is present
            $this->getId3v2($fp);

            // getId3v2 will position pointer at end of header
            $header = ftell($fp);
        } else {
            fseek($fp, 0);
            $this->id3v2 = false;
        }

        for ($x = 0; $x < 4; $x++) {
            $byte[$x] = ord(fread($fp, 1));
        }
        fseek($fp, -128, SEEK_END);
        $TAG = fread($fp, 128);
        fclose($fp);

        //id tag?-------------------------------
        if (substr($TAG, 0, 3) == "TAG") {
            $v1tag = 128;
            $info["mpeg_id3v1_tag"]["title"] = rtrim(substr($TAG, 3, 30));
            $info["mpeg_id3v1_tag"]["artist"] = rtrim(substr($TAG, 33, 30));
            $info["mpeg_id3v1_tag"]["album"] = rtrim(substr($TAG, 63, 30));
            $info["mpeg_id3v1_tag"]["year"] = rtrim(substr($TAG, 93, 4));
            $info["mpeg_id3v1_tag"]["comment"] = rtrim(substr($TAG, 97, 30));
            $info["mpeg_id3v1_tag"]["genre"] = "";
            $tmp = ord(substr($TAG, 127, 1));
            if ($tmp < count($genre)) {
                $info["mpeg_id3v1_tag"]["genre"] = $genre[$tmp];
            }
        } else {
            $info["mpeg_id3v1_tag"] = false;
        }

        //version-------------------------------

        $tmp = $byte[1] & 24;
        $tmp = $tmp >> 3;
        $info_i["mpeg_version"] = $tmp;
        $byte_v = $version_bitrate[$tmp];
        $byte_vs = $version_sampling[$tmp];
        $info["mpeg_version"] = $version[$tmp];

        //layer---------------------------------

        $tmp = $byte[1] & 6;
        $tmp = $tmp >> 1;
        $info_i["mpeg_layer"] = $tmp;
        $byte_l = $layer_bitrate[$tmp];
        $byte_len = $layer_lengt[$tmp];
        $info["mpeg_layer"] = $layer[$tmp];

        //bitrate-------------------------------

        $tmp = $byte[2] & 240;
        $tmp = $tmp >> 4;
        $info_i["mpeg_bitrate"] = $tmp;
        $info["mpeg_bitrate"] = $byterate[$byte_v][$byte_l][$tmp];

        //samplingrate--------------------------

        $tmp = $byte[2] & 12;
        $tmp = $tmp >> 2;
        $info["mpeg_sampling_rate"] = $samplingrate[$byte_vs][$tmp];

        //protection----------------------------

        $tmp = $byte[1] & 1;
        $info["mpeg_protection"] = $protection[$tmp];

        //paddingbit----------------------------

        $tmp = $byte[2] & 2;
        $tmp = $tmp >> 1;
        $byte_pad = $tmp;
        $info["mpeg_padding_bit"] = $tmp;

        //privatebit----------------------------

        $tmp = $byte[2] & 1;
        $byte_prv = $tmp;

        //channel_mode--------------------------

        $tmp = $byte[3] & 192;
        $tmp = $tmp >> 6;
        $info["mpeg_channel_mode"] = $cannel_mode[$tmp];

        //copyright-----------------------------

        $tmp = $byte[3] & 8;
        $tmp = $tmp >> 3;
        $info["mpeg_copyright"] = $copyright[$tmp];

        //original------------------------------

        $tmp = $byte[3] & 4;
        $tmp = $tmp >> 2;
        $info["mpeg_original"] = $original[$tmp];

        //emphasis------------------------------

        $tmp = $byte[3] & 3;
        $info["mpeg_emphasis"] = $emphasis[$tmp];

        //framelenght---------------------------

        if ($info["mpeg_bitrate"] == 'free' or $info["mpeg_bitrate"] == 'bad' or !$info["mpeg_bitrate"] or !$info["mpeg_sampling_rate"]) {
            $info["mpeg_framelength"] = 0;
        } else {
            if ($byte_len == 0) {
                $rate_tmp = $info["mpeg_bitrate"] * 1000;
                $info["mpeg_framelength"] = (12 * $rate_tmp / $info["mpeg_sampling_rate"] + $byte_pad) * 4;
            } elseif ($byte_len == 1) {
                $rate_tmp = $info["mpeg_bitrate"] * 1000;
                $info["mpeg_framelength"] = 144 * $rate_tmp / $info["mpeg_sampling_rate"] + $byte_pad;
            }
        }

        //audio_duration------------------------------

        $tmp = filesize($this->wave_filename);
        $tmp = $tmp - $header - 4 - $v1tag;

        $tmp2 = 0;
        $info["mpeg_frames"] = "";
        $info["mpeg_playtime"] = "";
        if (!$info["mpeg_bitrate"] or $info["mpeg_bitrate"] == 'bad' or !$info["mpeg_sampling_rate"]) {
            $info["mpeg_playtime"] = -1;
        } elseif ($info["mpeg_bitrate"] == 'free') {
            $info["mpeg_playtime"] = -1;
        } else {
            $tmp2 = ((8 * $tmp) / 1000) / $info["mpeg_bitrate"];
            $info["mpeg_frames"] = floor($tmp / $info["mpeg_framelength"]);
            $tmp = $tmp * 8;
            if ($rate_tmp <> 0) {
                $info["mpeg_playtime"] = $tmp / $rate_tmp;
            }
            $info["mpeg_playtime"] = $tmp2;
        }

        // transfer the extracted data into classAudio File-structure
        // Currently only these informations is enough.
        $this->data->audio_id = $this->wave_id = "MPEG";
        $this->data->audio_type = $this->wave_type = $info["mpeg_version"];
        $this->data->audio_compression = $this->wave_compression = $info["mpeg_layer"];
        $this->data->audio_channels = $this->wave_channels = $info["mpeg_channel_mode"];

        $this->data->audio_framerate = $this->audio_framerate = $info["mpeg_sampling_rate"];

        $this->data->audio_byterate = $this->audio_byterate = $info["mpeg_bitrate"] . " Kbps";

        $this->data->audio_bits = $this->audio_bits = "n/a";

        $this->data->audio_size = $this->audio_size = filesize($this->wave_filename);

        $this->data->audio_duration = $this->audio_duration = $info["mpeg_playtime"];

        $this->data->audio_duration_formatted = $this->audio_duration_formatted = gmdate($this->audio_duration >= 3600 ? 'H:i:s' : 'i:s', $this->audio_duration);


        // pick up length from id3v2 tag if necessary and available
        if ($this->audio_duration < 1 && is_array($this->id3v2->TLEN)) {
            $this->audio_duration = ($this->id3v2->TLEN['value'] / 1000);
        }

        //        $this->data->mb = mb_detect_encoding($str, "auto");

        $this->id3_tag = $info["mpeg_id3v1_tag"];

        if ($this->id3_tag) {

            $this->data->id3 = array();

            $this->id3_title = $info["mpeg_id3v1_tag"]["title"];
            $this->id3_artist = $info["mpeg_id3v1_tag"]["artist"];
            $this->id3_album = $info["mpeg_id3v1_tag"]["album"];
            $this->id3_year = $info["mpeg_id3v1_tag"]["year"];
            $this->id3_comment = $info["mpeg_id3v1_tag"]["comment"];
            $this->id3_genre = $info["mpeg_id3v1_tag"]["genre"];

            $this->data->id3 = (object) $this->data->id3;
            //push id3 tags to data
            foreach ($info["mpeg_id3v1_tag"] as $key => $value) {
                if ($value && $key !== null) {

                    $newValue = cleaner((mb_convert_encoding($value, "UTF-8", "ASCII")));

                    if ($key == 'comment') {
                        $newValue = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $value);
                    }

                    $this->data->id3->{ucfirst($key)} = $newValue;
                }
            }
        }

        $return = $this->data;

        //        var_dump($this->data, $this->wave_filename);

        //@unset($this);

        return $return;
    }

    /**
     * longCalc calculates the decimal value of 4 bytes
     * mode = 0 ... b1 is the byte with least value
     * mode = 1 ... b1 is the byte with most value
     * 
     * @param type $b1
     * @param type $b2
     * @param type $b3
     * @param type $b4
     * @param type $mode
     * @return type
     */
    function longCalc($b1, $b2, $b3, $b4, $mode)
    {
        $b1 = hexdec(bin2hex($b1));
        $b2 = hexdec(bin2hex($b2));
        $b3 = hexdec(bin2hex($b3));
        $b4 = hexdec(bin2hex($b4));
        if ($mode == 0) {
            return ($b1 + ($b2 * 256) + ($b3 * 65536) + ($b4 * 16777216));
        } else {
            return ($b4 + ($b3 * 256) + ($b2 * 65536) + ($b1 * 16777216));
        }
    }

    /**
     * shortCalc calculates the decimal value of 2 bytes
     * mode = 0 ... b1 is the byte with least value
     * mode = 1 ... b1 is the byte with most value
     * 
     * @param type $b1
     * @param type $b2
     * @param type $b3
     * @param type $b4
     * @param type $mode
     * @return type
     */
    function shortCalc($b1, $b2, $mode)
    {
        $b1 = hexdec(bin2hex($b1));
        $b2 = hexdec(bin2hex($b2));
        if ($mode == 0) {
            return ($b1 + ($b2 * 256));
        } else {
            return ($b2 + ($b1 * 256));
        }
    }

    /**
     * getCompression delivers a string which identifies the compression-mode of the Audio File-Object
     * 
     * @param type $id
     * @return type
     */
    function getCompression($id)
    {
        if ($this->wave_id != "MPEG" && $this->wave_id != "OGG") {
            $append = "($id)";
            switch ($id) {
                case 0:
                    return ("unknown $append");
                    break;
                case 1:
                    return ("pcm/uncompressed $append");
                    break;
                case 2:
                    return ("microsoft adpcm $append");
                    break;
                case 6:
                    return ("itu g.711 a-law $append");
                    break;
                case 7:
                    return ("itu g.711 u-law $append");
                    break;
                case 17:
                    return ("ima adpcm $append");
                    break;
                case 20:
                    return ("itu g.723 adpcm (yamaha) $append");
                    break;
                case 49:
                    return ("gsm 6.10 $append");
                    break;
                case 64:
                    return ("itu g.721 adpcm $append");
                    break;
                case 80:
                    return ("mpeg $append");
                    break;
                case 65536:
                    return ("experimental $append");
                    break;
                default:
                    return ("not defined $append");
                    break;
            }
        } else {
            return ($id);
        }
    }

    /**
     * getVisualization creates a graphical visualization of the audio-sample (works ONLY * for uncompressed waves! * files with 1 or 2 channels * 8/16/24/32 bit sample-resolution )
     * 
     * @param type $output
     */
    function getVisualization($output)
    {
        $width = $this->visual_width;
        $height = $this->visual_height;
        $height_channel = $height / $this->wave_channels;
        if ($this->wave_filename <> "" && $this->wave_id == "RIFF" && $this->wave_type == "WAVE" && ($this->wave_channels >= 1 && $this->wave_channels <= 2) && $this->audio_bits % 8 == 0) {
            $file = fopen($this->wave_filename, "r");

            // read the first 12 bytes (RIFF- & WAVE-chunk)

            for ($i = 0; $i < 12; $i++) {
                $null = fgetc($file);
            }

            // Read the next chunk-id, supposed to be "fmt "

            $chunk_id_3 = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
            if ($chunk_id_3 == "fmt ") {
                $chunk_size_3 = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                for ($i = 0; $i < $chunk_size_3; $i++) {
                    $null = fgetc($file);
                }

                // Read the next chunk-id, supposed to be "data"
                $chunk_id_4 = "";
                while ($chunk_id_4 <> "data" && !feof($file)) {
                    $chunk_id_4 = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                    if ($chunk_id_4 <> "data") {
                        $chunk_size_4 = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                        for ($i = 0; $i < $chunk_size_4; $i++) {
                            $null = fgetc($file);
                        }
                    }
                }
                if ($chunk_id_4 == "data") {
                    $chunk_size_4 = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                    $visualData = array();
                    $bytes_per_frame = ($this->audio_bits / 8) * ($this->wave_channels);
                    $bytes_per_channel = ($this->audio_bits / 8);
                    $frames = $chunk_size_4 / $bytes_per_frame;
                    $visual_frames = ceil($frames / $width);
                    $frame_index = 1;
                    $data_index = 1;

                    // revised code -- computing bytes per pixel allows quick processing of large (>10MB) wavs by fseek()ing past unused data
                    $bytes_per_pixel = floor($chunk_size_4 / $width);
                    $currentindex = 0;
                    while (!feof($file) && $currentindex < $chunk_size_4) {
                        $loopindex = 0;
                        for ($j = 0; $j < $this->wave_channels; $j++) {
                            $bytes = array();
                            for ($i = 0; $i < $bytes_per_channel; $i++) {
                                $bytes[$i] = fgetc($file);
                                $loopindex++;
                            }
                            switch ($bytes_per_channel) {
                                case 1:
                                    $visualData[$j][$data_index] = $this->shortCalc($bytes[0], $bytes[1], 0);
                                    break;
                                case 2:
                                    $f = 128;
                                    if (ord($bytes[1]) & 128)
                                        $f = 0;
                                    $x = chr((ord($bytes[1]) & 127) + $f);
                                    $visualData[$j][$data_index] = floor($this->shortCalc($bytes[0], $x, 0) / 256);
                                    break;
                            }
                            if (($j + 1) == $this->wave_channels) {
                                $data_index++;
                            }
                        }
                        $currentindex += ($bytes_per_pixel - $loopindex);
                        fseek($file, $bytes_per_pixel, SEEK_CUR);
                    }
                    //$im = @ImageCreate ($width, (256*$this->wave_channels)+1) or die ("Cannot Initialize new GD image stream!");
                    $im = @ImageCreate($width, $height) or die("Cannot Initialize new GD image stream!");
                    $background_color = ImageColorAllocate($im, hexdec(substr($this->visual_background_color, 1, 2)), hexdec(substr($this->visual_background_color, 3, 2)), hexdec(substr($this->visual_background_color, 5, 2)));
                    $cBlack = ImageColorAllocate($im, hexdec(substr($this->visual_background_color, 1, 2)), hexdec(substr($this->visual_background_color, 3, 2)), hexdec(substr($this->visual_background_color, 5, 2)));
                    $cGreen = ImageColorAllocate($im, hexdec(substr($this->visual_graph_color, 1, 2)), hexdec(substr($this->visual_graph_color, 3, 2)), hexdec(substr($this->visual_graph_color, 5, 2)));
                    $cRed = ImageColorAllocate($im, hexdec(substr($this->visual_border_color, 1, 2)), hexdec(substr($this->visual_border_color, 3, 2)), hexdec(substr($this->visual_border_color, 5, 2)));
                    $cBlue = ImageColorAllocate($im, hexdec(substr($this->visual_grid_color, 1, 2)), hexdec(substr($this->visual_grid_color, 3, 2)), hexdec(substr($this->visual_grid_color, 5, 2)));
                    if ($this->visual_border) {
                        ImageRectangle($im, 0, 0, ($width - 1), ($height - 1), $cRed);
                        for ($i = 0; $i <= $this->wave_channels; $i++) {
                            ImageLine($im, 1, ($i * ($height_channel / 2)) + ($height_channel / 2), $width, ($i * ($height_channel / 2)) + ($height_channel / 2), $cRed);
                        }
                    }
                    if ($this->visual_grid) {
                        for ($i = 1; $i <= ($width / 100 * 2); $i++) {
                            ImageLine($im, $i * 50, 0, $i * 50, (256 * $this->wave_channels), $cBlue);
                        }
                    }

                    // this for-loop draws a graph for every channel

                    for ($j = 0; $j < sizeof($visualData); $j++) {
                        $last_x = 1;
                        $last_y = $height_channel / 2;

                        // this for-loop draws the graphs itself

                        for ($i = 1; $i < sizeof($visualData[$j]); $i++) {
                            $faktor = 128 / ($height_channel / 2);
                            $val = $visualData[$j][$i] / $faktor;
                            if ($this->visual_graph_mode == 0) {
                                ImageLine($im, $last_x, ($last_y + ($j * $height_channel)), $i, ($val + ($j * $height_channel)), $cGreen);
                            } else {
                                ImageLine($im, $i, (($height_channel / 2) + ($j * $height_channel)), $i, ($val + ($j * $height_channel)), $cGreen);
                            }
                            $last_x = $i;
                            $last_y = $val;
                        }
                    }

                    // change this to generate JPG or direct output to browser
                    if (strtolower($this->visual_fileformat) == "jpeg") {
                        ImageJpeg($im, $output);
                    } else {
                        ImagePng($im, $output);
                    }
                }
            }
            fclose($file);
        } else {
            // AudioSample - Audio File-Object not initialized!

            return false;
        }
    }

    /**
     * extracts the attributes of the Audio File-Object
     * 
     * @return type
     */
    function getSampleInfo($short = false)
    {
        $valid = true;

        if (strstr(strtoupper($this->wave_filename), "MP3")) {

            return $this->mp3info($short);
        } elseif (substr(strtoupper($this->wave_filename), -3) == "OGG") {

            return $this->ogginfo($short);
        } else {

            $this->data = (object) $this->data;

            $this->data->audio_size = $this->audio_size = filesize($this->wave_filename);

            if ($this->audio_size > 16) {
                $file = fopen($this->wave_filename, "r");
                $chunk_id = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                $null = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                $chunk_id_2 = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                $this->data->audio_id = $this->wave_id = $chunk_id;
                $this->data->audio_type = $this->wave_type = $chunk_id_2;
                if (substr($chunk_id, 0, 2) == "PK") {
                    // it's a ZIP-file

                    $this->wave_id = "ZIP";
                    $this->wave_type = "ZIP";
                    $this->valid = true;
                } else {
                    if ($this->wave_id == "RIFF" && $this->wave_type == "WAVE") {
                        // it's a Wave-File

                        $chunk_id = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                        $chunk_size = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                        if ($chunk_id == "fmt ") {
                            $format_len = $chunk_size;
                            $this->data->audio_compression = $this->wave_compression = $this->shortCalc(fgetc($file), fgetc($file), 0);
                            $this->data->audio_channels = $this->wave_channels = $this->shortCalc(fgetc($file), fgetc($file), 0);
                            $this->data->audio_framerate = $this->audio_framerate = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                            $this->data->audio_byterate = $this->audio_byterate = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                            $null = fgetc($file) . fgetc($file);
                            $this->data->audio_bits = $this->audio_bits = $this->shortCalc(fgetc($file), fgetc($file), 0);
                            $read = 16;
                            if ($read < $format_len) {
                                $extra_bytes = $this->shortCalc(fgetc($file), fgetc($file), 1);
                                $j = 0;
                                while ($j < $extra_bytes && !feof($file)) {
                                    $null = fgetc($file);
                                    $j++;
                                }
                            }
                            $chunk_id = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                            $chunk_size = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                            if ($chunk_id == "data") {
                                $this->data->audio_duration = $this->audio_duration = (($chunk_size / $this->wave_channels) / ($this->audio_bits / 8)) / $this->audio_framerate;
                            } else {
                                while ($chunk_id <> "data" && !feof($file)) {
                                    $j = 1;
                                    while ($j <= $chunk_size && !feof($file)) {
                                        $null = fgetc($file);
                                        $j++;
                                    }
                                    $chunk_id = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                                    //print "<br>$chunk_id*";
                                    $chunk_size = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                                }
                                if ($chunk_id == "data") {
                                    $this->data->audio_duration = $this->audio_duration = (($chunk_size / $this->wave_channels) / ($this->audio_bits / 8)) / $this->audio_framerate;
                                }
                            }
                        } else {
                            $valid = false;
                        }
                    } else {
                        if ($this->wave_id == "FORM" && $this->wave_type == "AIFF") {
                            // we have a AIFF file here

                            $chunk_id = fgetc($file) . fgetc($file) . fgetc($file) . fgetc($file);
                            $chunk_size = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 0);
                            if ($chunk_id == "COMM") {
                                $format_len = $chunk_size;
                                $this->data->wave_channels = $this->wave_channels = $this->shortCalc(fgetc($file), fgetc($file), 1);
                                $null = $this->longCalc(fgetc($file), fgetc($file), fgetc($file), fgetc($file), 1);
                                $this->data->audio_bits = $this->audio_bits = $this->shortCalc(fgetc($file), fgetc($file), 1);
                                $null = fgetc($file) . fgetc($file);
                                $this->data->audio_framerate = $this->audio_framerate = $this->shortCalc(fgetc($file), fgetc($file), 1);

                                $read = 16;
                            } else {
                                $valid = false;
                            }
                        } else {
                            // probably crap

                            $valid = false;
                        }
                    }
                }
                fclose($file);

                return $this->data;
            } else {
                $valid = false;
            }


            return $valid;
        }
    }

    /**
     * initializes the Audio File-Object
     * 
     * @param type $loadFilename
     * @return type
     */
    public function loadFile($loadFilename)
    {

        $this->wave_filename = $loadFilename;

        return $this->getSampleInfo(true);

        ob_clean();
        ob_flush();
        flush();
    }

    /**
     * Loads id3v2 frames into $this->id3v2-><frameid>
     * any frame flags are saved in an array called <frameid>_flags
     * @example song title will be in $this->id3v2->TIT2
     * @link http://www.id3.org/id3v2.4.0-frames.txt for common frame id codes.
     * @link http://www.id3.org/id3v2.4.0-structure.txt for more info on format.
     * 
     * @param type $fp
     * @return int
     */
    function getId3v2(&$fp)
    {
        // ID3v2 version 4 support -- see http://www.id3.org/id3v2.4.0-structure.txt
        $footer = 0;

        $this->id3v2 = new \stdClass();

        // id3v2 version
        $tmp = ord(fread($fp, 1));
        $tmp2 = ord(fread($fp, 1));
        $this->id3v2->version = "ID3v2." . $tmp . "." . $tmp2;

        // flags
        $tmp = ord(fread($fp, 1));
        if ($tmp & 128)
            $this->id3v2->unsynch = "1";
        if ($tmp & 64)
            $this->id3v2->extended = "1";
        if ($tmp & 32)
            $this->id3v2->experimental = "1";
        if ($tmp & 16) {
            $this->id3v2->footer = "1";
            $footer = 10;
        }

        // tag size
        $tagsize = $this->get32bitSynchsafe($fp) + $footer;

        // extended header
        if (isset($this->id3v2->extended) && $this->id3v2->extended == 1) {
            // get extended header size
            $extended_header_size = $this->get32bitSynchsafe($fp);

            // load (but ignore) extended header
            $this->id3v2->extended_header = fread($fp, $extended_header_size);
        }

        // get the tag contents
        while (ftell($fp) < ($tagsize + 10)) {
            // get next frame header
            $frameid = fread($fp, 4);

            if (trim($frameid) == "")
                break;

            $framesize = $this->get32bitSynchsafe($fp);
            $frameflags0 = ord(fread($fp, 1));
            $frameflags1 = ord(fread($fp, 1));

            $frameidflags = $frameid . "_flags";


            if ($frameflags0 & 128)
                $this->id3v2->{$frameidflags}['tag_alter_discard'] = 1;
            if ($frameflags0 & 64)
                $this->id3v2->{$frameidflags}['file_alter_discard'] = 1;
            if ($frameflags0 & 32)
                $this->id3v2->{$frameidflags}['readonly'] = 1;

            // frame format flags
            if ($frameflags1 & 128)
                $this->id3v2->{$frameidflags}['group'] = 1;
            if ($frameflags1 & 16)
                $this->id3v2->{$frameidflags}['compressed'] = 1;
            if ($frameflags1 & 8)
                $this->id3v2->{$frameidflags}['encrypted'] = 1;
            if ($frameflags1 & 4)
                $this->id3v2->{$frameidflags}['unsyrchronised'] = 1;
            if ($frameflags1 & 2)
                $this->id3v2->{$frameidflags}['data_length_indicator'] = 1;

            // get frame contents
            if ($frameid !== null) {
                //                var_dump($fp, $framesize);
                $this->id3v2->{$frameid} = $this->readfile_chunked_remote($fp, $framesize);
            }
        }

        // position $fp at end of id3v2header
        fseek($fp, ($tagsize + 10), SEEK_SET);


        return 1;
    }

    function readfile_chunked_remote($filename, $seek = 0, $retbytes = true, $timeout = 3)
    {
        $defaultchunksize = 1024 * 1024;
        $chunksize = $defaultchunksize;
        $buffer = '';
        $cnt = 0;

        $remotereadfile = true;

        $handle = $filename;

        if ($handle === false) {
            return false;
        }

        if ($seek != 0 && !$remotereadfile)
            fseek($handle, $seek);

        while (!feof($handle)) {

            if ($remotereadfile && $cnt + $chunksize > $seek)
                $chunksize = $seek - $cnt;
            else
                $chunksize = $defaultchunksize;

            $buffer = @fread($handle, $chunksize);

            if ($retbytes || ($remotereadfile && $seek != 0)) {
                $cnt += strlen($buffer);
            }

            if (!$remotereadfile || ($remotereadfile && $cnt > $seek))
                return $buffer;

            ob_flush();
        }

        $info = stream_get_meta_data($handle);

        if ($info['timed_out'])
            return false;

        if ($retbytes && $status) {
            return $cnt;
        }

        return $status;
    }

    function sfread($fp, $ft)
    {

        $contents = "";
        $x = 1;
        if ($ft > 1024 * 8) {

            $fpt = $ft / (1024 * 8);
            $st = 1024 * 8;

            while (($buf = fread($fp, $st * $x)) != '') {

                if ($x == $fpt) break;

                $contents .= $buf;

                $x++;
            }
        } else {

            $contents = fread($fp, $ft);
        }

        return $contents;
    }
    // ************************************************************************
    // get32bitSynchsafe returns a converted integer from an ID3v2 tag
    // ************************************************************************

    /**
     * returns a converted integer from an ID3v2 tag     *
     * Synchsafe integers are integers that keep its highest bit (bit 7) zeroed, making seven bits out of eight available.
     * Thus a 32 bit synchsafe integer can store 28 bits of information.
     * 
     * @param type $fp
     * @return type
     */
    function get32bitSynchsafe(&$fp)
    {
        $tmp = ord(fread($fp, 1)) & 127;
        $tmp2 = ord(fread($fp, 1)) & 127;
        $tmp3 = ord(fread($fp, 1)) & 127;
        $tmp4 = ord(fread($fp, 1)) & 127;
        $converted = ($tmp * 2097152) + ($tmp2 * 16384) + ($tmp3 * 128) + $tmp4;
        return $converted;
    }

    /**
     * gets format, audio_duration, and metadata from Ogg Vorbis files metadata (comment header) information is saved in
     * @example $this->vorbis_comment-><fieldname>
     * for instance, the song title will be in $this->vorbis_comment->title
     * - WARNING: values may be arrays because the Vorbis spec allows multiple fields
     * with the same name (eg, $this->vorbis_comment->artist[0] and
     * $this->vorbis_comment->artist[1] for a duet)
     * @link  http://www.xiph.org/ogg/vorbis/doc/framing.html For more info on Ogg bitstream containers
     * @link  http://www.xiph.org/ogg/vorbis/doc/Vorbis_I_spec.html For more info on Vorbis,
     * @return int
     */
    function ogginfo()
    {

        $this->data = (object) $this->data;

        $fp = fopen($this->wave_filename, "r");

        // Ogg stream?
        $capture_pattern = fread($fp, 4);
        if ($capture_pattern != "OggS") {
            // not an Ogg stream
            fclose($fp);
            return 0;
        }
        rewind($fp);

        // find the next page, then
        $this->findVorbis($fp);
        $packet_type = ord(fread($fp, 1));
        $preamble = fread($fp, 6);

        if ($packet_type == 1) {
            /* IDENTIFICATION HEADER
              1) [vorbis_version] = read 32 bits as unsigned integer
              2) [audio_channels] = read 8 bit integer as unsigned
              3) [audio_sample_rate] = read 32 bits as unsigned integer
              4) [bitrate_maximum] = read 32 bits as signed integer
              5) [bitrate_nominal] = read 32 bits as signed integer
              6) [bitrate_minimum] = read 32 bits as signed integer
              7) [blocksize_0] = 2 exponent (read 4 bits as unsigned integer) -- IGNORING
              8) [blocksize_1] = 2 exponent (read 4 bits as unsigned integer) -- IGNORING
              9) [framing_flag] = read one bit -- IGNORING
             */
            $identification = unpack('L1vorbis_version/C1audio_channels/L1audio_sample_rate/L1bitrate_maximum/L1bitrate_nominal/L1bitrate_minimum', fread($fp, 21));
            //print "<pre>".print_r($identification,1)."</pre>";
        }

        // find the next header, then
        $this->findVorbis($fp);
        $packet_type = ord(fread($fp, 1));
        $preamble = fread($fp, 6);

        if ($packet_type == 3) {
            /* COMMENT HEADER
              1) [vendor_length] = read an unsigned integer of 32 bits
              2) [vendor_string] = read a UTF-8 vector as [vendor_length] octets
              3) [user_comment_list_length] = read an unsigned integer of 32 bits
              4) iterate [user_comment_list_length] times {
              5) [length] = read an unsigned integer of 32 bits
              6) this iteration's user comment = read a UTF-8 vector as [length] octets
              }
              7) [framing_bit] = read a single bit as boolean

              Note that there may be more than one instance of any field
             */
            $vendor = unpack('L1vendor_length', fread($fp, 4));
            $vendor['vendor_string'] = fread($fp, $vendor['vendor_length']);
            $list = unpack('L1user_comment_list_length', fread($fp, 4));
            for ($i = 0; $i < $list['user_comment_list_length']; $i++) {
                $length = unpack('L1length', fread($fp, 4));
                $temp = fread($fp, $length['length']);
                $array = explode("=", $temp, 2);

                // field names are case-insensitive
                $array[0] = strtoupper($array[0]);

                /*
                  EXPLANATION OF THE FOLLOWING LOGIC
                  If there is only one artist field, it will be at $this->vorbis_comment->ARTIST, handled by the final else below
                  If a second one is found, $this->vorbis_comment->ARTIST will be converted to an array with two artist values.
                  This is done by the if statement.
                  Any additional artist fields will be pushed onto the end of the $this->vorbis_comment->ARTIST array by the elseif
                 */

                if ($this->vorbis_comment->{$array[0]} != "" && !is_array($this->vorbis_comment->{$array[0]})) {
                    // second instance, convert to array
                    $temp = $this->vorbis_comment->{$array[0]};
                    $this->vorbis_comment->{$array[0]} = array($temp, $array[1]);
                } elseif (is_array($this->vorbis_comment->{$array[0]})) {
                    // third through nth instances, add to array
                    array_push($this->vorbis_comment->{$array[0]}, $array[1]);
                } else {
                    // first instance
                    $this->vorbis_comment->{$array[0]} = $array[1];
                }
            }
            //print "<pre>".print_r($this->vorbis_comment,1)."</pre>";
        }

        // find length (number of samples, ay?) -- last page will have total samples info, see below
        $filesize = filesize($this->wave_filename);
        if ($filesize > 12288)
            $nearend = -12288;
        else
            $nearend = (0 - $filesize);
        fseek($fp, $nearend, SEEK_END);

        // look for page of type 4 or higher (0x04 == end-of-stream)
        while ($type < 4 && !feof($fp)) {
            $type = $this->findOggPage($fp);
        }

        // found the end of stream page...
        // the next 8 bytes are the absolute granule position:
        /*
          "The position specified is the total samples encoded after
          including all packets finished on this page (packets begun
          on this page but continuing on to the next page do not count).
          The rationale here is that the position specified in the frame
          header of the last page tells how long the data coded by the
          bitstream is. "
         */
        $bytes[0] = ord(fread($fp, 1));
        $bytes[1] = ord(fread($fp, 1));
        $bytes[2] = ord(fread($fp, 1));
        $bytes[3] = ord(fread($fp, 1));
        $bytes[4] = ord(fread($fp, 1));
        $bytes[5] = ord(fread($fp, 1));
        $bytes[6] = ord(fread($fp, 1));
        $bytes[7] = ord(fread($fp, 1));
        foreach ($bytes as $exp => $value) {
            $samples += ($value * pow(256, $exp));
        }
        $seconds = round(($samples / $identification['audio_sample_rate']), 2);
        $min = floor($seconds / 60);
        $sec = $seconds - ($min * 60);
        $audio_duration = "$min:$sec";
        //print "$samples samples / $seconds seconds ($audio_duration)";

        fclose($fp);

        // transfer the extracted data into classAudio File-structure
        $this->data->audio_id = $this->wave_id = "OGG";
        $this->data->audio_type = $this->wave_type = "Ogg Bitstream";
        $this->data->audio_compression = $this->wave_compression = "Vorbis version 1." . $identification['vorbis_version'];
        $this->data->audio_channels = $this->wave_channels = $identification['audio_channels'];
        $this->data->audio_framerate = $this->audio_framerate = $identification['audio_sample_rate'];
        $this->data->audio_byterate = $this->audio_byterate = ($identification['bitrate_nominal'] / 1000) . " Kbits/sec.";
        $this->data->audio_bits = $this->audio_bits = "n/a";
        $this->data->audio_size = $this->audio_size = $filesize;
        $this->data->audio_duration = $this->audio_duration = $seconds;

        return $this->data;
    }

    /**
     * finds the start of the next Vorbis header in an Ogg bitstream
     * 
     * @param type $fp
     */
    function findVorbis(&$fp)
    {
        // find the next header, then
        $capture_pattern = fread($fp, 6);
        while ($capture_pattern != "vorbis" && !feof($fp)) {
            // yes, character by character, fun!
            $capture_pattern = substr($capture_pattern, 1) . fread($fp, 1);
            //print ". ";
        }
        //print "Found header ".(ftell($fp)-7)."<br>";
        // back up the pointer by 7 to start of header
        fseek($fp, -7, SEEK_CUR);
    }

    /**
     * finds the next logical page in an Ogg bitstream, and returns the page type flag
     * 
     * @param type $fp
     * @return type
     */
    function findOggPage(&$fp)
    {
        // find the next header, then
        $capture_pattern = fread($fp, 4);
        while ($capture_pattern != "OggS" && !feof($fp)) {
            // yes, character by character, fun!
            $capture_pattern = substr($capture_pattern, 1) . fread($fp, 1);
            //print ". ";
        }
        $version = fread($fp, 1);
        $type = ord(fread($fp, 1));
        //print "Found page ".sprintf('%08b',$type)." ".(ftell($fp)-6)."<br>";
        return $type;
    }
}
