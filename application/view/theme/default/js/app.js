
function toggleNavToDropdown(add) {
    var $nb = $page.find("ul.fr");
    if (add) {
        $page.addClass("btn-group")//.removeClass("vhidden");
        $nb.addClass("dropdown-menu").removeClass("pull-left");
    } else {
        $page.removeClass("btn-group")//.addClass("vhidden");
        $nb.removeClass("dropdown-menu").addClass("pull-left");
    }
}
function topBar() {
    setTimeout(function() {
        var tbw = $topActBtns.width();

        if (tbw < 523) {
            toggleNavToDropdown(true)
            $wrap.addClass("small").removeClass("medium wide");
            $list.find("li.preview").removeClass("col-xs-3").addClass("col-xs-12 col-sm-12");

        } else if (tbw >= 593 && tbw < 768) {
            toggleNavToDropdown(true)
            $wrap.addClass("medium").removeClass("small wide");
            $list.find("li.preview").removeClass("col-xs-12 col-sm-6").addClass("col-xs-3");

        } else if (tbw >= 768) {
            toggleNavToDropdown(false)
            $wrap.addClass("wide").removeClass("small medium");
            $list.find("li.preview").removeClass("col-xs-12 col-sm-12");
        }

    }, 150);
}

function sidebar() {
    dirTreeScr();
}

function dirTreeScr() {
    //tree slimscroll
    $dirTree.slimScroll({
        height: "auto",
    });
    $sideBarStaticTree.find(".scr").slimScroll({
        height: "auto",
    });
}

function fullreload() {

    if (navigator.userAgent.indexOf('Safari') === -1 && navigator.userAgent.indexOf('Chrome') !== -1) {
        window.location = CLO_URL;
    } else {
        location.reload();
    }
}
function successBoxForm(responseText, statusText, xhr, $form, $element, $box, delope, formid, noArr, noReloadArr) {

    if ($.inArray(formid, noArr) > -1) {
        if ($element) {
            $element.button("reset");
            if (!$element.hasClass("noDisable"))
                setTimeout(function () {
                    $element.disabletoggle(true);
                }, 17)
        }

    } else {

        if ($element) {
            $element.prev("a").text("Close");
            $element.remove();
        }
        $(window).resize();
        var countdown = parseInt($box.data("countdown") ? $box.data("countdown") : 10);
        $box.find(".countdow span").countdown(countdown, "Box will be closed in", function () {
            $box.modal("hide");
        });

        if (delope) {
            if ($form.find('input[name="value"]:first').val() == currDirID) {
                window.location.replace('#page=' + currPage);
            } else {
                if ($.inArray(formid, noReloadArr) === -1) {
                    reloadPage(1, false, 1000);
                }
            }
            sidebarStatistics();

        } else {
            if ($.inArray(formid, noReloadArr) === -1) {
                reloadPage(1, false, 1000);
            }
        }
    }
}
function handleBoxFormAjaxResponse(responseText, statusText, xhr, $form, $element, $box) {

    var delope = ($form.attr("id") == "form_delete") ? true : false,
            formid = $form.attr("id"),
            noArr = new Array("form_downloadItem", "form_tpage", "form_downloadFolder", "form_downloadItems"),
            noReloadArr = new Array("form_email");
    
    var response = responseText.message ? (responseText.message.txt ? responseText.message.txt : responseText.message) : '';
        
    if (responseText.result == 1) {

        
        if ($.inArray(formid, noArr) > -1) {
            
            if($box.find(".callout.result").length > 0){
            $form.find(".callout:first").removeClass("callout-danger").addClass("callout-success").show().find("div").htmlA(response, 200, function() {
                return successBoxForm(responseText, statusText, xhr, $form, $element, $box, delope, formid, noArr, noReloadArr)                    
            });
        }else{
            return successBoxForm(responseText, statusText, xhr, $form, $element, $box, delope, formid, noArr, noReloadArr);
            
//                $body.find("#uinotify").jGrowl("close").jGrowl(response, {header: ( responseText.title ? responseText.title : ""), life: 5000, closeDuration: 0,
//                    open: function () {
//                        return successBoxForm(responseText, statusText, xhr, $form, $element, $box, delope, formid, noArr, noReloadArr)
//                    }});

        }
            
            console.log("yesarr")
        } else {
            console.log("noarr")
            
            $form.htmlA('<div class="form-group" style="margin: 0; float:none"><div class="callout callout-' + (delope ? 'danger' : 'success') + '">' + response + '</div></div>', 200,
                    function() {
                        return successBoxForm(responseText, statusText, xhr, $form, $element, $box, delope, formid, noArr, noReloadArr);
                    }
            );
        }
            //trigger if callback is exists
            var callbackFunction = $form.find(".control").attr("id")+'_callback';

            if (callbackFunction in window){
                window[callbackFunction]();
            }
        
    } else {
        
        var alert = $form.find(".callout:first");

        alert.removeClass("callout-success").addClass("callout-danger");

        if ($form.find(".fterr").length == 0) {
            var cloth = $('<div class="form-group fterr" style="margin: 0"/>');
            $form.prepend(cloth);
        } else {
            cloth = $form.find(".fterr");
        }
        cloth.append(alert);

        if (alert.is(":hidden")) {
            alert.show().find("div:first").htmlA(responseText.message, 200,function(){
                $(window).resize();
            });
            
        } else {
            alert.find("div:first").html(responseText.message);
        }

        if ($element) {
            $element.button("reset");
        }
    }
    if ($element)
        $element.blur();

}
function handleboxForms($element, $form, $box) {
    var $element = $element;
    var options = {
        success: function(responseText, statusText, xhr, $form) {
            handleBoxFormAjaxResponse(responseText, statusText, xhr, $form, $element, $box);
            $form.unblock();
        },
        dataType: 'json'
    };

    $form.blockit({message: indicatorCssSm + ' Please wait...', simple: true, button: false});

    $form.ajaxSubmit(options);
}

function loadShareBigBox($this, ract, $form, $box, loadText) {
    
    $form.find("#share_box").empty().append('<div class="sharebox"></div>');
    
    $('.ignoretitem').off("click").on("click", function() {
        //getItemId
        var p = $(this).closest("div.thumbnail"),
                id = p.data("id"),
                $vel = $form.find('input[name="value"]'),
                cel = $box.find(".box_title .count");

        $vel.val(removeVal($vel.val(), id));
        //update selected files
        //delete selectedItems[dir.id][id];
        selectedItems[dir.id] = jQuery.grep(selectedItems[dir.id], function(value, key) {
            return value !== id;
        });

        //trigger change event for this item on the list area
        var $item = $list.findItem(id, "selected");
        selectItem($item, true);
        
        $this.data("item", selectedItems[dir.id].join(","))

        //update box title count
        var count = selectedItems[dir.id].length;
        if (count === 0) {
            $box.modal("hide");
        }
        cel.text(count);

        hideTip(p[0])
        p.remove();
        
        if(count >= 1){
            loadShareBigBox($this, ract, $form, $box, " Refreshing item list...");
        }
        
    });    
    
    $form.blockit({message: indicatorCssSm + (loadText ? loadText :  ' Loading social platforms...'), simple: true, button: false});
    
    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        data: {'action': 'prepare_share', value: $this.data("item")},
        dataType: 'json',
        success: function(response) {
            $spintarget.spin(false);
            $form.unblock();
            $form.find(".sharebox").html(response.html);
            $form.find("#go-share-url-btn").attr("href", response.link);
            $form.find("#share_url").removeClass("vh");
            $form.find("#share_short_url").on("focus click",function(){
                $(this).select();
            }).val(response.link); 
            
            $form.find(".sharebox").share({
                networks: response.shareOpts,
                link: response.link,
                url: response.url,
                title: response.title,
                desc: response.description,
                theme: "default"
            });
            
            console.log(response.exclude);
            if(response.exclude.length > 0){
                console.log(response.exclude);
                $.each(response.exclude, function(index, id) {
                    console.log($form.findItem(id, "thumbnail", false, "div"))
                    $form.findItem(id, "thumbnail", false, "div").addClass("error").attr({
                            'data-original-title' : "Not found!"
                        });
                });
            }
            
            loadscript({src: ASSURI+'js/rotors/zero/ZeroClipboard.min.js'}, function(){
                var client = new ZeroClipboard( document.getElementById("copy-share-url-btn") );
                
                ZeroClipboard.config( { moviePath: ASSURI+'js/rotors/zero/ZeroClipboard.swf' } );
                
                client.on( "ready", function( readyEvent ) {
                    
                    client.on( "aftercopy", function( event ) {  
                        jQuery("#copy-to-clipboard-result").show("highlight").text("Copied link to clipboard");
                        $(window).resize()
                    } );
                });
            });
        }
    });
    
}

function loadShareBox($this) {
    
    if($list.find(".sharebox").length > 0){
        $list.find(".sharebox").find(".close").trigger("click")
    }
    
    $this.append('<div class="sharebox"></div>');    
    
    $this.blockit({message: indicatorCssPurple , simple: true, usimple: true, button: false});
    
    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        data: {'action': 'prepare_share', value: $this.data("id")},
        dataType: 'json',
        beforeSend: function() {
        },
        success: function(response) {
            $spintarget.spin(false);
            $this.unblock();
            $this.find(".sharebox").html(response.html);
            
//            setTimeout(function(){
                $this.addClass("sharing");               
//            },250);
            
            setTimeout(function(){
            
            $this.find(".sharebox").share({
                networks: response.shareOpts,
                link: response.link,
                url: response.url,
                title: response.title,
                desc: response.description,
                theme: "circle"
            }); 
            $this.find(".sharebox").append(
                    $('<span class="close icon icon-times" title="Cancel" rel="tip"></span>').on('click', function(){
                        hideTip(this)
                        var par = $(this).closest("li");
                        par.find(".sharebox").remove();
                        par.removeClass("sharing");
                        
                    })
                    );            
            },600)
            
        }
    });
}

function isApproachingToBottom(el) {
    
    var scrEl = (el[0].tagName.toLowerCase() == 'body' ? $(window) : el)
    var elementHeight = el[0].scrollHeight,
            scrollPosition = scrEl.height() + scrEl.scrollTop(),
            equa = 100; //100px before
    
    return (elementHeight - equa <= scrollPosition);
}

//load more items
$(function() {
    count = 0;
    loadingMore = false;
    if (!isMob())
        $screl.scroll($.debounce(500, function() {
            var ex = $(this);
            if (dir.scrollMore) {
                if (isApproachingToBottom(ex)) {
                    loadMore = true;
                    
//                    setTimeout(function(){
                    $("#moreItemLoader").show();
                    
                    dir.page = dir.page+1;
                    
                    
                    if(loadingMore === false){
                        loadingMore = true;
                    doPageLoad(false, {
                        'page': 'list',
                        'dir': currDir,
                        'path': dir.path,
                        'p': dir.id + ',' + dir.parentid,
                        pg: dir.page,
                        filter: currFilter,
                        search: (currSearch ? currSearch : undefined),
                        sort: sortby,
                        order: orderby
                    }, false);
                    loadingMore = false;
                }
//                },220);
                }
            }

            return false;
        }));


    //search action if screen is not small
//    if (!isSmall()) {
        var items = new Bloodhound({
            datumTokenizer: function(datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            limit: 5,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: AJAX_PATH+'?dir=%DIR&in=%IN&search=%KEY&q=%QUERY',
                type: 'GET',
                dataType: 'json',
                replace: function(url, query) {
                    return url.replace('%DIR', currDirID).replace('%IN', $("#search_filter").find(":selected").val()).replace('%KEY', "key").replace('%QUERY', encodeURIComponent(query));
                },     
                xhrSending: function() {
                        $indicatorEl.css("visibility","visible");
                },
                xhrDone: function(url) {
                    $indicatorEl.css("visibility","hidden");
                    
                    var nobj = $searcher.data("url") ? $searcher.data("url") : {},
                        obj = $.deparam(url);
                    nobj[obj.q] = obj.q;
                    $searcher.data("url", nobj);
                    var searchDetail = '<div id="search_details" class="well well-sm borrn ptb5 mb5 mt0 curdef">Search result for <span class="highlight p3"><span class="large">"</span><b class="medium">'+obj.q+'</b><span class="large">"</span></span> inside <b class="ul">'+dir.name+'</b> with filter <b class="ul">'+$("#search_filter").find(":selected").text()+'</b></div>';
                    if($("#search_details").length > 0)
                        $("#search_details").replaceWith(searchDetail)
                    else
                        $searcher.find(".tt-dropdown-menu").prepend(searchDetail)
                    
                    //be sure indicator is off
                    setTimeout(function(){
                        $indicatorEl.css("visibility","hidden");
                    },5000)
                },
                filter: function(items) {
                    return $.map(items, function(item) {
                        item.value = item.name;
                        return item;
                    });
                }
            }
        });

// Initialize the Bloodhound suggestion engine
        var searchInit = items.initialize();

        $("#search").typeahead(null, {
            hint: true,
            highlight: true,
            items: 10,
            minLength: 0,
            templates: {
                empty: [
                    '<div class="alert alert-warning bgw mt0 mb0 p5 brn">',
                    'unable to find any items that match the current query',
                    '</div>'
                ].join('\n'),
                suggestion: tmpl("query-suggestions")
            },
            displayKey: function(a, b) {
                return this.query;
            },
            
            source: items.ttAdapter()  
        })
                .on("typeahead:selected", function(e, data, data_set) {

                    var fakeOb = createDomItem(data);
                    fakeOb.attr("id", data.type + data.id);
                    if(data.type == 'folder'){
                        fakeOb.data("hash", data.hash);
                    }
                    fakeOb.find(".vpsve").toggleClass("vpsve fakevpsve");
                    fakeOb.addClass("dn").appendTo("body");
                    $(".fakevpsve").vobox();
                    
                    loadMore = false;
                    $.bbq.pushState({'dir': dir.hash, 'search': encodeURIComponent( $("#search").val() )});
                    $("#search").typeahead("close")
                    return false;
                })
                .on("typeahead:opened", function($e, data, data_set) {
                    $("#search").focus();
                })
                .on("typeahead:closed", function($e, data, data_set) {
                });
        
        //search filter
        var searchFilter = $.cookie("CLO_SF") || false;
        
        if(searchFilter && searchFilter != "all"){
            $("#search_filter").find(":selected").removeAttr("selected");
            $("#search_filter").find('[value="' + searchFilter + '"]').attr("selected", true);
            $("#search_filter").trigger("change")
        }else{
            $.cookie("CLO_SF", $("#search_filter").find(":selected").val())
        }
        $("#search_filter").on("change", function(){
            $("#search").focus();
            searchFilter = $(this).find(":selected").val()
            $.cookie("CLO_SF", searchFilter);
            items.clearRemoteCache();
        });

        $("#search_submit").on("click", function() {
            var searchval = $("#search").val();
            
            if($searcher.hasClass("on")){
                //submit form
                if (searchval.length > 0 && searchval != currSearch) {
                    loadMore = false;
                    var state = {
                        'dir': dir.hash,
                        'search': encodeURIComponent(searchval)
                    }
                    
                    if(searchFilter != "all" && searchFilter !== false){
                        console.log(searchFilter)
                        state.filter = searchFilter;
                    }
                    
                    $.bbq.pushState(state);
                    
                    $("#search").typeahead("close")
                    return false;
                }else{
                    $("#search").focus();
                }
            }
            
            if ((!$searcher.hasClass("on")) || $searcher.val().length == 0) {
                $("#search").focus();
            }             
            
            return false;
        });
        var bEv;
        $(document).mousedown(function(e) {
            bEv = e.target || e.srcElement;
            
            checkCloseSearch(this, bEv);
                        
        });
        $(document).mouseup(function(e) {
            bEv = null;
        });
        $("#search").on("focus", function () {
            $searcher.addClass("on");
            $list.addClass("listdown");

            if (isMob())
                return;

            var ev = $.Event("keydown");
            ev.keyCode = ev.which = 40
            $(this).trigger(ev)
            return true
        })
                .on("blur", function (e) {
                    
                    checkCloseSearch(this, bEv);

                }).on("keyup", function (e) {
                    var $this = $(this),
                            match = $(this).val();
            if ($this.val().length > 0) {
                $searcher.addClass("opened")
                $searcher.find(".clearinput").addClass("on");

                if ($searcher.data("url")) {
                    var obj = $searcher.data("url");
                    if ($this.val() in obj) {
                        var searchDetail = '<div id="search_details" class="well well-sm borrn ptb5 mb5 mt0 curdef">Search result for <span class="highlight p3"><span class="large">"</span><b class="medium">' + obj[$this.val()] + '</b><span class="large">"</span></span> inside <b class="ul">' + dir.name + '</b> with filter <b class="ul">' + $("#search_filter").find(":selected").text() + '</b></div>';
                        if ($("#search_details").length > 0)
                            $("#search_details").replaceWith(searchDetail)
                        else
                            $searcher.find(".tt-dropdown-menu").prepend(searchDetail)
                    }
                }

            } else {
                $searcher.removeClass("opened");
                $searcher.find(".clearinput").removeClass("on");
            }
            if (e && e.which === $.ui.keyCode.ENTER && $.trim(match) !== "") {
                $("#search_submit").trigger("click")
            }
        });

        $searcher.find(".clearinput").on("click", function () {
            $("#search").typeahead('val', '').focus().trigger("keyup");
            return false;
        });
        
        //add click events to suggested items
        $body.on("click", ".suggestion-action", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this),
                    d = $this.data();
            hideTip(this)
            setTimeout(function() {
                switch (d.action) {
                    case 'viewItem':
                        var $target = $("#" + d.type + d.id).find(".fakevpsve");
                        $target.trigger("click");

                        $target.on("click", function() {
                            $("#" + d.type + d.id).removeClass("dn");
                        });
                        break;
                    case 'downloaditem':
                        itemActions("downloadItem", $("#" + d.type + d.id), false);
                        break;
                    case 'downloadfolder':
                        itemActions("downloadItem", $("#" + d.type + d.id), false);
                        break;
                    case 'openupfolder':
                        $.bbq.pushState( { 'dir': $("#" + d.type + d.id).data("hash") });
                        break;                        
                }
            }, 17)
            return false;
        });

//    }//screen is bigger than 768px
//doc is ready
});

window.onbeforeunload = function() {
    if (currprocData("uploadinprogress") == 1)
        return "An upload process is running. Do you really want to leave the page?";
}

function checkCloseSearch(that, bEv) {
//    console.log(that, bEv, $("#searcher").has(bEv))
    var pass = (typeof bEv != 'undefined' && bEv !== null) ? ($("#searcher").has(bEv).length > 0 || $("#search").is(bEv)) : false

    if (!pass) {
        $searcher.find(".tt-dropdown-menu").css("display", "none")
        $searcher.removeClass("on");
        $list.removeClass("listdown");
        $body.removeClass("searcison");
    }
}
//update Pagelink cache
function updateprocData(newobj) {
    var obj = $viewPort.data("procs");
    $.extend(true, obj, newobj);
    $viewPort.data("procs", obj);
}
function currprocData(el) {
    var data = $viewPort.data("procs") || 0;
    return data ? data[el] : 0;
}
function loadPage(hash, force, delay) {
    var waitt = delay || 1;

    setTimeout(function() {
        $.bbq.pushState(hash);
        if (force) {
            forceUpdate = true;
            //$(window).trigger("hashchange");
        }
    }, waitt);
}
function reloadPage(changed, unblockel, delay) {

    var currentLoad = $.param.fragment(),
            waitt = delay || 1,
            toLoad;
    setTimeout(function() {
        if (changed) {
            forceUpdate = true;
            $.bbq.pushState($.param.fragment(), 2);
            $(window).trigger("hashchange");
        } else {
            forceUpdate = false;
            $(unblockel).unblock();
            $spintarget.spin(false);
        }
    }, waitt);
}

function returnTypeIcon(ext) {
    var icon = 'other';
    if (ext === false)
        return icon;

    $.each(typesObj, function(key, obj) {
        if ($.inArray(ext, obj) > -1) {
            icon = key.split("-")[0];
            return;
        }
    });
    return icon;
}

function loadExtractDirectories($this, ract, $form, $box) {

    var d = $this.data(),
            sdata = {
                action: "extract_directories",
                value: d.id,
                path: dir.path,
                name: d.t,
                toSelect: {
                    'name': 'extract_to',
                    'id': 'exto',
                    'class': 'form-control'
                }
            },
    $tg = $form.find("#extract_to");

    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        dataType: 'json',
        cache: true,
        data: sdata,
        beforeSend: function() {
            setTimeout(function() {
                $tg.blockit({message: $indicator + ' loading target tree...', simple: true, button: false});
            }, 16);
        },
        success: function(data, statusText, xhr) {
            if (data.result) {
                setTimeout(function() {
                    $tg.unblock();
                }, 50);

                $tg.html(data.html);
                var tst = $form.find("#zip_contains");


                $form.find("#zip_infp").prepend('<div class="callout callout-info mt10"><b>' + data.zipInfo.data.Items + '</b> Items | <b>' + data.zipInfo.data.Size + '</b>B<small>(' + formatFileSize(data.zipInfo.data.Size) + ')</small>' + ' | <b>' + data.zipInfo.data.UnCompSize + '</b>B<small>(Uncompressed:' + formatFileSize(data.zipInfo.data.UnCompSize) + ')</small><b> | ' + data.zipInfo.data.Ratio + '%' + '</b> ratio.</div>');

                tst.find("div.int").html(data.zipInfo.table.html);
                var stct = tst.find("table");
                tst.find("#zip_cont-inner").on('shown.bs.collapse', function() {
                    if (!stct.hasClass("footable"))
                        stct.footable();

                    $(window).resize()
                }).on('hidden.bs.collapse', function() {
                    $(window).resize();
                });

                $(window).resize();
            }
            var cdata = $.deparam.fragment($form.serialize());
            
            $.extend(true, cdata, {parentid: dir.id});
            
            $form.find("#extract_toBtn").on('click', function(){
                var $that = $(this)
                //extractTo = $form.find("#exto").val().length > 0 ? $form.find("#exto").val() : $form.find("#exto1").val()
                var cdata = $.deparam.fragment($form.serialize());  
                $.extend(true, cdata, {parentid: dir.id});
                
                $.ajaxQueue({
                    url: AJAX_PATH,
                    type: 'POST',
                    dataType: 'json',
                    cache: true,
                    data: cdata,
                    beforeSend: function() {
                        $that.button("loading");
                        saveArchive = ($box.find("#saveZip").is(":checked") ? 1 : 0);
                    },
                    success: function(data, statusText, xhr) {

                        handleBoxFormAjaxResponse(data, statusText, xhr, $form, $that, $box);

                        if (data.result) {

                            $that.toggleClass("btn-primary-alt btn-success-alt");

                        } else {

                            $that.button("reset").removeClass("btn-primary-alt").addClass("btn-danger-alt");

                        }
                    }
                });                
                
            });
        }
    });
}

function calculateArchiveSize($this, ract, $form, $box) {
    var d = $this.data();
    var sdata = {
        action: "calculate_size",
        value: archiveItems.value,
        path: archiveItems.path,
        parent: archiveItems.parent
    },
    ondir = d.diro,
            saveArchive = 1;

    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        dataType: 'json',
        cache: true,
        data: sdata,
        beforeSend: function() {
            setTimeout(function() {
                $form.find(".tbs").blockit({message: indicatorCssSm + ' calculating approximate size...', simple: true, button: false});
            }, 16);
        },
        success: function(data) {
            setTimeout(function() {
                $form.find(".tbs").unblock();
            }, 50);
            $box.find("#total_size_down").find("strong").html(data.size);

            archiveItems = {};
            //add go ahead button event
            $box.find("#downloadBtn").on("click", function() {
                var $dwbtn = $(this);

                $.ajaxQueue({
                    url: AJAX_PATH,
                    type: 'POST',
                    dataType: 'json',
                    cache: true,
                    data: {
                        dirid: (dir.id == 1 ? 1 : (ondir ? dir.parentid : dir.id)),
                        action: "compress",
                        dirname: (dir.id == 1 && ondir ? dir.hash : dir.name),
                        ondir: ondir
                    },
                    beforeSend: function() {
                        $dwbtn.button("loading");
                        saveArchive = ($box.find("#saveZip").is(":checked") ? 1 : 0);
                    },
                    success: function(data, statusText, xhr) {

                        handleBoxFormAjaxResponse(data, statusText, xhr, $form, $dwbtn, $box);

                        if (data.result) {

                            $dwbtn.toggleClass("btn-primary-alt btn-success-alt");

                        } else {

                            $dwbtn.button("reset").toggleClass("btn-primary-alt btn-danger-alt");

                        }
                    }
                });
            });
        }
    });
}
function prepareDownload($this, ract, $form, $box) {
    var d = $this.data();
    
    $item = $list.findItem(d.value, "selected");
        
    var sdata = {
        action: "prepare_download",
        value: downloadItems.value,
        path: downloadItems.path,
        name: d.name
    },
    ondir = d.diro,
            saveArchive = 1;

    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        dataType: 'json',
        cache: true,
        data: sdata,
        beforeSend: function() {
            setTimeout(function() {
                $form.find(".tbs").blockit({message: $indicator + ' preparing to download...', simple: true, button: false});
            }, 16);
        },
        success: function(data, statusText, xhr) {

            setTimeout(function() {
                $form.find(".tbs").unblock().hide();
                handleBoxFormAjaxResponse(data, statusText, xhr, $form, false, $box);

            }, 50);

            downloadItems = {};
            $.fileDownload(data.octet)
                    .done(function() {
                        selectItem($item, true);
                        $.removeCookie("CLO_OCT");
                    })
                    .fail(function() {
                        alert('File download failed!');
                    });
        }
    });
}
function calculateDownloadSize($this, ract, $form, $box) {
    var d = $this.data();
    var sdata = {
        action: "calculate_size",
        value: downloadItems.value,
        path: downloadItems.path
    },
    ondir = d.diro,
            saveArchive = 1;

    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        dataType: 'json',
        cache: true,
        data: sdata,
        beforeSend: function() {
            setTimeout(function() {
                $form.find(".tbs").blockit({message: indicatorCssSm + ' calculating approximate size...', simple: true, button: false});
            }, 16);
        },
        success: function(data) {
            setTimeout(function() {
                $form.find(".tbs").unblock();
            }, 50);
            $box.find("#total_size_down").find("strong").html(data.size);

            downloadItems = {};
            //add go ahead button event
            $box.find("#downloadBtn").on("click", function() {
                var $dwbtn = $(this);

                $.ajaxQueue({
                    url: AJAX_PATH,
                    type: 'POST',
                    dataType: 'json',
                    cache: true,
                    data: {
                        dirid: (dir.id == 1 ? 1 : (ondir ? dir.parentid : dir.id)),
                        action: "download",
                        dirname: (dir.id == 1 && ondir ? dir.hash : dir.name),
                        ondir: ondir,
                        saveArchive: ($box.find("#saveZip").is(":checked") ? 1 : 0)
                    },
                    beforeSend: function() {
                        $dwbtn.button("loading");
                        saveArchive = ($box.find("#saveZip").is(":checked") ? 1 : 0);
                    },
                    success: function(data, statusText, xhr) {

                        handleBoxFormAjaxResponse(data, statusText, xhr, $form, $dwbtn, $box);

                        if (data.result) {

                            $dwbtn.toggleClass("btn-primary-alt btn-success-alt");

                            if ((dir.id == 1 && saveArchive) || (!ondir && saveArchive)) {
                                reloadPage(1, false, 400);
                            }
                            $.fileDownload(data.octet)
                                    .done(function() {
                                        $.removeCookie("CLO_OCT");
                                    })
                                    .fail(function() {
                                        alert('File download failed!');
                                    });
                        } else {

                            $dwbtn.button("reset").toggleClass("btn-primary-alt btn-danger-alt");

                        }
                    }
                });
            });
        }
    });
}

//dom ready edits
$(function() {

    //top action button event
    $topActBtns.find(".act").on("click", function(e) {
        
        e.preventDefault();
        
        hideTip(this);

        var $this = $(this),
                data = $this.data(),
                alreadyClicked = data.clicked;
        
        if (alreadyClicked) {
            return false;
        }  
        
        switch (data.action) {
            case 'updatedir':

                $notify.jGrowl("close").jGrowl('<div class="icon icon-flash animated zoomOutLeft loop"></div>'+"Syncing current folder...", {header: "In progress", sticky: true, theme: 'iconup'});

                forceUpdate = true;
                var q = {
                    'page': 'list',
                    'dir': currDir,
                    force: true,
                    'updatedir': 1,
                    'path': dir.path,
                    'p': dir.id + ',' + dir.parentid,
                    filter: (currFilter ? currFilter : undefined),
                    search: (currSearch ? currSearch : undefined)
                }

                doPageLoad(false, q, false, "sidebarStatistics");

                break;

            case 'createdir':
                var item = createJElobj({"data-type": "d"}).data("id", 'd_' + dir.id);
                itemActions("create", item, false);
                break;

            case 'sharedir':
                var item = createJElobj(false);
                createActionBox("share", item, "loadShareBox", "share-square");
                break;

            case 'cutItem':

                itemActions("cut", $("#list li.selected"), false);

                //console.log(cutcopyItems)

                break;

            case 'copyItem':

                itemActions("copy", $("#list li.selected"), false);

                //console.log(cutcopyItems)

                break;

            case 'pasteItem':

                itemActions("paste", cutcopyItems, false, true);

                //console.log(cutcopyItems)

                break;


            case 'deleteItem':

                itemActions("delete", $("li.preview.selected"), false);

                break;

            case 'shareItem':
                itemActions("shareItem", $("li.preview.selected"), "loadShareBigBox", "share-alt");
                break;

            case 'downloadFolder':

                itemActions("downloadFolder", false, "file-zip-o");
                break;

            case 'downloadItem':

                itemActions("downloadItem", $("li.preview.selected"), "file-zip-o");

                break;

            case 'switchListType':
                var $this = $(this),
                        type = $this.data("type"),
                        atype = (type == 'list' ? 'thumb' : 'list');

                $list.removeClass(atype).addClass(type);
                $.cookie("CLO_VT", type);
                //perfection for list typle
                if (type == 'list') {
                    $list.find("li.preview").each(function() {
                        var $this = $(this),
                                $ch = $this.find("span.vn"),
                                d = $this.data();
                        if ($ch.attr("rel")) {
                            $ch.html(truncToTip($('<span>'), d.t, 50, false, d.ftype).html())
                        }
                    });
                } else {
                    $list.find("li.preview").each(function() {
                        var $this = $(this),
                                $ch = $this.find("span.vn"),
                                d = $this.data();
                        if ($ch.attr("rel")) {
                            $ch.html(truncToTip($('<span>'), d.t, 22, false, d.ftype).html());
                        }
                    });
                }
                break;
        }
        
        $this.data('clicked', true);
        
        setTimeout(function(){
            $this.removeData("clicked")
        },300);
    });

    //add profile dropdown events
    $uiactControl.on("click", "a.uiact", function() {
        var $this = $(this);

        //pre calculate hight set min-height to modal-content;
        var fullh = (parseInt($(window).height())-187)
        $this.data({
            width: $this.data("width") || "70%",
            height: fullh
        });


        createActionBox("tpage", $this, "remoteLoadPage");

        return false;
    });

    //bind tooltip events
    $body.tooltip({
        html: true,
        selector: '[rel=tip]:not(".disabled")',
        trigger: "hover",
        container: function(tip, element) {
            return ($(element).data("container") === undefined) ? $body : false
        },
        animation: false,
        placement: function(tip, element) {
            return $(element).data("placement") ? $(element).data("placement") : popoverautoplacement(tip, element, true)
        },
    });
    //bind autopops
    $body.popover({
        html: true,
        selector: '[rel=pop]:not(".disabled")',
        trigger: "hover",
        container: function(tip, element) {
            return ($(element).data("container") === undefined) ? $body : false
        },
        animation: false,
        placement: function(tip, element) {
            return $(element).data("placement") ? $(element).data("placement") : popoverautoplacement(tip, element, true)
        },
    }).show();
        
    //General events of items
    $body.on("click", "li.preview .tnsocialContainer", function() {
        var $this = $(this).closest("li.preview");
         loadShareBox($this)
    }).on("mousleave", "li.preview", function() {
        clearTimeout(hdelay);
    });
    
    $body.on('mousedown', function (e) {
        setTimeout(function(){
            
//        if ($container.data("unfocusable")) {

            $('.info-active').find(".unfocusablebtn").each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
                
                
            });
//        }
    },16);
    });    

    //some sidebar events
    //statistics collapse button event
    $(".statPull").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        hideTip(this);
        var $that = $(this),
                $stcont = $("#usageStatistics"),
                $i = $that.find("i");

        $stcont.append($that.removeClass("on"));
        
        $stcont.slideToggle("fast", function() {
            
            $("#usageStatistics").resize();
            
            setTimeout(function() {
                                
                if ($stcont.is(":visible")) {
                    
                    $stcont.append($that.removeClass("on"));
                    
                    $("#usageStatistics").unblock()
                } else {
                    
                    $stcont.after($that.addClass("on"));
                }
                
                $i.toggleClass("icon-angle-double-up icon-angle-double-down");
            }, 10);
        }
        );

    }).click();
    
    //sidebar collapse

    $sdivider.on("click", function(e, d) {
        var $this = $(this)
        closeSideBar($this, d, false);
    });

    $sopener.on("click", function(e, d) {
        var $this = $(this)
        openSideBar($this, d, false)
    });

    selectedTemp = [];

    //check single - item
    $list.on("change", "input[type=checkbox]:not(:disabled)", function(e, d) {

        var $that = $(this),
                totalItem = $list.find("li.preview").length,
                totalChecked = $list.find("input[type=checkbox]:checked").not(":disabled").length,
                parent = $that.closest("li.preview"),
                data = parent.data(),
                tempid = data.id;

        if ($that[0].checked) {

            parent.addClass("selected");

            if ($.inArray(tempid, selectedTemp) === -1) {
                selectedTemp.push(tempid);
            }
            //store selected items into global scope as an object foreach directory
            if ($.inArray(tempid, selectedItems[dir.id]) === -1) {
                selectedItems[dir.id].push(tempid);
            }

        } else {

            parent.removeClass("selected");

            selectedTemp = jQuery.grep(selectedTemp, function(value, key) {
                return value !== tempid;
            });

            //remove unselected item from selectedItems
            selectedItems[dir.id] = jQuery.grep(selectedItems[dir.id], function(value, key) {
                return value !== tempid;
            });

        }

        if (!totalChecked) {
            selectedTemp = [];
            selectedItems[dir.id] = [];
        }

        liveSelections(totalChecked, totalItem);

        //don't write cookie for each elements/touching to cookies makes things slower!
        if (!d) {
            if (selectedTemp.length > 0)
                $.cookie("CLO_IS_" + dir.id, selectedTemp);
            else
                $.removeCookie("CLO_IS_" + dir.id);
        }

    });

    //check multiple - items
    $("#checkFiles").on("change", function() {
        var $that = $(this),
                status = $that.prop("checked"),
                $chkbox = $list.find("input[type=checkbox]:not(:disabled)");

        if ($that.prop("indeterminate")) {
            status = true;
        }
        $chkbox.prop("checked", status).trigger("change", ['all']);

        if (selectedTemp.length > 0) {
            $.cookie("CLO_IS_" + dir.id, selectedTemp);
        }
        else {
            $.removeCookie("CLO_IS_" + dir.id);
        }
    });
    
    //add editable to name and description
    
    $.fn.editableContainer.defaults.placement = popoverautoplacement;
    if(($.inArray("describe", ui.perms) > -1 || $.inArray("rename", ui.perms) > -1))
    $list.editable({
        selector: ($.inArray("describe", ui.perms) > -1 && $.inArray("rename", ui.perms) > -1) ? 'li.preview:not(.error) span.dv, li.preview:not(.error) span.vn' : ( 
                ($.inArray("describe", ui.perms) > -1 && $.inArray("rename", ui.perms) === -1) ? 'li.preview:not(.error) span.dv' : (
                ($.inArray("describe", ui.perms) === -1 && $.inArray("rename", ui.perms) > -1) ? 'li.preview:not(.error) span.vn' : '' 
                )
                ),
        html: true,
        emptytext: "",
        placement: popoverautoplacement,
//        container: 'body',
        title: function() {
            var ftype = $(this).closest("li.preview").data("ftype");
            if ($(this).closest("li.preview").data("type") == 'd') {
                ftype = 'folder';
            }
            return '<i title="' + ftype + '" class="icon icon-circle ' + (filterTypes[ftype]) + '"></i> ' + $(this).text()
        },
        viewport: "",
        url: '/',
//        toggle: 'manual',
        pk: function() {
            return $(this).closest("li.preview").data("id").match(/\d+/)[0];
        },
//        name: function() {
//            
//            return $(this).text();
//        },        
        params: function(params, a) {
            var d = $(this).closest("li.preview").data();
            
            if(!$(this).hasClass("dv")){
                params.ext = d.realext;
            }
            params.path = d.ppath; 
            params.parent = d.parent;
            params.oname = d.t;
            params.type = d.type;
            params.action = $(this).hasClass("dv") ? 'description' : 'rename'
            return params
        },        
        
        success: function (response) {

            if (response.result) {

                //$notify.jGrowl("close").jGrowl(response.message.txt, {header: response.message.title, life: 5000, closeDuration: 0});
                var $el = $(this);
                    $parent = $el.closest("li.preview");
                                
                if($el.hasClass("vn")){
                    //renamed
                    var data = {
                        't': response.newValue,
                        'p': response.newpValue
                    }                 
                    
                }else{
                    var data = {
                        'description': response.newValue
                    }

                    if (response.newValue) {
                        $parent.find(".tnpreviewDesc").addClass("on").removeClass("empty");
                        setTimeout(function(){
                            $parent.find(".tnpreviewDesc").removeClass("on")
                        },3000)
                    }                         
                }
                
                $parent.data(data);
                
                if ($el.data("original-title")) {
                    $el.attr({
                        'data-original-title': response.newValue
                    });
                }                
                
                return  {newValue: (response.newValue !== false ? response.newValue : '')};

            } else {

                //$($(this).data("editable").container.$form).find(".help-block").show().html(response.message);
                return response.message;
            }

        },
    }).on('x-editable.shown', function (e, editable) {
        var $el = editable.$element,
                $parent = $el.closest("li.preview"),
                d = $parent.data();
        //edit title
        if ($el.hasClass("vn")) {
            $parent.addClass("vn");
            var val = (d.type != 'd') ? (d.p + ((d.realext) ? ('.' + d.realext) : '')) : d.t;
            editable.input.$input.val(val);
            
        } else {
            $parent.addClass("dv");
            var val = (d.description ? d.description : ""),
                    tempel = $("<span/>"),
                    value = tempel.html(val).text(),
                    $t = editable.input.$input;
           
            $t.val(value).attr({
                "placeholder": "Modify description of " + d.t
            });
            if ($el.data("original-title")) {
                $el.data("bs.popover").$tip.find("h3.popover-title").html(editable.options.title)
            }
            
            if($el.text() == ""){
                $el.html($el.data("emptytext"))
            }            
        }
        setTimeout(function(){
            $parent.addClass("editing");
        },16);
    }).on('x-editable.hidden', function (e, editable) {
        var $element = editable.$element;
            $element.closest("li.preview").removeClass("editing dv vn");   
            if($element.text() == $element.data("emptytext")){
                $element.html("")
            }
    });   

    $list.on("click", "span.editName", function(e) {
        e.stopPropagation();
        $(this).parent().find("span.vn").trigger("click", true);
    });
    
    $list.on("click", "span.edititemDesc", function(e) {
        e.stopPropagation();
        $(this).parent().find("span.dv").trigger("click", true);
    });    

    //directory empty-area context menu
    $.contextMenu({
        selector: '#viewport',
        className: 'dropdown-menu fdropdownActions',
        build: function($trigger) {
            var options = {
                items: {
                    "refresh": {
                        name: "Refresh",
                        icon: "refresh",
                        callback: function() {
                            reloadPage(1, false, 100);
                        },
                        disabled: function() {
                            return currSearch ? true : false
                        }
                    },
                    "edit": {
                        className: 'empty',
                        disabled: function() {
                            return currSearch ? true : false
                        }
                    },
                    "newdir": {
                        name: "New Folder",
                        icon: "plus",
                        callback: function() {
                            $topActBtns.find('a[data-action="createdir"]').trigger("click");
                        },
                        disabled: function() {
                            return currSearch ? true : false
                        }
                    },
                    "download": {
                        name: "Download",
                        icon: "cloud-download",
                        callback: function(key, opt) {
                            itemActions("downloadFolder", false, "file-zip-o");
                        },
                        disabled: function() {
                            return currSearch ? true : false
                        }
                    }
                }
            }

            if (cutcopyItems.length && checkPasteTarget()) {
                options.items.paste = {
                    name: "Paste",
                    icon: "paste",
                    callback: function() {
                        $topActBtns.find('button[data-action="pasteItem"]').trigger("click");
                    },
                    disabled: function() {
                        return currSearch ? true : false
                    }
                }
            }

            if (dir.id > 6) {
                options.items.edit = {
                    name: "Edit",
                    icon: "pencil",
                    callback: function() {
                        var data = {
                            'data-item': dir.id,
                            'class': 'item',
                            'data-t': dir.name,
                            'data-parent': dir.parentid,
                            'data-type': 'd',
                            'data-ondir': true
                        },
                        item = createJElobj(data);
                        itemActions("edit", item, "pencil");

                    },
                    disabled: function() {
                        return currSearch ? true : false
                    }
                }
            }
            
            if(($.inArray("create", ui.perms) === -1) )
                delete options.items.newdir;
            
            if(($.inArray("download", ui.perms) === -1) )
                delete options.items.download;            

            return options;
        }

    });
    
    //items context menu
    $.contextMenu({
        selector: 'li.preview',
        className: 'dropdown-menu fdropdownActions',
        build: function($trigger) {
            if($trigger.hasClass("sharing") || (ui.totalPerm) === 0){
                return false;
                
            }            
            $trigger.find(".fileMoreButton").blockit({message: $indicator, fadeOut: 1, blockMsgClass: '', css: {'padding': 0}, overlayCSS: {opacity: 0.9}});
            var options = {
                //zIndex : 9,
                events: {
                    show: function(opt) {
                        var $this = $(this)
                        setTimeout(function() {
                            $this.find(".fileMoreButton").unblock();
                        }, 10)
                    },
                    hide: function(opt) {
                        //hide filemore button
                        $(this).find(".fileMoreButton").removeClass("on").unblock();

                    },
                },
                callback: function(key, opt) {

                    $(this).contextMenu("hide");
                    itemActions(key, this, opt);

                    return false;
                },
                items: {
                    
                    "open": {
                        name: "Open",
                        icon: "em",
                        className: "bold blue",
                        callback: function (key, opt) {
                            var that = this;
                            
                            var state = {
                                'dir': that.find(".item").data("hash"),
                            }
                            if (currFilter) {
                                state.filter = currFilter;
                            }
                            if (currSearch) {
                                state.search = currSearch;
                            }
                            $.bbq.pushState(state, 2);
                        },
                    },
                    "sep5": "---------",
                    "addstar": {
                        name: "Add Star",
                        icon: "star",
                        className: "gold",
                        callback: function (key, opt) {
                            selectItem(this, false);
                            var add = $trigger.data("starred") ? false : true;
                            itemActions("addremovestar", $list.find("li.selected"), add);
                        }
                    },
                                        
                    "shareOp": {
                        name: "Share...",
                        icon: "share-alt",
                        callback: function (key, opt) {
                          return false;  
                        },
                        "items": {
                            "email": {
                                name: "Send via E-mail",
                                icon: "envelope",
                                callback: function (key, opt) {
                                    selectItem(this, false);
                                    itemActions("email", $list.find("li.selected"), opt);
                                }
                            },
                            "share": {
                                name: "Social Share",
                                icon: "hand-o-right",
                                callback: function (key, opt) {
                                    loadShareBox(this);
                                }
                            },
                            "sharewith": {
                                name: "Share With",
                                icon: "user-plus",
                                callback: function (key, opt) {
                                    loadShareWithBox(this);
                                }
                            }
                            }
                    },
                    "sep3": "---------",
                    "download": {
                        name: "Download",
                        icon: "download",
                        callback: function(key, opt) {
                            downloadSingleItem(this, opt);
                        }
                    },
                    "archive": {
                        name: "Compress(.zip)",
                        icon: "file-zip-o",
                        callback: function(key, opt) {
                            selectItem(this, false);
                            itemActions("archiveItem", $list.find("li.selected"), opt);
                        }
                    },
                    "sep2": "---------",                    
                    "select": {
                        name: "Select/Deselect",
                        icon: "check-square-o",
                        callback: function(key, opt) {
                            selectItem(this, true)
                        }
                    },                  
                    "sep4": "---------",
                    "edit": {
                        className: 'empty'
                    },
                    "rename": {
                        className: 'empty'
                    },
                    "cut": {
                        name: "Cut",
                        icon: "cut"
                    },
                    "copy": {
                        name: "Copy",
                        icon: "copy"
                    },
                    "paste": {
                        className: 'empty'
                    },
                    "delete": {
                        name: "Delete",
                        icon: "trash"
                    },
                    "sep1": "---------",
                    "quit": {
                        name: "Quit",
                        icon: "em"
                    },                    
                }
            }
            
            if($trigger.data("starred")){
                options.items.addstar.name = "Remove Star";
                options.items.addstar.icon = "star-o"
            }            

            //folder actions
            if ($trigger.hasClass("folder")) {

                options.items.edit = {
                    name: "Edit",
                    icon: "pencil",
                    className: ''
                }
                
                if(checkPasteTarget($trigger)){
                options.items.paste = {
                    name: "Paste",
                    icon: "paste",
                    className: '',
                    disabled: function(key, opt) {
                        return !checkPasteTarget($trigger)
                    }
                }
                }

            } else {
                //file actions
                if($trigger.data("viewable")){
                    options.items.open = {
                        name: "Preview",
                        icon: "eye",
                        callback: function(key, opt) {
                            $trigger.find(".vpsve").trigger("click");
                        }
                    }
                }else{
                    delete options.items.open;
                }
                
                options.items.rename = {
                    name: "Rename",
                    icon: "pencil",
                    className: '',
                    callback: function(key, opt) {
                        setTimeout(function() {
                            $trigger.find("span.vn").trigger("click", true)
                        }, 150)
                    }
                }

                if ($trigger.data("ext") == "zip") {
                    options.items.archive = {
                        name: "Extract to",
                        icon: "file-zip-o",
                        callback: function(key, opt) {
                            itemActions("extractItem", this, opt);
                        }
                    }
                }
            }
            
            console.log( $trigger.data() )
//            if(currSearch || currFilter ){
//                
//            }
            
            //remove all actions from searched list
            if (currSearch || currFilter) {
                var ittxt = ($trigger.hasClass("folder") ? 'folder' : 'file')
                options.items = {
                    "filelocation": {
                        name: "Open " + ittxt + " location",
                        icon: "mail-forward",
                        callback: function(key, opt) {

                            var state = {
                                'dir': $trigger.data("dirhash")
                            }
                            
                            lookfor = $trigger.data("id");
                            
//                            if (currFilter) {
//                                state.filter = currFilter
//                            }
                            $.bbq.pushState(state, 2);
                        }
                    }
                }
            }
            
            if(($.inArray("download", ui.perms) === -1) )
                delete options.items.download;
            if(($.inArray("share", ui.perms) === -1) )
                delete options.items.shareOp.items.share;
            if(($.inArray("compress", ui.perms) === -1) ){
                delete options.items.archive;
                delete options.items.sep2;
            }
            if(($.inArray("delete", ui.perms) === -1) ){
                delete options.items["delete"];
            }   
            if(($.inArray("email", ui.perms) === -1) )
                delete options.items.shareOp.items.email;              
            if(($.inArray("move", ui.perms) === -1) )
                delete options.items.cut;
            if(($.inArray("copy", ui.perms) === -1) )
                delete options.items.copy;
            if(($.inArray("copy", ui.perms) === -1) && ($.inArray("move", ui.perms) === -1) )
                delete options.items.paste;
            if(($.inArray("rename", ui.perms) === -1) )
                delete options.items.rename;  
            if(($.inArray("rename", ui.perms) === -1) && ($.inArray("describe", ui.perms) === -1) )
                delete options.items.edit;            
            
            return options;
        }
    });


    //file & folders trigger context menu with top more button
    $body.on("click", ".fileMoreButton", function(e) {
        var $that = $(this),
                of = $that.offset(),
                $li = $that.closest("li.preview");

        $li.contextMenu({x: of.left - 1, y: of.top + $that.height() + 3});
        $that.addClass("on")
    });

    //click events of static types on sidebar
    $sideBarStaticTree.find(".filter").on("click", function(e) {
        var filter = $(this).attr("rel").replace(/^#/, '');

        toggleStaticFilterButtonStates(e.target);
        loadMore = false;
        $.bbq.pushState({
            'dir': dir.hash,
            'filter': filter
        });
        return false;
    });
    //deep button
    $sideBarStaticTree.find("#filter_current_dir").on("change", function() {
        var that = $(this);
        if(that.is(":checked")){
            $.cookie("CLO_DP", "1");
        }else{
            $.removeCookie("CLO_DP");
        }
        if(currFilter)
            reloadPage(1, false, 400);
    });
    
    $sideBarStaticTree.find("#filter_current_dir").prop(":checked", $.cookie("CLO_DP")).trigger("change");
    
    //reset filter button
    $sideBarStaticTree.find("button.resetFilter").on("click", function(e) {
        hideTip(this)
        toggleStaticFilterButtonStates(false);
        var state = {
            'dir': dir.hash
        }
        if (currSearch) {
            state.search = currSearch;
        }
        $.bbq.pushState(state, 2);
        $(window).resize();

    });

    setTimeout(function() {
        if (!isMob() && !isTablet())
            sidebarStatistics();

        $("#usageStatistics").find(" .chartContainer").on("click", function() {
            createActionBox("statistics", $(this), "createStatistics", "bar-chart-o");
        });

    }, 1000);


    //cut copy paste list events
//    $itemPaste.on('click', function(e) {
//        e.stopPropagation();
//        return false;
//    });

    $itemPaste.on("click", "a.clearcutocopyItem", function() {
        cutcopyItems = [];
        cutCopyItemList();
    });

    $itemPaste.on("click", "i.cutitemdismiss", function() {
        var l = $(this).closest("li"),
                id = l.data("id"),
                el = $list.findItem(cutcopyItems[id].id, "selected");
        el.removeClass("cut copy");
        selectItem(el, true);
        
        cutcopyItems = jQuery.grep(cutcopyItems, function(value, key) {
            return key !== id;
        });
        
        l.remove();
        cutCopyItemList(false);
        return false;
    });

    $body.on("click", "span.qplayMedia", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this),
                $clone = $this.clone(true),
                startFrom = $this.data("currentTime") || 0,
                $item = $this.closest("li.preview"),
                $viewpart = $item.find("div.vpsve"),
                $bottomBar = $item.find(".tnpreviewBottomBar"),
                data = $item.data(),
                ww = $viewpart.width(),
                wh = $viewpart.height(),
                wh = (data.ftype == "video" ? ('width="' + (ww) + '" height="' + (wh) + '"') : ''),
                src = CLO_URL + '/' + UIDIR + ((data.path != '/') ? (data.path + '/') : data.path) + data.t,
                $el = $('<' + data.ftype + ' src="' + src + '" ' + wh + '>');
        var http = checkhead($item.find(data.ftype).attr('src'));
        hideTip(this)

        if (http == 200) {
            if ($list.hasClass("list") && data.ftype == 'video') {
                $item.data("playState", true);
                $viewpart.trigger("click");
                return;
            }

            $this.replaceWith($el);

            $item.find(data.ftype).mediaelementplayer({
                audioWidth: ww,
                audioHeight: 42,
                defaultVideoWidth: ww,
                defaultVideoHeight: wh,
                videoWidth: ww,
                videoHeight: wh,
                enableAutosize: true,
                plugins: ['flash', 'silverlight'],
                pluginPath: ASSURI + 'player/',
                flashName: 'player.swf',
                features: ['playpause', 'progress', 'fullscreen'],
                success: function(media) {
                    media.addEventListener('play', function() {

                        $item.data("playState", true);

                        $item.find(".mejs-time-rail").show();

                        mediaPlaying = media;

                    }, true);

                    media.addEventListener('pause', function() {
                        $item.data("playState", false);
                        mediaPlaying = false;
                    }, true);

                    //auto play if currentTime exist in data
                    if (data.currentTime) {

                        var savedPosition = data.currentTime,
                                mediaHasPlayed = false

                        media.addEventListener('loadedmetadata', function(e) {
                            if (!mediaHasPlayed && savedPosition > 0) {

                                //Set the start time from the relation in seconds
                                media.setCurrentTime(savedPosition);

                                //Set the video has played flag - so if paused and played it is not reset to start time
                                mediaHasPlayed = true;
                            }

                        }, false);
                    }

                    media.play();
                },
                error: function() {
                    appendMediaError($item, http)
                }

            });
            //remove default&add custom event to the fullscreen button
            setTimeout(function() {
                $item.find(".mejs-fullscreen-button").find("button").off("click");
                $item.find(".mejs-fullscreen-button").off("click").click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    //store currentTime
                    var player = $item.find(data.ftype)[0].player,
                            currentTime = player.getCurrentTime();
                    $item.data("currentTime", currentTime);

                    $viewpart.trigger("click");

                    //destroy the small player and re-create it;
                    //player.setSrc(src);
                    player.remove();
                    $bottomBar.append($clone);
                    $bottomBar.find("video").remove();

                    return false;
                });

            }, 17);

            return false;

        } else {
            appendMediaError($item, http)
        }

    });


    //viewport sort link items
    $(".filesHeading").find(".link").on("click", function() {
        var $this = $(this),
                $parent = $this.closest(".fheading"),
                data = $this.data();

        if ($this.closest(".fheading").hasClass("up")) {

            $(".fheading").removeClass("down").removeClass("up");

            setTimeout(function() {
                $this.closest(".fheading").addClass("down");
            }, 17)
            sortUpdate = sortUpdateMore = true;
            orderby = $parent.data("order");
            sortby = 'asc'
        } else {
            $(".fheading").removeClass("down").removeClass("up");
            sortUpdate = true;
            orderby = $parent.data("order");
            sortby = 'desc'
            setTimeout(function() {
                $this.closest(".fheading").addClass("up");
            }, 17)
        }

        if (orderby == 'none')
            return;

        doPageLoad(false, {
            'page': 'list',
            'dir': currDir,
            'path': dir.path,
            'p': dir.id + ',' + dir.parentid,
            filter: currFilter,
            search: currSearch,
            order: orderby,
            sort: sortby
        }, false);

    });

    $dirNav.on("click", "a.parentN", function() {
        var state = $(this).data("state");

        var tree = $dirTree.fancytree("getTree"),
                node = tree.getNodeByKey(dir.parentid.toString()),
                state = {
                    dir: node.data.hash
                };

        if (currFilter) {
            state.filter = currFilter;
        }

        if (currSearch) {
            state.search = currSearch;
        }

        $.bbq.pushState(state);
    });


    $list.on("click", 'li.preview:not(.tobeUploaded, .uploading) .octet', function() {
        var $li = $(this).closest("li.preview");
        downloadSingleItem($li, false);
    });
    
    
    $("#usageStatistics").on("resize", function(){
        $("#usageStatistics").blockit({message: indicatorCssPurple, fadeOut: 1, blockMsgClass: '', css: {top: "2px", left: "2px", 'padding': 0}, overlayCSS: {opacity: 0.9}});
    });
    
    $.fn.modal.defaults.maxHeight = function(){
    // subtract the height of the modal header and footer
    return $(window).height() - 165; 
}
//DOM READY
});

// functions
function appendMediaError($item, xcase) {
    var html = '';
    switch (xcase) {
        case 404:
            html = '<div style="position: absolute; bottom: 10px; left: 0; right: 0; font-size: 10px; color: white; text-align: center">Sorry the media that you are trying to play cannot be found on the server.</div>';
            $item.find(".download").empty();
            break;
        default:
            html = '<div style="position: absolute; bottom: 10px; left: 0; right: 0; font-size: 10px; color: white; text-align: center">Your browser does not support to play this kind of media.</div>';
    }
    $item.find(".download").prepend(html);
}
function checkhead(src, t) {

    var response = t ? t : 200,
            http = jQuery.ajax({
                type: "HEAD",
                url: src,
                async: false
            });

    return response;
}
function downloadSingleItem(item, opt) {
    if (selectedItems[dir.id].length > 0) {
        $list.find("li.selected").not(this).each(function() {
            var $that = $(this);
            selectItem($that.find("input[type=checkbox]:not(:disabled)"), true);
            $that.find("input[type=checkbox]:not(:disabled)").prop("checked", false).trigger("change")
        });
    }
    var $this = item;
    setTimeout(function() {
        selectItem($this, false);

        var tit = $($this);

        if ($list.find("li.selected").length > 1 || tit.hasClass("folder")) {

            tit = $list.find("li.selected");
        }

        itemActions("downloadItem", tit, (opt ? opt : false));
    }, 50);
}
function resetSort() {
    $(".fheading").removeClass("up").removeClass("down");
    setTimeout(function() {
        $(".filesHeading").find(".filetypes").addClass("down");
    }, 17);
}
function sidebarStatistics(callback) {
    
    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        dataType: 'json',
        cache: true,
        data: {"action": "user_stat"}, //"get files & folders stats"
        success: function(data) {
            //update usage
            userDiskUsageDonut(data);
            //update file types
            userFileTypesDonut(data);

            uSt = data;
            if (callback) {
                window[callback]();
            }
        }
    });
}

function closeSideBar($this, d) {

    hideTip($this);

    var fixed = ($(window).width() < 768 ? true : false);
    var dur = (d ? d : 440)

    $sidebar.hide('slide', {direction: 'left'}, dur, function() {

        $sopener.addClass("on").removeClass("off");

        $.cookie("CLO_SBAR", "off");
    });

    if (!fixed) {

        $wrap.stop().animate({"margin-left": '0'}, dur, function() {
            console.log("wrap animated to margin-left: 0")
            viewport();
        });

        $footer.stop().animate({"left": '0'}, dur);
    } else {
        viewport();
    }

    $body.addClass("sidebar-off").removeClass("sidebar-on");
    $footer.addClass("up").removeClass("down");
}

function openSideBar($this, d) {

    $("#usageStatistics").resize();
    var fixed = ($(window).width() < 768 ? true : false);
    hideTip($this);

    var dur = (d ? d : 440)

    $this.addClass("off").removeClass("on");

    $sidebar.removeClass("hidden-xs").show('slide', {direction: 'left'}, dur);

    if (fixed) {
        viewport();
        dirTreeScr();

    } else {
        $.cookie("CLO_SBAR", "on");

        $wrap.stop().animate({"margin-left": 251}, dur, function() {
            console.log("wrap animated to margin-left: 250")
            viewport();
            dirTreeScr();
        });

        $footer.stop().animate({"left": 255}, dur);
    }

    $body.addClass("sidebar-on").removeClass("sidebar-off");
    $footer.addClass("down").removeClass("up");
}

function toggleStaticFilterButtonStates(item) {
    var $filterTypBtns = $sideBarStaticTree.find(".filter");
    //remove all active classes
    $filterTypBtns.removeClass("active");
    //if item was specified activate it
    if (item) {
        var $currentItem = $filterTypBtns.filter(item);
        $currentItem.addClass("active");
        //add color to the crrent tab button
        $("#sidebarTabContainer").find("li.active a > i").prop("class", "icon icon-circle").addClass($currentItem.data("color"))

    }

//    resetSort();
}

function userFileTypesDonut(uSt) {

    var td = uSt.percent_types,
            typesData = [];


    var typesData = [
        {label: "Image", value: uSt.count_image_types},
        {label: "Video", value: uSt.count_video_types},
        {label: "Audio", value: uSt.count_audio_types},
        {label: "Document", value: uSt.count_document_types},
        {label: "Other", value: uSt.count_other_types},
        {label: "Folder", value: uSt.count_dirs},
    ];

    var colors = ["#68217A", "#F25022", "#0072C6", "#8AC53E", "#FFB900", "#EAEAEA"];
    createDonut('typesCountDonut', typesData, function(x, d) {
        return x + (d.label == "Folder" ? ' folder' : ' file');
    }, 5, colors);

}

function userDiskUsageDonut(uSt) {
    
    var diskUsageData = [
        {label: uSt.space_used_percentage + "% In use", value: uSt.space_used_percentage, size: uSt.space_used_formatted},
        {label: uSt.space_free_percentage + "% Free", value: uSt.space_free_percentage, size: uSt.space_free_formatted}
    ]

    createDonut('diskSpaceUseDonut', diskUsageData, function(x, data) {
        return data.size
    }, 1, ["#E73D0D", "#3075DD"]);

    if (uSt.error) {
        $("#diskSpaceUseDonut").attr({"title": uSt.error.title, "data-content": uSt.error.content, "rel": "pop"});
    }
}

function createDonut(elem, data, formatterfn, selecti, color) {

    Morris.Donut({
        element: elem,
        "data": data,
        labelColor: '#3E4855',
        formatter: formatterfn,
        colors: color,
        resize: true

    }).select(selecti);
}

function renderSideBar(dt, update) {

    var ctree = $dirTree.data("uiFancytree") || 0;

    if (ctree && update) {
        $dirTree.fancytree("option", "source", dt.folderTree);
    }


    if (!ctree) {
        $dirTree.fancytree({
            source: dt.folderTree,
            debugLevel: 0,
            selectMode: 4,
            clickFolderMode: 4,
            autoCollapse: true,
            keyboard: true,
            minExpandLevel: 2,
            extensions: ["dnd", "filter", "childcounter", "glyph"],
            glyph: {
                map: {
                    error: "icon icon-exclamation-sign",
                    expanderClosed: "icon icon-caret-right",
                    expanderOpen: "icon icon-caret-down",
                    folder: "icon icon-folder",
                    folderActive: "icon icon-folder-o",
                    folderOpen: "icon icon-folder-open",
                    loading: "icon icon-refresh icon-spin"
                }
            },
            click: function(event, data) {

                var node = data.node,
                        d = node.data;

                if (dir.hash != d.hash) {
                    var state = {'dir': d.hash};

                    if (currFilter) {
                        $.extend(true, state, {'filter': currFilter});
                    }
                    
                    if(currSearch){
                        $.extend(true, state, {'search': currSearch});
                    }
                    
                    
                    setTimeout(function(){
                        
                        $.bbq.pushState(state, 2);
                        
                    },17)
                    //resetSort();
                }

//                return false;
            },
            dnd: {
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                autoExpandMS: 400,
                dragStart: function(node, data) {
                    return true;
                },
                dragEnter: function(node, data) {
                    if (node.key == 1) {
                        return false;
                    }
                    if (node.data.parent == data.otherNode.data.parent) {
                        return ["over"];
                    }
                    return true;
                },
                dragDrop: function(node, data) {
                    var d = node.data,
                            target = ((data.hitMode == 'before' || data.hitMode == 'after') ? node.data.parent : data.node.key),
                            cpath = ((data.hitMode == 'before' || data.hitMode == 'after') ? data.otherNode.data.parent_path : data.otherNode.data.parent_path/*node.data.parent_path*/),
                            path = ((data.hitMode == 'before' || data.hitMode == 'after') ? node.data.parent_path : node.data.path);

                    //if folder dropped to its current parent do nothing
                    if (target == data.otherNode.data.parent) {
                        return false;
                    }

                    var q = {
                        value: "d_" + data.otherNode.key,
                        dir: "d_" + target,
                        path: path,
                        cdir: "d_" + data.otherNode.data.parent,
                        cpath: cpath,
                    }

                    //send move request
                    qDirActions("move", node, q);

                    //set page to target dir
                    forceUpdate = true;
                    var targetHash = ((data.hitMode == 'before' || data.hitMode == 'after') ? node.data.phash : node.data.hash);
                    $.bbq.pushState({'dir': targetHash}, 2)
                    if (dir.hash == targetHash) {
                        $(window).trigger('hashchange');
                    }

                    data.otherNode.moveTo(node, data.hitMode);
                }
            },
//            focusTree: function() {
//                return false;
//            },
            filter: {
                mode: (dir.subdirs.count_total >= 6) ? "hide" : "dimm"
            },
            childcounter: {
                deep: true,
                hideZeros: true,
                hideExpanded: true
            } 
        })

    }
    //personal folders only
    if (dir.id > 6 || dir.id == 1) {
        var tree = $dirTree.fancytree("getTree"), node = tree.getNodeByKey(dir.id.toString()), delay = (update ? 500 : 17);
        
        if(node)
        node.setActive();
        node.renderTitle();

        if (!node.isExpanded()) {
            setTimeout(function() {
                node.setExpanded();
            }, delay);
        }
    }
    //filter option for directories
    $("#dirTreeFilter").keyup(function(e) {
        var ctr = $("#dirTreeCtr"),
                match = $(this).val();
        if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
            ctr.click();
            return;
        }
        // Pass text as filter string (will be matched as substring in the node title)
        var n = tree.applyFilter(match);
        $("#dirTreematches").text(n + " matches ");
        $("#dirTreeCtr").show();
    });

    $("#dirTreeCtr").click(function(e) {
        $("#dirTreeFilter").val("");
        $("#dirTreematches").text("");
        $(this).hide();
        tree.clearFilter();
    });


}

function truncToTip(item, str, length, html, type) {
    
    if (!str || typeof str == 'undefined')
        return '';
    
    str = String(str);
    
    var shortStr = str.trunc(length, '...');
    item.text(shortStr);

    if (str.length > length - 3) {
        item.attr({
            "rel": "tip",
            "title": (type ? ('<i class="icon icon-circle ' + filterTypes[(type == "d" ? "folder" : type)] + '"></i> ') : '') + str
        });
    }

    if (html) {
        return $("<div/>").append(item).html();
    }
    return item;

}

function clearList(data) {
    
    var score = ($viewPort.data("dir") != data.dir.id) ? 5 : 1;

    if (score == 5 && mediaPlaying) {
        mediaPlaying.pause();
    }
    
    score += (($viewPort.data("filter") != currFilter)) ? 5 : 0;

    score += (($viewPort.data("search") != currSearch)) ? 5 : 0;
    
    score -= (loadMore) ? 5 : 0;
    
    if(!$.bbq.getState("dir")){
        score += 11; 
    }

    if (forceUpdate) {

        score += (forceUpdate ? 11 : 1);
        forceUpdate = false;
    }


    if (sortUpdate) {
        score += (sortUpdate ? 11 : 1);
        sortUpdate = false;
    }
            
    if (score >= 5) {
        $list.empty();
    }
}
function setElData($el, data) {
    $.each(data, function(a, b) {
        if (b) {
            $el.data(a, b);
        }
    });

    return $el;
}
function createDomItem(v) {
    var $li = $(tmpl("item-tpl", {files: [v]}));

    //item general data
    return setElData($li, v.data);
}

(function ($) {
    
$.renderListPage = function (data, target) {

    var force = (forceUpdate && !firstLoad) ? true : false;
    
    var Images = [];

    clearList(data);

    //reset all selected
    $("#checkFiles").prop("indeterminate", false).prop("checked", false)//.trigger("change");

    if (data.items.length) {

        $.each(data.items, function(key, v) {
            
            var val = [];

            if (v.preview != "canvas" && force && v.type != "folder") {
                v.preview = v.preview + '?f=' + ($.now());
            }

            if (currSearch && dir.id == 1) {
                v.noaction = (currSearch && dir.id == 1) ? true : false;
            }

            var $li = createDomItem(v);
            
            
            if (checkItemCheckedStatus(v.data.id)) {
                $li.find("input[type=checkbox]:not(:disabled)").not(":checked").prop("checked", true);
            }
            //only if its folder
            if (v.type == 'folder') {

                //create previews for folders that contains images
                if (v.thumbs && $(window).width() > 767) {

                    var $primgc = $('<span class="tnimpreview"></span>'),
                            et = 0;

                    $.each(v.thumbs, function(k, s) {
                        $primgc.append('<img src="' + s.src + '">');
                        et++;
                    });

                    $li.addClass("tnim" + et).find(".tnpreviewImageContainer").prepend($primgc);
                }

                if (v.bsize == 0) {
                    $li.addClass("empty")
                }
                
                //add extra data from response
                $li.data("thumbs", v.thumbs);
                
            }
            
            if(v.filetype == 'image'){
                                    
                $li.find(".tnpreviewImageContainer").append( $((isMob()) ? indicatorCss : indicatorCssPurple).css({"position": "absolute", "top": "50%", "left" : "50%", "margin-left" : "-39px", "margin-top": "-25px"}) )
                var $img = $("<img/>").attr("src", v.preview).css("display", "none");
                $li.find(".tnpreviewImageContainer").append($img);
                
                imagesLoaded( $li.find(".tnpreviewImageContainer"), function(instance, image) {
                    $li.find(".tnpreviewImageContainer").find(".indicator").remove();
                    $li.find(".tnpreviewImageContainer").removeClass("done").find("img").remove().detach();
                    
                })
                .on( 'fail', function( instance ) {
                    $li.find(".tnpreviewImageContainer").find(".indicator").remove();
                    $li.find(".tnpreviewImageContainer").find(".tnpreviewImage").append('<span class="bno tacent" style="position: absolute; height: 100%; width: 100%; left:0; line-height: 4;">No preview is available!</span>');
                    $li.addClass("error");
                });
            }
            
            fileInfoBtn($li);
                                   
            $list.append($li);
        
        });
          
//        $list.sortable({
//            appendTo: $list[0],
//            containment: $list[0],
//            scroll: false,
//        })//.disableSelection();        
        
        if($list.findItem(lookfor, "preview").length > 0)
            $list.findItem(lookfor, "preview").addClass("highlight");
        
        //add placement data to the name for the z-index fix on the first and last items of the first column
//        if(firstLoad){
            var liw = $list.find("li").eq(0).width(),
                colSize = Math.floor( parseInt($list.width())/parseInt(liw) );
            
            $list.find("li").eq(colSize-1).find(".tnFilename .vn").data("placement", "bottom");
            $list.find("li").eq(0).find(".tnFilename .vn").data("placement", "right");
            $list.find("li").eq(0).find(".tnFilename .vn").on('shown.bs.popover', function () {
                $list.find("li").eq(0).find('.popover').css('top',parseInt($('.popover').css('top')) + 22 + 'px')
            });
//        }       
            
        
        $list.find(".tnpreviewImageContainer")

        //viewer call
        $(".vpsve").vobox();

        emptyDirectory(true);

    } else {
        emptyDirectory();
        liveSelections(0, 0);
    }

    $list.find("input[type=checkbox]:not(:disabled)").trigger("change");
    
    if(($.inArray("describe", ui.perms) === -1) ){
        
        $viewPort.find("li.preview").not(".rendered").addClass("noDescribe")
        
    }    

    //add additional elements to the files and folders like icons, share buttons etc...
    if(($.inArray("share", ui.perms) > -1) )
    $viewPort.find("li.preview").not(".rendered").each(function() {
        var $this = $(this),
                data = $this.data();

        //create share button on each items
        $this.addClass("rendered").find(".tnpreviewBottomBar .bright").append('<div class="tnsocialContainer hidden-xs btn-white"><span class=""><i class="icon icon-share-alt"></i> Share</span></div>');
    });
    
    //live actions move,copy,delete,file selection etc...
    //cut-copy
    if (checkPasteTarget()) {
        $itemPaste.find("button:first").disabletoggle(false);
    } else {
        $itemPaste.find("button:first").disabletoggle(true);
    }


    //apply last view type
    if ($.cookie("CLO_VT") && firstLoad) {
        var vt = $.cookie("CLO_VT");
        $("#switchListType").find('label[data-type="' + vt + '"]').click();
    }
    
    updateItemsTotalText(loadMore);

    firstLoad = false;

    if (loadMore) {
        $("#loadAllItems").addClass("active");
    } else {
        $("#loadAllItems").removeClass("active");
    }

    //store filter,id sth for after use
    $viewPort.data("dir", currDirID);
    $viewPort.data("filter", currFilter);
    $viewPort.data("search", currSearch);
    //reset load more
    loadMore = false;
    $("#moreItemLoader").hide();

    //hide context menu if its opened
    if ($viewPort.data("contextMenu")) {
        $viewPort.contextMenu("hide");
    }

    //set page title
    setPageTitle((currSearch ? ('search: ' + decodeURIComponent(currSearch)) : currFilter));

    //set page number
    setPageNumber();

    //set breadcrumb
    if (dir.page === 1) {
        breadCrumb((currSearch ? ('search: ' + decodeURIComponent(currSearch)) : currFilter));
    }

    if (dir.scrollMore) {
        $screl.trigger("scroll");
    }

    if (currSearch) {
        var sinpt = $searcher.addClass("on").find("#search"); 
        $("#search").focus().typeahead('val', decodeURIComponent(currSearch));
        $list.addClass("listdown");
        //disable multiselect
        $("#checkFiles").prop("disabled", true);

    } else {
        $searcher.removeClass("on").find("#search").typeahead('val', '').blur();
        $list.removeClass("listdown");
        //enable multiselect
        $("#checkFiles").prop("disabled", false)
    }
    
    $.removeCookie("CLO_HG");
    
}
})(jQuery);

//add file information pop event
function fileInfoBtn($li) {
    
    var content = "";
    
    $li.find("button.fileInfoButton").popover({
        html: true,
        trigger: "manual",
        content: function (tip, element) {
            
            
            var d = $li.data();
            content = $(tmpl("itemInfo", d));
            
            return content;
        },
        container: function (tip, element) {
            return ($(element).data("container") === undefined) ? $body : false
        },
        animation: false,
        placement: function (tip, element) {
            $(tip).addClass("infoTable");
            return $(element).data("placement") ? $(element).data("placement") : popoverautoplacement(tip, element, false)
        },
        viewport: "#list"
    }).on("show.bs.popover", function (d) {
        var $item = $(d.target).closest("li");        
        $container.find(".infoTable").popover("hide");

    }).on("shown.bs.popover", function (d) {
        var $item = $(d.target).closest("li");
        $item.addClass("context-active info-active");
        
        $container.data("unfocusable", true)

    }).on("hidden.bs.popover", function (d) {
        var $item = $(d.target).closest("li");
        $item.removeClass("context-active info-active");
        
        $container.removeData("unfocusable")
        
    }).on("click", function (e) {
        $(this).popover("toggle");
    });
}
function breadCrumb(append) {
    //upper-current level directory breadcrumb/dirnavigation
    var parentN = $dirNav.find("a.parentN").first(),
            currentN = parentN.next("a");

    parentN.show();

    if (dir.id != 1) {
        parentN.find("span").html(truncToTip($('<b/>'), dir.parentname, 30, true)+' <i class="icon icon-angle-right"></i>');

    } else {
        parentN.hide();
    }

    currentN.show().addClass("disabled").find("span").html(truncToTip($('<u class="uld arr"/>'), dir.name, 30, true));

    if (append) {
        var $resetBtn = $('<button href="javascript:;" class="close icon icon-times-circle small mt10" data-aria="hidden"></button>').on("click", function(){
           if(currFilter){
               $sideBarStaticTree.find("button.resetFilter").trigger("click");
           }else{
               var state = {"dir" : $.bbq.getState("dir")}
               $.bbq.pushState(state,2);
           }
           
        });
        currentN.find("i.fltr").html(' <i class="icon icon-filter"></i> ' + decodeURIComponent( append ) ).append($resetBtn);
    } else {
        currentN.find("i.fltr").html("")
    }

    var pos = currentN.position(),
            w = currentN.width(),
            dt = {'left': pos.left + 36 + w/2, 'top': pos.top};

    $wrap.data("nofilepos", dt);
}

function emptyDirectory(rem) {
    $wrap.find(".empty-directory").hide();
    setTimeout(function() {
        var $emtydir = $wrap.find(".empty-directory");
        if (rem) {
            $(".edis").unblock();
            $searcher.show();
            $dirNav.find(".uld").addClass("arr");
            return $emtydir.detach().remove();
        }

        if ($emtydir.length) {
            $emtydir.detach().remove();
        }

        var text = 'Empty folder!<span class="hidden-xs"> Add some goods...</span>';
        if (currFilter) {
            text = 'No ' + (currFilter == 'folder' ? 'folders' : (currFilter == 'file' ? 'files' : (currFilter + ' files '))) + ' in this directory';
        }
        var innerel = '<div id="dragboxnot" class="hidden-xs" style="border: 4px dashed #ddd; text-align: center; position: relative; top: 20px; margin-left: 0px; min-height: 200px;"><h1 style="line-height: 200px; color: #ddd">Drop your files to upload</h1></div>';
        
        var el = $('<div class="empty-directory"><h2>' + text + '</h2>'+innerel+'</div>');

        if (isMob() && $(window).width() < 768) {
            el.css('top', $wrap.data("nofilepos").top - 5);
        }

        $viewPort.append(el.css('left', $wrap.data("nofilepos").left));

        //free any queue
        $itemPaste.find("a.clearcutocopyItem").click("click");
//        $totalItemsNum.hide();
        $(".edis").block({message: false, overlayCSS: {backgroundColor: '#fff', opacity: 0.1, cursor: 'not-allowed'}});
        $searcher.hide();
        $dirNav.find(".uld").removeClass("arr");
        $emtydir.show();
    }, 16);
    
}

function setPageNumber() {
    var $pageNumber = $("#pageNumber"),
            $helper = $pageNumber.find("div.helper");
    $pageNumber.find("div.badge").text('Page ' + dir.page);

    if (!touchable) {
        $helper.removeClass("touch");
    }

    if (dir.scrollMore) {
        $helper.show();
    } else {
        $helper.hide();
    }

}
function setPageTitle(append) {
    var title = SITENAME + " " + ui.name + " " + dir.pageTitle;

    if (append) {
        title += ' ≈ ' + append;
    }
    $(document).attr("title", title);

}

function updateItemsTotalText(more, add, type) {

//    $totalItemsNum.show()
    
    var $files = $totalItemsNum.find(".files"),
            $dirs = $totalItemsNum.find(".dirs");
    
    var dd = $dirs.data("loaded"),
        fd = $files.data("loaded"),
        lastLoaded = $totalItemsNum.find("span.loaded").text();
    
    var loadedCount = dir.scrollMore ? dir.scrollMore : dir.totalitems;
        
    var totalEl = $totalItemsNum.find("span.total"),
            loadedEl = $totalItemsNum.find("span.loaded"),
            oldtotalItems = totalEl.text(),
            totalItems = dir.totalitems;
    
    if (add) {
        //add if current filter is the same that file just uploaded
        if( ( !currFilter || $viewPort.data("filter") == type ) ){
            totalItems += add;
            loadedCount += add;
        }
        
    } 
       
    
    loadedEl.animateNumber(lastLoaded, loadedCount) ;
    
    totalEl.animateNumber(oldtotalItems, totalItems);
}

function checkItemCheckedStatus(item) {
    var sel = ((selectedItems[dir.id].length) ? selectedItems[dir.id] : false) || $.cookie("CLO_IS_" + dir.id) || false;
    
    var selval = sel ? (($.isArray(sel)) ? sel : sel.split(",")) : false;

    if (selval && selval.length) {
        if (jQuery.inArray(item, selval) > -1) {
            return true;
        }
    }
    return false;
}

function googlePluspOK() {
    console.log("googlePlusOK")
}

//select/deselect single or multiple items
function selectItem(item, toggle) {

    item.each(function() {
        var chk = $(this).find("input[type=checkbox]:not(:disabled)"),
                status = toggle ? (toggle == "unchk" ? false : !chk.is(":checked")) : true;

        chk.prop("checked", status).trigger("change").change();
    });
}

function cutCopyItemList(actionstr, dirname) {

    var $ul = $itemPaste.find("ul.scr"),
            count = cutcopyItems.length,
            $badge = $itemPaste.find("span.badge"),
            $inf = $itemPaste.find("div.ccinfo");

    if (count) {
        $itemPaste.removeClass("dn");
        $ul.empty();

        var html = '';
        $.each(cutcopyItems, function(key, ob) {

            if (!$itemPaste.find('li[data-id="' + key + '"]').length) {

                html += '<li role="presentation" data-id="' + key + '" class="item"><i title="' + ob.ftype + '" class="icon icon-circle ' + filterTypes[ob.ftype] + '"></i> ' + ob.name + '<i class="icon icon-times cutitemdismiss" title="Ignore this one"></i></li>';
            }
        });

        $ul.append(html);
        $badge.removeClass("animated shake").text(count);
        setTimeout(function(){
            $badge.addClass("animated shake")
        },200)
        if (actionstr)
            $inf.text('(' + actionstr + ' from ' + dirname + ')');
    } else {
        //hide it remove it do sth
        $ul.empty();
        $itemPaste.addClass("dn");
        $notify.jGrowl("close");
        var $lis = $list.find("li.preview");
        selectItem($lis, "unchk");
        $lis.removeClass("cut copy");
    }
}

function checkPasteTarget(target) {

    if (cutcopyItems.length === 0)
        return false;

    var sdir = (target ? parseInt(target.data("id").match(/\d+/)) : dir.id),
            st = (sdir != cutcopyItems[0].parent) ? 1 : 0;

    //Prevent pasting items into own descendants
    if (st) {
        $.each(cutcopyItems, function(key, ob) {

            var obid = parseInt(ob.id.match(/\d+/)),
                    tbid = target ? sdir : dir.id,
                    tree = $dirTree.fancytree("getTree"),
                    node = tree.getNodeByKey(tbid.toString()),
                    otherNode = tree.getNodeByKey(obid.toString());

            if (obid == tbid || node.isDescendantOf(otherNode)) {
                st = false;
                return false;
            }
        });
        return st;

    } else {
        return false
    }
    return true;
}


//item actions
function itemActions(action, item, opt, generalBtn) {

    //var data = item.data() || 0;


    //var aicon = opt ? opt.items[action]['icon'] : (data ? data.i : false);
    //type = item.hasClass("folder") ? 'd' : 'f',
    //typet = (type == 'd' ? 'folder' : (type == 'f' ? 'file' : 'item'))

    switch (action) {
        case 'select':

            break;
        case 'create':
            createActionBox(action, item, "loadFolderEdit", "plus");
            break;

        case 'edit':
            createActionBox(action, item, "loadFolderEdit", "pencil");
            break;

        case 'copy':
        case 'cut':

            cutcopyItems = [];

            var remove = false,
                    actString = "copied",
                    notmsg = item.eq(0).data("t").trunc(17, '...');

            if (action == "cut") {
                remove = true;
                actString = 'cut';

            }
            
            if($list.find("li.selected").length > 1){
                selectItem(item, false);
                item = $list.find("li.selected");
            }else{
                selectItem($list.find("li.selected"), "unchk")
            }
            
            $.each(item, function(key, obj) {

                var $this = $(obj),
                        data = $this.data(),
                        type = $this.hasClass("folder") ? 'd' : 'f';

                cutcopyItems.push({
                    id: data.id,
                    name: data.t,
                    parent: data.parent,
                    type: type,
                    path: data.path,
                    ftype: (type == 'd' ? "folder" : data.ftype),
                    remove: remove
                });

                $("li.preview").removeClass("cut copy");

                setTimeout(function() {
                    if (action == "cut") {
                        $this.addClass("cut")
                    } else {
                        $this.addClass("copy")
                    }
                }, 17)

                //select each items
                selectItem($this, false);
            });

            cutCopyItemList(actString, dir.name);

            //multiple items
            if (item.length > 1) {
                var itotal = item.length - 1,
                        iname = item.eq(0).data("t"), //name of first item
                        itype = item.eq(0).hasClass("folder") ? "Folder" : "File",
                        suffixtxt = " and other <i>" + itotal + '</i> item(s)',
                        notmsg = iname.trunc(17, '...') + suffixtxt
            }

            $notify.jGrowl("close").jGrowl('<div class="icon icon-'+action+'"></div> Now paste it where you want.', {header: notmsg + ' was ' + actString + '!', sticky: true, theme: 'iconup'});

            break;
        case 'paste':

            var values = [],
                    action = 'copy',
                    actString = 'Copying',
                    data = $(item).data() || false;

            $.each(cutcopyItems, function(key, ob) {
                values.push(ob.id);
                if (ob.remove) {
                    action = 'move';
                    actString = 'Moving';
                }
            });

            var q = {
                value: values.join(","),
                dir: ((generalBtn) ? dir.id : data.id), //current dir id which paste called or target dir from context menu;
                path: ((generalBtn) ? dir.path : data.path),
                cdir: cutcopyItems[0].parent,
                cpath: (cutcopyItems[0].type == "d") ? (cutcopyItems[0].path).substring(0, (cutcopyItems[0].path).lastIndexOf("/") + 1) : cutcopyItems[0].path,
            }

            $notify.jGrowl("close").jGrowl('<div class="icon icon-copy animated zoomOutLeft loop"></div>'+ actString + " selected item(s)...", {header: "In progress", sticky: true,theme: 'iconup'});
            
            qDirActions(action, false, q, function() {
                cutcopyItems = [];
                cutCopyItemList();
                reloadPage(1, false, 400);
            });

            break;
        case 'move':
            break;
        case 'delete':
            
            if($list.find("li.selected").length > 1){
                selectItem(item, false);
                item = $list.find("li.selected");
            }            

            var data = {
                'data-item': '',
                'data-type': '',
                'data-t': ''
            },
            i = [], t = [], v = [], p = [];

            $.each(item, function(key, obj) {
                var $this = $(this),
                        d = $(this).data();
                i.push(d.id);
                t.push(d.type);
                v.push(d.t);
                p.push($this);
            });

            data['data-item'] = i.join(',');
            data['data-type'] = t.join(',');
            data['data-t'] = v.join(',');

            var $item = createJElobj(data).data({
                "preview": p,
                "count": item.length
            });

            createActionBox(action, $item, "deleteItemDismiss", "trash-o");

            $item.remove();

            break;
        case 'email':
            var data = {
                'data-item': '',
                'data-type': '',
                'data-t': '',
                'data-width': "45%",
                'data-height': $(window).height() - 165
            },
            i = [], t = [], v = [], p = [];

            $.each(item, function(key, obj) {
                var $this = $(this),
                        d = $(this).data();
                i.push(d.id);
                t.push(d.type);
                v.push(d.t);
                p.push($this);
            });

            data['data-item'] = i.join(',');
            data['data-type'] = t.join(',');
            data['data-t'] = v.join(',');

            var $item = createJElobj(data).data({
                "preview": p,
                "count": item.length
            });

            createActionBox(action, $item, "loadEmailShare", "envelope-o");

            break;
            
        case 'shareItem':
            
            var data = {
                'data-item': '',
                'data-type': '',
                'data-t': '',
                //'data-width': "250px"
            },
            i = [], t = [], v = [], p = [];

            $.each(item, function(key, obj) {
                var $this = $(this),
                        d = $(this).data();
                i.push(d.id);
                t.push(d.type);
                v.push(d.t);
                p.push($this);
            });

            data['data-item'] = i.join(',');
            data['data-type'] = t.join(',');
            data['data-t'] = v.join(',');

            var $item = createJElobj(data).data({
                "preview": p,
                "count": item.length
            });
            
            createActionBox("share", $item, "loadShareBigBox", "share-alt");
            
            break;
                     
        case 'downloadFolder':
            var data = {
                'data-path': dir.path,
                'data-value': dir.id + " ",
                'data-diro': true,
                'data-name': dir.name
            },
            item = createJElobj(data);
            downloadItems = {
                path: dir.path,
                value: dir.id + " "
            }
            createActionBox("downloadFolder", item, "calculateDownloadSize", "file-zip-o");
            break;
        case 'downloadItem':
            var data = {
                'data-path': [],
                'data-value': [],
                'data-diro': false,
                'data-count': item.length,
                'data-name': '',
                'data-type': ''
            },
            d = '';

            downloadItems = {
                'path': [],
                'value': [],
                'count': 0
            }

            $.each(item, function(key, obj) {
                d = $(this).data(),
                        tps = ((d.path == '/') ? '' : '/'),
                        pth = d.path + tps + ($(this).hasClass("file") ? d.t : '');
                data['data-path'].push(pth);
                data['data-value'].push(d.id);
                data['data-name'] = d.t;
                data['data-type'] = ($(this).hasClass("file") ? 'f' : 'd');
                downloadItems.path.push(pth);
                downloadItems.value.push(d.id);
                downloadItems.count = data['data-count'];
            });

            if (data['data-count'] == 1 && data['data-type'] == 'f') {
                data['data-ftype'] = d.ftype;
            } else {
                data['data-ftype'] = "d";
            }

            var ac = (item.length > 1 || (item.eq(0).hasClass("folder"))) ? "downloadItems" : "downloadItem",
                    fn = (item.length > 1 || (item.eq(0).hasClass("folder"))) ? "calculateDownloadSize" : "prepareDownload",
                    ic = (item.length > 1 || (item.eq(0).hasClass("folder"))) ? "file-zip-o" : "cloud-download";
            
            var item = createJElobj(data);          

            createActionBox(ac, item, fn, ic);
            break;

        case 'archiveItem':
            var data = {
                'data-path': [],
                'data-value': [],
                'data-diro': false,
                'data-count': item.length,
                'data-name': '',
                'data-type': ''
            },
            d = '';

            archiveItems = {
                'path': [],
                'value': [],
                'parent': []
            }

            $.each(item, function(key, obj) {
                var d = $(this).data(),
                        tps = ((d.path == '/') ? '' : '/'),
                        pth = d.path + tps + ($(this).hasClass("file") ? d.t : '');
                        
                data['data-path'].push(pth);
                data['data-value'].push(d.id);
                data['data-name'] = d.t;
                data['data-type'] = ($(this).hasClass("file") ? 'f' : 'd');
                archiveItems.path.push(pth);
                archiveItems.value.push(d.id);
                archiveItems.parent.push(d.parent);
            });

            if (data['data-count'] == 1 && data['data-type'] == 'f') {
                data['data-ftype'] = d.ftype;
            } else {
                data['data-ftype'] = "d";
            }            
            var item = createJElobj(data);
            createActionBox("archiveItem", item, "calculateArchiveSize", "file-zip-o");
            break;

        case 'extractItem':
            item.data({"width": "480", "height": $(window).height() - 110})
            createActionBox("extractItem", item, "loadExtractDirectories", "file-zip-o");
            break;
            
        case 'addremovestar':
            var items = [],
                    $items = [];
            
            $.each(item, function(key, obj) {
                var d = $(this).data()
                items.push(d.id);
                $items.push($(this))
                
            });
            
            addRemoveStar($($items), items, opt);
            
            break;

    }

    return false;
}

function addRemoveStar($items, items, opt) {
    
    var sdata = {
        action: "addremovestar",
        value: items,
        add: opt
    }
    
    $indicatorEl.css("visibility","visible");
    
    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'POST',
        dataType: 'json',
        data: sdata,
        success: function (response) {
            $indicatorEl.css("visibility","hidden");
            selectItem($items, "unchk");       
            reloadPage(1, false, 200);
        }
    });

}

    var sselected = [];

    var sselect = function(datum) {
        sselected.push(datum.attrs.value);
    }
    var sunselect = function(datum) {
        removeVal(sselected, datum.attrs.value)
    }    

    var sfilter = function(suggestions) {
        return $.grep(suggestions, function(suggestion) {
            return $.inArray(suggestion.value, sselected) === -1;
        });
    }

    var esuggest = new Bloodhound({
        datumTokenizer: function(datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: AJAX_PATH+'?userdata=email&q=%QUERY',
            type: 'GET',
            dataType: 'json'
        }
    });

    esuggest.initialize();

function loadEmailShare($this, action, $form, $box) {
    
    sselected = [];

    var $textArea = $box.find(".editor");
    makeSmallEditor($textArea, $box);
    

    $('.ignoretitem').one("click", function() {
        //getItemId
        var p = $(this).closest("div.thumbnail"),
                id = p.data("id"),
                $vel = $form.find('input[name="value"]'),
                cel = $box.find(".box_title .count");

        $vel.val(removeVal($vel.val(), id));
        //update selected files
        //delete selectedItems[dir.id][id];
        selectedItems[dir.id] = jQuery.grep(selectedItems[dir.id], function(value, key) {
            return value !== id;
        });

        //trigger change event for this item on the list area
        var $item = $list.findItem(id, "selected");
        selectItem($item, true);

        //update box title count
        var count = selectedItems[dir.id].length;
        if (count === 0) {
            $box.modal("hide");
        }
        cel.text(count);

        hideTip(p[0])
        p.remove();
    }).closest("div.thumbnail").on("touchend", function(){
        $(this).find(".close").trigger("click");
    });
    
    setTimeout(function(){
    $(".emailsuggestion")
            .on('tagfield:initialize', function(){
                setTimeout(function(){
                    $form.find(".tt-input").focus();
                    console.log("focused")
                },150)
                
            })
            .on('tagfield:createtoken', function(e) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                var valid = re.test(e.attrs.value)
                if (!valid) {
                    return false;
                } else {
                    var data = e.attrs.value.split('|')
                    e.attrs.value = data[1] || data[0]
                    e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
                } 
            })

            .on('tagfield:edittoken', function(e) {
                if (e.attrs.label !== e.attrs.value) {
                    var label = e.attrs.label.split(' (')
                    e.attrs.value = label[0] + '|' + e.attrs.value
                }
            })

            .on('tagfield:removedtoken', function(e) {
                if($form.find("div.token").length == 0){
                    $box.find("a.go").disabletoggle(true);
                }                
                sunselect(e);
            })
            
            .on('tagfield:createdtoken', function(e){
                
                if($form.find("div.token").length > 0){
                    $box.find("a.go").disabletoggle(false);
                }                  
                sselect(e);
            })

            .tagfield({
                typeahead: [null, {
                        source: function(query, cb) {
                            esuggest.get(query, function(suggestions) {
                                cb(sfilter(suggestions));
                            });
                        },
                        hint: true,
                        highlight: true,
                        minLength: 0
                    }],
                minWidth: 120
            });
        
            //use user email
            $form.find("#usemyEmail").on("change", function(){
                if($(this).is(":checked")){
                    $form.find("#sender").val(ui.mail);
                }else{
                    $form.find("#sender").val("");
                }
            })
            
            $form.bootstrapValidator();
            
            $(window).resize();
            
            },700);
}

function makeSmallEditor(target, $parent, html) {

    var smallEditor = {
        "source": html ? true : false,
        format: false,
        indent: false,
        justify: false,
        sub: false,
        sup: false,
        u: false,
        outdent: false,
        strike: false,
    }

    smallEditor.placeholder = target.attr("placeholder");

    target.veditor(smallEditor).veditorVal(html);

    $parent.find(".veditor").addClass("form-control p0");

}

function multiplePreviewCreate(obj) {
    var html = '';
    $.each(obj, function(key, ob) {
        var $this = $(this),
                data = $this.data(),
                src = $this.find(".tnpreviewImage").css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

        if ($this.data("type") == 'd') {
            src = THEMEURL + 'images/folder.mb.gif';
        }
        html += '<div class="thumbnail" data-id="' + data.id + '" data-placement="top" data-container=".modal-body" rel="tip" data-title="' + $this.data("t") + '">\n\
                 <button class="close-button close ignoretitem" type="button" title="Ignore this one">×</button>\n\
                 <div class="caption">' + $this.data("t") + '</div>\n\
                 <img src="' + src + '">\n\
                 </div>';
    })
    return html;
}

//create Action Boxes
function createActionBox(action, $this, ajax, aicon, multi) {
    var spint = $html.hasClass("vobox") ? $(".slide.current").find(".om").spin(spos, '#fff') : $indicatorEl.css("visibility","visible"),
        spos = $html.hasClass("vobox") ? 'mid' : 'main'; 
    //spint.spin(spos, '#fff');
    var $box = $("#actionbox").find("div.modal").clone(),
            $actbtn = '',
            html = '',
            data = $this.data(),
            dontWajax = false;
    var title = $this.data("title") || 0,
            type = $.isArray(data.type) ? data.type.join(',') : data.type,
            typet = (type == 'd' ? 'folder' : (type == 'f' ? 'file' : 'item(s)')),
            name = data.t || '',
            description = data.description || '',
            ract = action,
            icon = data.icon || false,
            aicon = (aicon ? aicon : icon),
            pass = data.p || 0,
            bid = $this.data("item") ? $this.data("item") : $this.data("id"),
            boxid = "box_" + action,
            $form = $box.find("form"),
            countdown = false;
        
    if(action != "tpage")
        html = '<div class="result callout callout-danger dnone vhidden"><div></div></div>';
    
    if (action != "page") {
        html += '<input class="dnone" type="hidden" name="value" value="' + bid + '" />\n\
                     <input class="dnone" type="hidden" name="filetype" value="' + type + '" />\n\
                     <input class="dnone" type="hidden" name="path" value="' + ( (data.ppath ? data.ppath : (data.path ? data.path : dir.path ))) + '" />\n\
                     <input class="dnone" type="hidden" name="action" value="' + action + '">', //static sends
                labels = (($this.data("labels") !== undefined) ? $this.data("labels").split("_") : ''),
                content = $this.data("content") || 0;
    }
    switch (action) {
        case 'delete':
            title = "Delete Operation" + (data.count > 1 ? (' - <span class="count">' + data.count + '</span> Item selected') : '');
            html += '<h5>Are you sure you want to  permanently delete the following ' + typet + '?</h5>'
            html += '<div class="ItemPreview">' + (data.preview ? multiplePreviewCreate(data.preview) : '') + '</div>';
            html += $divider;
            html += '<small>Note: This cannot be undone!</small>';

            $actbtn = $('<a href="" class="btn btn-danger btn-sm go">Delete</a>');
            html += '<input class="dnone" type="hidden" name="cdir" value="' + dir.id + '" />';
            dontWajax = true;
            break;
        case 'create':
            title = "Create new folder in <span>" + name + "</span>";
            html += '<div class="form-group">\n\
                     <label for="foname">Name</label>\n'
                    + createTextInput('name', 'foname', false, "Please enter a folder name") + '\
                     </div>\n\
                     <div class="form-group">\n\
                     <label for="fodesc">Description</label>\n'
                    + createTextInput('desc', 'fodesc', "", 'Please enter a description', 'textarea') + '\n\
                     </div>\n\
                     <div class="form-group">\n\
                     <label for="fopass_val" rel="tip" data-container="item" data-placement="right" data-title="Prevent direct access to this folder on shared page">Folder Protection: <input id="fopass" name="fopass" type="checkbox" value="' + ((pass) ? '2' : '1') + '" class="switch-small"' + (pass ? ' checked' : '') + '>\n\
                     </label>\n'
                    + createTextInput('fopass_val', 'fopass_val', false, ((pass) ? 'Leave empty if you don\'t want to change' : 'Please specify a password'), "text", ((pass) ? '' : 'dn')) + '\n\
                     </div>\n\
                     <div class="divider mt0 mb0"></div>\n\
                     <div class="form-group last">\n\
                     <label for="icon_select" class="col-md-12 col-sm-12 col-xs-12 fltn p0">Folder Icon: <img id="iconpreview" src="' + ASSURI + 'img/' + ((icon) ? ('icons/' + icon) : 'blank.png') + '">' +
                    (icon ? '<span id="resetIcon" class="fltrt"><i class="icon icon-times-circle-o"></i> Remove Icon</span>' : '')
                    + '</label>\n\
                     <a href="#" class="icon_select_btn">Click to select <i class="icon icon-caret-down"></i></a>\n\
                     <div id="icon_select" class="scrollContainer dnone"></div>'
                    + createTextInput('icon', 'foiconin', icon, icon, 'hidden', 'col-md-3 fltn ml0') + '\n\
                     </div>';
            $actbtn = $('<a href="" class="btn btn-primary btn-sm disabled go"><i class="icon icon-check"></i> Create</a>');
            dontWajax = true;
            break;
        case 'edit':
            title = "Edit folder <span>" + name + "</span>";
            html += '<div class="form-group">\n\
                     <label for="foname">Name</label>\n'
                    + createTextInput('name', 'foname', name, 'Specify a ' + typet + ' name', false, 'col-md-3 fltn ml0', true, false, ($.inArray("rename", ui.perms) === -1) ) + '\n\
                     </div>\n\
                     <div class="form-group">\n\
                     <label for="fodesc">Description</label>\n'
                    + createTextInput('desc', 'fodesc', description, 'No Description', 'textarea') + '\n\
                     </div>\n\
                     <div class="form-group">\n\
                     <label for="fopass_val" rel="tip" data-container="item" data-placement="right" data-title="Prevent direct access to this folder on shared page">Folder Protection: <input id="fopass" name="fopass" type="checkbox" value="' + ((pass) ? '2' : '1') + '" class="switch-small"' + (pass ? ' checked' : '') + '></label>\n'
                    + createTextInput('fopass_val', 'fopass_val', false, ((pass) ? 'Leave empty if you don\'t want to change' : 'Please specify a password'), "text", ((pass) ? '' : 'dn')) + '\n\
                     </div>\n\
                     <div class="divider mt0 mb0"></div>\n\
                     <div class="form-group last">\n\
                     <label for="icon_select" class="col-md-12 col-sm-12 col-xs-12 fltn p0">Folder Icon: <img id="iconpreview" src="' + ASSURI + 'img/' + ((icon) ? ('icons/' + icon) : 'blank.png') + '">' +
                    (icon ? '<span id="resetIcon" class="fltrt"><i class="icon icon-times-circle-o"></i> Remove Icon</span>' : '')
                    + '</label>\n\
                     <a href="#" class="icon_select_btn">Click to select <i class="icon icon-caret-down"></i></a>\n\
                     <div id="icon_select" class="scrollContainer dnone"></div>'
                    + (data.ondir ? createTextInput('ondir', 'ondir', '1', '', 'hidden', '') : '')
                    + createTextInput('icon', 'foiconin', icon, icon, 'hidden', '')
                    + createTextInput('oname', 'oname', name, '', 'hidden', '')
                    + createTextInput('parent', 'parent', data.parent, '', 'hidden', '') + '\n\
                     </div>';
            $actbtn = $('<a href="" class="btn btn-primary btn-sm disabled go"><i class="icon icon-save"></i> Save</a>');
            dontWajax = true;
            break;
        case 'move':
            $this.data("ajax", "loadFoldersDropdown");
            html += '<div class="form-group">\n\
                     <span>Current Folder: </span><i class="ul">' + $viewPort.find("#breadcrumb li.active a").text() + '</i>\n\
                     </div>\n\
                     <div id="fo_dropdownlist" class="form-group row-fluid last">\n\
                     <label for="folist">Move To</label>\n\
                     <div class="col-md-11" style="height: 33px;"></div>\
                     <input class="dnone" type="hidden" name="odir" value="' + dir.id + '" />\
                     </div>';
            $actbtn = $('<a href="" class="btn btn-primary disabled go"><i class="icon icon-copy"></i> Move</a>');
            break;

        case 'statistics':
            title = "Statistics";

            html += '<p class="meterTitle">Disk Usage<span class="free-space">' + uSt.space_free_formatted + ' free out of ' + uSt.space_total_formatted + '</span></p>';
            html += '<div id="trs"></div>';
            html += '<p class="meterTitle">File Types</p>';
            html += '<div class="uts"></div>';

            break;

        case 'email':
            title = 'Send <b class="small icon icon-circle ' + filterTypes[(data.ftype == "d" ? "folder" : data.ftype)] + '"></b> ' + (data.count == 1 ? ('<i> ' + truncToTip($('<b class="small" data-container="false"/>'), data.t, 25, true) + '</i>') : ('selected <span class="count">' + data.count + '</span> item(s)')) + ' via Email';
            
            html += '<div style="min-height: ' + data.height + 'px">';
            if(!$html.hasClass("vobox")){
                html += '<div class="ItemPreview">' + (data.preview ? multiplePreviewCreate(data.preview) : '') + '</div>';
                html += $divider;
            }

            html += '<div class="form-group emailsuggestContainer" style="min-height: 69px">\n\
                     <label for="recipient">To <small>(can select multiple e-mail addresses)</small></label>\n'
                    + createTextInput('recipient', 'recipient', false, "john@example.com", "email", "emailsuggestion", true)
                    + '\
                     </div>\n\
                     <div class="form-group">\n\
                     <label for="sender">Sender email</label>\n\
                     <div class="input-group">'
                    + createTextInput('sender', 'sender', false, "sender email (optional)", "email", false, false,false,false,' data-container="#form_email"') 
                    + '<label for="usemyEmail" class="input-group-addon">'
                    + createTextInput('usemyEmail', 'usemyEmail', "", false, 'checkbox', '') + ' Use my email\
                     </label></div>\n\
                     </div>\n\
                     <div class="form-group">\n\
                     <label for="message">Aditional Message</label>\n'
                    + createTextInput('message', 'message', "", 'Enter aditional message (optional)', 'textarea', 'editor') + '\n\
                     </div>';
            html += '<div class="form-group last">\n\
                     <div class="checkbox">\n\
                     <label for="sendCopy">\n'
                    + createTextInput('sendCopy', 'sendCopy', "", false, 'checkbox', '') + '\n\
                     Send a copy to my email address\n\
                    </label>\n\
                    </div>\n\
                    </div>';
            html += '</div>'
            $actbtn = $('<a href="" class="btn btn-primary btn-sm disabled go"  data-loading-text="Sending..."><i class="icon icon-paper-plane"></i> Send</a>');
            dontWajax = false;
            break;

        case 'share':            
            title = 'Share <b class="small icon icon-circle ' + filterTypes[(data.ftype == "d" ? "folder" : data.ftype)] + '"></b> ' + (data.count == 1 ? ('<i> ' + truncToTip($('<b class="small" data-container="false"/>'), data.t, 25, true) + '</i>') : ('selected <span class="count">' + data.count + '</span> item(s)'));
            if(!$html.hasClass("vobox")){
            html += '<div class="ItemPreview">' + (data.preview ? multiplePreviewCreate(data.preview) : '') + '</div>';
            html += $divider;  
            }
            html += '<div id="share_url" class="input-group sharing vh" style="position: relative">\n\
                    <span class="input-group-btn"><button id="copy-share-url-btn" type="button" class="btn btn-default" data-clipboard-target="share_short_url" title="Copy link to clipboard" rel="tip" data-container="item" data-placement="top">Copy <i class="icon icon-clipboard"></i></button></span>'
                     + createTextInput('share_short_url', 'share_short_url', "", "Short link", 'text', 'unselectable', false, false, true) + '\n\
                     <span class="input-group-btn"><a href="#" target="_blank" id="go-share-url-btn" class="btn btn-default" title="Open link in a new tab" rel="tip" data-container="item" data-placement="top"><i class="icon icon-external-link"></i></a></span>\n\
                     </div><div id="copy-to-clipboard-result" class="callout callout-success-alt clearfix dn"></div>';
            html += '<div class="divider"></div><div id="share_box" class="sharing" style="position: relative">\n\
                     </div>';
            $actbtn = false;
            break;

        case 'downloadFolder':
            title = 'Download <i>' + truncToTip($('<b class="small" data-container="false"/>'), data.name, 25, true) + '</i> as .zip';
            html += '<div class="form-group tacent tbs">\n\
                     <div id="total_size_down">Approximate unpacked size: <strong></strong></div>\n\
                     </div>';
            html += '<div id="down_box" class="form-group">\n\
                     <button data-loading-text=\'' + $indicatorbg + ' creating zip archive...\' id="downloadBtn" type="button" class="btn btn-lg btn-primary-alt btn-block">\n\
                     <i class="icon icon-cloud-download"></i> Download</button>\n\
                     <label>Also save zip file: <input id="saveZip" name="saveZip" type="checkbox" value="1" checked>\n\
                     </label>\n\
                     </div>';
            $actbtn = false;
            break;

        case 'downloadItems':
            title = 'Download <b class="small icon icon-circle ' + filterTypes[(data.type == "d" ? "folder" : data.ftype)] + '"></b> ' + (data.count == 1 ? ('<i> ' + truncToTip($('<b class="small" data-container="false"/>'), data.name, 25, true) + '</i>') : ('selected ' + data.count + ' item(s)')) + ' as .zip';
            html += '<div class="form-group tacent tbs">\n\
                     <div id="total_size_down">Approximate unpacked size: <strong></strong></div>\n\
                     </div>';
            html += '<div id="down_box" class="form-group row-fluid">\n\
                     <button data-loading-text=\'' + $indicatorbg + ' creating zip archive...\' id="downloadBtn" type="button" class="btn btn-lg btn-primary-alt btn-block">\n\
                     <i class="icon icon-cloud-download"></i> Download</button>\n\
                     <label>Also save zip file: <input id="saveZip" name="saveZip" type="checkbox" value="1">\n\
                     </label>\n\
                     </div>';
            $actbtn = false;
            break;

        case 'downloadItem':
            title = 'Downloading <b class="small icon icon-circle ' + filterTypes[(data.type == "d" ? "folder" : data.ftype)] + '"></b> ' + ('<i> ' + truncToTip($('<b class="small" data-container="false"/>'), data.name, 25, true) + '</i>');
            html += '<div class="form-group tacent tbs h30">\n\
                     </div>';
            html += '<div id="down_box" class="form-group row-fluid">\n\
                     </div>';
            $actbtn = 'close';
            countdown = 60;
            break;

        case 'archiveItem':
            title = 'Add <b class="small icon icon-circle ' + filterTypes[(data.type == "d" ? "folder" : data.ftype)] + '"></b> ' + (data.count == 1 ? ('<i> ' + truncToTip($('<b class="small" data-container="false"/>'), data.name, 25, true) + '</i>') : ('selected ' + data.count + ' item(s)')) + ' to .zip archive';
            html += '<div class="form-group tacent tbs">\n\
                     <div id="total_size_down">Approximate unpacked size: <strong></strong></div>\n\
                     </div>';
            html += '<div id="down_box" class="form-group row-fluid">\n\
                     <button data-loading-text=\'' + $indicatorbg + ' creating zip archive...\' id="downloadBtn" type="button" class="btn btn-lg btn-primary-alt btn-block">\n\
                     <i class="icon icon-bolt"></i> Start Process</button>\n\
                     </div>';
            $actbtn = false;
            break;

        case 'extractItem':
            title = 'Extract <b class="small icon icon-circle ' + filterTypes[(data.type == "d" ? "folder" : data.ftype)] + '"></b> ' + ('<i> ' + truncToTip($('<b class="small" data-container="false"/>'), data.t, 25, true) + '</i>');
            html += '<div>';
            html += '<div class="form-group tacent">\n\
                     <label for="exto">Extract to: </label>\n\
                     <div id="extract_to" class="h30"></div>\n\
                     </div>\n\
                     <div class="form-group">'
                     + createTextInput('extract_to', 'exto1', false, "or create a new directory in current folder") + '\
                     </div>';
            html += '<div class="form-group" id="zip_infp">\n\
                     <label for="zip_contains" class="btn btn-block btn-default mb5" data-toggle="collapse" data-parent="#zip_infp" href="#zip_cont-inner">\n\
                     Click for detailed tree of this archive</label>\n\
                     <div id="zip_contains"><div id="zip_cont-inner" class="int panel-collapse collapse"></div></div>\n\
                     </div>';
            html += '<div class="form-group last">'
                     + createTextInput('name', 'name', data.t, data.t, 'hidden', '') + '\
                     <div class="callout callout-warning">Note: If this archive was created as a backup and will be extracted it to it\'s previous path, all files&folders will be overwritten! </div>\n\
                     </div>';

            html += '<div id="extract_box" class="form-group">\n\
                     <button data-loading-text=\'' + $indicatorbg + ' extracting...\' id="extract_toBtn" type="button" class="btn btn-lg btn-primary-alt btn-block">\n\
                     <i class="icon icon-bolt"></i> Extract</button>\n\
                     </div></div>';
            $actbtn = false;
            break;

        case 'tpage':
            title = data.title + '<div id="headcontrol"><div class="uitoolbar"></div></div>';
            html += createTextInput("page", "page", data.action, "", "hidden");
            html += '<div id="page_' + data.action + '" style="height: ' + data.height + 'px; max-height: 100%" class="last control">';
            $actbtn = $('<a href="" class="btn btn-primary btn-sm disabled go"><i class="icon icon-save"></i> Save</a>');
            dontWajax = true;
            break;

        default:
            $actbtn = $('<a href="" class="btn btn-danger disabled go">Continue</a>');
            break;
    }

    //set the box id
    $box.attr("id", boxid);
    $form.attr("id", "form_" + action).data("target", $this.attr("id")).append(html);
    if (title)
        $box.find(".box_title").html(((aicon) ? '<i class="icon icon-' + aicon + '"></i> ' : '') + title);
    else
        $box.find(".modal-header").remove();

    if (content) {
        if (action.split("_")[1] == 'delete') {
            $form.find(".callout").show().addClass("mp0").find("div:first").html(content);
        } else
            $form.append(content);
    }

    //set box width
    if (data.width) {
        $box.attr("data-width", data.width);
    }

    //bind click event to the $actbtn to submit the form;
    if ($actbtn && !$this.data("nobtn")) {
        if ($actbtn != "close") {
            $actbtn.on('click', function() {
                var $this = $(this);
                if (!$(this).hasClass("disabled")) {
                    handleboxForms($this, $form, $box);
                    $this.button("loading");
                }
                return false;
            });
            $box.find(".modal-footer").append($actbtn);
        }
    } else {
        $box.addClass("nofooter").find(".modal-footer").remove();
    }

    if (countdown) {
        $box.data("countdown", countdown);
    }

    $box.on('shown', function() {
        var tinput = $form.find("input[type=text]") || 0;
        if (tinput) {
            tinput.eq(0).focus().select();
        }

        $box.addClass("resize");
    });

    $box.on('shown', function() {
        if (ajax) {
            setTimeout(function(){
                if(action == 'tpage')
                    $form.blockit({message: indicatorCssSm + ' Loading ' + title, simple: true, button: false});  
                
                window[ajax]($this, ract, $form, $box);
            },700);
        } else {
            $box.find("a.go").disabletoggle(false);
        }

        if (dontWajax) {
            $box.find("a.go").disabletoggle(false);
        }

        liveFormEnterSubmit($box);
        
        $box.draggable({
            handle: ".moveHandler",
            containment: "body",
            cursor: "crosshair"
        });
        
    });

    $box.on("hide.bs.modal", function() {
        $box.find(".jGrowl").jGrowl("shutdown");
    });

    setTimeout(function() {
        $box.modal("show");
        $box.find(".dismisbox").on("touchend", function(){
            $box.modal("hide")
        })
        $indicatorEl.css("visibility","hidden");
        spint.spin(false)
    }, 100);

}

function liveFormEnterSubmit($box) {
    $box.find("input[type=text], input[type=email]").keypress(function(e) {
        if (e.which == 13) {
            $(this).blur();
            $box.find("a.go").focus().click();
            return false;
        }
    });

}

function remoteLoadPage($this, ract, $form, $box, query, callback) {

    var action = $this.data("action"),
            target = $form.find("#page_" + action),
            data = {
                "page": action
            };

    if (query !== undefined) {
        $.extend(true, data, query);
    }
        
    $.ajaxQueue({
        url: AJAX_PATH,
        type: 'GET',
        data: data,
        beforeSend: function() {
        },
        success: function(response) {
            $form.unblock();
            target.htmlA(response, 600, function() {
                liveFormEnterSubmit($box);
                if($box.find(".tabbable").length > 0){
                    $box.find(".nav-tabs a.active").tab("show").trigger("click");
                }
                if (callback) {
                    callback.call();
                }
            });
            $(window).resize();
        }
    });
}

function createStatistics($this, ract, $form, $box) {

    Morris.Bar({
        element: $box.find($this.data("target"))[0],
        stacked: true,
        hideHover: false,
        resize: true,
        xLabelAngle: 35,
        data: [
            {t: 'Image', a: uSt.count_image_types, i: 0},
            {t: 'Video', a: uSt.count_video_types, i: 1},
            {t: 'Audio', a: uSt.count_audio_types, i: 2},
            {t: 'Document', a: uSt.count_document_types, i: 3},
            {t: 'Other Types', a: uSt.count_other_types, i: 4},
            {t: 'Folders', a: uSt.count_dirs, i: 5}
        ],
        xkey: 't',
        ykeys: ['a'],
        labels: ['Total'],
        barColors: function(row, series, type) {
            var colors = {
                'Image': "#68217A",
                'Video': "#F25022",
                'Audio': "#0072C6",
                'Document': "#8AC53E",
                'Other Types': "#FFB900",
                'Folders': "#EAEAEA"
            };
            return colors[row.label];
        },
        hoverCallback: function(index, options, content) {
            return(content + ' item(s)');
        }
    });

    var w = $form.width(),
            r = Raphael("trs", w, 50),
            fin = function() {
                this.flag = r.popup(this.bar.x, this.bar.y, (formatFileSize(this.bar.value)) || "0").insertBefore(this);
            },
            fout = function() {
                this.flag.animate({opacity: 0}, 300, function() {
                    this.remove();
                });
            };
    var used = parseInt(uSt.space_used_percentage),
            fcol = (used < 20 ? "#3980B5" : ((used > 20 && used < 50) ? "#d07e22" : "#E73D0D")),
            chart = r.hbarchart(30, 10, w - 60, 40, [[uSt.space_used], [uSt.space_free]], {stacked: true, colors: [fcol, "#F4F4F4"]}).hover(fin, fout);

    $(window).resize(function() {
        r.setSize($form.width(), 50);
        chart.remove();
        chart = r.hbarchart(30, 10, $form.width() - 60, 40, [[uSt.space_used], [uSt.space_free]], {stacked: true, colors: [fcol, "#F4F4F4"]}).hover(fin, fout);
    });
}

function deleteItemDismiss($this, action, $form, $box) {

    $('.ignoretitem').one("click", function() {
        //getItemId
        var p = $(this).closest("div.thumbnail"),
                id = p.data("id"),
                $vel = $form.find('input[name="value"]'),
                cel = $box.find(".box_title .count");

        $vel.val(removeVal($vel.val(), id));
        //update selected files
        //delete selectedItems[dir.id][id];
        selectedItems[dir.id] = jQuery.grep(selectedItems[dir.id], function(value, key) {
            return value !== id;
        });

        //trigger change event for this item on the list area
        var $item = $list.findItem(id, "selected");
        selectItem($item, true);

        //update box title count
        var count = selectedItems[dir.id].length;
        if (count === 0) {
            $box.modal("hide");
        }
        cel.text(count);

        hideTip(p[0])
        p.remove();
    });
}

function removeVal(array, item) {

    var elements = $.isArray(array) ? array : array.split(","),
            remove_index = elements.indexOf(item);
    elements.splice(remove_index, 1);

    return elements.join(",");
}

function loadFolderEdit($this, action, $form, $box) {
    var target = $('#icon_select'),
            btn = $box.find('.icon_select_btn'),
            iprv = $("#iconpreview"),
            $elem = $('<span class="iconselect" />').on("click", function() {
        var $this = $(this);
        iprv.prop("src", $this.find("img").prop("src"));
        target.find("span.active").removeClass("active");
        $this.addClass("active");
        $("#foiconin").val($this.data("id"));
        $("#resetIcon").show();
    }),
            data = target.find('input[type="hidden"]:first').val();

    $("#resetIcon").on("click", function() {
        $("#foiconin").val("0");
        iprv.prop("src", ASSURI + 'img/blank.png');
        $(this).hide();
        $("#icon_select").find("span.iconselect.active").removeClass("active")
    });

    $("#fopass").xswitch().on("change", function() {
        $(this).closest("div.form-group").find("#fopass_val").toggle();
    });

    $('.icon_select_btn').on("click", function() {

        if (!target.hasClass("loaded")) {
            var tempDom = $("<div/>");
            $.ajaxQueue({
                url: AJAX_PATH,
                type: 'POST',
                dataType: 'json',
                cache: true,
                data: {"action": "pull_icons", "current_icon": $this.data("i")}, //"pull_icons"
                beforeSend: function() {
                    btn.blockit({message: $indicator, simple: true, button: true, css: {top: "-1px"}});
                },
                success: function(data) {
                    var objlen = data.length;

                    setTimeout(function() {
                        $.each(data, function(key, obj) {
                            var $clone = $elem.clone(true)
                            $clone
                                    .data("id", obj.value)
                                    .append(createIconImage(obj.value))
                                    .appendTo(tempDom);
                            if (obj.selected) {
                                $clone.addClass("active");
                            }
                        });
                        
                        target.append(tempDom);
                        
                        target.addClass("loaded");

                        btn.unblock();
                        
                    }, 100);
                }
            });
        }
        target.slideToggle("fast", function() {
            setTimeout(function(){
                $(window).resize();
            },50)
            
        });

        btn.find("i.icon").toggleClass("icon-caret-down icon-caret-up");

        return false;

    });
}

function liveSelectCount($chk, totalChecked) {

    if (totalChecked) {
        var pop = $chk.data("bs.popover") || 0;
        
        if (pop) {
            $chk.attr("data-content", totalChecked);
            pop.setContent();
            pop.$tip.addClass(pop.options.placement + ' light-blue selectedTotalcountnumber');
            if (pop.$tip.is(":hidden")) {
                pop.show();
            }
            $dirNav.addClass("shift");
        } else {
            $chk.popover({
                trigger: "manual",
                content: totalChecked,
                placement: "right"
            }).popover("show").on('hide.bs.popover', function() {
                $dirNav.removeClass("shift")
            }).on('shown.bs.popover', function() {
                
            }).addClass("sticky");        
            
            $dirNav.addClass("shift");
        }
    } else {
        if ($chk.closest("label").find("div.popover").length) {
            $chk.popover("hide");
        }
    }
}

function liveSelections(totalChecked, totalItem, last) {
    
    var $tcheck = $("#checkFiles"),
            $con = $("#filecheck"),
            $phoneActDr = $("#phoneActDr");

    if (totalChecked) {
        $topActBtns.addClass("selected");
        $wrap.addClass("itemSelected");

        if ($phoneActDr.is(":visible")) {
            $phoneActDr.addClass("light-orange").popover({
                trigger: "manual",
                content: "Navigate to take action",
                placement: "right"
            }).popover("show").on("click", function() {
                $phoneActDr.popover("hide");
            }).on("shown.bs.popover", function() {
                $(this).data("bs.popover").$tip.addClass("orange").find(".popover-content").addClass("pl5 pr5")
            });
        }
        
        liveSelectCount($tcheck, totalChecked);

    } else {

        $topActBtns.removeClass("selected");
        $wrap.removeClass("itemSelected");
        
        liveSelectCount($tcheck, totalChecked);
        
        if ($phoneActDr.is(":visible")) {
            $phoneActDr.removeClass("light-orange")
            if ($phoneActDr.data("bs.popover")) {
                $phoneActDr.popover("hide");
            }
        }
    }
        
    if (totalChecked <= totalItem && totalChecked > 0) {
        $tcheck.prop("indeterminate", true);

        if (totalChecked == totalItem) {
            $tcheck.prop("indeterminate", false).prop("checked", true);
        }
    } else {
            $tcheck.prop("indeterminate", false).prop("checked", false);
    }
}

function qDirActions(action, item, extraQuery, callback) {

    if (action == 'updatedir') {
        $topActBtns.find('a[data-action="updatedir"]').trigger("click");
        if ($.isFunction(callback))
            callback();
        return;
    }

    var query = {
        action: action,
        value: item ? $(item).data("value") : '',
        path: dir.path,
        dir: dir.id,
        hash: dir.hash
    };

    if (extraQuery) {
        $.extend(true, query, extraQuery);
    }
    $.ajaxQueue({
        type: "POST",
        url: AJAX_PATH,
        data: query,
        dataType: "json",
        success: function() {
            if ($.isFunction(callback))
                callback();
        }
    });
}

function checkforAlert(data) {
    //show warning/prompts
    if (data.ppop) {


        $(".modal").modal("hide");
        var d = data;

        setTimeout(function() {
            var data = d.ppop,
                    btns = {};

            $.each(data.action, function(key, val) {
                btns[key] = {}
                $.each(val, function(k, v) {
                    btns[key][k] = (typeof v == 'function' ? v(data.items) : v);
                });
            });

            var pp = ppop.dialog({
                width: (data.width ? data.width : 360),
                message: data.message,
                title: data.title,
                buttons: btns
            })
                    
            pp.on("shown.bs.modal", function() {
                $notify.jGrowl("close");
            })

            $notify.jGrowl("close");

        }, 50);

    }

    return true;

}

function createIconImage(icon) {
    return '<img src="' + ASSURI + 'img/icons/' + icon + '"/>';
}


function createJElobj(attr) {
    var el = $('<div/>'),
            attrs = {
                "data-s": "",
                "data-c": dir.description,
                "data-t": dir.name,
                "data-parent": dir.parentid,
                "data-id": dir.id,
                "class": "folder"
            }
    if (attr) {
        $.extend(true, attrs, attr);
    }
    $.each(attrs, function(key, val) {
        el.attr(key, val);
    });
    return el;
}

function strip(html)
{
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

//set after load
forceUpdate = false;
