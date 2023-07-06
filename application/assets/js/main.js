/* global $topActBtns, $searcher, $notify, $dirNav, $totalItemsNum, $itemPaste, $totalItemsNum, $dirTree, cutcopyItems, $sidebar, $sopener, $viewPort, $list, $footer, $sideBarS, $footertaticTree, $container, $wrap, $sideBarStaticTree, $spin, $spintarget, $pagetarget, $body, $page, $indi, $page, $htmlcatorEl, $indicatorEl, $html, mediaPlaying */

/**
 * app.js
 * @package      Closhare +plus
 */

//Custom touches
//Dom please!
$(function() {
    //General
    $('.btn').button()
    $('.button-loading').click(function() {
        $(this).button('loading');
    });

    $html = $spintarget = $("html");
    $page = $('#page');
    $indicatorEl = $page.find("#mainIndicator");
    $spintarget = $("#pgloader").show();
    $body = $("body");
    $container = $("#container");
    $wrap = $("#wrap");
    $footer = $("#footer");
    $viewPort = $('#viewport');
    $list = $viewPort.find(".directoryList");
    $sidebar = $("#sidebar");
    $sideBarStaticTree = $sidebar.find("#sideBarStaticTree");
    $sdivider = $("#sidebarDivider");
    $sopener = $("#sidebarOpener");
    $dirTree = $("#dirTree");
    $filesSideBarTbar = $("#filesdropdown");
    $topActBtns = $("#topActionButtons");
    $itemPaste = $topActBtns.find("#itemPaste");
    $totalItemsNum = $topActBtns.find("#totalItemsNumber");
    $dirNav = $topActBtns.find("#dirNav");
    $uiactControl = $topActBtns.find("#uiactControl");
    $notify = $("#notify_block");
    $notifyarea = $(".notify_area");
    $searcher = $topActBtns.find("#searcher");
    $norequestArr = new Array("login", "register", "recover");
    scrloaded = new Array("noscr");
    selectedItems = {};
    cutcopyItems = [];
    lookfor = false;
    $divider = '<div class="divider"/>';
    $indicatorbg = '<i class="loading loading-sm"></i>';
    $downloadTip = '<i class="icon icon-download"></i>';
    indicatorCss = '<div class="indicator"><span></span><span></span><span></span></div>';
    $.fn.editableform.loading = indicatorCssBlue = '<div class="indicator blue"><span></span><span></span><span></span></div>';
    dir = {id: 1, name: 'Document Root', description: 'Document Root', path: '/', parentid: 0, parentname: null, files: 0, subdirs: "", size: 0, page: 1};
    uSt = {};
    succload = false;
    currPage = 'list';
    currDir = 1;
    forceUpdate = true;
    sortUpdate = false;
    firstLoad = true;
    loadMore = false;
    orderby = 'type';
    sortby = 'desc';
    $screl = (isMob() && $(window).width() < 481) ? $(window) : $("#list");
    mediaPlaying = false;
    touchable = ('ontouchstart' in document.documentElement) ? true : false;


    //spin start
    $indicatorEl.css("visibility","visible");

    //some defaults
    $.jGrowl.defaults.closer = false;
    $.jGrowl.defaults.closeDuration = 1;
    $.jGrowl.defaults.openDuration = 1;
    $.jGrowl.defaults.pool = 1;

    $(document).ajaxComplete(function(event, xhr, settings) {

        var ct = xhr.getResponseHeader("content-type");
        if (settings.dataType == 'json' || ct.indexOf('json') > -1) {
            var data = $.parseJSON(xhr.responseText) || 0;
            if (data && (data.auth == 0 || data.auth == 2)) {
                $(".modal").modal("hide");
                $html.blockit({message: data.message, blockMsgClass: 'callout callout-danger', button: false, fadeOut: 900, overlayCSS: {opacity: 0.9}});
                setTimeout(function() {
                    $("#countrd").countdown(4, 's', function() {
                        fullreload();
                    }, true);
                }, 150);
            }



            if (data.message) {


                var icont = 'check';
                var gopt = {life: 8000};
                
                var iconhtml = '';
                
                if(data.message.title || data.title){
                    gopt["header"] = data.title || data.message.title;
                }

                if (data.message.options) {
                    gopt = $.extend(true, gopt, data.message.options);
                }
                if (data.result !== undefined) {
                    gopt.open = function (e, m, o) {
                        if (data.result == 0){
                            e.addClass("bg-error");
                        }else if(data.result == 2){
                            e.addClass("bg-warning");
                        }
                    }
                }

                if (data.message.icon) {
                    gopt.theme = 'iconup'
                    icont = data.message.icon;
                    iconhtml = '<div class="icon icon-' + icont + '"></div>';
                }
                                
                if (data.message.txt && !$body.hasClass("modal-open")) {
                    setTimeout(function () {
                        if (data.message.txt) {
                            setTimeout(function () {
                                $notify.jGrowl("close").jGrowl(iconhtml + data.message.txt, gopt);
                            }, 120)
                        }
                    }, 30); //fix close
                }

                if ($body.hasClass("modal-open") && $body.find("#uinotify").length > 0) {
                    
                    var msg = data.message.txt || data.message;

                    $body.find("#uinotify").jGrowl("close").jGrowl(iconhtml + msg, gopt);

                }
            }

            checkforAlert(data);

            $viewPort.unblock();

            //globally check for a callback function
            if (data.callback) {
                $.globalEval(data.callback);
            }

            succload = (data.result == 1) ? true : false;

        }


    });

});
//start for view page
jQuery(document).ready(function() {
    viewport(); //viewport init

    //while window being resized.
    $(window).resize($.throttle(100, function() {
        viewport.call();
        sidebar.call();
    }));

    window.addEventListener("orientationchange", function() {
        $(window).resize();
    }, false);

});


jQuery(function() {

    var clickHandler = ('ontouchstart' in document.documentElement ? "touchstart" : "click");

    $wrap.on("click", '.rpsve', folderInteract);

    $(document).on('click', 'a.pg', function(e) {

        e.preventDefault();
        var $this = $(this);

        $this.tab('show');

        var state = {},
                id = "page",
                idx = $this.prop('href').replace(/^#/, '');

        state[ id ] = idx;
        $.bbq.pushState(state, 2);

//        return false;
    });


    $(window).bind('hashchange', function(e) {
        $('[data-toggle="dropdown"]').parent().removeClass('open');

        var dirHash = $.bbq.getState("dir", true) || 0,
                filter = $.bbq.getState("filter", true) || 0,
                search = $.bbq.getState("search", true) || 0;

        if (!dirHash) {
            $list.empty()
            $.bbq.pushState({dir: UIDIR}, 2)
        }

        //check for filtering by type existance
        var $filterReset = $sideBarStaticTree.find("button.resetFilter");
        if (filter) {

            if (!(filter in filterTypes)) {
                $.bbq.pushState({dir: dir.hash, filter: "image"}); //push"image"filter if any good string wasn't there=>refrence by filterTypes array
            } else {
                //all good, load requested filter and trigger some events
                if ($viewPort.data("filter") != filter) {
                    $("#sidebarTabContainer a").last().tab("show"); //open filter tab
                }
                toggleStaticFilterButtonStates($sideBarStaticTree.find('[rel="#' + filter + '"]'));

            }

            $sidebar.addClass("filter");
            $filterReset.show();
            $filterReset.disabletoggle(false);

            //store filter type for after use
            //$viewPort.data("filter", filter);
        } else {
            //if no filter, show regular folder tree on the sidebar
            $('#sidebarTabContainer a').first().tab('show');

            $sidebar.removeClass("filter");
            $filterReset.hide();
            $filterReset.disabletoggle(true);
        }


        var hashSource = $.bbq.getState(), target, mode, query = hash = {};

        $.each(hashSource, function(key, val) {

            if (val) {
                hash[key] = val;
            }

        });

        //store current page for after use
        currPage = $.bbq.getState("page", true) || 0;

        //store current folder for after use
        currDir = $.bbq.getState("dir", true) ? $.bbq.getState("dir", true) : ((dir.hash) ? dir.hash : UIDIR);

        currFilter = filter;

        currSearch = search;
        
        if(dirHash)
            doPageLoad(target, query);
    });

    $(window).trigger('hashchange');

    if (firstLoad) {
        $body.removeClass("onload").blockit({message: indicatorCssSm + " Loading...Please wait", simple: true, button: false, fadeOut: 900, overlayCSS: {opacity: 0.9}});
    }


});
//functions
function folderInteract() {

    var $this = $(this),
            state = {},
            id = "dir",
            idx = $this.data("hash");

    state[ id ] = idx;
    var sfreplace = currSearch ? 2 : false;
    $.bbq.pushState(state, sfreplace);

//    return false;
}
function doPageLoad($target, queryObj, $item, callback) {

    var target = $target ? $target : $("#list"),
            query = {'page': 'list', 'dir': UIDIR, order: orderby, sort: sortby, deep: $("#filter_current_dir").is(":checked")},
    waitt = firstLoad ? 1800 : 300,
            blockEl = firstLoad ? $body : $viewPort;

    query = $.extend(true, query, queryObj);

    if (forceUpdate) {
        query.force = true;
    }
    
    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        data: query,
        cache: true,
        dataType: 'json',
        beforeSend: function() {
            if ($item) {
                $item.blockit({message: $indicator, simple: true, button: true, css: {top: "0"}});
            } else {

                if (!firstLoad) {
                    blockEl.blockit({message: null, fadeOut: 500, overlayCSS: {opacity: 0.3}});
                    $indicatorEl.css("visibility","visible");

                }

            }
        },
        success: function(data) {
            
            setTimeout(function() {
                $indicatorEl.css("visibility","hidden");
                blockEl.unblock();
            }, waitt);


            if (data.dir !== undefined) {
                var d = data.dir;
                $.each(d, function(key, val) {
                    if (val !== undefined)
                        dir[key] = val;
                });

                dir['itemTotal'] = parseInt(dir.files + dir.subdirs.count_total);

                if (!(dir.id in selectedItems)) {
                    selectedItems[dir.id] = [];
                }

                currDirID = dir.id;
            }

            // create, scale page parts
            if (data.result === 1) {
                setTimeout(function(){
                    $.renderListPage(data, target);
                    renderSideBar(data, (data.folderTree !== undefined ? true : false));
                    viewport();
                    sidebar();
                    if (callback) {
                        window[callback]();
                    }
                },17)
            }
            //set events
            var event = jQuery.Event('click');
            event.target = $wrap.find('.rpsve');

            if (data.run) {
                $.globalEval(data.run);
            }
        }
    });
}

function executer(data) {
    $.each(data.acall, function(index, obj) {
        if ('object' == typeof obj || 'string' == typeof obj) {
            if (obj.back === "fn") {
                setTimeout(function() {
                    $.globalEval(obj.run);
                }, 150);
            } else {
                window[obj.back](data.acall[index]);
            }
        }
    });
}

function viewport() {

    var viewportH = parseInt($(window).height()),
            headH = (
                    parseInt($topActBtns.outerHeight())
                    ),
            filterH = 110,
            FootH = 0;

    var headHTotal = (headH + filterH);

    if (headHTotal > headH + FootH) {
        headHTotal = headH + FootH;
    }

    headHeight = headH;

    var vpH = (viewportH - headH - FootH);
    
    $viewPort.height(vpH-2);
    
//    $viewPort.find(".viewbox").slimScroll({
//        height: $viewPort.height(),
//        railVisible: true,
//        railBorderRadius: '0',
//        size: '6px',
//        alwaysVisible: true
//    });

    var ush = $("#usageStatistics").is(":hidden") ? 55 : 177;

    $sidebar.find(".tab-pane").height(viewportH - headHTotal - ush - 30);

    $viewPort.removeClass("view_port_fixed");

    topBar();
}