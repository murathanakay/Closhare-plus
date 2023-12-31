/**
 * admin.js
 * @package      Closhare +plus
 */

//Dom please!
$(function() {
    var $oTrigger = $uiactControl.find("a").filter('[data-action="users"]');

    //user space
    $body.editable({
        selector: "a.uispace",
        html: true,
        params: function(params) {
            params.page = "users";
            params.uiaction = 'sizelimit'
            return params;
        },
        success: function(response) {

            if (response.result) {
                
                $body.find("#uinotify").jGrowl("close").jGrowl(response.message.txt, {header: response.message.title, life: 5000, closeDuration: 0});
                
                //if there is an extra data use their key as a HTML Object class selector and change html with the retuned html.                               
                if(response.data){
                    $.each(response.data, function(a, b) {
                        $body.find("."+a).html(b);
                    });
                    
                }
                return {newValue: response.newValue};

            } else {
                return response.msg;
            }
        },
        display: function(value) {
            if (value != "")
                $(this).text(value);
        }
    });
    
    //user privileges
    $body.editable({
        selector: "a.uipermissions",
        type: 'checklist',
        title: 'Select user permissions',
        highlight: false,
        params: function(params) {
            params.page = "users";
            params.uiaction = 'privileges'
            return params;
        },        
        source: function(a, b){
            
            return eval(this.id+"_source");
        },
        success: function(response, a,b) {

            if (response.result) {
                
                $body.find("#uinotify").jGrowl("close").jGrowl(response.message.txt, {header: response.message.title, life: 10000, closeDuration: 0});
                
                //if there is an extra data use their key as a HTML Object class selector and change html with the retuned html.                               
                if(response.data){
                    $.each(response.data, function(a, b) {
                        $body.find("."+a).html(b);
                    });
                    
                }
                var $this = $(this),
                        $target = $("#"+$this.data("target"));
                
                $target.toggleClass("mid-gray light-blue flash");
                setTimeout(function(){
                    $target.toggleClass("mid-gray light-blue flash")
                },1200);
                
                if(response.newValue)
                    return {newValue: response.newValue};
                else 
                    return {newValue: "-"}
                

            } else {
                return response.msg;
            }
        },        
        
        display: function (value, sourceData) {
            
                        
            var $el = $("#"+$(this).data("target")),
                    checked, html = '';
            if (!jQuery.isArray(value) && value.length == 0) {
                $el.empty();
                return;
            }
            
            checked = $.grep(sourceData, function (o) {
                return $.grep(value, function (v) {
                    return v == o.value;
                }).length;
            });
            
            $.each(checked, function (i, v) {
                html += ' <i class="icon icon-' + $.fn.editableutils.escape(v["class"]) + ' curdef" rel="tip" data-placement="top" data-container="item" title="'+v.text+'"></i>';
            });
            if (html){
                $el.html(html);
            }
        }
    }).on('x-editable.shown', function (e, editable) {
        var $el = editable.$element;
        $el.closest(".modal-body").css("overflow","visible")
        $el.addClass("editable-click")
    }).on('x-editable.hidden', function (e, editable) {
        var $el = editable.$element;
        $el.closest(".modal-body").css("overflow","auto");
        $el.removeClass("editable-click")
    });
    

    $body.on("click", "button.changestatus", function() {
        var $this = $(this);
        if ($this.hasClass("disabled"))
            return;

        var iel = $this.find("i.icon"),
                inactCls = 'btn-orange',
                status = "inactive",
                $tr = $this.closest("tr");

        if ($this.hasClass(inactCls)) {
            //its currently active
            iel.removeClass("icon-minus-square").addClass("icon-check-square");
            $this.attr("data-original-title", "Click to deactivate user.");
            status = "active";

        } else {
            iel.removeClass("icon-check-square").addClass("icon-minus-square");
            $this.attr("data-original-title", "Click to activate user.");
        }

        $this.toggleClass("btn-orange btn-lightblue");

        var sdata = {
            page: "users",
            uiaction: "status",
            status: status,
            value: $tr.data("id")
        };
        $.ajaxQueue({
            url: "",
            type: "POST",
            data: sdata,
            dataType: "json",
            beforeSend: function() {
                $this.blockit({message: $indicator, simple: true, button: false, fadeOut: 600, blockMsgClass: '', css: {'padding': 1}, overlayCSS: {opacity: 0.9}});
            },
            success: function(response) {
                $body.find("#uinotify").jGrowl("close").jGrowl(response.message.txt, {header: response.message.title, life: 5000, closeDuration: 0});
                $this.unblock();
            }
        });
    });

    //user delete button

    $body.on("click", "button.deleteuser", function() {
        var $this = $(this),
                data = $this.closest("table").data();
        if ($this.hasClass("disabled"))
            return;

        var $tr = $this.closest("tr"),
                sdata = {
                    page: "users",
                    uiaction: "remove",
                    value: $tr.data("id")
                }

        ppop.confirm({
            title: '<i class="icon icon-chain-broken"></i> Remove User',
            message: '<b class="large">Do you really want to remove this user?</b><br><small class="mt10">(This action will completely remove all personal data of this user.)</small><div class="divider"></div><small class="db mt10">Note: This can not be undone!</small>',
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn-default btn-sm"
                },
                confirm: {
                    label: "Remove",
                    className: "btn-danger btn-sm"
    }
            },
            callback: function(result) {

                if (result) {
                    $.ajaxQueue({
                        url: "",
                        type: "POST",
                        data: sdata,
                        dataType: "json",
                        beforeSend: function() {
                            $this.blockit({message: $indicator, simple: true, button: false, fadeOut: 600, blockMsgClass: '', css: {'padding': 1}, overlayCSS: {opacity: 0.9}});
                        },
                        success: function(response) {
                            $body.find("#uinotify").jGrowl("shutdown");
                            var pagerData = {
                                pg: data.pg,
                                ipp: data.ipp
                            };
                            $this.unblock();
                            remoteLoadPage($oTrigger, false, $("#form_tpage"), $("#box_tpage"), pagerData, function() {
                                $body.find("#uinotify").jGrowl(response.message.txt, {header: response.message.title, life: 5000, closeDuration: 0});
                            });
                        }
                    });
                }else{
                    return false;
                }
            }
        });


        return false;
    });

    //pagination load
    $body.on("click", ".uitoolbar a", function() {
        var $this = $(this),
                $li = $this.closest("li"),
                data = $this.data();

        if ($li.hasClass("active") || $li.hasClass("disabled")) {
            return false;
        }

        var pagerData = {
            pg: data.pg,
            ipp: data.ipp,
            uisearch: $body.find("#headcontrol").data("searchTerm")
        };
        
        $body.find("#uinotify").jGrowl("shutdown");
        
        remoteLoadPage($oTrigger, false, $("#form_tpage"), $("#box_tpage"), pagerData);

        return false;

    });

    //search on enter or press button
    $body.on("click", "#uisearchuserbtn", function() {
        var val = $("#uisearchuser").val(),
                len = val.length;

        var searchData = {
            uisearch: val
        };

        $body.find("#headcontrol").data("searchTerm", val);
        $body.find("#uinotify").jGrowl("shutdown");
        
        if (len > 0) {
            remoteLoadPage($oTrigger, false, $("#form_tpage"), $("#box_tpage"), searchData);
            $("#uisearchreset").show();
            
        } else {
            remoteLoadPage($oTrigger, false, $("#form_tpage"), $("#box_tpage"), false);
            $("#uisearchreset").hide();
        }

        return false;
    });

    $body.on("keydown", "#uisearchuser", function(e) {
        if (e.which == 13) {
            $(this).blur();
            $("button#uisearchuserbtn").trigger("click");
            return false;
        }
    });

    //reset search
    $body.on("click touchend", "#uisearchreset", function() {
        $("#uisearchuser").val("");
        $("button#uisearchuserbtn").trigger("click");
    });
    
    //load default mail templates
    $body.on("click", ".load_default", function() {
        
        var $this = $(this),
        data = $this.data(),
        blockel = $(data.container),
        sdata = {
                    page: "mail",
                    uiaction: data.uiaction
                };
        
        if ($this.hasClass("disabled"))
            return;

        ppop.confirm({
            title: '<i class="icon icon-check"></i> Confirmation',
            message: data.content,
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn-default btn-sm"
                },
                confirm: {
                    label: "Yes",
                    className: "btn-primary btn-sm"
    }
            },
            callback: function(result) {

                console.log(result);
                if (result) {
                    $.ajaxQueue({
                        url: "",
                        type: "POST",
                        data: sdata,
                        dataType: "json",
                        beforeSend: function() {
                            blockel.blockit({message: $indicator, simple: true, button: false, fadeOut: 600, blockMsgClass: '', css: {'padding': 1}, overlayCSS: {opacity: 0.9}});
                        },
                        success: function(response) {
                            blockel.unblock();
                            blockel.find(".editor").veditorVal(response.newVal);
                            $("#page_settings").find("#uinotify").jGrowl(response.message.txt, {header: response.message.title, life: 5000, closeDuration: 0});
                        }
                    });
                }
            }
        });


        return false;
    }); 
    
    $(document).on("shown.bs.tab", "#settingsTab a", function(e){
        
        var append = $(e.target).closest("ul").hasClass("dropdown-menu"),
        $target = (append ? $(e.target).closest(".dropdown").find(".dropdown-toggle") : $(e.target)),
        appendT = append ? (' <small><i class="icon icon-angle-right"></i> '+$(this).data("heading")+'</small>') : "";
        
        if($target.data("heading")){       
            $("#page_settings").find(".tab-heading").show().html( '<h4><span class="flat '+$target.attr('href').replace(/^#/, '')+'"></span> '+$target.data("heading")+appendT+'</h4><hr>' );
        }
        else{
            $("#page_settings").find(".tab-heading").hide();
        }
        
        $("#page_settings").find(".tab-content").slimScroll({
            height: parseInt($(window).height()-(230+($("#page_settings").find(".tab-heading").is(":visible") ? parseInt( $("#page_settings").find(".tab-heading").outerHeight()) : 0)) ),
            size: '6px',
            railVisible: true,
            railBorderRadius : '0',
            alwaysVisible: true,
            alwaysVisible: true         
        });
        
    });    
    
});