;
(function($, window, undefined) {

    var document = window.document;

    $.fn.share = function(method) {

        var methods = {
            init: function(options) {
                this.share.settings = $.extend({}, this.share.defaults, options);
                var settings = this.share.settings,
                        networks = this.share.settings.networks,
                        cls = this.share.settings.cls == 'none' ? '' : 'btn'
                theme = this.share.settings.theme || 'normal',
                        margin = this.share.settings.margin,
                        pageTitle = this.share.settings.title || $(document).attr('title'),
                        pageLink = this.share.settings.link || $(location).attr('href'),
                        pageUrl = this.share.settings.url || $(location).attr('href'),
                        pageDesc = this.share.settings.desc || $(document).find('meta[name="description"]').eq(0).attr("content"),
                        exceptit = [],
                        excpt = this.share.settings.excpt || [],
                        callbacks = this.share.settings.callbacks;
                

                // each instance of this plugin
                return this.each(function(index) {
                    var $element = $(this),
                            id = $element.attr("id"),
                            l = encodeURIComponent(pageLink),
                            u = encodeURIComponent(pageUrl),
                            t = encodeURIComponent(pageTitle),
                            d = pageDesc.substring(0, 250),
                            href,
                            cou = 0;

                    // append HTML for each network button
                    for (var item in networks) {
                        
                        item = networks[item];
                        
                        if($.inArray(item, excpt) > -1) continue;
                        
                        cou++;
                        
                        href = helpers.networkDefs[item].url;
                        var pop = (href != 'mailto:?subject=|t|') ? " pop" : "";
                        var title = (href === 'mailto:?subject=|t|') ? "Send via " + item : "Share on " + item;
                        var icon = (href === 'mailto:?subject=|t|') ? 'envelope-alt' : (item == 'googleplus' ? 'google-plus' : item)
                        href = href.replace('|l|', l).replace('|u|', u).replace('|d|', t)
                                .replace('|140|', t.substring(0, 130));
                        if(href === 'mailto:?subject=|t|'){
                            href = 'javascript:;';
                        }
                        

                        var linkel = $('<a href="' + href + '" title="' + title + '" class="' + cls + ' social ' + pop + ' ' + item + '" data-name="'+item+'"></a>');
                        
                        if(item in callbacks){
                            
                            var callback = callbacks[item];
                            
                            linkel.on("click", function(){
                               var $this = $(this);
                               jQuery.globalEval(callback);
                           });
                           
                        }else{
                        
                        if(item == 'email'){
                            linkel.on("click", function(){
                               var $this = $(this);
                               
                               if($("body").hasClass("modal-open")){
                                   
                                   $(".modal").modal("hide");
                                   
                               }else{  
                                   var $par = $this.closest("li");
                                   $par.find(".sharebox").find(".close").trigger("click");
                                   $list.find("li.selected").not(this).each(function() {
                                       var $that = $(this);
                                       selectItem($that.find("input[type=checkbox]:not(:disabled)"), true);
                                       $that.find("input[type=checkbox]:not(:disabled)").prop("checked", false).trigger("change");
                                   });           
                                   selectItem($par, false);
                               }
                               
                                    setTimeout(function(){
                                        itemActions("email", $list.find("li.selected"), false);
                                    },200)
                               
                               
                            });
                        }
                        
                        //use facebook ui if fb login is already defined and there is an APP ID
                        if(item == 'facebook' && (typeof(FB) != 'undefined' && FB != null ) ){
                            
                            exceptit.push("facebook");
                            
                            itemhref = linkel.attr("href");
                                linkel.attr("href", "javascript:;")
                            
                            linkel.on('click', function(e) {
                                e.preventDefault();
                                FB.ui({
                                    method: 'share',
                                    href: decodeURIComponent(u),
                                    picture: '',
                                    title: ''
                                }, function(response){});
                                return false;
                            });
                            
                        }
                        
                        }
                                
                        linkel.appendTo($element);                        
                    }

                    if (theme == 'circle') {

                        var a = 60;
                        var e = 212;
                        var t = 30;
                        var r = $element.find("a.btn").length;
                        var i = e + (r - 1) * t;
                        var s = 0;
                    var o = parseInt($element.width());
                    var f = parseInt($element.height());
                    var pos = $element.find("div.shareme").position();
                    var l = $element.find("div.shareme").width()-pos.left;
                    var c = $element.find("div.shareme").height()-pos.top;
                    var h = (o) / 2;
                    var p = (f) / 2;
                        
                        var d = 60,
                            v = 180,
                            m = v / r,
                            g = d + m / 2;
                        $element.find("a.btn").each(function() {
                            var n = g / 90 * Math.PI,
                                wt = 48,
                                ht = 48,
                                r = h-(wt/2) + a * Math.cos(n),
                                i = p-(ht/2) + a * Math.sin(n),
                                vx = h-(wt/2),
                                vy = p-(ht/2);
                            
                            $(this).css({
                                display: "block",
                                left: h-(wt/2),
                                top: p-(ht/2)
                            }).transition({
                                    x: r-vx,
                                    y: i-vy,
                                    easing: 'snap',
                                    duration: 100,
                                    delay: (t * s)
                                }, e);                            
                            
                            g += m;
                            s++
                        });
                        $element.find("div.shareme").on('click', function() {
                            var r = $element.find("a.btn").length;
                            var v = 180;
                            var m = v / r;
                            var g = d + m / 2;
                            $element.find("a.btn").each(function(index) {
                                var $this = $(this);
                                var pos = (index < r - 1) ? $this.next('a.btn').position() : $element.find("a.btn").eq(0).position();
                                $this.stop().animate({
                                    left: pos.left + "px",
                                    top: pos.top + "px"
                                }, 100);
                            });
                        });

                    } else {
                        //regular sharer
                        var $par = $element.find("div.shareme").html("").parent(),
                            pw = $par.innerWidth(),
                            pwd = Math.ceil(pw/cou);
                            
                        $par.addClass("linear");
                        
                        var x = 0,
                            w = 48,
                            h = 48;
                        
                        $element.find("a.btn").each(function() {
                            
                            $(this).transition({ x: x });
                            x += pwd;
                        });
                        if(!$("html").hasClass("vobox")){
                            $(window).resize()
                        }
                    }


                    // customize css
                    $("#" + id + ".share-" + theme).css('margin', margin);

                    // bind click
                    $('.pop').click(function() {
                        var $this = $(this);
                        
                        if($.inArray($this.data("name"), exceptit) > -1) return;
                        
                        window.open($this.attr('href'), 't', 'toolbar=0,resizable=1,status=0,width=640,height=528');
                        return false;
                    });

                });

            }
        }

        var helpers = {
            networkDefs: {
                facebook: {url: 'http://www.facebook.com/share.php?u=|l|'},
                twitter: {url: 'https://twitter.com/share?url=|l|&text=|140|'},
                linkedin: {url: 'http://www.linkedin.com/shareArticle?mini=true&url=|l|&title=|t|&summary=|d|&source=in1.com'},
                in1: {url: 'http://www.in1.com/cast?u=|l|', w: '490', h: '529'},
                tumblr: {url: 'http://www.tumblr.com/share?v=3&u=|l|'},
                digg: {url: 'http://digg.com/submit?url=|l|&title=|t|'},
                googleplus: {url: 'https://plusone.google.com/_/+1/confirm?hl=en&url=|l|'},
                reddit: {url: 'http://reddit.com/submit?url=|l|'},
                pinterest: {url: 'http://pinterest.com/pin/create/button/?url=|l|'},
                posterous: {url: 'http://posterous.com/share?linkto=|l|&title=|t|'},
                stumbleupon: {url: 'http://www.stumbleupon.com/submit?url=|l|&title=|t|'},
                email:{url:'mailto:?subject=|t|'}
            }
        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method "' + method + '" does not exist in social plugin');
        }

    }

    $.fn.share.defaults = {
        networks: ['facebook', 'twitter', 'linkedin'],
        theme: 'icon',
        autoShow: true,
        margin: '3px',
        expct: [],
        callbacks : {}
    }

    $.fn.share.settings = {}

})(jQuery, window);