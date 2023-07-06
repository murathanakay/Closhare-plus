(function(window, document, $, undefined) {

    $.vobox = function(elem, options) {

        var defaults = {
            useCSS: true,
            initialIndexOnArray: 0,
            hideBarsDelay: 4000,
            videoMaxWidth: 1140,
            beforeOpen: null,
            afterClose: null
        },
        plugin = this,
                elements = [],
                elem = elem,
                selector = elem.selector,
                $selector = $(selector),
                currPlay = {'index': null, 'type': null},
                mediaHasPlayed = false,
        isTouch = document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints,
                supportSVG = !!(window.SVGSVGElement),
                winWidth = window.innerWidth ? window.innerWidth : $(window).width(),
                winHeight = window.innerHeight ? window.innerHeight : $(window).height(),
                html = '<div id="vobox-overlay">\
                        <div id="vobox-container">\
				<div id="vobox-slider"></div>\
				<div class="navbar navbar-inverse mb0" id="vobox-caption">\
                        <div class="container-fluid">\
                        <ul class="nav pull-left">\
                        <li id="vobox-title"><span class="icon large"></span> <b></b></li>\
                        </ul>\
                        <ul class="nav navbar-nav midaction">\
                        <li><a href="javascript:;" id="vobox-download" title="Download" rel="tip" data-container="item" data-placement="bottom"><i class="icon icon-download"></i></a></li>\
                        <li><a href="javascript:;" id="vobox-email" title="Email" rel="tip" data-container="item" data-placement="bottom"><i class="icon icon-envelope"></i></a></li>\
                        <li><a href="javascript:;" id="vobox-share" title="Share" rel="tip" data-container="item" data-placement="bottom"><i class="icon icon-share-alt"></i></a></li>\
                        </ul>\
                        <ul class="nav navbar-nav pull-right closenav">\
                        <li><a id="vobox-close" title="Close" rel="tip" data-container="item"><i class="icon icon-times"></i></a></li>\
                        </ul>\
                        </div>\
                        </div>\
                        <div class="vobox-side vobox-prev-container curdef">\
                            <div id="vobox-prev" title="Previous" rel="tip" data-container="item" data-placement="right"></div>\
                        </div>\
                        <div class="vobox-side vobox-next-container curdef">\
                            <div id="vobox-next" title="Next" rel="tip" data-container="item" data-placement="left"></div>\
                        </div>\
                        <div class="vobox-baseline">\
                        <div class="vobox-count-container">\
                        <div id="vobox-count"><span class="current">1</span> of <span class="total">1</span> items</div>\
                        </div>\
                        <div class="vobox-description-container">\
                        <div id="vobox-description"><span class="current"></span></div>\
                        </div>\
                        </div>\
                        </div>\
                        </div>',
                playing = false;
                
        plugin.settings = {}

        plugin.init = function() {

            plugin.settings = $.extend({}, defaults, options);

            if ($.isArray(elem)) {

                elements = elem;
                ui.target = $(window);
                ui.init(plugin.settings.initialIndexOnArray);

            } else {
                $selector.off("click");

                $selector.click(function(e) {
                    e.stopPropagation();
                    e.preventDefault();  
                    elements = [];
                    var index, relType, relVal;

                    if (!relVal) {
                        relType = 'rel';
                        relVal = $(this).attr(relType);
                    }

                    if (relVal && relVal !== '' && relVal !== 'nofollow') {
                        $elem = $selector.filter('[' + relType + '="' + relVal + '"]');
                    } else {
                        $elem = $(selector);
                    }

                    $elem.each(function(curr) {

                        var $this = $(this);
                        var title = null, 
                            href = $this.attr("href") || null,
                            
                        $item = (href === null) ? ($this.data("direct") ? $this.closest(".tt-dataset-0") : $this.closest(".preview")) : $this,
                        data = $item.data();
                        itemKey = $this.data("hash");
                        
                        
                        
                        if(href === null){
//                                               console.log(data) 
                        if (data.ftype == 'video' || data.ftype == 'audio') {
                            var curDirDif = ( (currDir != UIDIR || data.dirhash) ?  (UIDIR+data.path) :  UIDIR);
                            href = CLO_URL+'/'+curDirDif+'/'+data.t;
                            
                            //elements[curr].playing = false;
                        }else if(data.ftype == 'image'){
                            //image
                            var curDirDif = ( (currDir != UIDIR) ?  (UIDIR+'/'+currDir) :  UIDIR);
                            if(data.dirhash){
                                curDirDif = UIDIR+'/'+data.dirhash;
                            }                            
                            href = CLO_URL+'/'+curDirDif+'/'+data.ftype+'/'+itemKey+'.'+data.ext+':large';
                        }else{
                            //console.log(data);
                            var curDirDif = ( (currDir != UIDIR) ?  (UIDIR+'/'+currDir) :  UIDIR);
                            if(data.dirhash){
                                curDirDif = UIDIR+'/'+data.dirhash;
                            }                              
                             href = CLO_URL+'/'+curDirDif+'/'+data.ftype+'/'+itemKey+'.'+data.ext;
                        }
                       }
                                              
                        elements.push({
                            data: data,
                            href: href,
                            title: data.t,
                            type: data.ftype,
                            loaded: false
                            
                        });

                    });

                    index = $elem.index($(this));
                    e.preventDefault();
                    e.stopPropagation();
                    ui.target = $(e.target);
                    ui.init(index);
                    
                    return false;
                });
            }
        }

        plugin.revobox = function() {

            if (!$.isArray(elem)) {
                ui.destroy();
                $elem = $(selector);
                ui.actions();
            }
        }

        var ui = {
            init: function(index) {
                if (plugin.settings.beforeOpen)
                    plugin.settings.beforeOpen();
                this.target.trigger('vobox-start');
                $.vobox.isOpen = true;
                this.build();
                this.openSlide(index);
                this.openMedia(index);
                var plug = this;
                setTimeout(function(){
                    plug.preloadMedia(index + 1);
                    plug.preloadMedia(index - 1);
                },1000)
            },
            build: function() {
                var $this = this;
                //close all 
                $(".popover").popover("hide");
                
                $('body').append(html);

                if ($this.doCssTrans()) {
                    $('#vobox-slider').css({
                        '-webkit-transition': 'left 0.4s ease',
                        '-moz-transition': 'left 0.4s ease',
                        '-o-transition': 'left 0.4s ease',
                        '-khtml-transition': 'left 0.4s ease',
                        'transition': 'left 0.4s ease'
                    });
                    $('#vobox-overlay').css({
                        '-webkit-transition': 'opacity 1s ease',
                        '-moz-transition': 'opacity 1s ease',
                        '-o-transition': 'opacity 1s ease',
                        '-khtml-transition': 'opacity 1s ease',
                        'transition': 'opacity 1s ease'
                    });
                    $('#vobox-action, #vobox-caption').css({
                        '-webkit-transition': '0.5s',
                        '-moz-transition': '0.5s',
                        '-o-transition': '0.5s',
                        '-khtml-transition': '0.5s',
                        'transition': '0.5s'
                    });
                    
                    $("#userUi").disabletoggle(true);
                }


//                if (supportSVG) {
//                    var bg = $('#vobox-close').css('background-image');
//                    bg = bg.replace('png', 'svg');
//                    $('#vobox-action #vobox-prev,#vobox-action #vobox-next, #vobox-close').css({
//                        'background-image': bg
//                    });
//                }

                $.each(elements, function() {
                    $('#vobox-slider').append('<div class="slide"></div>');
                });

                $this.setDim();
                $this.actions();
                $this.keyboard();
                $this.gesture();
                $this.animBars();
                $this.resize();
                
                //set total index
                $("#vobox-count").find("span.total").text(elements.length)

            },
            setDim: function() {

                var width, height, sliderCss = {};

                if ("onorientationchange" in window) {

                    window.addEventListener("orientationchange", function() {
                        if (window.orientation == 0) {
                            width = winWidth;
                            height = winHeight;
                        } else if (window.orientation == 90 || window.orientation == -90) {
                            width = winHeight;
                            height = winWidth;
                        }
                    }, false);


                } else {

                    width = window.innerWidth ? window.innerWidth : $(window).width();
                    height = window.innerHeight ? window.innerHeight : $(window).height();
                }

                sliderCss = {
                    width: width,
                    height: height
                }


                $('#vobox-overlay').css(sliderCss);

            },
            resize: function() {
                var $this = this;

//                $(window).resize(function() {
//                    $this.setDim();
//                }).resize();
            },
            supportTransition: function() {
                var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition'.split(' ');
                for (var i = 0; i < prefixes.length; i++) {
                    if (document.createElement('div').style[prefixes[i]] !== undefined) {
                        return prefixes[i];
                    }
                }
                return false;
            },
            doCssTrans: function() {
                if (plugin.settings.useCSS && this.supportTransition()) {
                    return true;
                }
            },
            gesture: function() {
                if (isTouch) {
                    var $this = this,
                            distance = null,
                            swipMinDistance = 10,
                            startCoords = {},
                            endCoords = {};
                    var bars = $('#vobox-caption, #vobox-action');

                    bars.addClass('visible-bars');
                    $this.setTimeout();

                    $('body').bind('touchstart.vobox', function(e) {

                        $(this).addClass('touching');

                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;

                        $('.touching').bind('touchmove.vobox', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            endCoords = e.originalEvent.targetTouches[0];

                        });

                        return false;

                    }).bind('touchend.vobox', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (isModal())
                            return;

                        distance = endCoords.pageX - startCoords.pageX;

                        if (distance >= swipMinDistance) {

                            // swipeLeft
                            $this.getPrev();
                            $this.showBars();
                            $this.setTimeout();
                        } else if (distance <= -swipMinDistance) {

                            // swipeRight
                            $this.getNext();
                            $this.showBars();
                            $this.setTimeout();

                        } else {
                            // tap
                            if (!bars.hasClass('visible-bars')) {
                                $this.showBars();
                                $this.setTimeout();
                            } else {
                                $this.clearTimeout();
                                $this.hideBars();
                            }

                        }

                        $("body").on("click", "#vobox-overlay", function() {
                            $("body").trigger("touchend.vobox");
                        });

                        $('.touching').unbind('touchmove.vobox').removeClass('touching');

                    });

                }
            },
            setTimeout: function() {
                if (plugin.settings.hideBarsDelay > 0) {
                    var $this = this;
                    $this.clearTimeout();
                    $this.timeout = window.setTimeout(function() {
                        $this.hideBars()
                    },
                            plugin.settings.hideBarsDelay
                            );
                }
            },
            clearTimeout: function() {
                window.clearTimeout(this.timeout);
                this.timeout = null;
            },
            showBars: function() {
                var bars = $('#vobox-caption, #vobox-action');
                if (this.doCssTrans()) {
                    bars.addClass('visible-bars');
                } else {
                    $('#vobox-caption').animate({top: 0}, 500);
                    $('#vobox-action').animate({bottom: 0}, 500);
                    setTimeout(function() {
                        bars.addClass('visible-bars');
                    }, 1000);
                }
            },
            hideBars: function() {
                var bars = $('#vobox-caption, #vobox-action');
                if (this.doCssTrans()) {
                    bars.removeClass('visible-bars');
                } else {
                    $('#vobox-caption').animate({top: '-50px'}, 500);
                    $('#vobox-action').animate({bottom: '-50px'}, 500);
                    setTimeout(function() {
                        bars.removeClass('visible-bars');
                    }, 1000);
                }
            },
            animBars: function() {
                var $this = this;
                var bars = $('#vobox-caption, #vobox-action');

                bars.addClass('visible-bars');
                $this.setTimeout();

                $('#vobox-slider').click(function(e) {
                    if (!bars.hasClass('visible-bars')) {
                        $this.showBars();
                        $this.setTimeout();
                    }
                });

                $('#vobox-caption').hover(function() {
                    $this.showBars();
                    bars.addClass('force-visible-bars visible-bars');
                    $this.clearTimeout();

                }, function() {
                    bars.removeClass('force-visible-bars visible-bars');
                    $this.setTimeout();

                });
            },
            keyboard: function() {
                var $this = this;
                $(window).bind('keyup', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.keyCode == 37) {
                        $this.getPrev();
                    }
                    else if (e.keyCode == 39) {
                        $this.getNext();
                    }
                    else if (e.keyCode == 27) {
                        $this.closeSlide();
                    }
                });
            },
            actions: function() {
                var $this = this;

                if (elements.length < 2) {
                    $('#vobox-prev, #vobox-next').hide();
                } else {
                    $('#vobox-prev').bind('click touchend', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $this.getPrev();
                        $this.setTimeout();
                    });

                    $('#vobox-next').bind('click touchend', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $this.getNext();
                        $this.setTimeout();
                    });
                }
                
                $('#vobox-download').bind('click touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var cindex = $("#vobox-slider").data("current");
                    var $trigger = $($elem[cindex]);
                    
                    if(typeof downloadSingleItem === 'function'){
                        downloadSingleItem($trigger.closest("li"),false);
                    }else{
                        var downloadLink = CLO_URL+'/?octet=download&file='+$trigger.data("t")+'&store='+$trigger.data("store");
                        
                        $.fileDownload(downloadLink);
                    }
                    return false;
                    
                });
                
                if(typeof itemActions === 'function'){
                    
                    $('#vobox-email').bind('click touchend', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var cindex = $("#vobox-slider").data("current");
                        var $trigger = $($elem[cindex]);

                        itemActions("email", $trigger.closest("li"));

                        return false;
                    });
                
                }else{
                     this.addEmailPop();              
                }
                
                if(typeof itemActions === 'function'){
                    
                $('#vobox-share').bind('click touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var cindex = $("#vobox-slider").data("current")
                    itemActions("shareItem", $($elem[cindex]).closest("li"));
                    return false;
                    
                });
                
                }else{
                     this.sharePop();              
                    
                }
                

                $('#vobox-close').bind('click touchend', function(e) {
                    //store media currentTime
                    var cel = $('#vobox-slider .slide.current'),
                    index = $('#vobox-slider .slide').index(cel),
                    etype = elements[index].type;
                    if( (etype == 'video' || etype == 'audio') && mediaHasPlayed){
                        mel = cel.find(etype);
                        $elem.eq(index).closest(".preview").data("currentTime", mel[0].player.getCurrentTime());
                        //mel[0].player.pause();
                    }
                
                    e.preventDefault();
                    e.stopPropagation();
                    $this.closeSlide();               
                });
            },
            setSlide: function(index, isFirst) {
                isFirst = isFirst || false;

                var slider = $('#vobox-slider');

                if (this.doCssTrans()) {
                    slider.css({left: (-index * 100) + '%'});
                } else {
                    slider.animate({left: (-index * 100) + '%'});
                }

                slider.find('.slide').data("index", index).removeClass('current');
                slider.find('.slide').eq(index).addClass('current')
                this.setTitle(index);
                
                $("#vobox-count").find("span.current").text(index+1);

                if (isFirst) {
                    slider.fadeIn();
                }

                $('#vobox-prev, #vobox-next').removeClass('disabled');
                if (index == 0) {
                    hideTip($('#vobox-prev')[0])
                    $('#vobox-prev').addClass('disabled');
                    
                } else if (index == elements.length - 1) {
                    hideTip($('#vobox-next')[0])
                    $('#vobox-next').addClass('disabled');
                }
                slider.data("current", index);
                
            },
            openSlide: function(index) {
                $('html').addClass('vobox');
                //$(window).trigger('resize'); // fix scroll bar visibility on desktop
                this.setSlide(index, true);
            },
            preloadMedia: function(index) {
                var $this = this, src = null, type;
                
                if (elements[index] !== undefined && elements[index].type != 'video' && elements[index].type != 'audio') {
                    src = elements[index].href;
                }
                
                $this.openMedia(index);

            },
            openMedia: function(index) {
                var $this = this, src = null, type = null;

                if (elements[index] !== undefined) {
                    src = elements[index].href;
                    type = elements[index].type;
                }

                if (index < 0 || index >= elements.length) {
                    return false;
                }
                
                switch (type) {
                    case 'audio':
                        $this.loadMedia(type, src, index);
                        break;
                    case 'video':
                        $this.loadMedia(type, src, index);
                        break;
                    case 'document':
                    case 'other':
                        $this.loadDocument(type, src, index);
                        break;                        
                    default:
                        $('#vobox-slider .slide').eq(index).html(this).prepend('<div class="indicator"><span></span><span></span><span></span></div>');
                        $this.loadImage(type, src, index);
                        break;
                }
                
                $this.showBars();
                $this.setTimeout();
            },
            setTitle: function(index, isFirst) {
                var $this = this,
                        title = null,
                        $tobj = $("#vobox-title"),
                        type = elements[index].type;

                $tobj.find("b").empty();
                
                if (elements[index] !== undefined) {
                    $item = $elem.eq(index);
                    id = $item.data("id")//$parent.find('input[type="checkbox"]:first').attr("id");
                    $this.setShare(index, isFirst, id, title);
                    $this.setOptions(index, isFirst);
                }

                $tobj.find("b").text(elements[index].title);
                $tobj.find("span").attr("class", "icon").addClass(iconTypes[type]+' '+filterTypes[type]);
                
                if(elements[index].data.description)
                $("#vobox-description").show().find(".current").text(elements[index].data.description);
                else
                    $("#vobox-description").hide();
                
            },
            setShare: function(index, isFirst, id, title) {
                var sharebtn = null;

//                $('#vobox-caption').find("div.actions").empty();
//                var $btn = $('<a href="javascript:;" data-title="Share <span>' + title + '</span>" class="btn ajax" data-action="fi_share" data-item="' + id + '" data-ajax="loadShareBox"><i class="icon-white icon-share"></i><span> Share</span></a>');
//
//
//                $('#vobox-caption').find("div.actions").append($btn);
            },
            setOptions: function(index, isFirst) {
                var sharebtn = null;

                $('#vobox-options').empty();
                var $el = $elem.eq(index);
                file = $el.data("file");
                var $downBtn = $('<a href="javascript:;" data-title="" class="btn" data-action="fi_download" data-file="' + file + '" data-item="" data-ajax="loadShareBox"><i class="icon-white icon-cloud-download"></i><span> Download</span></a>'),
                        $pauseBtn = $('<a href="javascript:;" class="btn"><i class="icon-pause"></i><a>');
                
                $('#vobox-caption').find("div.actions").append($downBtn);
                if ($("body").data("playing")) {
                    $('#vobox-caption').find("div.actions").prepend($pauseBtn);
                }
            },
            isVideo: function(type) {

                if (type) {
                    if (type == 'video') {
                        return true;
                    }
                    return false;
                }

            },
            isDoc: function(src) { // feature

                if (type) {
                    if (type == 'document') {
                        return true;
                    }
                    return false;
                }

            },
            callMediaPlayer: function($item, index, type) {
                $item.find(type)
                        .mediaelementplayer({
                            defaultVideoWidth: ((isMob() || isTablet()) ? DevWidth - 50 : '480'),
                            defaultVideoHeight: ((isMob() || isTablet()) ? DevHeight - 140 : 270),
                            videoWidth: -1,
                            videoHeight: -1,
                            audioWidth: ((isMob() || isTablet()) ? DevWidth - 50 : '480'),
                            audioHeight: 30,
                            startVolume: 0.8,
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
                            success: function(media) {
                                
                                media.addEventListener('ended', function() {
                                    this.player.exitFullScreen();
                                }, true);                                
                                
                                media.addEventListener('play', function() {
                                    elements[index].playing = true;
                                    currPlay = {'index': index, 'type': type};
                                    mediaHasPlayed = true;
                                }, true);

                                media.addEventListener('pause', function() {
                                    elements[index].playing = false;
                                    currPlay = {'index': null, 'type': null};
                                    videoHasPlayed = false;
                                }, true);
                                
                                //auto play if currentTime exist in data
                                if(elements[index].data.currentTime){
                                    
                                    var savedPosition = elements[index].data.currentTime,
                                            videoHasPlayed = false,
                                            playState = elements[index].data.playState;
                                    
                                    media.addEventListener('loadedmetadata', function(e) {
                                        if (!videoHasPlayed && savedPosition > 0) {

                                            //Set the start time from the relation in seconds
                                            media.setCurrentTime(savedPosition);
                                                                                        
                                            if(playState === true){
                                                setTimeout(function(){
                                                    media.play();
                                                },17)
                                                
                                            }

                                            //Set the video has played flag - so if paused and played it is not reset to start time
                                            videoHasPlayed = true;
                                        }
                                        
                                    }, false);                                    
                                    
                                    
                                }
                                
                                

                            },
                            error: function() {
                                console.log("player cannot initialized! check your server configuration.");
                            }
                        });

                if ($item.find(".download").length > 0) {
                    $item.find(".download").prepend($('<div style="position: absolute; bottom: 10px; left: 0; right: 0; font-size: 10px; color: white; text-align: center">Your browser does not support to play this kind of media.</div>'));
                    $item.find(".download").find("a").on('click touchend', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return createTempIframe('?octet&file=' + $elem.eq(index).data("file"));
                        return false;
                    }).attr("href", '#').prepend('<i class="icon-white icon-cloud-download icon-3x" /> ');
                }

                return true;
            },
            
            loadMedia: function(type, src, index) {
                var callMed = false,
                        $item = $('#vobox-slider .slide').eq(index);

                if (!elements[index].loaded) {
                    var $media = $((type == 'video' ? '<video width="' + (DevWidth * 0.8) + '" height="' + (DevHeight - 120) + '" id="player_' + index + '" src="' + src + '" preload="false">' : '<audio id="player" src="' + src + '" preload="false">') + '<object width="566" height="320" type="application/x-shockwave-flash" data="' + ASSURI + 'player/player.swf">' +
                            '<param name="movie" value="' + ASSURI + 'player/player.swf" />' +
                            '<param name="flashvars" value="controls=true&file=' + src + '" /></object>' +
                            (type == 'video' ? '</video>' : '</audio>')
                            );

                    $item.append($media);
                                            
                    
                    var callMed = this.callMediaPlayer($item, index, type);
                    if (callMed) {
                        this.removeInd(index);
                        elements[index].loaded = true;
                    }
                } else {
                    return elements[index];
                }                
                
                return true;
            },
            loadImage: function(type, src, index) {
                var $this = this;

                if (type == 'image') {
                    
                    if (!elements[index].loaded) {
                        
                        var img = $('<img>').on('load', function() {
                            $('#vobox-slider .slide').eq(index).html(this).prepend('<span class="om"></span>');
                        });
                
                        img.attr('src', src).on('load', function() {
                            $this.removeInd(index);
                            elements[index].loaded = true;
                            if(!isMob() && !isTablet())
                                $('#vobox-slider .slide').eq(index).find('.om').css({"width": img.width(), "height": $(window).height()})
                        });
                    } else {
                        return elements[index];
                    }
                }
            },
            loadDocument: function (type, src, index) {

                if (!elements[index].loaded) {
                    var $this = this,
                            eid = 'if_' + type + '_' + index,
                            h = $('#vobox-slider .slide').eq(index).height() - 70,
                            w = $('#vobox-slider .slide').eq(index).width() / 2 * 1.2,
                            ec = 'col-xs-12 col-md-8  col-lg-8',
                            iframe = $('<div class="' + ec + ' viewer_frame">\n\
                                        <div class="indicator"><span></span><span></span><span></span></div>\n\
                                        <iframe id="' + eid + '" src="' + src + '" />\n\
                                        </div>');
                    
                    var scss = {
                        height: h,
                        "margin-top": 0,
                        "overflow": "hidden",
                        "overflow-y": "auto",
                        "border": "none",
                        "line-height": "1.4",
                    }
                    
                    iframe.find("iframe").attr("src", src).css(scss).load(function () {
                        var that = $(this);
                        elements[index].loaded = true;
                        setTimeout(function(){
                            iframe.find(".indicator").remove().detach();
                        },750)
                    });                    
                    
                    $('#vobox-slider .slide').eq(index).html(iframe);

                } else {
                    return elements[index];
                }
            },            
            stopMedia: function() {
                if (currPlay.index !== null) {
                    var $medObj = $('#vobox-slider .slide').eq(currPlay.index).find(currPlay.type),
                            medSrc = $medObj.prop("src");
                    $medObj[0].player.pause();
                }
                currPlay = {'index': null, 'type': null};
                return true;
            },
            getNext: function() {
                var that = this,
                index = $('#vobox-slider .slide').index($('#vobox-slider .slide.current'));
                if (that.stopMedia()) {
                    if (index + 1 < elements.length) {
                        index++;
                        that.setSlide(index);
                        setTimeout(function() {
                            that.preloadMedia(index + 1);
                        },500)
                    }
                    else {

                        $('#vobox-slider').addClass('rightSpring');
                        setTimeout(function() {
                            $('#vobox-slider').removeClass('rightSpring');
                        }, 500);
                    }
                }
                
                $("#vobox-email").closest("li").popover('destroy');
                $("#vobox-share").closest("li").popover('destroy')
                this.addEmailPop();
                this.sharePop();

            },
            getPrev: function() {
                var that = this,
                index = $('#vobox-slider .slide').index($('#vobox-slider .slide.current'));
                
                if (this.stopMedia()) {
                    if (index > 0) {
                        index--;
                        this.setSlide(index);
                        setTimeout(function() {
                            that.preloadMedia(index - 1);
                        },500);
                        
                    }
                    else {

                        $('#vobox-slider').addClass('leftSpring');
                        setTimeout(function() {
                            $('#vobox-slider').removeClass('leftSpring');
                        }, 500);
                    }
                }
                
                $("#vobox-email").closest("li").popover('destroy')
                $("#vobox-share").closest("li").popover('destroy')
                this.addEmailPop();
                this.sharePop();
            },
            closeSlide: function() {
                $('html').removeClass('vobox');
                //$(window).trigger('resize');
                this.destroy();
                setTimeout(function(){
                    $("#userUi").disabletoggle(false);
                },600);

            },
            removeInd: function(index) {
                $('#vobox-slider .slide').eq(index).css("background-image", "none");
            },
            destroy: function() {
                if (mediaHasPlayed) {
                    var $medObj = $('#vobox-slider').find("video,audio");
                    $medObj.each(function(){
                        var medSrc = $medObj.prop("src");
                        this.player.setSrc(medSrc);
                    });
                }                
                $(window).unbind('keyup');
                $('body').unbind('touchstart.vobox');
                $('body').unbind('touchmove.vobox');
                $('body').unbind('touchend.vobox');
                $('#vobox-slider').unbind();
                $('#vobox-overlay').remove();
                if (!$.isArray(elem)) {
                    elem.removeData('_vobox');
                }
                if (this.target)
                    this.target.trigger('vobox-destroy');
                $.vobox.isOpen = false;
                if (plugin.settings.afterClose)
                    plugin.settings.afterClose();
            },
            
            sharePop: function(){
                setTimeout(function(){                    
                    var cindex = $("#vobox-slider").data("current"),
                        $trigger = $($elem[cindex]),
                        title = '<i class="icon icon-share-alt"></i> Share <small class="ul">'+$trigger.data("t")+'</small>',
                        html = '<div id="share_box"><div class="sharebox"></div></div>';
                        
                    
                    $('#vobox-share').closest("li").popover({
                        html: true,
                        content: html,
                        placement: 'bottom',
                        title: title
                    }).on("shown.bs.popover", function(){
                        
                        var $this = $(this);
                        
                        var $popcontent = $this.closest("ul").find(".popover-content");
                        
                        $.ajaxQueue({
                            url: '/',
                            type: 'POST',
                            data: {
                                shareViaShare: true,
                                value: $trigger.data("id"),
                                uid: $trigger.closest("ul.share").data("uid")
                            },
                            dataType: 'json',
                            beforeSend: function() {
                                $popcontent.spin()
                            },
                            success: function(response) {
                                $popcontent.spin(false);
                                
                                $popcontent.find(".sharebox").html(response.html);
                                
                                //$form.find("#share_short_url").val(response.link).select();
                                $popcontent.find(".sharebox").share({
                                    networks: response.shareOpts,
                                    link: response.link,
                                    url: response.url,
                                    title: response.title,
                                    desc: response.description,
                                    excpt: ['email'],
                                    theme: "default"
                                });         
                            }
                        });                       
                    });
                },11);
                
                $("#vobox-caption").find("li").off("click").on('click', function (e) {
                    $("#vobox-caption").find("li").not(this).popover('hide');
                });
            },
            
            addEmailPop : function(){
                
                setTimeout(function(){
                    var cindex = $("#vobox-slider").data("current");
                    var $trigger = $($elem[cindex]),
                    $target = $('#vobox-email').closest("li");    
                    
                    createEmailPop($trigger, $target);
                    
                },11);
                
                $("#vobox-caption").find("li").off("click").on('click', function (e) {
                    $("#vobox-caption").find("li").not(this).popover('hide');
                });                
            }

        };

        plugin.init();

    };

    $.fn.vobox = function(options) {
        if (!$.data(this, "_vobox")) {
            var vobox = new $.vobox(this, options);
            this.data('_vobox', vobox);
        }
        return this.data('_vobox');
    }

}(window, document, jQuery));