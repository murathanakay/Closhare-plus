<?php
$DIR = str_replace("wcustom.php", "", realpath(__FILE__));

define("_SECURE_PHP", true);
require_once $DIR.'../../../../../init.php';
header("Content-type: text/css; charset: UTF-8");
?>
@import url("<?php echo CLO_DEF_CSS_URI.'icheck/blue.css'?>");
/*
    Document   : wcustom
    Generated on : <?php echo date("d-M-Y H:s:i");?>
    Author     : Xneda
    Description:
        The custom css on login screen for Closhare.
*/

/*WELCOME SCREEN*/
<?php if($core->page_welcome_bg != ""){?>
.welcome-container{
background-image: url(<?php echo CLO_DEF_ASS_URI;?>img/uploads/<?php echo $core->page_welcome_bg; ?>);
}
<?php
}
?>