<?php

/**
 * email-footer
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: email-footer.php UTF-8 , 03-Nov-2014 | 21:01:22 nwdo ε
 */

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

require_once 'email-header.php';

//global $eitems;
$name = "width: 100%;
         bottom: 0;
         background-color: #CCCCCC;
         border-top: 1px solid #111111; padding:4px;
         text-align: center;
         color: #ffffff;
         font-size: 11px;
         font-family:sans-serif";

$scover = "position:relative;
           width:200px;
           height:160px;
           overflow:hidden;
           margin:1px;
           float:left;";

$items = $eitems;

$total = count($items);
$i = 0;

?>

<p style="text-align:center;color:#999999;font-family:sans-serif;">Showing <?php echo $total . '/' . $totalSended; ?>


    <a href="<?php echo $viewUrl; ?>" style="color:#888888; text-decoration:none;margin-top: 15px;">Click here to view all files shared with you.</a>
</p>

<table cellspacing="0" cellpadding="0" style="width: 100%; border: 1px solid #eee; margin: 20px 0px" border="0">

    <?php if ($message) { ?>
        <thead>
            <tr>
                <td colspan="<?php echo $total; ?>" height="50" align="left">
                    <?php
                    echo '<div style="height:50px;color:#888888;font-family:sans-serif; font-size:12px;padding: 10px;">'
                        . '<strong style="font-size:13px;color:#666666;">Sender Message:</strong> '
                        . sanitise($message)
                        . '</div>';
                    ?>
                </td>
            </tr>
        </thead>
    <?php } ?>
    <tbody>
        <?php
        $xi = 0;
        $srcRoot = CLO_DEF_ASS_URI . 'img/';

        echo "<tr>";

        foreach ($items as $key => $eitem) {


            $item = (object) $eitem;

            echo '<td valign="top" width="200" height="160">';

            echo '<div style="' . $scover . '"><a href="' . $viewUrl . '" target="_blank">';

            $src = '';

            if ($item->type == 'file') {

                if ($item->viewable && $item->filetype == "image") {

                    $src = $item->preview["t"];
                } else {
                    $src = $srcRoot . $item->filetype . ".gif";
                }
            } else {
                $src = $srcRoot . "folder.gif";
            }

            echo '<img style="max-height:160px" alt="' . $item->name . '" src="' . $src . '" /></a>';

            $truncedName = trunc($item->name, 20, false);

            echo '<div style="' . $name . '">'
                . ($item->description ? ($truncedName . ' | ' . trunc($item->description, 15, true)) : $truncedName)
                . '</div>';

            echo "</div>";
            echo "</td>";

            $xi++;

            if ($xi == 3)
                echo "</tr>";
        }

        if ($total < $totalSended) {
            echo '<tr><td colspan="' . $total . '" height="50" align="center">'
                . '<div style="height:50px;color:#888888;"><a href="' . $viewUrl . '" target="_blank" style="color:#888888;text-decoration:none;">Show More </a><span style="font-size:24px;font-weight:bold;">. . .</span></div>'
                . '</td></tr>';
        }
        ?>
    </tbody>
</table>
<?php
require_once 'email-footer.php';
?>