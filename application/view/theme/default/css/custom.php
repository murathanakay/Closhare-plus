<?php
$DIR = str_replace("custom.php", "", realpath(__FILE__));

define("_SECURE_PHP", true);
require_once $DIR.'../../../../../init.php';
header("Content-type: text/css; charset: UTF-8");
?>
@import url("<?php echo CLO_DEF_CSS_URI.'icheck/blue.css'?>");
/*
    Document   : custom
    Generated on : <?php echo date("d-M-Y H:s:i");?>
    Author     : Xneda
    Description:
        The custom css for Closhare.
*/
.logo{
    background-image: url(<?php echo CLO_DEF_ASS_URI;?>img/uploads/<?php echo $core->site_logo; ?>);
    background-size: auto 50px;
}
.folder .rpsve{
    background-image: url(<?php echo CLO_DEF_ASS_URI;?>img/diricons/default/aft/<?php echo $core->site_dir_icon?>.png);
}
.folder .tnpreviewImage{
    background-image:  url(<?php echo CLO_DEF_ASS_URI;?>img/diricons/default/<?php echo $core->site_dir_icon?>.png)
}
.directoryList.list > li.folder .tnpreviewImage{
    background-image:  url(<?php echo CLO_DEF_ASS_URI;?>img/diricons/small/<?php echo $core->site_dir_icon?>.png);
}
@media (max-width: 768px) {
    .folder .rpsve{
        background: transparent none;
    }
    .folder .tnpreviewImage{
        background:  transparent url(<?php echo CLO_DEF_ASS_URI;?>img/diricons/medium/<?php echo $core->site_dir_icon?>.png) center center no-repeat;
    }
    .directoryList.list > li.folder .tnpreviewImage{
    background-image:  url(<?php echo CLO_DEF_ASS_URI;?>img/diricons/small/<?php echo $core->site_dir_icon?>.png);
    }    
}