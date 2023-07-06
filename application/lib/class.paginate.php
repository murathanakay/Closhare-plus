<?php

/**
 * class.paginate
 * @package      Closhare+plus app
 * @copyright    2014
 * @license      MIT
 * @contact      murathan@xneda.com
 * @version $Id: class.paginate.php UTF-8 , 01-Jun-2011 | 23:02:02 nwdo ε
 */

namespace Nedo;

if (!defined("_SECURE_PHP"))
    die('Direct access to this location is not allowed.');

class Paginate
{

    public $items_per_page;
    public $items_total;
    public $num_pages;
    public $limit;
    public $default_ipp;
    private $mid_range;
    private $low;
    private $high;
    private $display;
    private $querystring;
    private $current_page;

    /**
     * 
     * @param type $p
     * @param type $ipp
     */
    function __construct($p = 1, $ipp = false)
    {
        global $core;

        $this->current_page = 1;
        $this->mid_range = 7;
        $this->items_per_page = $ipp ? $ipp : $core->items_per_page;
    }

    /**
     * 
     * @global type $core
     * @param type $path
     */
    public function paginate($path = false)
    {
        global $core;

        if (!is_numeric($this->items_per_page) || $this->items_per_page <= 0)
            $this->items_per_page = $this->default_ipp;
        $this->num_pages = ceil($this->items_total / $this->items_per_page);

        $this->current_page = post("pg") ? intval(sanitise(post('pg'))) : intval(sanitise(get('pg')));
        if ($this->current_page < 1 or !is_numeric($this->current_page))
            $this->current_page = 1;
        if ($this->current_page > $this->num_pages)
            $this->current_page = $this->num_pages;
        $prev_page = $this->current_page - 1;
        $next_page = $this->current_page + 1;

        $this->display = '<ul class="pager mt0 mb0">';

        if ($_GET) {
            $args = explode("&amp;", $_SERVER['QUERY_STRING']);
            foreach ($args as $arg) {
                $keyval = explode("=", $arg);
                if ($keyval[0] != "pg" && $keyval[0] != "ipp")
                    $this->querystring .= "&amp;" . sanitise($arg);
            }
        }

        if ($_POST) {
            foreach ($_POST as $key => $val) {
                if ($key != "pg" && $key != "ipp")
                    $this->querystring .= "&amp;$key=" . sanitise($val);
            }
        }

        if ($this->num_pages > 1) {
            if ($this->current_page != 1 && $this->items_total >= $this->default_ipp) {

                $this->display .= '<li>'
                    . '<a data-pg="' . $prev_page . '" data-ipp="' . $this->items_per_page . '" href="#">'
                    . '<i class="icon icon-long-arrow-left"></i> '
                    . '<span class="hidden-xs">Previous</span>'
                    . '</a>'
                    . '</li> ';
            } else {
                $this->display .= '<li class="disabled">'
                    . '<a href="javascript:;">'
                    . '<i class="icon icon-long-arrow-left"></i> '
                    . '<span class="hidden-xs">Previous</span>'
                    . '</a>'
                    . '</li> ';
            }

            $this->start_range = $this->current_page - floor($this->mid_range / 2);
            $this->end_range = $this->current_page + floor($this->mid_range / 2);

            if ($this->start_range <= 0) {
                $this->end_range += abs($this->start_range) + 1;
                $this->start_range = 1;
            }
            if ($this->end_range > $this->num_pages) {
                $this->start_range -= $this->end_range - $this->num_pages;
                $this->end_range = $this->num_pages;
            }
            $this->range = range($this->start_range, $this->end_range);

            for ($i = 1; $i <= $this->num_pages; $i++) {
                if ($this->range[0] > 2 && $i == $this->range[0])
                    $this->display .= '<li class="disabled"><a href="javascript:;"> ... </a></li>';

                if ($i == 1 or $i == $this->num_pages or in_array($i, $this->range)) {
                    if ($i == $this->current_page) {
                        $this->display .= '<li><a class="btn btn-primary-alt hidden-xs">' . $i . '/' . $this->num_pages . '</a></li> ';
                    } else {
                        //$this->display .= '<li><a data-pg="' . $i . '" data-ipp="' . $this->items_per_page . '" title="Go to page ' . $i . ' of ' . $this->num_pages . ' total" href="#">' . $i . '</a></li>';
                    }
                }
                if ($this->range[$this->mid_range - 1] < $this->num_pages - 1 && $i == $this->range[$this->mid_range - 1])
                    $this->display .= '<li class="disabled"><a href="javascript:;"> ... </a></li>';
            }
            if ($this->current_page != $this->num_pages && $this->items_total >= $this->default_ipp) {

                $this->display .= '<li><a data-pg="' . $next_page . '" data-ipp="' . $this->items_per_page . '" href="#">'
                    . '<span class="hidden-xs">Next</span> '
                    . '<i class="icon icon-long-arrow-right"></i>'
                    . '</a>'
                    . '</li>';
            } else {
                $this->display .= '<li class="disabled"><a href="javascript:;">'
                    . '<span class="hidden-xs">Next</span> '
                    . '<i class="icon icon-long-arrow-right"></i>'
                    . '</a>'
                    . '</li>';
            }
        } else {
            for ($i = 1; $i <= $this->num_pages; $i++) {
                if ($i == $this->current_page) {
                    // $this->display .= '<li><a href="javascript:;" class="active">$i</a></li>';
                } else {
                    //$this->display .= '<li><a data-pg="' . $i . '" data-ipp="' . $this->items_per_page . '" href="#">' . $i . '</a></li>';
                }
            }
        }
        $this->low = ($this->current_page - 1) * $this->items_per_page;
        $this->high = $this->current_page * $this->items_per_page - 1;
        $this->limit = " LIMIT $this->low,$this->items_per_page";

        $this->display .= '</ul>';
    }

    /**
     * 
     * @return type
     */
    public function items_per_page()
    {
        $items = '';
        $ipp_array = array(10, 15, 25, 50, 75, 100);
        foreach ($ipp_array as $ipp_opt)
            $items .= ($ipp_opt == $this->items_per_page) ? "<option selected=\"selected\" value=\"$ipp_opt\">$ipp_opt</option>\n" : "<option value=\"$ipp_opt\">$ipp_opt</option>\n";
        return "<strong>" . _PAG_IPP . "</strong>: <div class=\"mybox\"><select class=\"custombox\" onchange=\"window.location='$_SERVER[PHP_SELF]?pg=1&amp;ipp='+this[this.selectedIndex].value+'$this->querystring';return false\" style=\"min-width:50px\">$items</select></div>\n";
    }

    /**
     * 
     * @return type
     */
    public function jump_menu()
    {
        $option = '';
        for ($i = 1; $i <= $this->num_pages; $i++) {
            $option .= ($i == $this->current_page) ? "<option value=\"$i\" selected=\"selected\">$i</option>\n" : "<option value=\"$i\">$i</option>\n";
        }
        return "<strong>" . _PAG_GOTO . "</strong>: <div class=\"mybox\"><select class=\"custombox\" onchange=\"window.location='$_SERVER[PHP_SELF]?pg='+this[this.selectedIndex].value+'&amp;ipp=$this->items_per_page$this->querystring';return false\" style=\"min-width:50px\">$option</select></div>\n";
    }

    /**
     * 
     * @return type
     */
    public function display_pages()
    {
        return ($this->items_total > $this->items_per_page) ? $this->display : "";
    }
}
