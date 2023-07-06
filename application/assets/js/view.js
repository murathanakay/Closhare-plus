/**
 * view.js
 */
$(document).ready(function () {

    if ($("html").hasClass("off")) {
        $("html").removeClass("off");
    }
    setTimeout(function () {
        $("body").removeClass("onload");
    }, 600);

    container = $('.share');
    var msnry, $imgs = $("li.item img"), imgArr = new Array();
    typeClasses = ["image", "audio", "video", "document", "other"];
    var itemCounts = $("li").length;

    colwidth = container.find(".item-thumb").eq(0).width();

    $.post(AJAX_PATH, {
        "colwidth": colwidth
    });

    pic_real_width = 0;
    pic_real_height = 0;

    $(".gallery").each(function () {
        var $this = $(this);

        var pt = {
        }

        if ($this.closest("li").hasClass("video")) {
            return false;
        }

        var im = $this.find("img")[0];


        $("<img/>")
                .attr("src", $(im).attr("data-src"))
                .load(function () {
                    pic_real_width = this.width;
                    pic_real_height = this.height;

                    console.log(pic_real_width)

//    if(colwidth <= pic_real_width) 
                    $this.not(".njf").justifiedGallery({
                        lastRow: 'justify',
                        margins: 2,
                        extension: /.jpg$/,
//  'sizeSuffixes' : {
//      'lt200':''
//  }
                        'sizeSuffixes': {
                            'lt100': '_t',
                            'lt240': '_m',
                            'lt320': '_n',
                            'lt500': '_n',
                            'lt640': '_z',
                            'lt1024': '_b'
                        }
                    }).on('jg.complete', function (e) {
//                        container.masonry({
//                            itemSelector: '.item-thumb',
//                            isFitWidth: true
//                        });


                        $(this).find("a.viewable").vobox();
                    });
                });
    })



    $("body").on("click", "a.singleImage", function (e) {
        var $this = $(this),
                d = $this.data(),
                $gal = $this.closest(".gallery");

        switch (d.type) {

            case 'image':

                $gal.off("jg.complete");


                var h = $this.find("img").height();
                if (!$this.data("fh")) {
                    $this.data("fh", $this.height())
                }
                var th = ($this.hasClass("on") ? parseInt($this.data("fh")) : parseInt(h));

                $gal.on('jg.complete', function (e) {
//                   container.masonry({
//                       itemSelector: '.item-thumb',
//                       isFitWidth: true
//                   });
                });

                $gal.not(".njf").justifiedGallery({
                    rowHeight: th,
                    maxRowHeight: th,
                    extension: /.jpg$/,
                })


                if (!$this.hasClass("on")) {
                    $this.addClass("on");
                    //$gal.find("a.singleImage")
                    $this.closest(".gallery:not(.njf)").find("a.singleImage").vobox();
                }
                break;
        }

        return false;
    });
    function isApproachingToBottom(el) {

        var elementHeight = typeof el[0].scrollHeight,
                scrollPosition = el.height() + el.scrollTop(),
                equa = 200; //100px before


        if (elementHeight == 'undefined') {

            var body = document.body,
                    html = document.documentElement;
            elementHeight = Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight);

        }

        return (elementHeight - equa <= scrollPosition);
    }

    pic_real_width = 0;
    pic_real_height = 0;
//load more items if needed
    $(window).scroll($.debounce(250, function () {
        var ex = $(this),
                isbottom = isApproachingToBottom(ex),
                loadingMore = null;

//            console.log(ex);

        if (!$("ul.share").data("loadmore"))
            return;

        if (isbottom) {
            var $itemPid = $("#itempid"),
                    $pagepid = $(".pagepid").filter(":last");

            if (loadingMore == null) {
                loadingMore = true;
                var $urlEl = $("a.nextpage:last");
                var url = $urlEl.attr("href");
                $(".loadMoreItemContainer").removeClass("dn")

                $.ajaxSingle({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: function (response) {


                        var $response = $('<div>' + response.content + '</div>');

                        $response.find(".gallery").addClass("new");

                        $response.find("li.item-thumb").each(function () {

                            var $newitem = $(this);

                            var im = $response.find(".gallery img")[0];

                            container.append($newitem);

                            $(".gallery.new").not(".njf").justifiedGallery({
                                lastRow: 'justify',
                                margins: 2,
                                extension: /.jpg$/,
                                'sizeSuffixes': {
                                    'lt100': '_t',
                                    'lt240': '_m',
                                    'lt320': '_n',
                                    'lt500': '_n',
                                    'lt640': '_z',
                                    'lt1024': '_b'
                                }
                            }).on('jg.complete', function (e) {
                                $(this).removeClass("new").find("a.viewable").vobox();
                            });
                            $('video,audio').mediaelementplayer({
                                startVolume: 0.6,
                                plugins: ['flash', 'silverlight'],
                                pluginPath: ASSURI + 'player/',
                                flashName: 'player.swf',
                                silverlightName: 'player.xap',
                                features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume', 'fullscreen'],
                                alwaysShowControls: false,
                                enableAutosize: true,
                                pluginWidth: -1,
                                pluginHeight: -1,
                                enableKeyboard: true,
                                timerRate: 250,
                                success: function (player, node) {
                                    //container.masonry()
                                }
                            });

                        });


                        container.append($response.find("a.nextpage"));
                        $(".loadMoreItemContainer").addClass("dn")

                        if (response.loadMore === false) {
                            $(window).off("scroll");
                        }

                        loadingMore = null;
                    }
                });
            }
        }
        return false;
    }));
//collapse details
//$("body").on('shown.bs.collapse', ".collapse", function () {
//    container.masonry();
//})
//$("body").on('hidden.bs.collapse', ".collapse", function () {
//        setTimeout(function(){
//            container.masonry();
//        }, 30)
//});

    $('video,audio').mediaelementplayer({
        startVolume: 0.6,
        plugins: ['flash', 'silverlight'],
        pluginPath: ASSURI + 'player/',
        flashName: 'player.swf',
        silverlightName: 'player.xap',
        features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume', 'fullscreen'],
        alwaysShowControls: false,
        enableAutosize: true,
        pluginWidth: -1,
        pluginHeight: -1,
        enableKeyboard: true,
        timerRate: 250,
        success: function (player, node) {
            //container.masonry()
        }
    });

    $("li.locked").each(function () {
        var $this = $(this),
                $ul = $this.closest("ul.share"),
                d = $this.data(),
                $form = $this.find("form"),
                $protected = $this.find(".protected"),
                $input = $form.find("input"),
                $pres = $protected.find(".pres"),
                $i = $protected.find("i");

        var prvat = $protected.data("preventattempts") || 0,
                prvatint = $protected.data("preventattemptsintv") || 0;

        if (prvatint) {
            preventAttemts($protected, prvat, prvatint);
        }

        //send password to server               
        $form.submit(function () {
            $(this).ajaxSubmit({
                url: AJAX_PATH,
                type: 'post',
                dataType: 'json',
                data: {
                    unlock_folder: true,
                    pd: d.id,
                    uid: $ul.data("uid"),
                    path: d.p
                },
                beforeSubmit: function (formData, jqForm, options) {
                    $i.removeClass("icon-lock").addClass("icon-unlock");
                },
                success: function (response, statusText, xhr, $form) {
                    setTimeout(function () {
                        if (response.result == 1) {
                            $this.find(".dirlistexp").removeClass("hidden").find(".all").removeClass("hidden");
                            $protected.fadeOut("fast", function () {
                                $protected.replaceWith(response.html);
                                $this.find(".gallery").not(".njf").justifiedGallery({
                                    rowHeight: 105,
                                    lastRow: 'justify',
                                    margins: 2,
                                    extension: /.jpg$/,
                                    'sizeSuffixes': {
                                        'lt100': '_t',
                                        'lt240': '_m',
                                        'lt320': '_n',
                                        'lt500': '_n',
                                        'lt640': '_z',
                                        'lt1024': '_b'
                                    }
                                }).on('jg.rowflush', function (e) {
                                    $this.find(".title").spin(false);
                                    //container.masonry();
                                }).on('jg.complete', function (e) {
                                    $(this).find("a.viewable").vobox("revobox");
                                });
                            });
                        }
                        else {
                            if (response.blocked) {
                                $protected.find(".res").hide();
                                preventAttemts($protected, response.blocked, response.intv)
                            } else {
                                $protected.find(".res").html(response.message).show();
                                $protected.find(".form-group").addClass("has-error");
                            }

                            $pres.addClass("maroon")
                            $i.removeClass("icon-unlock").addClass("icon-lock");
                        }
                    }, 400);
                }

            });
            return false;
        });

    });

    function preventAttemts($protected, message, intv) {
        $protected.find(".input-group").block({
            message: '<span class="maroon">' + message + '</span> <span id="contr"></span>',
            css: {
                border: 'none',
                width: '99%',
            },
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: .95,
            }
        });
        $("#contr").countdown((intv), 's', function () {
            $protected.find(".input-group").unblock();
        }, true);
    }

    function createsharebox($trigger, $el, response) {
        $el.find(".sharebox").html(response.html);
        $el.find(".sharebox").share({
            networks: response.shareOpts,
            link: response.link,
            url: response.url,
            title: response.title,
            desc: response.description,
//                        excpt: ['email'],
            theme: "default",
            callbacks: {
                'email': function () {
                    createEmailPop($trigger.closest("li"), $trigger.closest("li"));
                    $("html, body").stop().animate({scrollTop: $trigger.closest("li").offset().top});
                }
            }
        });
    }


    $("body").on("click", ".showAll", function () {
        var $this = $(this),
                $li = $this.closest("li");
        $this.disabletoggle(true);
        var uh = $li.find(".gallery").height(),
                $ul = $li.closest("ul");

        //ajax to load more items;
        $.ajax({
            url: AJAX_PATH,
            type: 'GET',
            data: {
                loadfolderItems: 1,
                id: $li.data("id"),
                uid: $li.closest("ul").data("uid")
            },
            dataType: 'json',
            beforeSend: function () {
                setTimeout(function () {
                    $li.find(".share-header").blockit({message: indicatorCssPurple, simple: true, usimple: true, button: false});
                }, 16);
            },
            success: function (response) {

                $li.find(".dirlistexp").removeClass("hidden").find(".all").removeClass("hidden");
                $li.find(".dirlistexp .first3").addClass("hidden");
                $li.find(".gallery").html(response.html);
                $this.hide();
                $li.find(".gallery").not(".njf").justifiedGallery({
                    rowHeight: 105,
                    lastRow: 'justify',
                    margins: 2,
                    extension: /.jpg$/,
                    'sizeSuffixes': {
                        'lt100': '_t',
                        'lt240': '_m',
                        'lt320': '_n',
                        'lt500': '_n',
                        'lt640': '_z',
                        'lt1024': '_b'
                    }
                }).off('jg.rowflush').on('jg.rowflush', function (e) {
                    $li.unblock();
                    //console.log(container.data("masonry"))
                    //container.masonry()
                }).off('jg.complete').on('jg.complete', function (e) {
                    $(this).find("a.viewable").vobox("revobox");
                    //container.masonry()
                    $li.find(".share-header").unblock();
                });

            }
        });


        return false;
    })


    $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    if ($(".download").length > 0) {

        $(".download").each(function () {

            var $el = $(this),
                    $this = $el.find("a"),
                    link = $this.prop('href');
            //$el.width($el.closest(".thumbnail").width());
            if ($el.parents("div:first").hasClass("mejs-mediaelement")) {
                $el.prepend($('<div style="position: absolute; bottom: 0; left: 0; right: 0; font-size: 10px; color: white; text-align: center">Your browser does not support to play this kind of media.</div>'))
            }

            $this.attr("href", 'javascript:;').prepend($('<i class="icon-download icon-5x" />'));
            $this.on('click', function () {
                downloader('/?octet&file=' + $(".share").eq(0).data("pack") + '__' + link.split("/")[4]);
                return false;
            });
        });
    }

    $("body").tooltip({
        html: true,
        selector: '[rel=tip]:not(".disabled")',
        trigger: "hover",
        container: function (tip, element) {
            return ($(element).data("container") === undefined) ? $("body") : false
        },
        animation: false,
        placement: function (tip, element) {
            return $(element).data("placement") ? $(element).data("placement") : popoverautoplacement(tip, element, true)
        },
    });


    yepnope.injectJs(ASSURI + 'js/rotors/zero/ZeroClipboard.min.js', function () {


        var client = new ZeroClipboard($(".clipboardBtn"));

        ZeroClipboard.config({moviePath: ASSURI + 'js/rotors/zero/ZeroClipboard.swf'});

        client.on("ready", function (readyEvent) {
            client.on("aftercopy", function (event) {
                var $target = $(event.target);
                if (!$target.data("oldhtml")) {
                    $target.data("oldhtml", $target.html())
                }
                $(event.target).html('<i class="icon icon-check"></i> Copied!').show("highlight").disabletoggle(true);

                setTimeout(function () {
                    $target.html($target.data("oldhtml")).disabletoggle(false)
                }, 2000)
                //jQuery("#copy-to-clipboard-result").show("highlight").text("Copied link to clipboard");
            });
        });
    });

});
