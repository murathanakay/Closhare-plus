$(document).ready(function() {
    
filterTypes = {"file": "white", "folder": "dark-gray", "image": "violet", "video": "orange", "audio": "blue", "document": "green", "other": "light-orange", "starred" : "yellow"};
iconTypes = {"file": "white", "folder": "icon-folder", "image": "icon-picture-o", "video": "icon-youtube-play", "audio": "icon-music", "document": "icon-file-text", "other": "icon-suitcase"};

indicatorCssSm = '<div class="indicator sm"><span></span><span></span><span></span></div>';
indicatorCssSmBlue = '<div class="indicator sm blue"><span></span><span></span><span></span></div>';
indicatorCssPurple = '<div class="indicator purple"><span></span><span></span><span></span></div>';
    
if ($.fn.bootstrapValidator !== "undefined") {
    $.fn.bootstrapValidator.DEFAULT_OPTIONS = $.extend({}, $.fn.bootstrapValidator.DEFAULT_OPTIONS, {
        container: 'tooltip',
        feedbackIcons: {
            valid: 'icon icon-check-circle',
            invalid: 'icon icon-exclamation-circle',
            validating: 'icon icon-refresh'
        }
    });
}
$(document).bind("dragstart", function(event) {
if (event.target.tagName.toLowerCase() === "a") {
  event.preventDefault();
}
});

$('.poper').click(function() {
    var $this = $(this),
    d = $this.data(),
    width = d.width || 640,
    height = d.height || 528;
    
    window.open($this.attr('href'), 't', 'toolbar=0,resizable=1,status=0,width='+width+',height='+height);
    return false;
});
});
(function($) {
    $indicator = '<img src="' + ASSURI + 'img/loading.gif" />';
})(jQuery);
function urldecode(str){
    
  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function() {
      // PHP tolerates poorly formed escape sequences
      return '%25';
    })
    .replace(/\+/g, '%20'));
}
/**
 * ajaxQueue
 */
(function($) {
    // jQuery on an empty object, we are going to use this as our Queue
    var ajaxQueue = $({});

    $.ajaxQueue = function(ajaxOpts) {
        // hold the original complete function
        var oldComplete = ajaxOpts.complete;

        // queue our ajax request
        ajaxQueue.queue(function(next) {

            // create a complete callback to fire the next event in the queue
            ajaxOpts.complete = function() {
                // fire the original complete if it was there
                if (oldComplete)
                    oldComplete.apply(this, arguments);
                next(); // run the next query in the queue
            };

            // run the query
            return $.ajax(ajaxOpts);
        });
    };
})(jQuery);

(function($) {

    $.fn.findItem = function(id, fclass, w, tag) {

        return this.find( ((tag) ? tag : "li")+"."+ fclass).filter(function() {
            return $(this).data( (w) ? w : "id" ) == id;
        });

    };
})(jQuery);


(function($) {

    $.fn.animateNumber = function(value0, value1, options, callback) {
        
        var that = this,
            defaults = {
                duration: 300
        },opts = defaults;
        
        if(options && defaults && !opts)
            opts = $.extend({},defaults,options);
        
        var s = new countUp(that[0], value0, value1);
        s.start(callback);
    };
    
})(jQuery);

(function($) {
    $.fullscreen = function(exit) {
        var element = this[0];

        if (exit) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozExitFullScreen) {
                document.mozExitFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

        } else {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    };
});
(function($) {
    var fooXHR = null;

    $.ajaxSingle = function(ajaxOpts) {
        // hold the original complete function
        var oldComplete = ajaxOpts.complete;

            // create a complete callback to fire the next event in the queue
            ajaxOpts.complete = function() {
                // fire the original complete if it was there
                if (oldComplete)
                    oldComplete.apply(this, arguments);

            };
            if(fooXHR != null){
                fooXHR.abort();
            }
            // run the query
           fooXHR = $.ajax(ajaxOpts);
    };

})(jQuery);

(function($) {
    $.fn.disabletoggle = function(disable) {
        if(disable)
        this.attr('disabled', 'disabled').addClass('disabled');
        else
        this.attr('disabled', false).removeClass('disabled');
    };

})(jQuery);



(function($) {
   
$.fn.cssGet = function (propertyArray) {

    //create an output variable and limit this function to finding info for only the first element passed into the function
    var output = {},
        self   = this.eq(0);

    //iterate through the properties passed into the function and add them to the output variable
    for (var i = 0, len = propertyArray.length; i < len; i++) {
        output[propertyArray[i]] = this.css(propertyArray[i]);
    }
    return output;
};


$.fn.countdown = function (duration, message, callback, reverse) {
    message = message || "";
    var tml = (reverse ? (duration+' '+message) : (message +' '+ duration)),
            container = $(this[0]).html(tml);
    container.parent().show()
    var countdown = setInterval(function () {
        // If seconds remain
        if (--duration) {
            tml = (reverse ? (duration+' '+message) : (message +' '+ duration))
            container.html(tml);
        // Otherwise
        } else {
            clearInterval(countdown);
            callback.call(container);   
        }
    // Run interval every 1000ms (1 second)
    }, 1000);

};
})(jQuery);

(function($)
{
   $.fn.htmlA = function(html, speed, callback)
   {
      return this.each(function()
      {
         var el = $(this);
         var finish = {width: this.style.width, height: this.style.height};
         var cur = {width: el.width()+'px', height: el.height()+'px'};
         el.html(html);
         var next = {width: el.width()+'px', height: el.height()+'px'};

         el.css(cur)
            .animate(next, speed, function(){
               el.css(finish);
               if ( $.isFunction(callback) ) callback();
            });
      });
   };


})(jQuery);

(function($) {
    $.fn.hidDims = function(boolOuter) {
        var $item = this;
        var props = {position: "absolute", visibility: "hidden", display: "block"};
        var dim = {"w": 0, "h": 0};
        var $hiddenParents = $item.parents().andSelf().not(":visible");

        var oldProps = [];
        $hiddenParents.each(function() {
            var old = {};
            for (var name in props) {
                old[ name ] = this.style[ name ];
                this.style[ name ] = props[ name ];
            }
            oldProps.push(old);
        });

        dim.w = (boolOuter === true) ? $item.outerWidth() : $item.width();
        dim.h = (boolOuter === true) ? $item.outerHeight() : $item.height();

        $hiddenParents.each(function(i) {
            var old = oldProps[i];
            for (var name in props) {
                this.style[ name ] = old[ name ];
            }
        });
//$.log(”w: ” + dim.w + ”, h:” + dim.h)
        return dim;
    }
}(jQuery));
//popover autoplacement
function popoverautoplacement(tip, element, verticalonly) {
    var offset = $(element).offset(),
            height = $(document).outerHeight(),
            width = $(document).outerWidth(),
            vert = 0.5 * height - offset.top,
            vertPlacement = vert > 0 ? 'bottom' : 'top',
            horiz = 0.5 * width - offset.left,
            horizPlacement = horiz > 0 ? 'right' : 'left',
            placement = (Math.abs(horiz)*0.8) > Math.abs(vert) ? horizPlacement : vertPlacement;

    return verticalonly ? vertPlacement : placement;
}
function createTextInput(name, id, value, placeholder, type, cls, required, disabled, readonly ,xtra) {
    var voph = (value) ? (' value="' + value + '"') : (' placeholder="' + placeholder + '"'),
            req = ((required) ? (' required') : ''),
            dcls = ((type == 'checkbox') ? '' : ('form-control ' + (cls ? cls : 'col-md-12'))),
            extra = xtra || '';
    if (type == 'hidden' && !value) {
        voph = ' value="0"';
    }
    if (type == 'textarea') {
        return '<textarea name="' + name + '" class="form-control ' + (cls ? cls : 'col-md-12') + '"  ' + (id ? ' id="' + id + '"' : '') + voph + req + '>' + value + '</textarea>';
    }
    return '<input type="' + (type ? type : 'text') + '" name="' + name + '" class="' + dcls + '"  ' + (id ? ' id="' + id + '"' : '') + voph + (disabled ? ' disabled="disabled"' : '') +(readonly ? ' readonly' : '')+extra+req+'>';

}
function createConnectFBBox(remove){
    
    var $target = $("body");
    if(remove){
        $target.unblock();
        return;
    }
    $target.block({message: '<h2 class="blue">'+$indicator+' Connecting with facebook...</h2>'}); 
        
}
function fileExtension(filename){
    
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : 'other';    
}
function hideTip(item) {
    $(item).tooltip('hide');
}
function createEmailPop($trigger, $target) {

    var title = '<i class="icon icon-envelope"></i> Send <small class="ul">' + $trigger.data("t") + '</small> via email';
    //popover send email box 
    var html = '<div class="p1015">';

    html += '<div class="callout callout-danger mt0 mb0 alert-dismissible result dn" role="alert">\
                            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\n\
                            <div class="errmessage"></div>\n\
                            </div>'

    html += '<form role="form" method="POST" action="" data-target="" data-async="" class="actform" id="form_email" novalidate="novalidate">';

    html += '<div class="form-group emailsuggestContainer">\n\
                             <label for="recipient">To <small>(seperate email addresses by comma ",")</small></label>\n'
            + createTextInput('recipient', 'recipient', false, "john@example.com", "email", "emailsuggestion", true)
            + '\
                             </div>\n\
                             <div class="form-group">\n\
                             <label for="sender">Sender email</label>\n'
            + createTextInput('sender', 'sender', false, "sender email (optional)", "email", false, false, false, false, ' data-container="#form_email"') + '\
                             </div>\n\
                             <div class="form-group">\n\
                             <label for="message">Aditional Message</label>\n'
            + createTextInput('message', 'message', "", 'Enter aditional message (optional)', 'textarea', 'editor') + '\n\
                             </div>';
    html += '<div class="form-group mb0 taright">\n\
                             <button class="btn btn-primary-alt"  data-loading-text="Sending..." autocomplete="off">Send!</button>\n\
                            </div>';
    html += createTextInput('value', 'value_sendemail', $trigger.data("id"), '', 'hidden', '');
    html += '</form>';
    html += '</div>';

    $target.popover({
        html: true,
        content: html,
        placement: 'bottom',
        title: title
    }).on("shown.bs.popover", function () {
        var $form = $(this).closest("ul").find("form"),
                $parent = $form.closest("div");

        $form.bootstrapValidator()
                .on('success.field.bv', function (e, data) {
                    var $parent = data.element.parents('.form-group');
                    $parent.removeClass('has-success');
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('success.form.bv', function (e, data) {
                    e.preventDefault();
                    $form.ajaxSubmit({
                        url: AJAX_PATH,
                        type: 'post',
                        dataType: 'json',
                        data: {
                            shareViaEmail: true,
                            uid: $("ul.share").data("uid")
                        },
                        beforeSubmit: function (formData, jqForm, options) {
                            $form.find("button").button("loading")

                        },
                        success: function (response, statusText, xhr, $form) {
                            setTimeout(function () {
                                if (response.result == 1) {
                                    //email was sent
                                    var $res = $parent.find(".result")
                                    $res.find("button").remove();
                                    $res.removeClass("callout-danger dn").addClass("callout-success").find(".errmessage").html(response.message);

                                    $form.htmlA("");
                                } else {
                                    //error occured
                                    $parent.find(".result").removeClass("dn").find(".errmessage").htmlA(response.message);
                                }
                            }, 400);

                            $form.find("button").button('reset');
                        }

                    });
                    return false;
                });

    });
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{factory(jQuery)}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s)}function decode(s){return config.raw?s:decodeURIComponent(s)}function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{s=decodeURIComponent(s.replace(pluses," "));return config.json?JSON.parse(s):s}catch(e){}}function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value}var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date();t.setTime(+t+days*86400000)}return(document.cookie=[encode(key),"=",stringifyCookieValue(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join(""))}var result=key?undefined:{};var cookies=document.cookie?document.cookie.split("; "):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");var name=decode(parts.shift());var cookie=parts.join("=");if(key&&key===name){result=read(cookie,value);break}if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie}}return result};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined){return false}$.cookie(key,"",$.extend({},options,{expires:-1}));return !$.cookie(key)}}));
/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/about/license/
 */
(function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I:{},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=navigator.userAgent.match(/msie/i),g=document.documentMode,h=f&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);
/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

/**
* jQuery Form Plugin; v20130711
* http://jquery.malsup.com/form/
* Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
* https://github.com/malsup/form#copyright-and-license
*/
;(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(this).ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=this;if(i.clk=r,"image"==r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function r(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;o>a;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(a){for(var n=new FormData,i=0;a.length>i;i++)n.append(a[i].name,a[i].value);if(t.extraData){var o=r(t.extraData);for(i=0;o.length>i;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:u||"POST"});t.uploadProgress&&(s.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(100*(a/n))),t.uploadProgress(e,a,n,r)},!1),r}),s.data=null;var l=s.beforeSend;return s.beforeSend=function(e,t){t.data=n,l&&l.call(this,e,t)},e.ajax(s)}function s(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;a("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(D),j&&clearTimeout(j),j=void 0}}var r=f.attr2("target"),i=f.attr2("action");w.setAttribute("target",d),u||w.setAttribute("method","POST"),i!=m.url&&w.setAttribute("action",m.url),m.skipEncodingOverride||u&&!/post/i.test(u)||f.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),m.timeout&&(j=setTimeout(function(){T=!0,s(k)},m.timeout));var o=[];try{if(m.extraData)for(var l in m.extraData)m.extraData.hasOwnProperty(l)&&(e.isPlainObject(m.extraData[l])&&m.extraData[l].hasOwnProperty("name")&&m.extraData[l].hasOwnProperty("value")?o.push(e('<input type="hidden" name="'+m.extraData[l].name+'">').val(m.extraData[l].value).appendTo(w)[0]):o.push(e('<input type="hidden" name="'+l+'">').val(m.extraData[l]).appendTo(w)[0]));m.iframeTarget||(v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1)),setTimeout(t,15);try{w.submit()}catch(c){var p=document.createElement("form").submit;p.apply(w)}}finally{w.setAttribute("action",i),r?w.setAttribute("target",r):f.removeAttr("target"),e(o).remove()}}function s(t){if(!x.aborted&&!F){if(M=n(g),M||(a("cannot access response document"),t=D),t===k&&x)return x.abort("timeout"),S.reject(x,"timeout"),void 0;if(t==D&&x)return x.abort("server abort"),S.reject(x,"error","server abort"),void 0;if(M&&M.location.href!=m.iframeSrc||T){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"==m.dataType||M.XMLDocument||e.isXMLDoc(M);if(a("isXml="+o),!o&&window.opera&&(null===M.body||!M.body.innerHTML)&&--O)return a("requeing onLoad callback, DOM not available"),setTimeout(s,250),void 0;var u=M.body?M.body:M.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=M.XMLDocument?M.XMLDocument:M,o&&(m.dataType="xml"),x.getResponseHeader=function(e){var t={"content-type":m.dataType};return t[e]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var l=(m.dataType||"").toLowerCase(),c=/(json|script|text)/.test(l);if(c||m.textarea){var f=M.getElementsByTagName("textarea")[0];if(f)x.responseText=f.value,x.status=Number(f.getAttribute("status"))||x.status,x.statusText=f.getAttribute("statusText")||x.statusText;else if(c){var d=M.getElementsByTagName("pre")[0],h=M.getElementsByTagName("body")[0];d?x.responseText=d.textContent?d.textContent:d.innerText:h&&(x.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==l&&!x.responseXML&&x.responseText&&(x.responseXML=X(x.responseText));try{L=_(x,l,m)}catch(b){i="parsererror",x.error=r=b||i}}catch(b){a("error caught: ",b),i="error",x.error=r=b||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&300>x.status||304===x.status?"success":"error"),"success"===i?(m.success&&m.success.call(m.context,L,"success",x),S.resolve(x.responseText,"success",x),p&&e.event.trigger("ajaxSuccess",[x,m])):i&&(void 0===r&&(r=x.statusText),m.error&&m.error.call(m.context,x,i,r),S.reject(x,"error",r),p&&e.event.trigger("ajaxError",[x,m,r])),p&&e.event.trigger("ajaxComplete",[x,m]),p&&!--e.active&&e.event.trigger("ajaxStop"),m.complete&&m.complete.call(m.context,x,i),F=!0,m.timeout&&clearTimeout(j),setTimeout(function(){m.iframeTarget||v.remove(),x.responseXML=null},100)}}}var l,c,m,p,d,v,g,x,b,y,T,j,w=f[0],S=e.Deferred();if(r)for(c=0;h.length>c;c++)l=e(h[c]),i?l.prop("disabled",!1):l.removeAttr("disabled");if(m=e.extend(!0,{},e.ajaxSettings,t),m.context=m.context||m,d="jqFormIO"+(new Date).getTime(),m.iframeTarget?(v=e(m.iframeTarget),y=v.attr2("name"),y?d=y:v.attr2("name",d)):(v=e('<iframe name="'+d+'" src="'+m.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",m.iframeSrc),x.error=r,m.error&&m.error.call(m.context,x,r,t),p&&e.event.trigger("ajaxError",[x,m,r]),m.complete&&m.complete.call(m.context,x,r)}},p=m.global,p&&0===e.active++&&e.event.trigger("ajaxStart"),p&&e.event.trigger("ajaxSend",[x,m]),m.beforeSend&&m.beforeSend.call(m.context,x,m)===!1)return m.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;b=w.clk,b&&(y=b.name,y&&!b.disabled&&(m.extraData=m.extraData||{},m.extraData[y]=b.value,"image"==b.type&&(m.extraData[y+".x"]=w.clk_x,m.extraData[y+".y"]=w.clk_y)));var k=1,D=2,A=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&A&&(m.extraData=m.extraData||{},m.extraData[E]=A),m.forceSync?o():setTimeout(o,10);var L,M,F,O=50,X=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},C=e.parseJSON||function(e){return window.eval("("+e+")")},_=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i="xml"===r||!r&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&("json"===r||!r&&n.indexOf("json")>=0?o=C(o):("script"===r||!r&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var u,l,c,f=this;"function"==typeof t?t={success:t}:void 0===t&&(t={}),u=t.type||this.attr2("method"),l=t.url||this.attr2("action"),c="string"==typeof l?e.trim(l):"",c=c||window.location.href||"",c&&(c=(c.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:c,success:e.ajaxSettings.success,type:u||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var p=t.traditional;void 0===p&&(p=e.ajaxSettings.traditional);var d,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,d=e.param(t.data,p)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,p);d&&(g=g?g+"&"+d:d),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var x=[];if(t.resetForm&&x.push(function(){f.resetForm()}),t.clearForm&&x.push(function(){f.clearForm(t.includeHidden)}),!t.dataType&&t.target){var b=t.success||function(){};x.push(function(r){var a=t.replaceTarget?"replaceWith":"html";e(t.target)[a](r).each(b,arguments)})}else t.success&&x.push(t.success);if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=x.length;o>i;i++)x[i].apply(n,[e,r,a||f,f])},t.error){var y=t.error;t.error=function(e,r,a){var n=t.context||this;y.apply(n,[e,r,a,f])}}if(t.complete){var T=t.complete;t.complete=function(e,r){var a=t.context||this;T.apply(a,[e,r,f])}}var j=e('input[type=file]:enabled[value!=""]',this),w=j.length>0,S="multipart/form-data",k=f.attr("enctype")==S||f.attr("encoding")==S,D=n.fileapi&&n.formdata;a("fileAPI :"+D);var A,E=(w||k)&&!D;t.iframe!==!1&&(t.iframe||E)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){A=s(v)}):A=s(v):A=(w||k)&&D?o(v):e.ajax(t),f.removeData("jqxhr").data("jqxhr",A);for(var L=0;h.length>L;L++)h[L]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r){var a=[];if(0===this.length)return a;var i=this[0],o=t?i.getElementsByTagName("*"):i.elements;if(!o)return a;var s,u,l,c,f,m,p;for(s=0,m=o.length;m>s;s++)if(f=o[s],l=f.name,l&&!f.disabled)if(t&&i.clk&&"image"==f.type)i.clk==f&&(a.push({name:l,value:e(f).val(),type:f.type}),a.push({name:l+".x",value:i.clk_x},{name:l+".y",value:i.clk_y}));else if(c=e.fieldValue(f,!0),c&&c.constructor==Array)for(r&&r.push(f),u=0,p=c.length;p>u;u++)a.push({name:l,value:c[u]});else if(n.fileapi&&"file"==f.type){r&&r.push(f);var d=f.files;if(d.length)for(u=0;d.length>u;u++)a.push({name:l,value:d[u],type:f.type});else a.push({name:l,value:"",type:f.type})}else null!==c&&c!==void 0&&(r&&r.push(f),a.push({name:l,value:c,type:f.type,required:f.required}));if(!t&&i.clk){var h=e(i.clk),v=h[0];l=v.name,l&&!v.disabled&&"image"==v.type&&(a.push({name:l,value:h.val()}),a.push({name:l+".x",value:i.clk_x},{name:l+".y",value:i.clk_y}))}return a},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)r.push({name:a,value:n[i]});else null!==n&&n!==void 0&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;n>a;a++){var i=this[a],o=e.fieldValue(i,t);null===o||void 0===o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],u=t.options,l="select-one"==n,c=l?o+1:u.length,f=l?o:0;c>f;f++){var m=u[f];if(m.selected){var p=m.value;if(p||(p=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),l)return p;s.push(p)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"==n?this.value="":"checkbox"==a||"radio"==a?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"==r||"radio"==r)this.checked=t;else if("option"==this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"==a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1})(jQuery);


/*yepnope1.5.x|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);

var prefixes=["webkit","Moz","ms","O"],animations={},useCssAnimations;
/*!
 * jQuery blockUI plugin
 * Version 2.63.0-2013.07.08
 * @requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */
;(function(){function setup($){$.fn._fadeIn=$.fn.fadeIn;var noOp=$.noop||function(){};var msie=/MSIE/.test(navigator.userAgent);var ie6=/MSIE 6.0/.test(navigator.userAgent)&&!/MSIE 8.0/.test(navigator.userAgent);var mode=document.documentMode||0;var setExpr=$.isFunction(document.createElement("div").style.setExpression);$.blockUI=function(opts){install(window,opts)};$.unblockUI=function(opts){remove(window,opts)};$.growlUI=function(title,message,timeout,onClose){var $m=$('<div class="growlUI"></div>');if(title){$m.append("<h1>"+title+"</h1>")}if(message){$m.append("<h2>"+message+"</h2>")}if(timeout===undefined){timeout=3000}var callBlock=function(opts){opts=opts||{};$.blockUI({message:$m,fadeIn:typeof opts.fadeIn!=="undefined"?opts.fadeIn:700,fadeOut:typeof opts.fadeOut!=="undefined"?opts.fadeOut:1000,timeout:typeof opts.timeout!=="undefined"?opts.timeout:timeout,centerY:false,showOverlay:false,onUnblock:onClose,css:$.blockUI.defaults.growlCSS})};callBlock();var nonmousedOpacity=$m.css("opacity");$m.mouseover(function(){callBlock({fadeIn:0,timeout:30000});var displayBlock=$(".blockMsg");displayBlock.stop();displayBlock.fadeTo(300,1)}).mouseout(function(){$(".blockMsg").fadeOut(1000)})};$.fn.block=function(opts){if(this[0]===window){$.blockUI(opts);return this}var fullOpts=$.extend({},$.blockUI.defaults,opts||{});this.each(function(){var $el=$(this);if(fullOpts.ignoreIfBlocked&&$el.data("blockUI.isBlocked")){return}$el.unblock({fadeOut:0})});return this.each(function(){if($.css(this,"position")=="static"){this.style.position="relative";$(this).data("blockUI.static",true)}this.style.zoom=1;install(this,opts)})};$.fn.unblock=function(opts){if(this[0]===window){$.unblockUI(opts);return this}return this.each(function(){remove(this,opts)})};$.blockUI.version=2.6;$.blockUI.defaults={message:"<h1>Please wait...</h1>",title:null,draggable:true,theme:false,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:0.6,cursor:"wait"},cursorReset:"default",growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:0.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:false,baseZ:9000,centerX:true,centerY:true,allowBodyStretch:true,bindEvents:true,constrainTabKey:true,fadeIn:200,fadeOut:400,timeout:0,showOverlay:true,focusInput:true,focusableElements:":input:enabled:visible",onBlock:null,onUnblock:null,onOverlayClick:null,quirksmodeOffsetHack:4,blockMsgClass:"blockMsg",ignoreIfBlocked:false};var pageBlock=null;var pageBlockEls=[];function install(el,opts){var css,themedCSS;var full=(el==window);var msg=(opts&&opts.message!==undefined?opts.message:undefined);opts=$.extend({},$.blockUI.defaults,opts||{});if(opts.ignoreIfBlocked&&$(el).data("blockUI.isBlocked")){return}opts.overlayCSS=$.extend({},$.blockUI.defaults.overlayCSS,opts.overlayCSS||{});css=$.extend({},$.blockUI.defaults.css,opts.css||{});if(opts.onOverlayClick){opts.overlayCSS.cursor="pointer"}themedCSS=$.extend({},$.blockUI.defaults.themedCSS,opts.themedCSS||{});msg=msg===undefined?opts.message:msg;if(full&&pageBlock){remove(window,{fadeOut:0})}if(msg&&typeof msg!="string"&&(msg.parentNode||msg.jquery)){var node=msg.jquery?msg[0]:msg;var data={};$(el).data("blockUI.history",data);data.el=node;data.parent=node.parentNode;data.display=node.style.display;data.position=node.style.position;if(data.parent){data.parent.removeChild(node)}}$(el).data("blockUI.onUnblock",opts.onUnblock);var z=opts.baseZ;var lyr1,lyr2,lyr3,s;if(msie||opts.forceIframe){lyr1=$('<iframe class="blockUI" style="z-index:'+(z++)+';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')}else{lyr1=$('<div class="blockUI" style="display:none"></div>')}if(opts.theme){lyr2=$('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+(z++)+';display:none"></div>')}else{lyr2=$('<div class="blockUI blockOverlay" style="z-index:'+(z++)+';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>')}if(opts.theme&&full){s='<div class="blockUI '+opts.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';if(opts.title){s+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title||"&nbsp;")+"</div>"}s+='<div class="ui-widget-content ui-dialog-content"></div>';s+="</div>"}else{if(opts.theme){s='<div class="blockUI '+opts.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';if(opts.title){s+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title||"&nbsp;")+"</div>"}s+='<div class="ui-widget-content ui-dialog-content"></div>';s+="</div>"}else{if(full){s='<div class="blockUI '+opts.blockMsgClass+' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>'}else{s='<div class="blockUI '+opts.blockMsgClass+' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>'}}}lyr3=$(s);if(msg){if(opts.theme){lyr3.css(themedCSS);lyr3.addClass("ui-widget-content")}else{lyr3.css(css)}}if(!opts.theme){lyr2.css(opts.overlayCSS)}lyr2.css("position",full?"fixed":"absolute");if(msie||opts.forceIframe){lyr1.css("opacity",0)}var layers=[lyr1,lyr2,lyr3],$par=full?$("body"):$(el);$.each(layers,function(){this.appendTo($par)});if(opts.theme&&opts.draggable&&$.fn.draggable){lyr3.draggable({handle:".ui-dialog-titlebar",cancel:"li"})}var expr=setExpr&&(!$.support.boxModel||$("object,embed",full?null:el).length>0);if(ie6||expr){if(full&&opts.allowBodyStretch&&$.support.boxModel){$("html,body").css("height","100%")}if((ie6||!$.support.boxModel)&&!full){var t=sz(el,"borderTopWidth"),l=sz(el,"borderLeftWidth");var fixT=t?"(0 - "+t+")":0;var fixL=l?"(0 - "+l+")":0}$.each(layers,function(i,o){var s=o[0].style;s.position="absolute";if(i<2){if(full){s.setExpression("height","Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:"+opts.quirksmodeOffsetHack+') + "px"')}else{s.setExpression("height",'this.parentNode.offsetHeight + "px"')}if(full){s.setExpression("width",'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')}else{s.setExpression("width",'this.parentNode.offsetWidth + "px"')}if(fixL){s.setExpression("left",fixL)}if(fixT){s.setExpression("top",fixT)}}else{if(opts.centerY){if(full){s.setExpression("top",'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"')}s.marginTop=0}else{if(!opts.centerY&&full){var top=(opts.css&&opts.css.top)?parseInt(opts.css.top,10):0;var expression="((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "+top+') + "px"';s.setExpression("top",expression)}}}})}if(msg){if(opts.theme){lyr3.find(".ui-widget-content").append(msg)}else{lyr3.append(msg)}if(msg.jquery||msg.nodeType){$(msg).show()}}if((msie||opts.forceIframe)&&opts.showOverlay){lyr1.show()}if(opts.fadeIn){var cb=opts.onBlock?opts.onBlock:noOp;var cb1=(opts.showOverlay&&!msg)?cb:noOp;var cb2=msg?cb:noOp;if(opts.showOverlay){lyr2._fadeIn(opts.fadeIn,cb1)}if(msg){lyr3._fadeIn(opts.fadeIn,cb2)}}else{if(opts.showOverlay){lyr2.show()}if(msg){lyr3.show()}if(opts.onBlock){opts.onBlock()}}bind(1,el,opts);if(full){pageBlock=lyr3[0];pageBlockEls=$(opts.focusableElements,pageBlock);if(opts.focusInput){setTimeout(focus,20)}}else{center(lyr3[0],opts.centerX,opts.centerY)}if(opts.timeout){var to=setTimeout(function(){if(full){$.unblockUI(opts)}else{$(el).unblock(opts)}},opts.timeout);$(el).data("blockUI.timeout",to)}}function remove(el,opts){var count;var full=(el==window);var $el=$(el);var data=$el.data("blockUI.history");var to=$el.data("blockUI.timeout");if(to){clearTimeout(to);$el.removeData("blockUI.timeout")}opts=$.extend({},$.blockUI.defaults,opts||{});bind(0,el,opts);if(opts.onUnblock===null){opts.onUnblock=$el.data("blockUI.onUnblock");$el.removeData("blockUI.onUnblock")}var els;if(full){els=$("body").children().filter(".blockUI").add("body > .blockUI")}else{els=$el.find(">.blockUI")}if(opts.cursorReset){if(els.length>1){els[1].style.cursor=opts.cursorReset}if(els.length>2){els[2].style.cursor=opts.cursorReset}}if(full){pageBlock=pageBlockEls=null}if(opts.fadeOut){count=els.length;els.stop().fadeOut(opts.fadeOut,function(){if(--count===0){reset(els,data,opts,el)}})}else{reset(els,data,opts,el)}}function reset(els,data,opts,el){var $el=$(el);els.each(function(i,o){if(this.parentNode){this.parentNode.removeChild(this)}});if(data&&data.el){data.el.style.display=data.display;data.el.style.position=data.position;if(data.parent){data.parent.appendChild(data.el)}$el.removeData("blockUI.history")}if($el.data("blockUI.static")){$el.css("position","static")}if(typeof opts.onUnblock=="function"){opts.onUnblock(el,opts)}var body=$(document.body),w=body.width(),cssW=body[0].style.width;body.width(w-1).width(w);body[0].style.width=cssW}function bind(b,el,opts){var full=el==window,$el=$(el);if(!b&&(full&&!pageBlock||!full&&!$el.data("blockUI.isBlocked"))){return}$el.data("blockUI.isBlocked",b);if(!full||!opts.bindEvents||(b&&!opts.showOverlay)){return}var events="mousedown mouseup keydown keypress keyup touchstart touchend touchmove";if(b){$(document).bind(events,opts,handler)}else{$(document).unbind(events,handler)}}function handler(e){if(e.type==="keydown"&&e.keyCode&&e.keyCode==9){if(pageBlock&&e.data.constrainTabKey){var els=pageBlockEls;var fwd=!e.shiftKey&&e.target===els[els.length-1];var back=e.shiftKey&&e.target===els[0];if(fwd||back){setTimeout(function(){focus(back)},10);return false}}}var opts=e.data;var target=$(e.target);if(target.hasClass("blockOverlay")&&opts.onOverlayClick){opts.onOverlayClick()}if(target.parents("div."+opts.blockMsgClass).length>0){return true}return target.parents().children().filter("div.blockUI").length===0}function focus(back){if(!pageBlockEls){return}var e=pageBlockEls[back===true?pageBlockEls.length-1:0];if(e){e.focus()}}function center(el,x,y){var p=el.parentNode,s=el.style;var l=((p.offsetWidth-el.offsetWidth)/2)-sz(p,"borderLeftWidth");var t=((p.offsetHeight-el.offsetHeight)/2)-sz(p,"borderTopWidth");if(x){s.left=l>0?(l+"px"):"0"}if(y){s.top=t>0?(t+"px"):"0"}}function sz(el,p){return parseInt($.css(el,p),10)||0}}if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],setup)}else{setup(jQuery)}})();

(function($) {
    $.fn.blockit = function(options) {
        $.blockUI.defaults.css = {textAlign: 'center', 'padding-right': '14px'};
        var simple = 0,
            modalison = ($(".modal-scrollable").length > 0 ? 1 : 0);
        if(options){
           msg = options.message;
           simple = options.simple;
           btntype = options.button
        }else{
           msg = false;
        }
        var blockitdefaults = {
            fadeIn:  0, 
            fadeOut:  10, 
            bindEvents: true,
            message: ((msg) ? ('<strong>'+msg+'</strong>') : false),
            overlayCSS: {
                backgroundColor: (modalison ? 'transparent' : ($("body").css("background-color"))),
                opacity: (modalison ? 0 : 0.96)
            },
            blockMsgClass: options.blockMsgClass ? options.blockMsgClass : 'alert alert-info infofix'
        };

        $.blockUI.defaults.centerX = true
        $.blockUI.defaults.centerY = true        
        
        if(options != undefined && options.simple){
            $.blockUI.defaults.css = options.css ? options.css : { padding : 8, margin: 0, border: 0};
            //blockitdefaults.blockMsgClass = '';
            blockitdefaults.overlayCSS = {backgroundColor: ($("body").css("background-color"))};
            
           }
        
        if(options.usimple){
            blockitdefaults.overlayCSS.backgroundColor = "#ffffff"
            blockitdefaults.overlayCSS.opacity = .8
            blockitdefaults.blockMsgClass = "";
        }
        
        if(options != undefined && btntype){
            $.blockUI.defaults.centerX = false
            $.blockUI.defaults.centerY = false
            $.blockUI.defaults.css = { left:'', right: '-20px', backgroundColor: 'transparent', border: 0, padding : 0, margin: 0};
            //blockitdefaults.blockMsgClass = '';
        }
        if(modalison && (options && !options.simple)){
            options.message = null;
        }        
        jQuery.extend(true,blockitdefaults, options);
       
        this.block(blockitdefaults);
        
        //default options
        
        options.usimple = false;
        return this;
       
    };
})(jQuery);
/*
 * NETEYE Activity Indicator jQuery Plugin
 *
 * Copyright (c) 2010 NETEYE GmbH
 * Licensed under the MIT license
 *
 * Author: Felix Gnass [fgnass at neteye dot de]
 * Version: 1.0.0
 */
(function($){$.fn.activity=function(opts){this.each(function(){var $this=$(this);var el=$this.data("activity");if(el){clearInterval(el.data("interval"));el.remove();$this.removeData("activity");}if(opts!==false){opts=$.extend({color:$this.css("color")},$.fn.activity.defaults,opts);el=render($this,opts).css("position","absolute").prependTo(opts.outside?"body":$this);var h=$this.outerHeight()-el.height();var w=$this.outerWidth()-el.width();var margin={top:opts.valign=="top"?opts.padding:opts.valign=="bottom"?h-opts.padding:Math.floor(h/2),left:opts.align=="left"?opts.padding:opts.align=="right"?w-opts.padding:Math.floor(w/2)};var offset=$this.offset();if(opts.outside){el.css({top:offset.top+"px",left:offset.left+"px"});}else{margin.top-=el.offset().top-offset.top;margin.left-=el.offset().left-offset.left;}el.css({marginTop:margin.top+"px",marginLeft:margin.left+"px"});animate(el,opts.segments,Math.round(10/opts.speed)/10);$this.data("activity",el);}});return this;};$.fn.activity.defaults={segments:12,space:3,length:7,width:4,speed:1.2,align:"center",valign:"center",padding:4};$.fn.activity.getOpacity=function(opts,i){var steps=opts.steps||opts.segments-1;var end=opts.opacity!==undefined?opts.opacity:1/steps;return 1-Math.min(i,steps)*(1-end)/steps;};var render=function(){return $("<div>").addClass("busy");};var animate=function(){};function svg(tag,attr){var el=document.createElementNS("http://www.w3.org/2000/svg",tag||"svg");if(attr){$.each(attr,function(k,v){el.setAttributeNS(null,k,v);});}return $(el);}if(document.createElementNS&&document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect){render=function(target,d){var innerRadius=d.width*2+d.space;var r=(innerRadius+d.length+Math.ceil(d.width/2)+1);var el=svg().width(r*2).height(r*2);var g=svg("g",{"stroke-width":d.width,"stroke-linecap":"round",stroke:d.color}).appendTo(svg("g",{transform:"translate("+r+","+r+")"}).appendTo(el));for(var i=0;i<d.segments;i++){g.append(svg("line",{x1:0,y1:innerRadius,x2:0,y2:innerRadius+d.length,transform:"rotate("+(360/d.segments*i)+", 0, 0)",opacity:$.fn.activity.getOpacity(d,i)}));}return $("<div>").append(el).width(2*r).height(2*r);};if(document.createElement("div").style.WebkitAnimationName!==undefined){var animations={};animate=function(el,steps,duration){if(!animations[steps]){var name="spin"+steps;var rule="@-webkit-keyframes "+name+" {";for(var i=0;i<steps;i++){var p1=Math.round(100000/steps*i)/1000;var p2=Math.round(100000/steps*(i+1)-1)/1000;var value="% { -webkit-transform:rotate("+Math.round(360/steps*i)+"deg); }\n";rule+=p1+value+p2+value;}rule+="100% { -webkit-transform:rotate(100deg); }\n}";document.styleSheets[0].insertRule(rule);animations[steps]=name;}el.css("-webkit-animation",animations[steps]+" "+duration+"s linear infinite");};}else{animate=function(el,steps,duration){var rotation=0;var g=el.find("g g").get(0);el.data("interval",setInterval(function(){g.setAttributeNS(null,"transform","rotate("+(++rotation%steps*(360/steps))+")");},duration*1000/steps));};}}else{var s=$("<shape>").css("behavior","url(#default#VML)").appendTo("body");if(s.get(0).adj){var sheet=document.createStyleSheet();$.each(["group","shape","stroke"],function(){sheet.addRule(this,"behavior:url(#default#VML);");});render=function(target,d){var innerRadius=d.width*2+d.space;var r=(innerRadius+d.length+Math.ceil(d.width/2)+1);var s=r*2;var o=-Math.ceil(s/2);var el=$("<group>",{coordsize:s+" "+s,coordorigin:o+" "+o}).css({top:o,left:o,width:s,height:s});for(var i=0;i<d.segments;i++){el.append($("<shape>",{path:"m "+innerRadius+",0  l "+(innerRadius+d.length)+",0"}).css({width:s,height:s,rotation:(360/d.segments*i)+"deg"}).append($("<stroke>",{color:d.color,weight:d.width+"px",endcap:"round",opacity:$.fn.activity.getOpacity(d,i)})));}return $("<group>",{coordsize:s+" "+s}).css({width:s,height:s,overflow:"hidden"}).append(el);};animate=function(el,steps,duration){var rotation=0;var g=el.get(0);el.data("interval",setInterval(function(){g.style.rotation=++rotation%steps*(360/steps);},duration*1000/steps));};}$(s).remove();}})(jQuery);

(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'))
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  }
  else {
    // Browser globals
    if (!$.isFunction($.fn.activity) ) throw new Error('activity.js not present')
    factory(window.jQuery, window.activity)
  }

}(function($, activity) {

  $.fn.spin = function(opts, color) {

       $.fn.spin.presets = {
            main: {segments: 12, steps: 8, opacity: 0.44, width: 3, space: 0.8, length: 6, speed: 0.8, align : "left"},
            big: {segments: 18, steps: 9, opacity: 0.44, width: 5, space: 0.99, length: 12, speed: 1.8},
            mid: {segments: 12, steps: 8, opacity: 0.44, width: 3, space: 0.8, length: 6, speed: 1.8}
        }
        
    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.activity) {
        $this.activity(false)
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        )
        //data.activity = $this.activity(opts);
        $this.activity(opts);
      }
    })
  }

}));



/*!
 * bootstrap-filestyle
 * http://dev.tudosobreweb.com.br/bootstrap-filestyle/
 *
 * Copyright (c) 2013 Markus Vinicius da Silva Lima
 * Version 1.0.3
 * Licensed under the MIT license.
 */
(function($){var Filestyle=function(element,options){this.options=options;this.$elementFilestyle=[];this.$element=$(element)};Filestyle.prototype={clear:function(){this.$element.val("");this.$elementFilestyle.find(":text").val("")},destroy:function(){this.$element.removeAttr("style").removeData("filestyle").val("");this.$elementFilestyle.remove()},icon:function(value){if(value===true){if(!this.options.icon){this.options.icon=true;this.$elementFilestyle.find("label").prepend(this.htmlIcon())}}else{if(value===false){if(this.options.icon){this.options.icon=false;this.$elementFilestyle.find("i").remove()}}else{return this.options.icon}}},input:function(value){if(value===true){if(!this.options.input){this.options.input=true;this.$elementFilestyle.prepend(this.htmlInput());var content="",files=[];if(this.$element[0].files===undefined){files[0]={name:this.$element[0].value}}else{files=this.$element[0].files}for(var i=0;i<files.length;i++){content+=files[i].name.split("\\").pop()+", "}if(content!==""){this.$elementFilestyle.find(":text").val(content.replace(/\, $/g,""))}}}else{if(value===false){if(this.options.input){this.options.input=false;this.$elementFilestyle.find(":text").remove()}}else{return this.options.input}}},buttonText:function(value){if(value!==undefined){this.options.buttonText=value;this.$elementFilestyle.find("label span").html(this.options.buttonText)}else{return this.options.buttonText}},classButton:function(value){if(value!==undefined){this.options.classButton=value;this.$elementFilestyle.find("label").attr({"class":this.options.classButton});if(this.options.classButton.search(/btn-inverse|btn-primary|btn-danger|btn-warning|btn-success/i)!==-1){this.$elementFilestyle.find("label i").addClass("icon-white")}else{this.$elementFilestyle.find("label i").removeClass("icon-white")}}else{return this.options.classButton}},classIcon:function(value){if(value!==undefined){this.options.classIcon=value;if(this.options.classButton.search(/btn-inverse|btn-primary|btn-danger|btn-warning|btn-success/i)!==-1){this.$elementFilestyle.find("label").find("i").attr({"class":"icon icon-white "+this.options.classIcon})}else{this.$elementFilestyle.find("label").find("i").attr({"class":"icon "+this.options.classIcon})}}else{return this.options.classIcon}},classInput:function(value){if(value!==undefined){this.options.classInput=value;this.$elementFilestyle.find(":text").addClass(this.options.classInput)}else{return this.options.classInput}},htmlIcon:function(){if(this.options.icon){var colorIcon="";if(this.options.classButton.search(/btn-inverse|btn-primary|btn-danger|btn-warning|btn-success/i)!==-1){colorIcon=" icon-white "}return'<i class="icon '+colorIcon+this.options.classIcon+'"></i> '}else{return""}},htmlInput:function(){if(this.options.input){return'<input type="text" class="'+this.options.classInput+'" disabled> '}else{return""}},constructor:function(){var _self=this,html="",id=this.$element.attr("id"),files=[];if(id===""||!id){id="filestyle-"+$(".bootstrap-filestyle").length;this.$element.attr({id:id})}html=this.htmlInput()+'<label for="'+id+'" class="'+this.options.classButton+'">'+this.htmlIcon()+"<span>"+this.options.buttonText+"</span></label>";this.$elementFilestyle=$('<div class="bootstrap-filestyle" style="display: inline-block;">'+html+"</div>");var $label=this.$elementFilestyle.find("label");var $labelFocusableContainer=$label.parent();$labelFocusableContainer.attr("tabindex","0").keypress(function(e){if(e.keyCode===13||e.charCode===32){$label.click()}});this.$element.css({position:"absolute",left:"-9999px"}).attr("tabindex","-1").after(this.$elementFilestyle);this.$element.change(function(){var content="";if(this.files===undefined){files[0]={name:this.value}}else{files=this.files}for(var i=0;i<files.length;i++){content+=files[i].name.split("\\").pop()+", "}if(content!==""){_self.$elementFilestyle.find(":text").val(content.replace(/\, $/g,""))}});if(window.navigator.userAgent.search(/firefox/i)>-1){this.$elementFilestyle.find("label").click(function(){_self.$element.click();return false})}}};var old=$.fn.filestyle;$.fn.filestyle=function(option,value){var get="",element=this.each(function(){if($(this).attr("type")==="file"){var $this=$(this),data=$this.data("filestyle"),options=$.extend({},$.fn.filestyle.defaults,option,typeof option==="object"&&option);if(!data){$this.data("filestyle",(data=new Filestyle(this,options)));data.constructor()}if(typeof option==="string"){get=data[option](value)}}});if(typeof get!==undefined){return get}else{return element}};$.fn.filestyle.defaults={buttonText:"Choose file",input:true,icon:true,classButton:"btn",classInput:"input-large",classIcon:"icon-folder-open"};$.fn.filestyle.noConflict=function(){$.fn.filestyle=old;return this};$(".filestyle").each(function(){var $this=$(this),options={buttonText:$this.attr("data-buttonText"),input:$this.attr("data-input")==="false"?false:true,icon:$this.attr("data-icon")==="false"?false:true,classButton:$this.attr("data-classButton"),classInput:$this.attr("data-classInput"),classIcon:$this.attr("data-classIcon")};$this.filestyle(options)})})(window.jQuery);

//rch iphone style bootstrap based checkboxes
(function ($) {
    if (typeof ($.fn.xswitch) != 'undefined') {
        return false;
    } // prevent dmultiple scripts inits

    $.fn.xswitch = function (on_text, off_text) {

        // destruct
        $.fn.xmdestroy = function () {

            $(this).each(function () {
                var $wrap = $(this).parents('.xmwrap');

                $wrap.children().not('input').remove();
                $(this).unwrap();
            });

            return true;
        };


        // set to ON
        $.fn.xmon = function () {

            $(this).each(function () {
                var $wrap = $(this).parents('.xmwrap');
                var $input = $wrap.find('input');

                if (typeof ($.fn.prop) == 'function') {
                    $wrap.find('input').prop('checked', true);
                } else {
                    $wrap.find('input').attr('checked', true);
                }

                $wrap.find('.xmswitch').removeClass('xmoff').addClass('xmon');

                // if radio - disable other ones 
                if ($wrap.find('.xmswitch').hasClass('xmradio_switch')) {
                    var f_name = $input.attr('name');
                    $wrap.parents('form').find('input[name=' + f_name + ']').not($input).xmoff();
                }
                $wrap.find('input').trigger('xmon');
                $wrap.find('input').trigger('change');                
                
            });

            return true;
        };


        // set to OFF
        $.fn.xmoff = function () {

            $(this).each(function () {
                var $wrap = $(this).parents('.xmwrap');

                if (typeof ($.fn.prop) == 'function') {
                    $wrap.find('input').prop('checked', false);
                } else {
                    $wrap.find('input').attr('checked', false);
                }

                $wrap.find('.xmswitch').removeClass('xmon').addClass('xmoff');
                $wrap.find('input').trigger('xmoff');
                $wrap.find('input').trigger('change');                
                
            });

            return true;
        };


        // construct
        return this.each(function () {

            var $input = $(this);
            on_text = $input.data("on-label") ? $input.data("on-label") : on_text;
            off_text = $input.data("off-label") ? $input.data("off-label") : off_text;

            // check against double init
            if (!$input.parent().hasClass('xmwrap')) {

                // default texts
                var ckd_on_txt = (typeof (on_text) == 'undefined') ? 'ON' : on_text;
                var ckd_off_txt = (typeof (off_text) == 'undefined') ? 'OFF' : off_text;

                // labels structure
                var on_label = (ckd_on_txt) ? '<div class="xmlabel xmlabel_on">' + ckd_on_txt + '</div>' : '';
                var off_label = (ckd_off_txt) ? '<div class="xmlabel xmlabel_off">' + ckd_off_txt + '</div>' : '';


                // default states
                var disabled = ($input.is(':disabled')) ? true : false;
                var active = ($input.is(':checked')) ? true : false;

                var status_classes = '';
                status_classes += (active) ? ' xmon' : ' xmoff';
                if (disabled) {
                    status_classes += ' xmdisabled';
                }


                // wrap and append
                var structure =
                        '<div class="xmswitch ' + status_classes + '">' +
                        '<div class="xmcursor"></div>' +
                        on_label + off_label +
                        '</div>';

                if ($input.is(':input') && ($input.attr('type') == 'checkbox' || $input.attr('type') == 'radio')) {

                    $input.wrap('<div class="xmwrap"></div>');
                    $input.parent().append(structure);

                    $input.parent().find('.xmswitch').addClass('xm' + $input.attr('type') + '_switch');
                }

                $input.next('.xmswitch:not(.xmdisabled)').on('click tap', function (e) {
                    var $xmswitch = $(this)
                    if ($xmswitch.hasClass('xmon')) {
                        if (!$xmswitch.hasClass('xmradio_switch')) { // not for radio
                            if(!$xmswitch.hasClass("xmoff"))
                                $(this).xmoff();
                        }
                    } else {
                        if($xmswitch.hasClass("xmoff"))
                            $(this).xmon();
                    }
                    return false;
                });
                
                $input.on("change", function(){
                    if ($input.is(':checked') ) {
                        if(!$input.next('.xmswitch:not(.xmdisabled)').hasClass("xmon"))
                            $(this).xmon();
                    } else {
                        if($input.next('.xmswitch:not(.xmdisabled)').hasClass("xmoff"))return;
                        $(this).xmoff();
                    }
            
            return false;
        });


            }
        });
    };



    // handlers
    $(document).ready(function () {

        // on click
//        $(document).delegate('.xmswitch:not(.xmdisabled)', 'click tap', function (e) {
//
//            if ($(this).hasClass('xmon')) {
//                if (!$(this).hasClass('xmradio_switch')) { // not for radio
//                    $(this).xmoff();
//                }
//            } else {
//                $(this).xmon();
//            }
//            return false;
//        });


        // on checkbox status swchange
//        $(document).delegate('.xmwrap input', 'change', function () {
//
//            if ($(this).is(':checked')) {
//                $(this).xmon();
//            } else {
//                $(this).xmoff();
//            }
//            
//            return false;
//        });
        
        $('input[data-xswitch="true"]').each(function(){
            var callback = $(this).data("callback");
            $(this).xswitch().on("change", function(){
                if(callback)window[callback]();
                return false;
            });
        });

    });

})(jQuery);

(function(a,b){if(typeof define==="function"&&define.amd){define(["jquery"],b)}else{if(typeof exports==="object"){module.exports=b(require("jquery"))}else{a.ppop=b(a.jQuery)}}}(this,function init(i,c){var m={dialog:'<div class="ppop modal fadeIn" tabindex="-1" data-backdrop="static" data-keyboard="true"><div class=\'modal-content\'><div class=\'modal-body\'><div class=\'ppop-body\'></div></div></div></div>',header:"<div class='modal-header'><h4 class='modal-title'></h4></div>",footer:"<div class='modal-footer'></div>",closeButton:"<button type='button' class='ppop-close-button close' data-dismiss='modal'>&times;</button>",form:"<form class='ppop-form'></form>",inputs:{text:"<input class='ppop-input ppop-input-text form-control' autocomplete=off type=text />",textarea:"<textarea class='ppop-input ppop-input-textarea form-control'></textarea>",email:"<input class='ppop-input ppop-input-email form-control' autocomplete='off' type='email' />",select:"<select class='ppop-input ppop-input-select form-control'></select>",checkbox:"<div class='checkbox'><label><input class='ppop-input ppop-input-checkbox' type='checkbox' /></label></div>",date:"<input class='ppop-input ppop-input-date form-control' autocomplete=off type='date' />",time:"<input class='ppop-input ppop-input-time form-control' autocomplete=off type='time' />",number:"<input class='ppop-input ppop-input-number form-control' autocomplete=off type='number' />",password:"<input class='ppop-input ppop-input-password form-control' autocomplete='off' type='password' />"}};var f={locale:"en",backdrop:true,animate:false,className:null,closeButton:true,show:true,container:"body"};var h={};function p(r){var q=a[f.locale];return q?q[r]:a.en[r]}function d(t,r,v,s){t.stopPropagation();t.preventDefault();var q=i.isFunction(v)&&i.globalEval(v(t))===false;if(!q){r.modal("hide")}if(v===c){return}if(typeof v!=="function"){if(v.indexOf(":")!=-1){var u=v.split(":");window[u[0]](u[1],s)}else{i.globalEval(v)}}}function j(s){var q,r=0;for(q in s){r++}return r}function k(s,r){var q=0;i.each(s,function(t,u){r(t,u,q++)})}function b(q){var s;var r;if(typeof q!=="object"){throw new Error("Please supply an object of options")}if(!q.message){throw new Error("Please specify a message")}q=i.extend({},f,q);if(!q.buttons){q.buttons={}}q.backdrop=q.backdrop?"static":false;s=q.buttons;r=j(s);k(s,function(v,u,t){if(i.isFunction(u)){u=s[v]={callback:u}}if(i.type(u)!=="object"){throw new Error("button with key "+v+" must be an object")}if(!u.label){u.label=v}if(!u.className){if(r<=2&&t===r-1){u.className="btn-primary"}else{u.className="btn-default"}}if(u.value===c){u.value=1}});return q}function g(r,s){var t=r.length;var q={};if(t<1||t>2){throw new Error("Invalid argument length")}if(t===2||typeof r[0]==="string"){q[s[0]]=r[0];q[s[1]]=r[1]}else{q=r[0]}return q}function l(s,q,r){return i.extend(true,{},s,g(q,r))}function e(t,u,s,r){var q={className:"ppop-"+t,buttons:o.apply(null,u)};return n(l(q,r,s),u)}function o(){var u={};for(var s=0,q=arguments.length;s<q;s++){var t=arguments[s];var r=t.toLowerCase();var v=t.toUpperCase();u[r]={label:p(v)}}return u}function n(q,s){var r={};k(s,function(t,u){r[u]=true});k(q.buttons,function(t){if(r[t]===c){throw new Error("button key "+t+" is not allowed (options are "+s.join("\n")+")")}});return q}h.alert=function(){var q;q=e("alert",["ok"],["message","callback"],arguments);if(q.callback&&!i.isFunction(q.callback)){throw new Error("alert requires callback property to be a function when provided")}q.buttons.ok.callback=q.onEscape=function(){if(i.isFunction(q.callback)){return q.callback()}return true};return h.dialog(q)};h.confirm=function(){var q;q=e("confirm",["cancel","confirm"],["message","callback"],arguments);q.buttons.cancel.callback=q.onEscape=function(){return q.callback(false)};q.buttons.confirm.callback=function(){return q.callback(true)};if(!i.isFunction(q.callback)){throw new Error("confirm requires a callback")}return h.dialog(q)};h.prompt=function(){var A;var t;var x;var q;var y;var s;var w;q=i(m.form);t={className:"ppop-prompt",buttons:o("cancel","confirm"),value:"",inputType:"text"};A=n(l(t,arguments,["title","callback"]),["cancel","confirm"]);s=(A.show===c)?true:A.show;var v=["date","time","number"];var u=document.createElement("input");u.setAttribute("type",A.inputType);if(v[A.inputType]){A.inputType=u.type}A.message=q;A.buttons.cancel.callback=A.onEscape=function(){return A.callback(null)};A.buttons.confirm.callback=function(){var C;switch(A.inputType){case"text":case"textarea":case"email":case"select":case"date":case"time":case"number":case"password":C=y.val();break;case"checkbox":var B=y.find("input:checked");C=[];k(B,function(D,E){C.push(i(E).val())});break}return A.callback(C)};A.show=false;if(!A.title){throw new Error("prompt requires a title")}if(!i.isFunction(A.callback)){throw new Error("prompt requires a callback")}if(!m.inputs[A.inputType]){throw new Error("invalid prompt type")}y=i(m.inputs[A.inputType]);switch(A.inputType){case"text":case"textarea":case"email":case"date":case"time":case"number":case"password":y.val(A.value);break;case"select":var r={};w=A.inputOptions||[];if(!w.length){throw new Error("prompt with select requires options")}k(w,function(B,C){var D=y;if(C.value===c||C.text===c){throw new Error("given options in wrong format")}if(C.group){if(!r[C.group]){r[C.group]=i("<optgroup/>").attr("label",C.group)}D=r[C.group]}D.append("<option value='"+C.value+"'>"+C.text+"</option>")});k(r,function(B,C){y.append(C)});y.val(A.value);break;case"checkbox":var z=i.isArray(A.value)?A.value:[A.value];w=A.inputOptions||[];if(!w.length){throw new Error("prompt with checkbox requires options")}if(!w[0].value||!w[0].text){throw new Error("given options in wrong format")}y=i("<div/>");k(w,function(B,C){var D=i(m.inputs[A.inputType]);D.find("input").attr("value",C.value);D.find("label").append(C.text);k(z,function(E,F){if(F===C.value){D.find("input").prop("checked",true)}});y.append(D)});break}if(A.placeholder){y.attr("placeholder",A.placeholder)}if(A.pattern){y.attr("pattern",A.pattern)}q.append(y);q.on("submit",function(B){B.preventDefault();x.find(".btn-primary").click()});x=h.dialog(A);x.off("shown.bs.modal");x.on("shown.bs.modal",function(){y.focus()});if(s===true){x.modal("show")}return x};h.dialog=function(s){s=b(s);var t=i(m.dialog);var q=t.find(".modal-body");var w=s.buttons;var u="";var v={onEscape:s.onEscape};if(s.width){t.data("width",s.width)}t.bind("shownpp");k(w,function(y,x){u+="<button data-bb-handler='"+y+"' data-value='"+x.value+"' type='button' class='btn "+x.className+"'>"+x.label+"</button>";v[y]=x.callback});q.find(".ppop-body").html(s.message);if(s.animate===true){t.addClass("fadeIn")}if(s.className){t.addClass(s.className)}if(s.title){q.before(m.header)}if(s.closeButton){var r=i(m.closeButton);if(s.title){t.find(".modal-header").prepend(r)}else{r.css("margin-top","-10px").prependTo(q)}}if(s.title){t.find(".modal-title").html(s.title)}if(u.length){q.after(m.footer);t.find(".modal-footer").html(u)}t.on("hidden.bs.modal",function(x){if(x.target===this){t.remove()}});t.on("shown.bs.modal",function(){setTimeout(function(){t.removeClass("fadeIn"); t.trigger("shownpp")},200)});t.on("escape.close.bb",function(x){if(v.onEscape){d(x,t,v.onEscape)}});t.on("click",".modal-footer button",function(y){var x=i(this).data("bb-handler");d(y,t,v[x],this)});t.on("click",".ppop-close-button",function(x){d(x,t,v.onEscape)});t.on("keyup",function(x){if(x.which===27){t.trigger("escape.close.bb")}});i(s.container).append(t);t.modal({backdrop:s.backdrop,keyboard:false,show:false});if(s.show){t.modal("show")}return t};h.setDefaults=function(){var q={};if(arguments.length===2){q[arguments[0]]=arguments[1]}else{q=arguments[0]}i.extend(f,q)};h.hideAll=function(){i(".ppop").modal("hide")};var a={en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"}};h.init=function(q){return init(q||i)};return h}));                                                                        
/*!
 * jquery.fancytree.js
 * Dynamic tree view control, with support for lazy loading of branches.
 * https://github.com/mar10/fancytree/
 *
 * Copyright (c) 2008-2015, Martin Wendt (http://wwWendt.de)
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version 2.8.1
 * @date 2015-03-01T20:28
 */
!function(a,b,c,d){"use strict";function e(b,c){b||(c=c?": "+c:"",a.error("Fancytree assertion failed"+c))}function f(a,c){var d,e,f=b.console?b.console[a]:null;if(f)try{f.apply(b.console,c)}catch(g){for(e="",d=0;d<c.length;d++)e+=c[d];f(e)}}function g(a){return!(!a.tree||a.statusNodeType===d)}function h(b){var c,d,e,f=a.map(a.trim(b).split("."),function(a){return parseInt(a,10)}),g=a.map(Array.prototype.slice.call(arguments,1),function(a){return parseInt(a,10)});for(c=0;c<g.length;c++)if(d=f[c]||0,e=g[c]||0,d!==e)return d>e;return!0}function i(a,b,c,d,e){var f=function(){var c=b[a],f=d[a],g=b.ext[e],h=function(){return c.apply(b,arguments)},i=function(a){return c.apply(b,a)};return function(){var a=b._local,c=b._super,d=b._superApply;try{return b._local=g,b._super=h,b._superApply=i,f.apply(b,arguments)}finally{b._local=a,b._super=c,b._superApply=d}}}();return f}function j(b,c,d,e){for(var f in d)"function"==typeof d[f]?"function"==typeof b[f]?b[f]=i(f,b,c,d,e):"_"===f.charAt(0)?b.ext[e][f]=i(f,b,c,d,e):a.error("Could not override tree."+f+". Use prefix '_' to create tree."+e+"._"+f):"options"!==f&&(b.ext[e][f]=d[f])}function k(b,c){return b===d?a.Deferred(function(){this.resolve()}).promise():a.Deferred(function(){this.resolveWith(b,c)}).promise()}function l(b,c){return b===d?a.Deferred(function(){this.reject()}).promise():a.Deferred(function(){this.rejectWith(b,c)}).promise()}function m(a,b){return function(){a.resolveWith(b)}}function n(b){var c=a.extend({},b.data()),d=c.json;return delete c.fancytree,d&&(delete c.json,c=a.extend(c,d)),c}function o(a){return a=a.toLowerCase(),function(b){return b.title.toLowerCase().indexOf(a)>=0}}function p(a){var b=new RegExp("^"+a,"i");return function(a){return b.test(a.title)}}function q(b,c){var d,f,g,h;for(this.parent=b,this.tree=b.tree,this.ul=null,this.li=null,this.statusNodeType=null,this._isLoading=!1,this._error=null,this.data={},d=0,f=A.length;f>d;d++)g=A[d],this[g]=c[g];c.data&&a.extend(this.data,c.data);for(g in c)B[g]||a.isFunction(c[g])||C[g]||(this.data[g]=c[g]);null==this.key?this.tree.options.defaultKey?(this.key=this.tree.options.defaultKey(this),e(this.key,"defaultKey() must return a unique key")):this.key="_"+t._nextNodeKey++:this.key=""+this.key,c.active&&(e(null===this.tree.activeNode,"only one active node allowed"),this.tree.activeNode=this),c.selected&&(this.tree.lastSelectedNode=this),this.children=null,h=c.children,h&&h.length&&this._setChildren(h),this.tree._callHook("treeRegisterNode",this.tree,!0,this)}function r(b){this.widget=b,this.$div=b.element,this.options=b.options,this.options&&(a.isFunction(this.options.lazyload)&&!a.isFunction(this.options.lazyLoad)&&(this.options.lazyLoad=function(){return t.warn("The 'lazyload' event is deprecated since 2014-02-25. Use 'lazyLoad' (with uppercase L) instead."),b.options.lazyload.apply(this,arguments)}),a.isFunction(this.options.loaderror)&&a.error("The 'loaderror' event was renamed since 2014-07-03. Use 'loadError' (with uppercase E) instead."),this.options.fx!==d&&t.warn("The 'fx' options was replaced by 'toggleEffect' since 2014-11-30.")),this.ext={},this.data=n(this.$div),this._id=a.ui.fancytree._nextId++,this._ns=".fancytree-"+this._id,this.activeNode=null,this.focusNode=null,this._hasFocus=null,this.lastSelectedNode=null,this.systemFocusElement=null,this.lastQuicksearchTerm="",this.lastQuicksearchTime=0,this.statusClassPropName="span",this.ariaPropName="li",this.nodeContainerAttrName="li",this.$div.find(">ul.fancytree-container").remove();var c,e={tree:this};this.rootNode=new q(e,{title:"root",key:"root_"+this._id,children:null,expanded:!0}),this.rootNode.parent=null,c=a("<ul>",{"class":"ui-fancytree fancytree-container"}).appendTo(this.$div),this.$container=c,this.rootNode.ul=c[0],null==this.options.debugLevel&&(this.options.debugLevel=t.debugLevel),this.$container.attr("tabindex",this.options.tabbable?"0":"-1"),this.options.aria&&this.$container.attr("role","tree").attr("aria-multiselectable",!0)}if(a.ui&&a.ui.fancytree)return void a.ui.fancytree.warn("Fancytree: ignored duplicate include");e(a.ui,"Fancytree requires jQuery UI (http://jqueryui.com)");var s,t=null,u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},v={16:!0,17:!0,18:!0},w={8:"backspace",9:"tab",10:"return",13:"return",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",59:";",61:"=",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},x={0:"",1:"left",2:"middle",3:"right"},y="active expanded focus folder hideCheckbox lazy selected unselectable".split(" "),z={},A="expanded extraClasses folder hideCheckbox key lazy refKey selected title tooltip unselectable".split(" "),B={},C={active:!0,children:!0,data:!0,focus:!0};for(s=0;s<y.length;s++)z[y[s]]=!0;for(s=0;s<A.length;s++)B[A[s]]=!0;q.prototype={_findDirectChild:function(a){var b,c,d=this.children;if(d)if("string"==typeof a){for(b=0,c=d.length;c>b;b++)if(d[b].key===a)return d[b]}else{if("number"==typeof a)return this.children[a];if(a.parent===this)return a}return null},_setChildren:function(a){e(a&&(!this.children||0===this.children.length),"only init supported"),this.children=[];for(var b=0,c=a.length;c>b;b++)this.children.push(new q(this,a[b]))},addChildren:function(b,c){var d,f,g,h=null,i=[];for(a.isPlainObject(b)&&(b=[b]),this.children||(this.children=[]),d=0,f=b.length;f>d;d++)i.push(new q(this,b[d]));return h=i[0],null==c?this.children=this.children.concat(i):(c=this._findDirectChild(c),g=a.inArray(c,this.children),e(g>=0,"insertBefore must be an existing child"),this.children.splice.apply(this.children,[g,0].concat(i))),(!this.parent||this.parent.ul||this.tr)&&this.render(),3===this.tree.options.selectMode&&this.fixSelection3FromEndNodes(),h},addNode:function(a,b){switch((b===d||"over"===b)&&(b="child"),b){case"after":return this.getParent().addChildren(a,this.getNextSibling());case"before":return this.getParent().addChildren(a,this);case"firstChild":var c=this.children?this.children[0]:null;return this.addChildren(a,c);case"child":case"over":return this.addChildren(a)}e(!1,"Invalid mode: "+b)},appendSibling:function(a){return this.addNode(a,"after")},applyPatch:function(b){if(null===b)return this.remove(),k(this);var c,d,e,f={children:!0,expanded:!0,parent:!0};for(c in b)e=b[c],f[c]||a.isFunction(e)||(B[c]?this[c]=e:this.data[c]=e);return b.hasOwnProperty("children")&&(this.removeChildren(),b.children&&this._setChildren(b.children)),this.isVisible()&&(this.renderTitle(),this.renderStatus()),d=b.hasOwnProperty("expanded")?this.setExpanded(b.expanded):k(this)},collapseSiblings:function(){return this.tree._callHook("nodeCollapseSiblings",this)},copyTo:function(a,b,c){return a.addNode(this.toDict(!0,c),b)},countChildren:function(a){var b,c,d,e=this.children;if(!e)return 0;if(d=e.length,a!==!1)for(b=0,c=d;c>b;b++)d+=e[b].countChildren();return d},debug:function(){this.tree.options.debugLevel>=2&&(Array.prototype.unshift.call(arguments,this.toString()),f("log",arguments))},discard:function(){return this.warn("FancytreeNode.discard() is deprecated since 2014-02-16. Use .resetLazy() instead."),this.resetLazy()},findAll:function(b){b=a.isFunction(b)?b:o(b);var c=[];return this.visit(function(a){b(a)&&c.push(a)}),c},findFirst:function(b){b=a.isFunction(b)?b:o(b);var c=null;return this.visit(function(a){return b(a)?(c=a,!1):void 0}),c},_changeSelectStatusAttrs:function(a){var b=!1;switch(a){case!1:b=this.selected||this.partsel,this.selected=!1,this.partsel=!1;break;case!0:b=!this.selected||!this.partsel,this.selected=!0,this.partsel=!0;break;case d:b=this.selected||!this.partsel,this.selected=!1,this.partsel=!0;break;default:e(!1,"invalid state: "+a)}return b&&this.renderStatus(),b},fixSelection3AfterClick:function(){var a=this.isSelected();this.visit(function(b){b._changeSelectStatusAttrs(a)}),this.fixSelection3FromEndNodes()},fixSelection3FromEndNodes:function(){function a(b){var c,e,f,g,h,i,j,k=b.children;if(k&&k.length){for(i=!0,j=!1,c=0,e=k.length;e>c;c++)f=k[c],g=a(f),g!==!1&&(j=!0),g!==!0&&(i=!1);h=i?!0:j?d:!1}else h=!!b.selected;return b._changeSelectStatusAttrs(h),h}e(3===this.tree.options.selectMode,"expected selectMode 3"),a(this),this.visitParents(function(a){var b,c,e,f,g=a.children,h=!0,i=!1;for(b=0,c=g.length;c>b;b++)e=g[b],(e.selected||e.partsel)&&(i=!0),e.unselectable||e.selected||(h=!1);f=h?!0:i?d:!1,a._changeSelectStatusAttrs(f)})},fromDict:function(b){for(var c in b)B[c]?this[c]=b[c]:"data"===c?a.extend(this.data,b.data):a.isFunction(b[c])||C[c]||(this.data[c]=b[c]);b.children&&(this.removeChildren(),this.addChildren(b.children)),this.renderTitle()},getChildren:function(){return this.hasChildren()===d?d:this.children},getFirstChild:function(){return this.children?this.children[0]:null},getIndex:function(){return a.inArray(this,this.parent.children)},getIndexHier:function(b){b=b||".";var c=[];return a.each(this.getParentList(!1,!0),function(a,b){c.push(b.getIndex()+1)}),c.join(b)},getKeyPath:function(a){var b=[],c=this.tree.options.keyPathSeparator;return this.visitParents(function(a){a.parent&&b.unshift(a.key)},!a),c+b.join(c)},getLastChild:function(){return this.children?this.children[this.children.length-1]:null},getLevel:function(){for(var a=0,b=this.parent;b;)a++,b=b.parent;return a},getNextSibling:function(){if(this.parent){var a,b,c=this.parent.children;for(a=0,b=c.length-1;b>a;a++)if(c[a]===this)return c[a+1]}return null},getParent:function(){return this.parent},getParentList:function(a,b){for(var c=[],d=b?this:this.parent;d;)(a||d.parent)&&c.unshift(d),d=d.parent;return c},getPrevSibling:function(){if(this.parent){var a,b,c=this.parent.children;for(a=1,b=c.length;b>a;a++)if(c[a]===this)return c[a-1]}return null},hasChildren:function(){return this.lazy?null==this.children?d:0===this.children.length?!1:1===this.children.length&&this.children[0].isStatusNode()?d:!0:!(!this.children||!this.children.length)},hasFocus:function(){return this.tree.hasFocus()&&this.tree.focusNode===this},info:function(){this.tree.options.debugLevel>=1&&(Array.prototype.unshift.call(arguments,this.toString()),f("info",arguments))},isActive:function(){return this.tree.activeNode===this},isChildOf:function(a){return this.parent&&this.parent===a},isDescendantOf:function(a){if(!a||a.tree!==this.tree)return!1;for(var b=this.parent;b;){if(b===a)return!0;b=b.parent}return!1},isExpanded:function(){return!!this.expanded},isFirstSibling:function(){var a=this.parent;return!a||a.children[0]===this},isFolder:function(){return!!this.folder},isLastSibling:function(){var a=this.parent;return!a||a.children[a.children.length-1]===this},isLazy:function(){return!!this.lazy},isLoaded:function(){return!this.lazy||this.hasChildren()!==d},isLoading:function(){return!!this._isLoading},isRoot:function(){return this.isRootNode()},isRootNode:function(){return this.tree.rootNode===this},isSelected:function(){return!!this.selected},isStatusNode:function(){return!!this.statusNodeType},isTopLevel:function(){return this.tree.rootNode===this.parent},isUndefined:function(){return this.hasChildren()===d},isVisible:function(){var a,b,c=this.getParentList(!1,!1);for(a=0,b=c.length;b>a;a++)if(!c[a].expanded)return!1;return!0},lazyLoad:function(a){return this.warn("FancytreeNode.lazyLoad() is deprecated since 2014-02-16. Use .load() instead."),this.load(a)},load:function(a){var b,c,d=this;return e(this.isLazy(),"load() requires a lazy node"),a||this.isUndefined()?(this.isLoaded()&&this.resetLazy(),c=this.tree._triggerNodeEvent("lazyLoad",this),c===!1?k(this):(e("boolean"!=typeof c,"lazyLoad event must return source in data.result"),b=this.tree._callHook("nodeLoadChildren",this,c),this.expanded&&b.always(function(){d.render()}),b)):k(this)},makeVisible:function(b){var c,d=this,e=[],f=new a.Deferred,g=this.getParentList(!1,!1),h=g.length,i=!(b&&b.noAnimation===!0),j=!(b&&b.scrollIntoView===!1);for(c=h-1;c>=0;c--)e.push(g[c].setExpanded(!0,b));return a.when.apply(a,e).done(function(){j?d.scrollIntoView(i).done(function(){f.resolve()}):f.resolve()}),f.promise()},moveTo:function(b,c,f){(c===d||"over"===c)&&(c="child");var g,h=this.parent,i="child"===c?b:b.parent;if(this!==b){if(!this.parent)throw"Cannot move system root";if(i.isDescendantOf(this))throw"Cannot move a node to its own descendant";if(1===this.parent.children.length){if(this.parent===i)return;this.parent.children=this.parent.lazy?[]:null,this.parent.expanded=!1}else g=a.inArray(this,this.parent.children),e(g>=0),this.parent.children.splice(g,1);if(this.parent=i,i.hasChildren())switch(c){case"child":i.children.push(this);break;case"before":g=a.inArray(b,i.children),e(g>=0),i.children.splice(g,0,this);break;case"after":g=a.inArray(b,i.children),e(g>=0),i.children.splice(g+1,0,this);break;default:throw"Invalid mode "+c}else i.children=[this];f&&b.visit(f,!0),this.tree!==b.tree&&(this.warn("Cross-tree moveTo is experimantal!"),this.visit(function(a){a.tree=b.tree},!0)),h.isDescendantOf(i)||h.render(),i.isDescendantOf(h)||i===h||i.render()}},navigate:function(b,c){function d(d){if(d){try{d.makeVisible()}catch(e){}return a(d.span).is(":visible")?c===!1?d.setFocus():d.setActive():(d.debug("Navigate: skipping hidden node"),void d.navigate(b,c))}}var e,f,g=!0,h=a.ui.keyCode,i=null;switch(b){case h.BACKSPACE:this.parent&&this.parent.parent&&d(this.parent);break;case h.LEFT:this.expanded?(this.setExpanded(!1),d(this)):this.parent&&this.parent.parent&&d(this.parent);break;case h.RIGHT:this.expanded||!this.children&&!this.lazy?this.children&&this.children.length&&d(this.children[0]):(this.setExpanded(),d(this));break;case h.UP:for(i=this.getPrevSibling();i&&!a(i.span).is(":visible");)i=i.getPrevSibling();for(;i&&i.expanded&&i.children&&i.children.length;)i=i.children[i.children.length-1];!i&&this.parent&&this.parent.parent&&(i=this.parent),d(i);break;case h.DOWN:if(this.expanded&&this.children&&this.children.length)i=this.children[0];else for(f=this.getParentList(!1,!0),e=f.length-1;e>=0;e--){for(i=f[e].getNextSibling();i&&!a(i.span).is(":visible");)i=i.getNextSibling();if(i)break}d(i);break;default:g=!1}},remove:function(){return this.parent.removeChild(this)},removeChild:function(a){return this.tree._callHook("nodeRemoveChild",this,a)},removeChildren:function(){return this.tree._callHook("nodeRemoveChildren",this)},render:function(a,b){return this.tree._callHook("nodeRender",this,a,b)},renderTitle:function(){return this.tree._callHook("nodeRenderTitle",this)},renderStatus:function(){return this.tree._callHook("nodeRenderStatus",this)},resetLazy:function(){this.removeChildren(),this.expanded=!1,this.lazy=!0,this.children=d,this.renderStatus()},scheduleAction:function(a,b){this.tree.timer&&clearTimeout(this.tree.timer),this.tree.timer=null;var c=this;switch(a){case"cancel":break;case"expand":this.tree.timer=setTimeout(function(){c.tree.debug("setTimeout: trigger expand"),c.setExpanded(!0)},b);break;case"activate":this.tree.timer=setTimeout(function(){c.tree.debug("setTimeout: trigger activate"),c.setActive(!0)},b);break;default:throw"Invalid mode "+a}},scrollIntoView:function(f,h){h!==d&&g(h)&&(this.warn("scrollIntoView() with 'topNode' option is deprecated since 2014-05-08. Use 'options.topNode' instead."),h={topNode:h});var i,j,l,m,n=a.extend({effects:f===!0?{duration:200,queue:!1}:f,scrollOfs:this.tree.options.scrollOfs,scrollParent:this.tree.options.scrollParent||this.tree.$container,topNode:null},h),o=new a.Deferred,p=this,q=a(this.span).height(),r=a(n.scrollParent),s=n.scrollOfs.top||0,t=n.scrollOfs.bottom||0,u=r.height(),v=r.scrollTop(),w=r,x=r[0]===b,y=n.topNode||null,z=null;return a(this.span).is(":visible")?(x?(j=a(this.span).offset().top,i=y&&y.span?a(y.span).offset().top:0,w=a("html,body")):(e(r[0]!==c&&r[0]!==c.body,"scrollParent should be an simple element or `window`, not document or body."),m=r.offset().top,j=a(this.span).offset().top-m+v,i=y?a(y.span).offset().top-m+v:0,l=Math.max(0,r.innerHeight()-r[0].clientHeight),u-=l),v+s>j?z=j-s:j+q>v+u-t&&(z=j+q-u+t,y&&(e(y.isRoot()||a(y.span).is(":visible"),"topNode must be visible"),z>i&&(z=i-s))),null!==z?n.effects?(n.effects.complete=function(){o.resolveWith(p)},w.stop(!0).animate({scrollTop:z},n.effects)):(w[0].scrollTop=z,o.resolveWith(this)):o.resolveWith(this),o.promise()):(this.warn("scrollIntoView(): node is invisible."),k())},setActive:function(a,b){return this.tree._callHook("nodeSetActive",this,a,b)},setExpanded:function(a,b){return this.tree._callHook("nodeSetExpanded",this,a,b)},setFocus:function(a){return this.tree._callHook("nodeSetFocus",this,a)},setSelected:function(a){return this.tree._callHook("nodeSetSelected",this,a)},setStatus:function(a,b,c){return this.tree._callHook("nodeSetStatus",this,a,b,c)},setTitle:function(a){this.title=a,this.renderTitle()},sortChildren:function(a,b){var c,d,e=this.children;if(e){if(a=a||function(a,b){var c=a.title.toLowerCase(),d=b.title.toLowerCase();return c===d?0:c>d?1:-1},e.sort(a),b)for(c=0,d=e.length;d>c;c++)e[c].children&&e[c].sortChildren(a,"$norender$");"$norender$"!==b&&this.render()}},toDict:function(b,c){var d,e,f,g={},h=this;if(a.each(A,function(a,b){(h[b]||h[b]===!1)&&(g[b]=h[b])}),a.isEmptyObject(this.data)||(g.data=a.extend({},this.data),a.isEmptyObject(g.data)&&delete g.data),c&&c(g),b&&this.hasChildren())for(g.children=[],d=0,e=this.children.length;e>d;d++)f=this.children[d],f.isStatusNode()||g.children.push(f.toDict(!0,c));return g},toggleExpanded:function(){return this.tree._callHook("nodeToggleExpanded",this)},toggleSelected:function(){return this.tree._callHook("nodeToggleSelected",this)},toString:function(){return"<FancytreeNode(#"+this.key+", '"+this.title+"')>"},visit:function(a,b){var c,d,e=!0,f=this.children;if(b===!0&&(e=a(this),e===!1||"skip"===e))return e;if(f)for(c=0,d=f.length;d>c&&(e=f[c].visit(a,!0),e!==!1);c++);return e},visitAndLoad:function(b,c,d){var e,f,g,h=this;return b&&c===!0&&(f=b(h),f===!1||"skip"===f)?d?f:k():h.children||h.lazy?(e=new a.Deferred,g=[],h.load().done(function(){for(var c=0,d=h.children.length;d>c;c++){if(f=h.children[c].visitAndLoad(b,!0,!0),f===!1){e.reject();break}"skip"!==f&&g.push(f)}a.when.apply(this,g).then(function(){e.resolve()})}),e.promise()):k()},visitParents:function(a,b){if(b&&a(this)===!1)return!1;for(var c=this.parent;c;){if(a(c)===!1)return!1;c=c.parent}return!0},warn:function(){Array.prototype.unshift.call(arguments,this.toString()),f("warn",arguments)}},r.prototype={_makeHookContext:function(b,c,e){var f,g;return b.node!==d?(c&&b.originalEvent!==c&&a.error("invalid args"),f=b):b.tree?(g=b.tree,f={node:b,tree:g,widget:g.widget,options:g.widget.options,originalEvent:c}):b.widget?f={node:null,tree:b,widget:b.widget,options:b.widget.options,originalEvent:c}:a.error("invalid args"),e&&a.extend(f,e),f},_callHook:function(b,c){var d=this._makeHookContext(c),e=this[b],f=Array.prototype.slice.call(arguments,2);return a.isFunction(e)||a.error("_callHook('"+b+"') is not a function"),f.unshift(d),e.apply(this,f)},_requireExtension:function(b,c,d,f){d=!!d;var g=this._local.name,h=this.options.extensions,i=a.inArray(b,h)<a.inArray(g,h),j=c&&null==this.ext[b],k=!j&&null!=d&&d!==i;return e(g&&g!==b),j||k?(f||(j||c?(f="'"+g+"' extension requires '"+b+"'",k&&(f+=" to be registered "+(d?"before":"after")+" itself")):f="If used together, `"+b+"` must be registered "+(d?"before":"after")+" `"+g+"`"),a.error(f),!1):!0},activateKey:function(a){var b=this.getNodeByKey(a);return b?b.setActive():this.activeNode&&this.activeNode.setActive(!1),b},applyPatch:function(b){var c,d,f,g,h,i,j=b.length,k=[];for(d=0;j>d;d++)f=b[d],e(2===f.length,"patchList must be an array of length-2-arrays"),g=f[0],h=f[1],i=null===g?this.rootNode:this.getNodeByKey(g),i?(c=new a.Deferred,k.push(c),i.applyPatch(h).always(m(c,i))):this.warn("could not find node with key '"+g+"'");return a.when.apply(a,k).promise()},count:function(){return this.rootNode.countChildren()},debug:function(){this.options.debugLevel>=2&&(Array.prototype.unshift.call(arguments,this.toString()),f("log",arguments))},findNextNode:function(b,c){var d=null,e=c.parent.children,f=null,g=function(a,b,c){var d,e,f=a.children,h=f.length,i=f[b];if(i&&c(i)===!1)return!1;if(i&&i.children&&i.expanded&&g(i,0,c)===!1)return!1;for(d=b+1;h>d;d++)if(g(a,d,c)===!1)return!1;return e=a.parent,e?g(e,e.children.indexOf(a)+1,c):g(a,0,c)};return b="string"==typeof b?p(b):b,c=c||this.getFirstChild(),g(c.parent,e.indexOf(c),function(e){return e===d?!1:(d=d||e,a(e.span).is(":visible")?b(e)&&(f=e,f!==c)?!1:void 0:void e.debug("quicksearch: skipping hidden node"))}),f},generateFormElements:function(b,c,d){d=d||{};var e,f="string"==typeof b?b:"ft_"+this._id+"[]",g="string"==typeof c?c:"ft_"+this._id+"_active",h="fancytree_result_"+this._id,i=a("#"+h),j=3===this.options.selectMode&&d.stopOnParents!==!1;i.length?i.empty():i=a("<div>",{id:h}).hide().insertAfter(this.$container),b!==!1&&(e=this.getSelectedNodes(j),a.each(e,function(b,c){i.append(a("<input>",{type:"checkbox",name:f,value:c.key,checked:!0}))})),c!==!1&&this.activeNode&&i.append(a("<input>",{type:"radio",name:g,value:this.activeNode.key,checked:!0}))},getActiveNode:function(){return this.activeNode},getFirstChild:function(){return this.rootNode.getFirstChild()},getFocusNode:function(){return this.focusNode},getNodeByKey:function(a,b){var d,e;return!b&&(d=c.getElementById(this.options.idPrefix+a))?d.ftnode?d.ftnode:null:(b=b||this.rootNode,e=null,b.visit(function(b){return b.key===a?(e=b,!1):void 0},!0),e)},getRootNode:function(){return this.rootNode},getSelectedNodes:function(a){var b=[];return this.rootNode.visit(function(c){return c.selected&&(b.push(c),a===!0)?"skip":void 0}),b},hasFocus:function(){return!!this._hasFocus},info:function(){this.options.debugLevel>=1&&(Array.prototype.unshift.call(arguments,this.toString()),f("info",arguments))},loadKeyPath:function(b,c,e){function f(a,b,d){c.call(r,b,"loading"),b.load().done(function(){r.loadKeyPath.call(r,l[a],c,b).always(m(d,r))}).fail(function(){r.warn("loadKeyPath: error loading: "+a+" (parent: "+o+")"),c.call(r,b,"error"),d.reject()})}var g,h,i,j,k,l,n,o,p,q=this.options.keyPathSeparator,r=this;for(a.isArray(b)||(b=[b]),l={},i=0;i<b.length;i++)for(o=e||this.rootNode,j=b[i],j.charAt(0)===q&&(j=j.substr(1)),p=j.split(q);p.length;){if(k=p.shift(),n=o._findDirectChild(k),!n){this.warn("loadKeyPath: key not found: "+k+" (parent: "+o+")"),c.call(this,k,"error");break}if(0===p.length){c.call(this,n,"ok");break}if(n.lazy&&n.hasChildren()===d){c.call(this,n,"loaded"),l[k]?l[k].push(p.join(q)):l[k]=[p.join(q)];break}c.call(this,n,"loaded"),o=n}g=[];for(k in l)n=o._findDirectChild(k),h=new a.Deferred,g.push(h),f(k,n,h);return a.when.apply(a,g).promise()},reactivate:function(a){var b,c=this.activeNode;return c?(this.activeNode=null,b=c.setActive(),a&&c.setFocus(),b):k()},reload:function(a){return this._callHook("treeClear",this),this._callHook("treeLoad",this,a)},render:function(a,b){return this.rootNode.render(a,b)},setFocus:function(a){return this._callHook("treeSetFocus",this,a)},toDict:function(a,b){var c=this.rootNode.toDict(!0,b);return a?c:c.children},toString:function(){return"<Fancytree(#"+this._id+")>"},_triggerNodeEvent:function(a,b,c,e){var f=this._makeHookContext(b,c,e),g=this.widget._trigger(a,c,f);return g!==!1&&f.result!==d?f.result:g},_triggerTreeEvent:function(a,b,c){var e=this._makeHookContext(this,b,c),f=this.widget._trigger(a,b,e);return f!==!1&&e.result!==d?e.result:f},visit:function(a){return this.rootNode.visit(a,!1)},warn:function(){Array.prototype.unshift.call(arguments,this.toString()),f("warn",arguments)}},a.extend(r.prototype,{nodeClick:function(a){var b,c,d=a.targetType,e=a.node;if("expander"===d)this._callHook("nodeToggleExpanded",a);else if("checkbox"===d)this._callHook("nodeToggleSelected",a),a.options.focusOnSelect&&this._callHook("nodeSetFocus",a,!0);else{if(c=!1,b=!0,e.folder)switch(a.options.clickFolderMode){case 2:c=!0,b=!1;break;case 3:b=!0,c=!0}b&&(this.nodeSetFocus(a),this._callHook("nodeSetActive",a,!0)),c&&this._callHook("nodeToggleExpanded",a)}},nodeCollapseSiblings:function(a,b){var c,d,e,f=a.node;if(f.parent)for(c=f.parent.children,d=0,e=c.length;e>d;d++)c[d]!==f&&c[d].expanded&&this._callHook("nodeSetExpanded",c[d],!1,b)},nodeDblclick:function(a){"title"===a.targetType&&4===a.options.clickFolderMode&&this._callHook("nodeToggleExpanded",a),"title"===a.targetType&&a.originalEvent.preventDefault()},nodeKeydown:function(b){var c,d,e,f=b.originalEvent,g=b.node,h=b.tree,i=b.options,j=f.which,k=String.fromCharCode(j),l=!(f.altKey||f.ctrlKey||f.metaKey||f.shiftKey),m=a(f.target),n=!0,o=!(f.ctrlKey||!i.autoActivate);if(g||((this.getActiveNode()||this.getFirstChild()).setFocus(),g=b.node=this.focusNode,g.debug("Keydown force focus on active node")),i.quicksearch&&l&&/\w/.test(k)&&!m.is(":input:enabled"))return d=(new Date).getTime(),d-h.lastQuicksearchTime>500&&(h.lastQuicksearchTerm=""),h.lastQuicksearchTime=d,h.lastQuicksearchTerm+=k,c=h.findNextNode(h.lastQuicksearchTerm,h.getActiveNode()),c&&c.setActive(),void f.preventDefault();switch(t.eventToString(f)){case"+":case"=":h.nodeSetExpanded(b,!0);break;case"-":h.nodeSetExpanded(b,!1);break;case"space":i.checkbox?h.nodeToggleSelected(b):h.nodeSetActive(b,!0);break;case"enter":h.nodeSetActive(b,!0);break;case"backspace":case"left":case"right":case"up":case"down":e=g.navigate(f.which,o);break;default:n=!1}n&&f.preventDefault()},nodeLoadChildren:function(b,c){var d,f,g,h=b.tree,i=b.node;return a.isFunction(c)&&(c=c()),c.url&&(d=a.extend({},b.options.ajax,c),d.debugDelay?(f=d.debugDelay,a.isArray(f)&&(f=f[0]+Math.random()*(f[1]-f[0])),i.debug("nodeLoadChildren waiting debug delay "+Math.round(f)+"ms"),d.debugDelay=!1,g=a.Deferred(function(b){setTimeout(function(){a.ajax(d).done(function(){b.resolveWith(this,arguments)}).fail(function(){b.rejectWith(this,arguments)})},f)})):g=a.ajax(d),c=new a.Deferred,g.done(function(d){var e,f;if("string"==typeof d&&a.error("Ajax request returned a string (did you get the JSON dataType wrong?)."),b.options.postProcess){if(f=h._triggerNodeEvent("postProcess",b,b.originalEvent,{response:d,error:null,dataType:this.dataType}),f.error)return e=a.isPlainObject(f.error)?f.error:{message:f.error},e=h._makeHookContext(i,null,e),void c.rejectWith(this,[e]);d=a.isArray(f)?f:d}else d&&d.hasOwnProperty("d")&&b.options.enableAspx&&(d="string"==typeof d.d?a.parseJSON(d.d):d.d);c.resolveWith(this,[d])}).fail(function(a,b,d){var e=h._makeHookContext(i,null,{error:a,args:Array.prototype.slice.call(arguments),message:d,details:a.status+": "+d});c.rejectWith(this,[e])})),a.isFunction(c.then)&&a.isFunction(c["catch"])&&(g=c,c=new a.Deferred,g.then(function(a){c.resolve(a)},function(a){c.reject(a)})),a.isFunction(c.promise)&&(e(!i.isLoading()),h.nodeSetStatus(b,"loading"),c.done(function(){h.nodeSetStatus(b,"ok")}).fail(function(a){var c;c=a.node&&a.error&&a.message?a:h._makeHookContext(i,null,{error:a,args:Array.prototype.slice.call(arguments),message:a?a.message||a.toString():""}),h._triggerNodeEvent("loadError",c,null)!==!1&&h.nodeSetStatus(b,"error",c.message,c.details)})),a.when(c).done(function(b){var c;a.isPlainObject(b)&&(e(a.isArray(b.children),"source must contain (or be) an array of children"),e(i.isRoot(),"source may only be an object for root nodes"),c=b,b=b.children,delete c.children,a.extend(h.data,c)),e(a.isArray(b),"expected array of children"),i._setChildren(b),h._triggerNodeEvent("loadChildren",i)})},nodeLoadKeyPath:function(){},nodeRemoveChild:function(b,c){var d,f=b.node,g=b.options,h=a.extend({},b,{node:c}),i=f.children;return 1===i.length?(e(c===i[0]),this.nodeRemoveChildren(b)):(this.activeNode&&(c===this.activeNode||this.activeNode.isDescendantOf(c))&&this.activeNode.setActive(!1),this.focusNode&&(c===this.focusNode||this.focusNode.isDescendantOf(c))&&(this.focusNode=null),this.nodeRemoveMarkup(h),this.nodeRemoveChildren(h),d=a.inArray(c,i),e(d>=0),c.visit(function(a){a.parent=null},!0),this._callHook("treeRegisterNode",this,!1,c),g.removeNode&&g.removeNode.call(b.tree,{type:"removeNode"},h),void i.splice(d,1))},nodeRemoveChildMarkup:function(b){var c=b.node;c.ul&&(c.isRoot()?a(c.ul).empty():(a(c.ul).remove(),c.ul=null),c.visit(function(a){a.li=a.ul=null}))},nodeRemoveChildren:function(b){var c,d=b.tree,e=b.node,f=e.children,g=b.options;f&&(this.activeNode&&this.activeNode.isDescendantOf(e)&&this.activeNode.setActive(!1),this.focusNode&&this.focusNode.isDescendantOf(e)&&(this.focusNode=null),this.nodeRemoveChildMarkup(b),c=a.extend({},b),e.visit(function(a){a.parent=null,d._callHook("treeRegisterNode",d,!1,a),g.removeNode&&(c.node=a,g.removeNode.call(b.tree,{type:"removeNode"},c))}),e.children=e.lazy?[]:null,this.nodeRenderStatus(b))},nodeRemoveMarkup:function(b){var c=b.node;c.li&&(a(c.li).remove(),c.li=null),this.nodeRemoveChildMarkup(b)},nodeRender:function(b,d,f,g,h){var i,j,k,l,m,n,o,p=b.node,q=b.tree,r=b.options,s=r.aria,t=!1,u=p.parent,v=!u,w=p.children;if(v||u.ul){if(e(v||u.ul,"parent UL must exist"),v||(p.li&&(d||p.li.parentNode!==p.parent.ul)&&(p.li.parentNode!==p.parent.ul&&this.debug("Unlinking "+p+" (must be child of "+p.parent+")"),this.nodeRemoveMarkup(b)),p.li?this.nodeRenderStatus(b):(t=!0,p.li=c.createElement("li"),p.li.ftnode=p,p.key&&r.generateIds&&(p.li.id=r.idPrefix+p.key),p.span=c.createElement("span"),p.span.className="fancytree-node",s&&a(p.span).attr("aria-labelledby","ftal_"+p.key),p.li.appendChild(p.span),this.nodeRenderTitle(b),r.createNode&&r.createNode.call(q,{type:"createNode"},b)),r.renderNode&&r.renderNode.call(q,{type:"renderNode"},b)),w){if(v||p.expanded||f===!0){for(p.ul||(p.ul=c.createElement("ul"),(g===!0&&!h||!p.expanded)&&(p.ul.style.display="none"),s&&a(p.ul).attr("role","group"),p.li?p.li.appendChild(p.ul):p.tree.$div.append(p.ul)),l=0,m=w.length;m>l;l++)o=a.extend({},b,{node:w[l]}),this.nodeRender(o,d,f,!1,!0);for(i=p.ul.firstChild;i;)k=i.ftnode,k&&k.parent!==p?(p.debug("_fixParent: remove missing "+k,i),n=i.nextSibling,i.parentNode.removeChild(i),i=n):i=i.nextSibling;for(i=p.ul.firstChild,l=0,m=w.length-1;m>l;l++)j=w[l],k=i.ftnode,j!==k?p.ul.insertBefore(j.li,k.li):i=i.nextSibling}}else p.ul&&(this.warn("remove child markup for "+p),this.nodeRemoveChildMarkup(b));v||t&&u.ul.appendChild(p.li)}},nodeRenderTitle:function(a,b){var c,e,f,g,h,i,j=a.node,k=a.tree,l=a.options,m=l.aria,n=j.getLevel(),o=[],p=j.data.icon;b!==d&&(j.title=b),j.span&&(n<l.minExpandLevel?(j.lazy||(j.expanded=!0),n>1&&o.push(m?"<span role='button' class='fancytree-expander fancytree-expander-fixed'></span>":"<span class='fancytree-expander fancytree-expander-fixed''></span>")):o.push(m?"<span role='button' class='fancytree-expander'></span>":"<span class='fancytree-expander'></span>"),l.checkbox&&j.hideCheckbox!==!0&&!j.isStatusNode()&&o.push(m?"<span role='checkbox' class='fancytree-checkbox'></span>":"<span class='fancytree-checkbox'></span>"),g=m?" role='img'":"",(p===!0||p!==!1&&l.icons!==!1)&&(p&&"string"==typeof p?(p="/"===p.charAt(0)?p:(l.imagePath||"")+p,o.push("<img src='"+p+"' class='fancytree-icon' alt='' />")):(e=l.iconClass&&l.iconClass.call(k,j,a)||j.data.iconclass||null,o.push(e?"<span "+g+" class='fancytree-custom-icon "+e+"'></span>":"<span "+g+" class='fancytree-icon'></span>"))),f="",l.renderTitle&&(f=l.renderTitle.call(k,{type:"renderTitle"},a)||""),f||(i=j.tooltip?" title='"+t.escapeHtml(j.tooltip)+"'":"",c=m?" id='ftal_"+j.key+"'":"",g=m?" role='treeitem'":"",h=l.titlesTabbable?" tabindex='0'":"",f="<span "+g+" class='fancytree-title'"+c+i+h+">"+j.title+"</span>"),o.push(f),j.span.innerHTML=o.join(""),this.nodeRenderStatus(a))},nodeRenderStatus:function(b){var c=b.node,d=b.tree,e=b.options,f=c.hasChildren(),g=c.isLastSibling(),h=e.aria,i=a(c.span).find(".fancytree-title"),j=e._classNames,k=[],l=c[d.statusClassPropName];
l&&(k.push(j.node),d.activeNode===c&&k.push(j.active),d.focusNode===c?(k.push(j.focused),h&&i.attr("aria-activedescendant",!0)):h&&i.removeAttr("aria-activedescendant"),c.expanded?(k.push(j.expanded),h&&i.attr("aria-expanded",!0)):h&&i.removeAttr("aria-expanded"),c.folder&&k.push(j.folder),f!==!1&&k.push(j.hasChildren),g&&k.push(j.lastsib),c.lazy&&null==c.children&&k.push(j.lazy),c.partsel&&k.push(j.partsel),c.unselectable&&k.push(j.unselectable),c._isLoading&&k.push(j.loading),c._error&&k.push(j.error),c.selected?(k.push(j.selected),h&&i.attr("aria-selected",!0)):h&&i.attr("aria-selected",!1),c.extraClasses&&k.push(c.extraClasses),k.push(f===!1?j.combinedExpanderPrefix+"n"+(g?"l":""):j.combinedExpanderPrefix+(c.expanded?"e":"c")+(c.lazy&&null==c.children?"d":"")+(g?"l":"")),k.push(j.combinedIconPrefix+(c.expanded?"e":"c")+(c.folder?"f":"")),l.className=k.join(" "),c.li&&(c.li.className=g?j.lastsib:""))},nodeSetActive:function(b,c,d){d=d||{};var f,g=b.node,h=b.tree,i=b.options,j=d.noEvents===!0,m=d.noFocus===!0,n=g===h.activeNode;return c=c!==!1,n===c?k(g):c&&!j&&this._triggerNodeEvent("beforeActivate",g,b.originalEvent)===!1?l(g,["rejected"]):void(c?(h.activeNode&&(e(h.activeNode!==g,"node was active (inconsistency)"),f=a.extend({},b,{node:h.activeNode}),h.nodeSetActive(f,!1),e(null===h.activeNode,"deactivate was out of sync?")),i.activeVisible&&g.makeVisible({scrollIntoView:!1}),h.activeNode=g,h.nodeRenderStatus(b),m||h.nodeSetFocus(b),j||h._triggerNodeEvent("activate",g,b.originalEvent)):(e(h.activeNode===g,"node was not active (inconsistency)"),h.activeNode=null,this.nodeRenderStatus(b),j||b.tree._triggerNodeEvent("deactivate",g,b.originalEvent)))},nodeSetExpanded:function(b,c,e){e=e||{};var f,g,h,i,j,m,n=b.node,o=b.tree,p=b.options,q=e.noAnimation===!0,r=e.noEvents===!0;if(c=c!==!1,n.expanded&&c||!n.expanded&&!c)return k(n);if(c&&!n.lazy&&!n.hasChildren())return k(n);if(!c&&n.getLevel()<p.minExpandLevel)return l(n,["locked"]);if(!r&&this._triggerNodeEvent("beforeExpand",n,b.originalEvent)===!1)return l(n,["rejected"]);if(q||n.isVisible()||(q=e.noAnimation=!0),g=new a.Deferred,c&&!n.expanded&&p.autoCollapse){j=n.getParentList(!1,!0),m=p.autoCollapse;try{for(p.autoCollapse=!1,h=0,i=j.length;i>h;h++)this._callHook("nodeCollapseSiblings",j[h],e)}finally{p.autoCollapse=m}}return g.done(function(){c&&p.autoScroll&&!q?n.getLastChild().scrollIntoView(!0,{topNode:n}).always(function(){r||b.tree._triggerNodeEvent(c?"expand":"collapse",b)}):r||b.tree._triggerNodeEvent(c?"expand":"collapse",b)}),f=function(d){var e,f,g=p.toggleEffect;if(n.expanded=c,o._callHook("nodeRender",b,!1,!1,!0),n.ul)if(e="none"!==n.ul.style.display,f=!!n.expanded,e===f)n.warn("nodeSetExpanded: UL.style.display already set");else{if(g&&!q)return void a(n.ul).toggle(g.effect,g.options,g.duration,function(){d()});n.ul.style.display=n.expanded||!parent?"":"none"}d()},c&&n.lazy&&n.hasChildren()===d?n.load().done(function(){g.notifyWith&&g.notifyWith(n,["loaded"]),f(function(){g.resolveWith(n)})}).fail(function(a){f(function(){g.rejectWith(n,["load failed ("+a+")"])})}):f(function(){g.resolveWith(n)}),g.promise()},nodeSetFocus:function(b,c){var d,e=b.tree,f=b.node;if(c=c!==!1,e.focusNode){if(e.focusNode===f&&c)return;d=a.extend({},b,{node:e.focusNode}),e.focusNode=null,this._triggerNodeEvent("blur",d),this._callHook("nodeRenderStatus",d)}c&&(this.hasFocus()||(f.debug("nodeSetFocus: forcing container focus"),this._callHook("treeSetFocus",b,!0,{calledByNode:!0})),f.makeVisible({scrollIntoView:!1}),e.focusNode=f,this._triggerNodeEvent("focus",b),b.options.autoScroll&&f.scrollIntoView(),this._callHook("nodeRenderStatus",b))},nodeSetSelected:function(a,b){var c=a.node,d=a.tree,e=a.options;if(b=b!==!1,c.debug("nodeSetSelected("+b+")",a),!c.unselectable){if(c.selected&&b||!c.selected&&!b)return!!c.selected;if(this._triggerNodeEvent("beforeSelect",c,a.originalEvent)===!1)return!!c.selected;b&&1===e.selectMode?d.lastSelectedNode&&d.lastSelectedNode.setSelected(!1):3===e.selectMode&&(c.selected=b,c.fixSelection3AfterClick()),c.selected=b,this.nodeRenderStatus(a),d.lastSelectedNode=b?c:null,d._triggerNodeEvent("select",a)}},nodeSetStatus:function(b,c,d,e){function f(){var a=h.children?h.children[0]:null;if(a&&a.isStatusNode()){try{h.ul&&(h.ul.removeChild(a.li),a.li=null)}catch(b){}1===h.children.length?h.children=[]:h.children.shift()}}function g(b,c){var d=h.children?h.children[0]:null;return d&&d.isStatusNode()?(a.extend(d,b),i._callHook("nodeRenderTitle",d)):(b.key="_statusNode",h._setChildren([b]),h.children[0].statusNodeType=c,i.render()),h.children[0]}var h=b.node,i=b.tree;switch(c){case"ok":f(),h._isLoading=!1,h._error=null,h.renderStatus();break;case"loading":h.parent||g({title:i.options.strings.loading+(d?" ("+d+") ":""),tooltip:e,extraClasses:"fancytree-statusnode-wait"},c),h._isLoading=!0,h._error=null,h.renderStatus();break;case"error":g({title:i.options.strings.loadError+(d?" ("+d+") ":""),tooltip:e,extraClasses:"fancytree-statusnode-error"},c),h._isLoading=!1,h._error={message:d,details:e},h.renderStatus();break;default:a.error("invalid node status "+c)}},nodeToggleExpanded:function(a){return this.nodeSetExpanded(a,!a.node.expanded)},nodeToggleSelected:function(a){return this.nodeSetSelected(a,!a.node.selected)},treeClear:function(a){var b=a.tree;b.activeNode=null,b.focusNode=null,b.$div.find(">ul.fancytree-container").empty(),b.rootNode.children=null},treeCreate:function(){},treeDestroy:function(){},treeInit:function(a){this.treeLoad(a)},treeLoad:function(b,c){var d,e,f,g=b.tree,h=b.widget.element,i=a.extend({},b,{node:this.rootNode});if(g.rootNode.children&&this.treeClear(b),c=c||this.options.source)"string"==typeof c&&a.error("Not implemented");else switch(d=h.data("type")||"html"){case"html":e=h.find(">ul:first"),e.addClass("ui-fancytree-source ui-helper-hidden"),c=a.ui.fancytree.parseHtml(e),this.data=a.extend(this.data,n(e));break;case"json":c=a.parseJSON(h.text()),c.children&&(c.title&&(g.title=c.title),c=c.children);break;default:a.error("Invalid data-type: "+d)}return f=this.nodeLoadChildren(i,c).done(function(){g.render(),3===b.options.selectMode&&g.rootNode.fixSelection3FromEndNodes(),g._triggerTreeEvent("init",null,{status:!0})}).fail(function(){g.render(),g._triggerTreeEvent("init",null,{status:!1})})},treeRegisterNode:function(){},treeSetFocus:function(a,b){b=b!==!1,b!==this.hasFocus()&&(this._hasFocus=b,!b&&this.focusNode&&this.focusNode.setFocus(!1),this.$container.toggleClass("fancytree-treefocus",b),this._triggerTreeEvent(b?"focusTree":"blurTree"))}}),a.widget("ui.fancytree",{options:{activeVisible:!0,ajax:{type:"GET",cache:!1,dataType:"json"},aria:!1,autoActivate:!0,autoCollapse:!1,autoScroll:!1,checkbox:!1,clickFolderMode:4,debugLevel:null,disabled:!1,enableAspx:!0,extensions:[],toggleEffect:{effect:"blind",options:{direction:"vertical",scale:"box"},duration:200},generateIds:!1,icons:!0,idPrefix:"ft_",focusOnSelect:!1,keyboard:!0,keyPathSeparator:"/",minExpandLevel:1,quicksearch:!1,scrollOfs:{top:0,bottom:0},scrollParent:null,selectMode:2,strings:{loading:"Loading&#8230;",loadError:"Load error!"},tabbable:!0,titlesTabbable:!1,_classNames:{node:"fancytree-node",folder:"fancytree-folder",combinedExpanderPrefix:"fancytree-exp-",combinedIconPrefix:"fancytree-ico-",hasChildren:"fancytree-has-children",active:"fancytree-active",selected:"fancytree-selected",expanded:"fancytree-expanded",lazy:"fancytree-lazy",focused:"fancytree-focused",partsel:"fancytree-partsel",unselectable:"fancytree-unselectable",lastsib:"fancytree-lastsib",loading:"fancytree-loading",error:"fancytree-error"},lazyLoad:null,postProcess:null},_create:function(){this.tree=new r(this),this.$source=this.source||"json"===this.element.data("type")?this.element:this.element.find(">ul:first");var b,c,f,g=this.options.extensions,h=this.tree;for(f=0;f<g.length;f++)c=g[f],b=a.ui.fancytree._extensions[c],b||a.error("Could not apply extension '"+c+"' (it is not registered, did you forget to include it?)"),this.tree.options[c]=a.extend(!0,{},b.options,this.tree.options[c]),e(this.tree.ext[c]===d,"Extension name must not exist as Fancytree.ext attribute: '"+c+"'"),this.tree.ext[c]={},j(this.tree,h,b,c),h=b;this.tree._callHook("treeCreate",this.tree)},_init:function(){this.tree._callHook("treeInit",this.tree),this._bind()},_setOption:function(b,c){var d=!0,e=!1;switch(b){case"aria":case"checkbox":case"icons":case"minExpandLevel":case"tabbable":this.tree._callHook("treeCreate",this.tree),e=!0;break;case"source":d=!1,this.tree._callHook("treeLoad",this.tree,c)}this.tree.debug("set option "+b+"="+c+" <"+typeof c+">"),d&&a.Widget.prototype._setOption.apply(this,arguments),e&&this.tree.render(!0,!1)},destroy:function(){this._unbind(),this.tree._callHook("treeDestroy",this.tree),this.tree.$div.find(">ul.fancytree-container").remove(),this.$source&&this.$source.removeClass("ui-helper-hidden"),a.Widget.prototype.destroy.call(this)},_unbind:function(){var b=this.tree._ns;this.element.unbind(b),this.tree.$container.unbind(b),a(c).unbind(b)},_bind:function(){var a=this,b=this.options,c=this.tree,d=c._ns;this._unbind(),c.$container.on("focusin"+d+" focusout"+d,function(a){var b=t.getNode(a),d="focusin"===a.type;b?c._callHook("nodeSetFocus",b,d):c._callHook("treeSetFocus",c,d)}).on("selectstart"+d,"span.fancytree-title",function(a){a.preventDefault()}).on("keydown"+d,function(a){if(b.disabled||b.keyboard===!1)return!0;var d,e=c.focusNode,f=c._makeHookContext(e||c,a),g=c.phase;try{return c.phase="userEvent",d=e?c._triggerNodeEvent("keydown",e,a):c._triggerTreeEvent("keydown",a),"preventNav"===d?d=!0:d!==!1&&(d=c._callHook("nodeKeydown",f)),d}finally{c.phase=g}}).on("click"+d+" dblclick"+d,function(c){if(b.disabled)return!0;var d,e=t.getEventTarget(c),f=e.node,g=a.tree,h=g.phase;if(!f)return!0;d=g._makeHookContext(f,c);try{switch(g.phase="userEvent",c.type){case"click":return d.targetType=e.type,g._triggerNodeEvent("click",d,c)===!1?!1:g._callHook("nodeClick",d);case"dblclick":return d.targetType=e.type,g._triggerNodeEvent("dblclick",d,c)===!1?!1:g._callHook("nodeDblclick",d)}}finally{g.phase=h}})},getActiveNode:function(){return this.tree.activeNode},getNodeByKey:function(a){return this.tree.getNodeByKey(a)},getRootNode:function(){return this.tree.rootNode},getTree:function(){return this.tree}}),t=a.ui.fancytree,a.extend(a.ui.fancytree,{version:"2.8.1",buildType: "production",debugLevel: 1,_nextId:1,_nextNodeKey:1,_extensions:{},_FancytreeClass:r,_FancytreeNodeClass:q,jquerySupports:{positionMyOfs:h(a.ui.version,1,9)},assert:function(a,b){return e(a,b)},debounce:function(a,b,c,d){var e;return 3===arguments.length&&"boolean"!=typeof c&&(d=c,c=!1),function(){var f=arguments;d=d||this,c&&!e&&b.apply(d,f),clearTimeout(e),e=setTimeout(function(){c||b.apply(d,f),e=null},a)}},debug:function(){a.ui.fancytree.debugLevel>=2&&f("log",arguments)},error:function(){f("error",arguments)},escapeHtml:function(a){return(""+a).replace(/[&<>"'\/]/g,function(a){return u[a]})},fixPositionOptions:function(b){if((b.offset||(""+b.my+b.at).indexOf("%")>=0)&&a.error("expected new position syntax (but '%' is not supported)"),!a.ui.fancytree.jquerySupports.positionMyOfs){var c=/(\w+)([+-]?\d+)?\s+(\w+)([+-]?\d+)?/.exec(b.my),d=/(\w+)([+-]?\d+)?\s+(\w+)([+-]?\d+)?/.exec(b.at),e=(c[2]?+c[2]:0)+(d[2]?+d[2]:0),f=(c[4]?+c[4]:0)+(d[4]?+d[4]:0);b=a.extend({},b,{my:c[1]+" "+c[3],at:d[1]+" "+d[3]}),(e||f)&&(b.offset=""+e+" "+f)}return b},getEventTargetType:function(a){return this.getEventTarget(a).type},getEventTarget:function(b){var c=b&&b.target?b.target.className:"",e={node:this.getNode(b.target),type:d};return/\bfancytree-title\b/.test(c)?e.type="title":/\bfancytree-expander\b/.test(c)?e.type=e.node.hasChildren()===!1?"prefix":"expander":/\bfancytree-checkbox\b/.test(c)||/\bfancytree-radio\b/.test(c)?e.type="checkbox":/\bfancytree-icon\b/.test(c)?e.type="icon":/\bfancytree-node\b/.test(c)?e.type="title":b&&b.target&&a(b.target).closest(".fancytree-title").length&&(e.type="title"),e},getNode:function(a){if(a instanceof q)return a;for(a.selector!==d?a=a[0]:a.originalEvent!==d&&(a=a.target);a;){if(a.ftnode)return a.ftnode;a=a.parentNode}return null},info:function(){a.ui.fancytree.debugLevel>=1&&f("info",arguments)},eventToString:function(a){var b=a.which,c=a.type,d=[];return a.altKey&&d.push("alt"),a.ctrlKey&&d.push("ctrl"),a.metaKey&&d.push("meta"),a.shiftKey&&d.push("shift"),"click"===c||"dblclick"===c?d.push(x[a.button]+c):v[b]||d.push(w[b]||String.fromCharCode(b).toLowerCase()),d.join("+")},keyEventToString:function(a){return this.warn("keyEventToString() is deprecated: use eventToString()"),this.eventToString(a)},parseHtml:function(b){var c,e,f,g,h,i,j,k,l=b.find(">li"),m=[];return l.each(function(){var l,o=a(this),p=o.find(">span:first",this),q=p.length?null:o.find(">a:first"),r={tooltip:null,data:{}};for(p.length?r.title=p.html():q&&q.length?(r.title=q.html(),r.data.href=q.attr("href"),r.data.target=q.attr("target"),r.tooltip=q.attr("title")):(r.title=o.html(),g=r.title.search(/<ul/i),g>=0&&(r.title=r.title.substring(0,g))),r.title=a.trim(r.title),e=0,f=y.length;f>e;e++)r[y[e]]=d;for(j=this.className.split(" "),c=[],e=0,f=j.length;f>e;e++)k=j[e],z[k]?r[k]=!0:c.push(k);if(r.extraClasses=c.join(" "),h=o.attr("title"),h&&(r.tooltip=h),h=o.attr("id"),h&&(r.key=h),l=n(o),l&&!a.isEmptyObject(l)){for(e=0,f=A.length;f>e;e++)h=A[e],i=l[h],null!=i&&(delete l[h],r[h]=i);a.extend(r.data,l)}b=o.find(">ul:first"),r.children=b.length?a.ui.fancytree.parseHtml(b):r.lazy?d:null,m.push(r)}),m},registerExtension:function(b){e(null!=b.name,"extensions must have a `name` property."),e(null!=b.version,"extensions must have a `version` property."),a.ui.fancytree._extensions[b.name]=b},unescapeHtml:function(a){var b=c.createElement("div");return b.innerHTML=a,0===b.childNodes.length?"":b.childNodes[0].nodeValue},warn:function(){f("warn",arguments)}})}(jQuery,window,document);
 /**!
 * jquery.fancytree.contextmenu.js
 * 3rd party jQuery Context menu extension for jQuery Fancytree
 *
 * Authors: Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://medialize.github.com/jQuery-contextMenu/
 *
 * Copyright (c) 2012, Martin Wendt (http://wwWendt.de)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://code.google.com/p/fancytree/wiki/LicenseInfe
 */
(function($, document) {
	"use strict";

	var initContextMenu = function(tree, selector, menu, actions) {
		tree.$container.on("mousedown.contextMenu", function(event) {
			var node = $.ui.fancytree.getNode(event);

			if(node) {
        $.contextMenu("destroy", "." + selector);

				node.setFocus(true);
				node.setActive(true);

				$.contextMenu({
					selector: "." + selector,
                                        className: 'dropdown-menu fdropdownActions',
					build: function($trigger, e) {
						node = $.ui.fancytree.getNode($trigger);

						var menuItems = { };
						if($.isFunction(menu)) {
							menuItems = menu(node);
						} else if($.isPlainObject(menu)) {
							menuItems = menu;
						}

						return {
							callback: function(action, options) {
								if($.isFunction(actions)) {
									actions(node, action, options);
								} else if($.isPlainObject(actions)) {
									if(actions.hasOwnProperty(action) && $.isFunction(actions[action])) {
										actions[action](node, options);
									}
								}
							},
							items: menuItems
						};
					}
				});
			}
		});
	};

	$.ui.fancytree.registerExtension({
		name: "contextMenu",
		version: "1.0",
		contextMenu: {
      selector: "fancytree-title",
			menu: {},
			actions: {}
		},
		treeInit: function(ctx) {
			this._superApply(arguments);
			initContextMenu(ctx.tree,
                      ctx.options.contextMenu.selector || "fancytree-title",
                      ctx.options.contextMenu.menu,
                      ctx.options.contextMenu.actions);
		}
	});
}(jQuery, document));                                               
//# sourceMappingURL=jquery.fancytree.min.js.map

/*!
 * jquery.fancytree.dnd.js
 *
 * Drag-and-drop support.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2014, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version @VERSION
 * @date @DATE
 */
;(function($,window,document,undefined){var logMsg=$.ui.fancytree.debug,didRegisterDnd=false;function offsetString(n){return n===0?"":((n>0)?("+"+n):(""+n))}function _initDragAndDrop(tree){var dnd=tree.options.dnd||null;if(dnd){_registerDnd()}if(dnd&&dnd.dragStart){tree.widget.element.draggable({addClasses:false,appendTo:"body",containment:false,delay:0,distance:4,revert:false,scroll:true,scrollSpeed:7,scrollSensitivity:10,connectToFancytree:true,helper:function(event){var sourceNode=$.ui.fancytree.getNode(event.target);if(!sourceNode){return"<div>ERROR?: helper requested but sourceNode not found</div>"}return sourceNode.tree.ext.dnd._onDragEvent("helper",sourceNode,null,event,null,null)},start:function(event,ui){var sourceNode=ui.helper.data("ftSourceNode");return !!sourceNode}})}if(dnd&&dnd.dragDrop){tree.widget.element.droppable({addClasses:false,tolerance:"intersect",greedy:false})}}function _registerDnd(){if(didRegisterDnd){return}$.ui.plugin.add("draggable","connectToFancytree",{start:function(event,ui){var draggable=$(this).data("ui-draggable")||$(this).data("draggable"),sourceNode=ui.helper.data("ftSourceNode")||null;if(sourceNode){draggable.offset.click.top=-2;draggable.offset.click.left=+16;return sourceNode.tree.ext.dnd._onDragEvent("start",sourceNode,null,event,ui,draggable)}},drag:function(event,ui){var isHelper,draggable=$(this).data("ui-draggable")||$(this).data("draggable"),sourceNode=ui.helper.data("ftSourceNode")||null,prevTargetNode=ui.helper.data("ftTargetNode")||null,targetNode=$.ui.fancytree.getNode(event.target);if(event.target&&!targetNode){isHelper=$(event.target).closest("div.fancytree-drag-helper,#fancytree-drop-marker").length>0;if(isHelper){logMsg("Drag event over helper: ignored.");return}}ui.helper.data("ftTargetNode",targetNode);if(prevTargetNode&&prevTargetNode!==targetNode){prevTargetNode.tree.ext.dnd._onDragEvent("leave",prevTargetNode,sourceNode,event,ui,draggable)}if(targetNode){if(!targetNode.tree.options.dnd.dragDrop){}else{if(targetNode===prevTargetNode){targetNode.tree.ext.dnd._onDragEvent("over",targetNode,sourceNode,event,ui,draggable)}else{targetNode.tree.ext.dnd._onDragEvent("enter",targetNode,sourceNode,event,ui,draggable)}}}},stop:function(event,ui){var draggable=$(this).data("ui-draggable")||$(this).data("draggable"),sourceNode=ui.helper.data("ftSourceNode")||null,targetNode=ui.helper.data("ftTargetNode")||null,eventType=event.type,dropped=(eventType==="mouseup"&&event.which===1);if(!dropped){logMsg("Drag was cancelled")}if(targetNode){if(dropped){targetNode.tree.ext.dnd._onDragEvent("drop",targetNode,sourceNode,event,ui,draggable)}targetNode.tree.ext.dnd._onDragEvent("leave",targetNode,sourceNode,event,ui,draggable)}if(sourceNode){sourceNode.tree.ext.dnd._onDragEvent("stop",sourceNode,null,event,ui,draggable)}}});didRegisterDnd=true}$.ui.fancytree.registerExtension({name:"dnd",version:"0.1.0",options:{dragStart:null,dragStop:null,autoExpandMS:1000,preventVoidMoves:true,preventRecursiveMoves:true,dragEnter:null,dragOver:null,dragDrop:null,dragLeave:null},treeInit:function(ctx){var tree=ctx.tree;this._super(ctx);_initDragAndDrop(tree)},nodeKeydown:function(ctx){var event=ctx.originalEvent;if(event.which===$.ui.keyCode.ESCAPE){this._local._cancelDrag()}return this._super(ctx)},_setDndStatus:function(sourceNode,targetNode,helper,hitMode,accept){var posOpts,markerOffsetX=0,markerAt="center",instData=this._local,$source=sourceNode?$(sourceNode.span):null,$target=$(targetNode.span);if(!instData.$dropMarker){instData.$dropMarker=$("<div id='fancytree-drop-marker'></div>").hide().css({"z-index":1000}).prependTo($(this.$div).parent())}if(hitMode==="after"||hitMode==="before"||hitMode==="over"){switch(hitMode){case"before":instData.$dropMarker.removeClass("fancytree-drop-after fancytree-drop-over");instData.$dropMarker.addClass("fancytree-drop-before");markerAt="top";break;case"after":instData.$dropMarker.removeClass("fancytree-drop-before fancytree-drop-over");instData.$dropMarker.addClass("fancytree-drop-after");markerAt="bottom";break;default:instData.$dropMarker.removeClass("fancytree-drop-after fancytree-drop-before");instData.$dropMarker.addClass("fancytree-drop-over");$target.addClass("fancytree-drop-target");markerOffsetX=8}if($.ui.fancytree.jquerySupports.positionMyOfs){posOpts={my:"left"+offsetString(markerOffsetX)+" center",at:"left "+markerAt,of:$target}}else{posOpts={my:"left center",at:"left "+markerAt,of:$target,offset:""+markerOffsetX+" 0"}}instData.$dropMarker.show().position(posOpts)}else{$target.removeClass("fancytree-drop-target");instData.$dropMarker.hide()}if(hitMode==="after"){$target.addClass("fancytree-drop-after")}else{$target.removeClass("fancytree-drop-after")}if(hitMode==="before"){$target.addClass("fancytree-drop-before")}else{$target.removeClass("fancytree-drop-before")}if(accept===true){if($source){$source.addClass("fancytree-drop-accept")}$target.addClass("fancytree-drop-accept");helper.addClass("fancytree-drop-accept")}else{if($source){$source.removeClass("fancytree-drop-accept")}$target.removeClass("fancytree-drop-accept");helper.removeClass("fancytree-drop-accept")}if(accept===false){if($source){$source.addClass("fancytree-drop-reject")}$target.addClass("fancytree-drop-reject");helper.addClass("fancytree-drop-reject")}else{if($source){$source.removeClass("fancytree-drop-reject")}$target.removeClass("fancytree-drop-reject");helper.removeClass("fancytree-drop-reject")}},_onDragEvent:function(eventName,node,otherNode,event,ui,draggable){if(eventName!=="over"){logMsg("tree.ext.dnd._onDragEvent(%s, %o, %o) - %o",eventName,node,otherNode,this)}var $helper,nodeOfs,relPos,relPos2,enterResponse,hitMode,r,opts=this.options,dnd=opts.dnd,ctx=this._makeHookContext(node,event,{otherNode:otherNode,ui:ui,draggable:draggable}),res=null,nodeTag=$(node.span);switch(eventName){case"helper":$helper=$("<div class='fancytree-drag-helper'><span class='fancytree-drag-helper-img' /></div>").append(nodeTag.find("span.fancytree-title").clone());$("ul.fancytree-container",node.tree.$div).append($helper);$helper.data("ftSourceNode",node);res=$helper;break;case"start":if(node.isStatusNode()){res=false}else{if(dnd.dragStart){res=dnd.dragStart(node,ctx)}}if(res===false){this.debug("tree.dragStart() cancelled");ui.helper.trigger("mouseup");ui.helper.hide()}else{nodeTag.addClass("fancytree-drag-source")}break;case"enter":if(dnd.preventRecursiveMoves&&node.isDescendantOf(otherNode)){r=false}else{r=dnd.dragEnter?dnd.dragEnter(node,ctx):null}if(!r){res=false}else{if($.isArray(r)){res={over:($.inArray("over",r)>=0),before:($.inArray("before",r)>=0),after:($.inArray("after",r)>=0)}}else{res={over:((r===true)||(r==="over")),before:((r===true)||(r==="before")),after:((r===true)||(r==="after"))}}}ui.helper.data("enterResponse",res);logMsg("helper.enterResponse: %o",res);break;case"over":enterResponse=ui.helper.data("enterResponse");hitMode=null;if(enterResponse===false){}else{if(typeof enterResponse==="string"){hitMode=enterResponse}else{nodeOfs=nodeTag.offset();relPos={x:event.pageX-nodeOfs.left,y:event.pageY-nodeOfs.top};relPos2={x:relPos.x/nodeTag.width(),y:relPos.y/nodeTag.height()};if(enterResponse.after&&relPos2.y>0.75){hitMode="after"}else{if(!enterResponse.over&&enterResponse.after&&relPos2.y>0.5){hitMode="after"}else{if(enterResponse.before&&relPos2.y<=0.25){hitMode="before"}else{if(!enterResponse.over&&enterResponse.before&&relPos2.y<=0.5){hitMode="before"}else{if(enterResponse.over){hitMode="over"}}}}}if(dnd.preventVoidMoves){if(node===otherNode){logMsg("    drop over source node prevented");hitMode=null}else{if(hitMode==="before"&&otherNode&&node===otherNode.getNextSibling()){logMsg("    drop after source node prevented");hitMode=null}else{if(hitMode==="after"&&otherNode&&node===otherNode.getPrevSibling()){logMsg("    drop before source node prevented");hitMode=null}else{if(hitMode==="over"&&otherNode&&otherNode.parent===node&&otherNode.isLastSibling()){logMsg("    drop last child over own parent prevented");hitMode=null}}}}}ui.helper.data("hitMode",hitMode)}}if(hitMode==="over"&&dnd.autoExpandMS&&node.hasChildren()!==false&&!node.expanded){node.scheduleAction("expand",dnd.autoExpandMS)}if(hitMode&&dnd.dragOver){ctx.hitMode=hitMode;res=dnd.dragOver(node,ctx)}this._local._setDndStatus(otherNode,node,ui.helper,hitMode,res!==false&&hitMode!==null);break;case"drop":hitMode=ui.helper.data("hitMode");if(hitMode&&dnd.dragDrop){ctx.hitMode=hitMode;dnd.dragDrop(node,ctx)}break;case"leave":node.scheduleAction("cancel");ui.helper.data("enterResponse",null);ui.helper.data("hitMode",null);this._local._setDndStatus(otherNode,node,ui.helper,"out",undefined);if(dnd.dragLeave){dnd.dragLeave(node,ctx)}break;case"stop":nodeTag.removeClass("fancytree-drag-source");if(dnd.dragStop){dnd.dragStop(node,ctx)}break;default:throw"Unsupported drag event: "+eventName}return res},_cancelDrag:function(){var dd=$.ui.ddmanager.current;if(dd){dd.cancel()}}})}(jQuery,window,document));
/*!
 * jquery.fancytree.filter.js
 *
 * Remove or highlight tree nodes, based on a filter.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2014, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version @VERSION
 * @date @DATE
 */
;(function($,window,document,undefined){function _escapeRegex(str){return(str+"").replace(/([.?*+\^\$\[\]\\(){}|-])/g,"\\$1")}$.ui.fancytree._FancytreeClass.prototype.applyFilter=function(filter){var match,re,count=0,leavesOnly=this.options.filter.leavesOnly;if(typeof filter==="string"){match=_escapeRegex(filter);re=new RegExp(".*"+match+".*","i");filter=function(node){return !!re.exec(node.title)}}this.enableFilter=true;this.$div.addClass("fancytree-ext-filter");if(this.options.filter.mode==="hide"){this.$div.addClass("fancytree-ext-filter-hide")}else{this.$div.addClass("fancytree-ext-filter-dimm")}this.visit(function(node){node.hide=true;delete node.match;delete node.subMatch});this.visit(function(node){if((!leavesOnly||node.children==null)&&filter(node)){count++;node.hide=false;node.match=true;node.visitParents(function(p){p.hide=false;p.subMatch=true})}});this.render();return count};$.ui.fancytree._FancytreeClass.prototype.clearFilter=function(){this.visit(function(node){delete node.hide;delete node.match;delete node.subMatch});this.enableFilter=false;this.$div.removeClass("fancytree-ext-filter fancytree-ext-filter-dimm fancytree-ext-filter-hide");this.render()};$.ui.fancytree.registerExtension({name:"filter",version:"0.0.2",options:{mode:"dimm",leavesOnly:false},treeInit:function(ctx){this._super(ctx)},treeDestroy:function(ctx){this._super(ctx)},nodeRenderStatus:function(ctx){var res,node=ctx.node,tree=ctx.tree,$span=$(node[tree.statusClassPropName]);res=this._super(ctx);if(!$span.length){return res}if(!tree.enableFilter){return res}$span.toggleClass("fancytree-match",!!node.match);$span.toggleClass("fancytree-submatch",!!node.subMatch);$span.toggleClass("fancytree-hide",!!node.hide);return res}})}(jQuery,window,document));
/*!
 * jquery.fancytree.childcounter.js
 *
 * Add a child counter bubble to tree nodes.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2014, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version @VERSION
 * @date @DATE
 */
;(function($,undefined){$.ui.fancytree._FancytreeClass.prototype.countSelected=function(topOnly){var tree=this,treeOptions=tree.options;return tree.getSelectedNodes(topOnly).length};$.ui.fancytree._FancytreeNodeClass.prototype.toUpper=function(){var node=this;return node.setTitle(node.title.toUpperCase())};$.ui.fancytree.prototype.widgetMethod1=function(arg1){var tree=this.tree;return arg1};$.ui.fancytree.registerExtension({name:"childcounter",version:"1.0.0",options:{deep:true,hideZeros:true,hideExpanded:false},foo:42,_appendCounter:function(bar){var tree=this},treeInit:function(ctx){var tree=this,opts=ctx.options,extOpts=ctx.options.childcounter;this._super(ctx);this.$container.addClass("fancytree-ext-childcounter")},treeDestroy:function(ctx){this._super(ctx)},nodeRenderTitle:function(ctx,title){var node=ctx.node,extOpts=ctx.options.childcounter,count=node.countChildren(extOpts.deep);this._super(ctx,title);if((count||!extOpts.hideZeros)&&(!node.isExpanded()||!extOpts.hideExpanded)){$("span.fancytree-icon",node.span).append($("<span class='fancytree-childcounter'/>").text(count))}},nodeSetExpanded:function(ctx,flag,opts){var tree=ctx.tree,node=ctx.node;return this._super(ctx,flag,opts).always(function(){tree.nodeRenderTitle(ctx)})}})}(jQuery));
/*!
 * jquery.fancytree.glyph.js
 *
 * Use glyph fonts as instead of icon sprites.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2014, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version @VERSION
 * @date @DATE
 */
;(function($,window,document,undefined){function _getIcon(opts,type){return opts.map[type]}$.ui.fancytree.registerExtension({name:"glyph",version:"0.0.2",options:{prefix:"icon-",extra:null,map:{doc:"icon-file-alt",docOpen:"icon-file-alt",checkbox:"icon-check-empty",checkboxSelected:"icon-check",checkboxUnknown:"icon-check icon-muted",error:"icon-exclamation-sign",expanderClosed:"icon-caret-right",expanderLazy:"icon-angle-right",expanderOpen:"icon-caret-down",folder:"icon-folder-close-alt",folderOpen:"icon-folder-open-alt",loading:"icon-refresh icon-spin"},icon:null},treeInit:function(ctx){var tree=ctx.tree;this._super(ctx);tree.$container.addClass("fancytree-ext-glyph")},nodeRenderStatus:function(ctx){var icon,span,node=ctx.node,opts=ctx.options.glyph,map=opts.map;this._super(ctx);if(node.isRoot()){return}span=$("span.fancytree-expander",node.span).get(0);if(span){if(node.isLoading()){icon="loading"}else{if(node.expanded){icon="expanderOpen"}else{if(node.isUndefined()){icon="expanderLazy"}else{icon="expanderClosed"}}}span.className="fancytree-expander "+map[icon]}span=$("span.fancytree-checkbox",node.span).get(0);if(span){icon=node.selected?"checkboxSelected":(node.partsel?"checkboxUnknown":"checkbox");span.className="fancytree-checkbox "+map[icon]}span=$("span.fancytree-icon",node.span).get(0);if(span){if(node.folder){icon=node.expanded?_getIcon(opts,"folderOpen"):_getIcon(opts,"folder")}else{icon=node.expanded?_getIcon(opts,"docOpen"):_getIcon(opts,"doc")}span.className="fancytree-icon "+icon}},nodeSetStatus:function(ctx,status,message,details){var span,opts=ctx.options.glyph,node=ctx.node;this._super(ctx,status,message,details);if(node.parent){span=$("span.fancytree-expander",node.span).get(0)}else{span=$(".fancytree-statusnode-wait, .fancytree-statusnode-error",node[this.nodeContainerAttrName]).find("span.fancytree-expander").get(0)}if(status==="loading"){span.className="fancytree-expander "+_getIcon(opts,"loading")}else{if(status==="error"){span.className="fancytree-expander "+_getIcon(opts,"error")}}}})}(jQuery,window,document));


String.prototype.trunc=function(strLen,separator){if(this.length<=strLen)return this;separator=separator||'...';var sepLen=separator.length,charsToShow=strLen-sepLen,frontChars=Math.ceil(charsToShow/2),backChars=Math.floor(charsToShow/2);return this.substr(0,frontChars)+separator+this.substr(this.length-backChars)};String.prototype.strip=function(){var regex=/(<([^>]+)>)/ig,body=this,result=body.replace(regex,"");return result};

(function(i){var e="0.4.2",j="hasOwnProperty",b=/[\.\/]/,a="*",g=function(){},f=function(m,l){return m-l},d,h,k={n:{}},c=function(m,C){m=String(m);var v=k,s=h,w=Array.prototype.slice.call(arguments,2),y=c.listeners(m),x=0,u=false,p,o=[],t={},q=[],n=d,A=[];d=m;h=0;for(var r=0,B=y.length;r<B;r++){if("zIndex" in y[r]){o.push(y[r].zIndex);if(y[r].zIndex<0){t[y[r].zIndex]=y[r]}}}o.sort(f);while(o[x]<0){p=t[o[x++]];q.push(p.apply(C,w));if(h){h=s;return q}}for(r=0;r<B;r++){p=y[r];if("zIndex" in p){if(p.zIndex==o[x]){q.push(p.apply(C,w));if(h){break}do{x++;p=t[o[x]];p&&q.push(p.apply(C,w));if(h){break}}while(p)}else{t[p.zIndex]=p}}else{q.push(p.apply(C,w));if(h){break}}}h=s;d=n;return q.length?q:null};c._events=k;c.listeners=function(l){var t=l.split(b),r=k,x,s,m,p,w,o,q,u,v=[r],n=[];for(p=0,w=t.length;p<w;p++){u=[];for(o=0,q=v.length;o<q;o++){r=v[o].n;s=[r[t[p]],r[a]];m=2;while(m--){x=s[m];if(x){u.push(x);n=n.concat(x.f||[])}}}v=u}return n};c.on=function(l,o){l=String(l);if(typeof o!="function"){return function(){}}var q=l.split(b),p=k;for(var m=0,n=q.length;m<n;m++){p=p.n;p=p.hasOwnProperty(q[m])&&p[q[m]]||(p[q[m]]={n:{}})}p.f=p.f||[];for(m=0,n=p.f.length;m<n;m++){if(p.f[m]==o){return g}}p.f.push(o);return function(r){if(+r==+r){o.zIndex=+r}}};c.f=function(m){var l=[].slice.call(arguments,1);return function(){c.apply(null,[m,null].concat(l).concat([].slice.call(arguments,0)))}};c.stop=function(){h=1};c.nt=function(l){if(l){return new RegExp("(?:\\.|\\/|^)"+l+"(?:\\.|\\/|$)").test(d)}return d};c.nts=function(){return d.split(b)};c.off=c.unbind=function(m,r){if(!m){c._events=k={n:{}};return}var t=m.split(b),s,v,n,p,w,o,q,u=[k];for(p=0,w=t.length;p<w;p++){for(o=0;o<u.length;o+=n.length-2){n=[o,1];s=u[o].n;if(t[p]!=a){if(s[t[p]]){n.push(s[t[p]])}}else{for(v in s){if(s[j](v)){n.push(s[v])}}}u.splice.apply(u,n)}}for(p=0,w=u.length;p<w;p++){s=u[p];while(s.n){if(r){if(s.f){for(o=0,q=s.f.length;o<q;o++){if(s.f[o]==r){s.f.splice(o,1);break}}!s.f.length&&delete s.f}for(v in s.n){if(s.n[j](v)&&s.n[v].f){var l=s.n[v].f;for(o=0,q=l.length;o<q;o++){if(l[o]==r){l.splice(o,1);break}}!l.length&&delete s.n[v].f}}}else{delete s.f;for(v in s.n){if(s.n[j](v)&&s.n[v].f){delete s.n[v].f}}}s=s.n}}};c.once=function(l,m){var n=function(){c.unbind(l,n);return m.apply(this,arguments)};return c.on(l,n)};c.version=e;c.toString=function(){return"You are running Eve "+e};(typeof module!="undefined"&&module.exports)?(module.exports=c):(typeof define!="undefined"?(define("eve",[],function(){return c})):(i.eve=c))})(window||this);(function(b,a){if(typeof define==="function"&&define.amd){define(["eve"],function(c){return a(b,c)})}else{a(b,b.eve)}}(this,function(aT,bc){function bi(g){if(bi.is(g,"function")){return K?g():bc.on("raphael.DOMload",g)}else{if(bi.is(g,u)){return bi._engine.create[bs](bi,g.splice(0,3+bi.is(g[0],bj))).add(g)}else{var b=Array.prototype.slice.call(arguments,0);if(bi.is(b[b.length-1],"function")){var d=b.pop();return K?d.call(bi._engine.create[bs](bi,b)):bc.on("raphael.DOMload",function(){d.call(bi._engine.create[bs](bi,b))})}else{return bi._engine.create[bs](bi,arguments)}}}}bi.version="2.1.2";bi.eve=bc;var K,bv=/[, ]+/,au={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},W=/\{(\d+)\}/g,bz="prototype",bw="hasOwnProperty",a5={doc:document,win:aT},aE={was:Object.prototype[bw].call(a5.win,"Raphael"),is:a5.win.Raphael},bJ=function(){this.ca=this.customAttributes={}},ao,bA="appendChild",bs="apply",av="concat",O=("ontouchstart" in a5.win)||a5.win.DocumentTouch&&a5.doc instanceof DocumentTouch,bn="",bh=" ",k=String,l="split",bB="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[l](bh),bp={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},aj=k.prototype.toLowerCase,aI=Math,bI=aI.max,ai=aI.min,ak=aI.abs,aS=aI.pow,ag=aI.PI,bj="number",a="string",u="array",s="toString",A="fill",aM=Object.prototype.toString,bC={},r="push",aa=bi._ISURL=/^url\(['"]?([^\)]+?)['"]?\)[ ]*(.*)$/i,Z=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,B={"NaN":1,"Infinity":1,"-Infinity":1},an=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,C=aI.round,P="setAttribute",bM=parseFloat,bK=parseInt,aU=k.prototype.toUpperCase,bq=bi._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},bo=bi._availableAnimAttrs={blur:bj,"clip-rect":"csv",cx:bj,cy:bj,fill:"colour","fill-opacity":bj,"font-size":bj,height:bj,opacity:bj,path:"path",r:bj,rx:bj,ry:bj,stroke:"colour","stroke-opacity":bj,"stroke-width":bj,transform:"transform",width:bj,x:bj,y:bj},bt=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,bf=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,ax={hs:1,rg:1},aN=/,?([achlmqrstvxz]),?/gi,bg=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,ac=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,ap=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,a2=bi._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,M={},x=function(g,d){return g.key-d.key},bu=function(g,d){return bM(g)-bM(d)},ad=function(){},aw=function(b){return b},q=bi._rectPath=function(b,E,d,g,i){if(i){return[["M",b+i,E],["l",d-i*2,0],["a",i,i,0,0,1,i,i],["l",0,g-i*2],["a",i,i,0,0,1,-i,i],["l",i*2-d,0],["a",i,i,0,0,1,-i,-i],["l",0,i*2-g],["a",i,i,0,0,1,i,-i],["z"]]}return[["M",b,E],["l",d,0],["l",0,g],["l",-d,0],["z"]]},U=function(b,i,g,d){if(d==null){d=g}return[["M",b,i],["m",0,-d],["a",g,d,0,1,1,0,2*d],["a",g,d,0,1,1,0,-2*d],["z"]]},af=bi._getPath={path:function(b){return b.attr("path")},circle:function(d){var b=d.attrs;return U(b.cx,b.cy,b.r)},ellipse:function(d){var b=d.attrs;return U(b.cx,b.cy,b.rx,b.ry)},rect:function(d){var b=d.attrs;return q(b.x,b.y,b.width,b.height,b.r)},image:function(d){var b=d.attrs;return q(b.x,b.y,b.width,b.height)},text:function(b){var d=b._getBBox();return q(d.x,d.y,d.width,d.height)},set:function(b){var d=b._getBBox();return q(d.x,d.y,d.width,d.height)}},Q=bi.mapPath=function(bQ,S){if(!S){return bQ}var bO,R,g,b,bP,E,d;bQ=bk(bQ);for(g=0,bP=bQ.length;g<bP;g++){d=bQ[g];for(b=1,E=d.length;b<E;b+=2){bO=S.x(d[b],d[b+1]);R=S.y(d[b],d[b+1]);d[b]=bO;d[b+1]=R}}return bQ};bi._g=a5;bi.type=(a5.win.SVGAngle||a5.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML");if(bi.type=="VML"){var a7=a5.doc.createElement("div"),a8;a7.innerHTML='<v:shape adj="1"/>';a8=a7.firstChild;a8.style.behavior="url(#default#VML)";if(!(a8&&typeof a8.adj=="object")){return(bi.type=bn)}a7=null}bi.svg=!(bi.vml=bi.type=="VML");bi._Paper=bJ;bi.fn=ao=bJ.prototype=bi.prototype;bi._id=0;bi._oid=0;bi.is=function(d,b){b=aj.call(b);if(b=="finite"){return !B[bw](+d)}if(b=="array"){return d instanceof Array}return(b=="null"&&d===null)||(b==typeof d&&d!==null)||(b=="object"&&d===Object(d))||(b=="array"&&Array.isArray&&Array.isArray(d))||aM.call(d).slice(8,-1).toLowerCase()==b};function bl(g){if(typeof g=="function"||Object(g)!==g){return g}var d=new g.constructor;for(var b in g){if(g[bw](b)){d[b]=bl(g[b])}}return d}bi.angle=function(E,S,g,R,d,i){if(d==null){var b=E-g,bO=S-R;if(!b&&!bO){return 0}return(180+aI.atan2(-bO,-b)*180/ag+360)%360}else{return bi.angle(E,S,d,i)-bi.angle(g,R,d,i)}};bi.rad=function(b){return b%360*ag/180};bi.deg=function(b){return b*180/ag%360};bi.snapTo=function(d,E,b){b=bi.is(b,"finite")?b:10;if(bi.is(d,u)){var g=d.length;while(g--){if(ak(d[g]-E)<=b){return d[g]}}}else{d=+d;var R=E%d;if(R<b){return E-R}if(R>d-b){return E-R+d}}return E};var aQ=bi.createUUID=(function(b,d){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(b,d).toUpperCase()}})(/[xy]/g,function(g){var d=aI.random()*16|0,b=g=="x"?d:(d&3|8);return b.toString(16)});bi.setWindow=function(b){bc("raphael.setWindow",bi,a5.win,b);a5.win=b;a5.doc=a5.win.document;if(bi._engine.initWin){bi._engine.initWin(a5.win)}};var J=function(g){if(bi.vml){var b=/^\s+|\s+$/g;var R;try{var S=new ActiveXObject("htmlfile");S.write("<body>");S.close();R=S.body}catch(bO){R=createPopup().document.body}var d=R.createTextRange();J=H(function(i){try{R.style.color=k(i).replace(b,bn);var bP=d.queryCommandValue("ForeColor");bP=((bP&255)<<16)|(bP&65280)|((bP&16711680)>>>16);return"#"+("000000"+bP.toString(16)).slice(-6)}catch(bQ){return"none"}})}else{var E=a5.doc.createElement("i");E.title="Rapha\xebl Colour Picker";E.style.display="none";a5.doc.body.appendChild(E);J=H(function(i){E.style.color=i;return a5.doc.defaultView.getComputedStyle(E,bn).getPropertyValue("color")})}return J(g)},az=function(){return"hsb("+[this.h,this.s,this.b]+")"},bm=function(){return"hsl("+[this.h,this.s,this.l]+")"},w=function(){return this.hex},G=function(R,E,d){if(E==null&&bi.is(R,"object")&&"r" in R&&"g" in R&&"b" in R){d=R.b;E=R.g;R=R.r}if(E==null&&bi.is(R,a)){var i=bi.getRGB(R);R=i.r;E=i.g;d=i.b}if(R>1||E>1||d>1){R/=255;E/=255;d/=255}return[R,E,d]},N=function(R,E,d,S){R*=255;E*=255;d*=255;var i={r:R,g:E,b:d,hex:bi.rgb(R,E,d),toString:w};bi.is(S,"finite")&&(i.opacity=S);return i};bi.color=function(b){var d;if(bi.is(b,"object")&&"h" in b&&"s" in b&&"b" in b){d=bi.hsb2rgb(b);b.r=d.r;b.g=d.g;b.b=d.b;b.hex=d.hex}else{if(bi.is(b,"object")&&"h" in b&&"s" in b&&"l" in b){d=bi.hsl2rgb(b);b.r=d.r;b.g=d.g;b.b=d.b;b.hex=d.hex}else{if(bi.is(b,"string")){b=bi.getRGB(b)}if(bi.is(b,"object")&&"r" in b&&"g" in b&&"b" in b){d=bi.rgb2hsl(b);b.h=d.h;b.s=d.s;b.l=d.l;d=bi.rgb2hsb(b);b.v=d.b}else{b={hex:"none"};b.r=b.g=b.b=b.h=b.s=b.v=b.l=-1}}}b.toString=w;return b};bi.hsb2rgb=function(S,bQ,bO,i){if(this.is(S,"object")&&"h" in S&&"s" in S&&"b" in S){bO=S.b;bQ=S.s;S=S.h;i=S.o}S*=360;var E,bP,d,g,b;S=(S%360)/60;b=bO*bQ;g=b*(1-ak(S%2-1));E=bP=d=bO-b;S=~~S;E+=[b,g,0,0,g,b][S];bP+=[g,b,b,g,0,0][S];d+=[0,0,g,b,b,g][S];return N(E,bP,d,i)};bi.hsl2rgb=function(bO,bQ,E,i){if(this.is(bO,"object")&&"h" in bO&&"s" in bO&&"l" in bO){E=bO.l;bQ=bO.s;bO=bO.h}if(bO>1||bQ>1||E>1){bO/=360;bQ/=100;E/=100}bO*=360;var S,bP,d,g,b;bO=(bO%360)/60;b=2*bQ*(E<0.5?E:1-E);g=b*(1-ak(bO%2-1));S=bP=d=E-b/2;bO=~~bO;S+=[b,g,0,0,g,b][bO];bP+=[g,b,b,g,0,0][bO];d+=[0,0,g,b,b,g][bO];return N(S,bP,d,i)};bi.rgb2hsb=function(bP,bO,d){d=G(bP,bO,d);bP=d[0];bO=d[1];d=d[2];var R,E,i,bQ;i=bI(bP,bO,d);bQ=i-ai(bP,bO,d);R=(bQ==0?null:i==bP?(bO-d)/bQ:i==bO?(d-bP)/bQ+2:(bP-bO)/bQ+4);R=((R+360)%6)*60/360;E=bQ==0?0:bQ/i;return{h:R,s:E,b:i,toString:az}};bi.rgb2hsl=function(d,bO,bR){bR=G(d,bO,bR);d=bR[0];bO=bR[1];bR=bR[2];var bS,R,bQ,bP,E,i;bP=bI(d,bO,bR);E=ai(d,bO,bR);i=bP-E;bS=(i==0?null:bP==d?(bO-bR)/i:bP==bO?(bR-d)/i+2:(d-bO)/i+4);bS=((bS+360)%6)*60/360;bQ=(bP+E)/2;R=(i==0?0:bQ<0.5?i/(2*bQ):i/(2-2*bQ));return{h:bS,s:R,l:bQ,toString:bm}};bi._path2string=function(){return this.join(",").replace(aN,"$1")};function c(E,g){for(var b=0,d=E.length;b<d;b++){if(E[b]===g){return E.push(E.splice(b,1)[0])}}}function H(i,d,b){function g(){var E=Array.prototype.slice.call(arguments,0),S=E.join("\u2400"),R=g.cache=g.cache||{},bO=g.count=g.count||[];if(R[bw](S)){c(bO,S);return b?b(R[S]):R[S]}bO.length>=1000&&delete R[bO.shift()];bO.push(S);R[S]=i[bs](d,E);return b?b(R[S]):R[S]}return g}var D=bi._preload=function(g,d){var b=a5.doc.createElement("img");b.style.cssText="position:absolute;left:-9999em;top:-9999em";b.onload=function(){d.call(this);this.onload=null;a5.doc.body.removeChild(this)};b.onerror=function(){a5.doc.body.removeChild(this)};a5.doc.body.appendChild(b);b.src=g};function h(){return this.hex}bi.getRGB=H(function(b){if(!b||!!((b=k(b)).indexOf("-")+1)){return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:h}}if(b=="none"){return{r:-1,g:-1,b:-1,hex:"none",toString:h}}!(ax[bw](b.toLowerCase().substring(0,2))||b.charAt()=="#")&&(b=J(b));var E,d,g,S,i,bP,bO,R=b.match(Z);if(R){if(R[2]){S=bK(R[2].substring(5),16);g=bK(R[2].substring(3,5),16);d=bK(R[2].substring(1,3),16)}if(R[3]){S=bK((bP=R[3].charAt(3))+bP,16);g=bK((bP=R[3].charAt(2))+bP,16);d=bK((bP=R[3].charAt(1))+bP,16)}if(R[4]){bO=R[4][l](bf);d=bM(bO[0]);bO[0].slice(-1)=="%"&&(d*=2.55);g=bM(bO[1]);bO[1].slice(-1)=="%"&&(g*=2.55);S=bM(bO[2]);bO[2].slice(-1)=="%"&&(S*=2.55);R[1].toLowerCase().slice(0,4)=="rgba"&&(i=bM(bO[3]));bO[3]&&bO[3].slice(-1)=="%"&&(i/=100)}if(R[5]){bO=R[5][l](bf);d=bM(bO[0]);bO[0].slice(-1)=="%"&&(d*=2.55);g=bM(bO[1]);bO[1].slice(-1)=="%"&&(g*=2.55);S=bM(bO[2]);bO[2].slice(-1)=="%"&&(S*=2.55);(bO[0].slice(-3)=="deg"||bO[0].slice(-1)=="\xb0")&&(d/=360);R[1].toLowerCase().slice(0,4)=="hsba"&&(i=bM(bO[3]));bO[3]&&bO[3].slice(-1)=="%"&&(i/=100);return bi.hsb2rgb(d,g,S,i)}if(R[6]){bO=R[6][l](bf);d=bM(bO[0]);bO[0].slice(-1)=="%"&&(d*=2.55);g=bM(bO[1]);bO[1].slice(-1)=="%"&&(g*=2.55);S=bM(bO[2]);bO[2].slice(-1)=="%"&&(S*=2.55);(bO[0].slice(-3)=="deg"||bO[0].slice(-1)=="\xb0")&&(d/=360);R[1].toLowerCase().slice(0,4)=="hsla"&&(i=bM(bO[3]));bO[3]&&bO[3].slice(-1)=="%"&&(i/=100);return bi.hsl2rgb(d,g,S,i)}R={r:d,g:g,b:S,toString:h};R.hex="#"+(16777216|S|(g<<8)|(d<<16)).toString(16).slice(1);bi.is(i,"finite")&&(R.opacity=i);return R}return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:h}},bi);bi.hsb=H(function(i,g,d){return bi.hsb2rgb(i,g,d).hex});bi.hsl=H(function(g,d,b){return bi.hsl2rgb(g,d,b).hex});bi.rgb=H(function(E,i,d){return"#"+(16777216|d|(i<<8)|(E<<16)).toString(16).slice(1)});bi.getColor=function(d){var g=this.getColor.start=this.getColor.start||{h:0,s:1,b:d||0.75},b=this.hsb2rgb(g.h,g.s,g.b);g.h+=0.075;if(g.h>1){g.h=0;g.s-=0.2;g.s<=0&&(this.getColor.start={h:0,s:1,b:g.b})}return b.hex};bi.getColor.reset=function(){delete this.start};function am(E,bO){var S=[];for(var g=0,b=E.length;b-2*!bO>g;g+=2){var R=[{x:+E[g-2],y:+E[g-1]},{x:+E[g],y:+E[g+1]},{x:+E[g+2],y:+E[g+3]},{x:+E[g+4],y:+E[g+5]}];if(bO){if(!g){R[0]={x:+E[b-2],y:+E[b-1]}}else{if(b-4==g){R[3]={x:+E[0],y:+E[1]}}else{if(b-2==g){R[2]={x:+E[0],y:+E[1]};R[3]={x:+E[2],y:+E[3]}}}}}else{if(b-4==g){R[3]=R[2]}else{if(!g){R[0]={x:+E[g],y:+E[g+1]}}}}S.push(["C",(-R[0].x+6*R[1].x+R[2].x)/6,(-R[0].y+6*R[1].y+R[2].y)/6,(R[1].x+6*R[2].x-R[3].x)/6,(R[1].y+6*R[2].y-R[3].y)/6,R[2].x,R[2].y])}return S}bi.parsePathString=function(b){if(!b){return null}var g=aR(b);if(g.arr){return aY(g.arr)}var i={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},d=[];if(bi.is(b,u)&&bi.is(b[0],u)){d=aY(b)}if(!d.length){k(b).replace(bg,function(R,E,bP){var bO=[],S=E.toLowerCase();bP.replace(ap,function(bR,bQ){bQ&&bO.push(+bQ)});if(S=="m"&&bO.length>2){d.push([E][av](bO.splice(0,2)));S="l";E=E=="m"?"l":"L"}if(S=="r"){d.push([E][av](bO))}else{while(bO.length>=i[S]){d.push([E][av](bO.splice(0,i[S])));if(!i[S]){break}}}})}d.toString=bi._path2string;g.arr=aY(d);return d};bi.parseTransformString=H(function(d){if(!d){return null}var g={r:3,s:4,t:2,m:6},b=[];if(bi.is(d,u)&&bi.is(d[0],u)){b=aY(d)}if(!b.length){k(d).replace(ac,function(E,i,bO){var S=[],R=aj.call(i);bO.replace(ap,function(bQ,bP){bP&&S.push(+bP)});b.push([i][av](S))})}b.toString=bi._path2string;return b});var aR=function(d){var b=aR.ps=aR.ps||{};if(b[d]){b[d].sleep=100}else{b[d]={sleep:100}}setTimeout(function(){for(var g in b){if(b[bw](g)&&g!=d){b[g].sleep--;!b[g].sleep&&delete b[g]}}});return b[d]};bi.findDotsAtSegment=function(d,b,b5,b3,S,E,bQ,bO,bY){var bV=1-bY,b0=aS(bV,3),b1=aS(bV,2),bS=bY*bY,bP=bS*bY,bU=b0*d+b1*3*bY*b5+bV*3*bY*bY*S+bP*bQ,bR=b0*b+b1*3*bY*b3+bV*3*bY*bY*E+bP*bO,bZ=d+2*bY*(b5-d)+bS*(S-2*b5+d),bX=b+2*bY*(b3-b)+bS*(E-2*b3+b),b4=b5+2*bY*(S-b5)+bS*(bQ-2*S+b5),b2=b3+2*bY*(E-b3)+bS*(bO-2*E+b3),bW=bV*d+bY*b5,bT=bV*b+bY*b3,i=bV*S+bY*bQ,g=bV*E+bY*bO,R=(90-aI.atan2(bZ-b4,bX-b2)*180/ag);(bZ>b4||bX<b2)&&(R+=180);return{x:bU,y:bR,m:{x:bZ,y:bX},n:{x:b4,y:b2},start:{x:bW,y:bT},end:{x:i,y:g},alpha:R}};bi.bezierBBox=function(d,b,i,g,bP,S,R,E){if(!bi.is(d,"array")){d=[d,b,i,g,bP,S,R,E]}var bO=aX.apply(null,d);return{x:bO.min.x,y:bO.min.y,x2:bO.max.x,y2:bO.max.y,width:bO.max.x-bO.min.x,height:bO.max.y-bO.min.y}};bi.isPointInsideBBox=function(d,b,g){return b>=d.x&&b<=d.x2&&g>=d.y&&g<=d.y2};bi.isBBoxIntersect=function(g,d){var b=bi.isPointInsideBBox;return b(d,g.x,g.y)||b(d,g.x2,g.y)||b(d,g.x,g.y2)||b(d,g.x2,g.y2)||b(g,d.x,d.y)||b(g,d.x2,d.y)||b(g,d.x,d.y2)||b(g,d.x2,d.y2)||(g.x<d.x2&&g.x>d.x||d.x<g.x2&&d.x>g.x)&&(g.y<d.y2&&g.y>d.y||d.y<g.y2&&d.y>g.y)};function aC(b,S,R,E,i){var g=-3*S+9*R-9*E+3*i,d=b*g+6*S-12*R+6*E;return b*d-3*S+3*R}function bb(bZ,R,bY,g,bX,d,bU,b,bR){if(bR==null){bR=1}bR=bR>1?1:bR<0?0:bR;var bS=bR/2,bT=12,bO=[-0.1252,0.1252,-0.3678,0.3678,-0.5873,0.5873,-0.7699,0.7699,-0.9041,0.9041,-0.9816,0.9816],bW=[0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],E=0;for(var bV=0;bV<bT;bV++){var bP=bS*bO[bV]+bS,bQ=aC(bP,bZ,bY,bX,bU),b0=aC(bP,R,g,d,b),S=bQ*bQ+b0*b0;E+=bW[bV]*aI.sqrt(S)}return bS*E}function aK(g,bS,d,bR,b,bP,bU,bO,bQ){if(bQ<0||bb(g,bS,d,bR,b,bP,bU,bO)<bQ){return}var bT=1,i=bT/2,R=bT-i,E,S=0.01;E=bb(g,bS,d,bR,b,bP,bU,bO,R);while(ak(E-bQ)>S){i/=2;R+=(E<bQ?1:-1)*i;E=bb(g,bS,d,bR,b,bP,bU,bO,R)}return R}function a4(i,bT,g,bR,b,bQ,bV,bP){if(bI(i,g)<ai(b,bV)||ai(i,g)>bI(b,bV)||bI(bT,bR)<ai(bQ,bP)||ai(bT,bR)>bI(bQ,bP)){return}var bO=(i*bR-bT*g)*(b-bV)-(i-g)*(b*bP-bQ*bV),S=(i*bR-bT*g)*(bQ-bP)-(bT-bR)*(b*bP-bQ*bV),E=(i-g)*(bQ-bP)-(bT-bR)*(b-bV);if(!E){return}var bU=bO/E,bS=S/E,R=+bU.toFixed(2),d=+bS.toFixed(2);if(R<+ai(i,g).toFixed(2)||R>+bI(i,g).toFixed(2)||R<+ai(b,bV).toFixed(2)||R>+bI(b,bV).toFixed(2)||d<+ai(bT,bR).toFixed(2)||d>+bI(bT,bR).toFixed(2)||d<+ai(bQ,bP).toFixed(2)||d>+bI(bQ,bP).toFixed(2)){return}return{x:bU,y:bS}}function aV(d,b){return aP(d,b)}function aL(d,b){return aP(d,b,1)}function aP(b5,b4,b3){var E=bi.bezierBBox(b5),d=bi.bezierBBox(b4);if(!bi.isBBoxIntersect(E,d)){return b3?0:[]}var bY=bb.apply(0,b5),bX=bb.apply(0,b4),bP=bI(~~(bY/5),1),bO=bI(~~(bX/5),1),bV=[],bU=[],g={},b6=b3?0:[];for(var b0=0;b0<bP+1;b0++){var bW=bi.findDotsAtSegment.apply(bi,b5.concat(b0/bP));bV.push({x:bW.x,y:bW.y,t:b0/bP})}for(b0=0;b0<bO+1;b0++){bW=bi.findDotsAtSegment.apply(bi,b4.concat(b0/bO));bU.push({x:bW.x,y:bW.y,t:b0/bO})}for(b0=0;b0<bP;b0++){for(var bZ=0;bZ<bO;bZ++){var b2=bV[b0],b=bV[b0+1],b1=bU[bZ],S=bU[bZ+1],bT=ak(b.x-b2.x)<0.001?"y":"x",bS=ak(S.x-b1.x)<0.001?"y":"x",R=a4(b2.x,b2.y,b.x,b.y,b1.x,b1.y,S.x,S.y);if(R){if(g[R.x.toFixed(4)]==R.y.toFixed(4)){continue}g[R.x.toFixed(4)]=R.y.toFixed(4);var bR=b2.t+ak((R[bT]-b2[bT])/(b[bT]-b2[bT]))*(b.t-b2.t),bQ=b1.t+ak((R[bS]-b1[bS])/(S[bS]-b1[bS]))*(S.t-b1.t);if(bR>=0&&bR<=1.001&&bQ>=0&&bQ<=1.001){if(b3){b6++}else{b6.push({x:R.x,y:R.y,t1:ai(bR,1),t2:ai(bQ,1)})}}}}}return b6}bi.pathIntersection=function(d,b){return bE(d,b)};bi.pathIntersectionNumber=function(d,b){return bE(d,b,1)};function bE(g,b,bZ){g=bi._path2curve(g);b=bi._path2curve(b);var bX,S,bW,E,bU,bO,d,bR,b3,b2,b4=bZ?0:[];for(var bV=0,bP=g.length;bV<bP;bV++){var b1=g[bV];if(b1[0]=="M"){bX=bU=b1[1];S=bO=b1[2]}else{if(b1[0]=="C"){b3=[bX,S].concat(b1.slice(1));bX=b3[6];S=b3[7]}else{b3=[bX,S,bX,S,bU,bO,bU,bO];bX=bU;S=bO}for(var bT=0,bY=b.length;bT<bY;bT++){var b0=b[bT];if(b0[0]=="M"){bW=d=b0[1];E=bR=b0[2]}else{if(b0[0]=="C"){b2=[bW,E].concat(b0.slice(1));bW=b2[6];E=b2[7]}else{b2=[bW,E,bW,E,d,bR,d,bR];bW=d;E=bR}var bQ=aP(b3,b2,bZ);if(bZ){b4+=bQ}else{for(var bS=0,R=bQ.length;bS<R;bS++){bQ[bS].segment1=bV;bQ[bS].segment2=bT;bQ[bS].bez1=b3;bQ[bS].bez2=b2}b4=b4.concat(bQ)}}}}}return b4}bi.isPointInsidePath=function(d,b,i){var g=bi.pathBBox(d);return bi.isPointInsideBBox(g,b,i)&&bE(d,[["M",b,i],["H",g.x2+10]],1)%2==1};bi._removedFactory=function(b){return function(){bc("raphael.log",null,"Rapha\xebl: you are calling to method \u201c"+b+"\u201d of removed object",b)}};var I=bi.pathBBox=function(bY){var bR=aR(bY);if(bR.bbox){return bl(bR.bbox)}if(!bY){return{x:0,y:0,width:0,height:0,x2:0,y2:0}}bY=bk(bY);var bU=0,bT=0,S=[],g=[],E;for(var bP=0,bX=bY.length;bP<bX;bP++){E=bY[bP];if(E[0]=="M"){bU=E[1];bT=E[2];S.push(bU);g.push(bT)}else{var bQ=aX(bU,bT,E[1],E[2],E[3],E[4],E[5],E[6]);S=S[av](bQ.min.x,bQ.max.x);g=g[av](bQ.min.y,bQ.max.y);bU=E[5];bT=E[6]}}var b=ai[bs](0,S),bV=ai[bs](0,g),bO=bI[bs](0,S),R=bI[bs](0,g),d=bO-b,bW=R-bV,bS={x:b,y:bV,x2:bO,y2:R,width:d,height:bW,cx:b+d/2,cy:bV+bW/2};bR.bbox=bl(bS);return bS},aY=function(d){var b=bl(d);b.toString=bi._path2string;return b},j=bi._pathToRelative=function(E){var bP=aR(E);if(bP.rel){return aY(bP.rel)}if(!bi.is(E,u)||!bi.is(E&&E[0],u)){E=bi.parsePathString(E)}var bS=[],bU=0,bT=0,bX=0,bW=0,g=0;if(E[0][0]=="M"){bU=E[0][1];bT=E[0][2];bX=bU;bW=bT;g++;bS.push(["M",bU,bT])}for(var bO=g,bY=E.length;bO<bY;bO++){var b=bS[bO]=[],bV=E[bO];if(bV[0]!=aj.call(bV[0])){b[0]=aj.call(bV[0]);switch(b[0]){case"a":b[1]=bV[1];b[2]=bV[2];b[3]=bV[3];b[4]=bV[4];b[5]=bV[5];b[6]=+(bV[6]-bU).toFixed(3);b[7]=+(bV[7]-bT).toFixed(3);break;case"v":b[1]=+(bV[1]-bT).toFixed(3);break;case"m":bX=bV[1];bW=bV[2];default:for(var S=1,bQ=bV.length;S<bQ;S++){b[S]=+(bV[S]-((S%2)?bU:bT)).toFixed(3)}}}else{b=bS[bO]=[];if(bV[0]=="m"){bX=bV[1]+bU;bW=bV[2]+bT}for(var R=0,d=bV.length;R<d;R++){bS[bO][R]=bV[R]}}var bR=bS[bO].length;switch(bS[bO][0]){case"z":bU=bX;bT=bW;break;case"h":bU+=+bS[bO][bR-1];break;case"v":bT+=+bS[bO][bR-1];break;default:bU+=+bS[bO][bR-2];bT+=+bS[bO][bR-1]}}bS.toString=bi._path2string;bP.rel=aY(bS);return bS},p=bi._pathToAbsolute=function(bT){var g=aR(bT);if(g.abs){return aY(g.abs)}if(!bi.is(bT,u)||!bi.is(bT&&bT[0],u)){bT=bi.parsePathString(bT)}if(!bT||!bT.length){return[["M",0,0]]}var bZ=[],bO=0,S=0,bR=0,bQ=0,E=0;if(bT[0][0]=="M"){bO=+bT[0][1];S=+bT[0][2];bR=bO;bQ=S;E++;bZ[0]=["M",bO,S]}var bY=bT.length==3&&bT[0][0]=="M"&&bT[1][0].toUpperCase()=="R"&&bT[2][0].toUpperCase()=="Z";for(var bS,b,bW=E,bP=bT.length;bW<bP;bW++){bZ.push(bS=[]);b=bT[bW];if(b[0]!=aU.call(b[0])){bS[0]=aU.call(b[0]);switch(bS[0]){case"A":bS[1]=b[1];bS[2]=b[2];bS[3]=b[3];bS[4]=b[4];bS[5]=b[5];bS[6]=+(b[6]+bO);bS[7]=+(b[7]+S);break;case"V":bS[1]=+b[1]+S;break;case"H":bS[1]=+b[1]+bO;break;case"R":var R=[bO,S][av](b.slice(1));for(var bV=2,bX=R.length;bV<bX;bV++){R[bV]=+R[bV]+bO;R[++bV]=+R[bV]+S}bZ.pop();bZ=bZ[av](am(R,bY));break;case"M":bR=+b[1]+bO;bQ=+b[2]+S;default:for(bV=1,bX=b.length;bV<bX;bV++){bS[bV]=+b[bV]+((bV%2)?bO:S)}}}else{if(b[0]=="R"){R=[bO,S][av](b.slice(1));bZ.pop();bZ=bZ[av](am(R,bY));bS=["R"][av](b.slice(-2))}else{for(var bU=0,d=b.length;bU<d;bU++){bS[bU]=b[bU]}}}switch(bS[0]){case"Z":bO=bR;S=bQ;break;case"H":bO=bS[1];break;case"V":S=bS[1];break;case"M":bR=bS[bS.length-2];bQ=bS[bS.length-1];default:bO=bS[bS.length-2];S=bS[bS.length-1]}}bZ.toString=bi._path2string;g.abs=aY(bZ);return bZ},aW=function(d,i,b,g){return[d,i,b,g,b,g]},z=function(d,i,S,E,b,g){var R=1/3,bO=2/3;return[R*d+bO*S,R*i+bO*E,R*b+bO*S,R*g+bO*E,b,g]},ab=function(bV,cq,b4,b2,bW,bQ,E,bU,cp,bX){var b1=ag*120/180,b=ag/180*(+bW||0),b8=[],b5,cm=H(function(cr,cu,i){var ct=cr*aI.cos(i)-cu*aI.sin(i),cs=cr*aI.sin(i)+cu*aI.cos(i);return{x:ct,y:cs}});if(!bX){b5=cm(bV,cq,-b);bV=b5.x;cq=b5.y;b5=cm(bU,cp,-b);bU=b5.x;cp=b5.y;var d=aI.cos(ag/180*bW),bS=aI.sin(ag/180*bW),ca=(bV-bU)/2,b9=(cq-cp)/2;var ck=(ca*ca)/(b4*b4)+(b9*b9)/(b2*b2);if(ck>1){ck=aI.sqrt(ck);b4=ck*b4;b2=ck*b2}var g=b4*b4,cd=b2*b2,cf=(bQ==E?-1:1)*aI.sqrt(ak((g*cd-g*b9*b9-cd*ca*ca)/(g*b9*b9+cd*ca*ca))),bZ=cf*b4*b9/b2+(bV+bU)/2,bY=cf*-b2*ca/b4+(cq+cp)/2,bP=aI.asin(((cq-bY)/b2).toFixed(9)),bO=aI.asin(((cp-bY)/b2).toFixed(9));bP=bV<bZ?ag-bP:bP;bO=bU<bZ?ag-bO:bO;bP<0&&(bP=ag*2+bP);bO<0&&(bO=ag*2+bO);if(E&&bP>bO){bP=bP-ag*2}if(!E&&bO>bP){bO=bO-ag*2}}else{bP=bX[0];bO=bX[1];bZ=bX[2];bY=bX[3]}var bT=bO-bP;if(ak(bT)>b1){var b0=bO,b3=bU,bR=cp;bO=bP+b1*(E&&bO>bP?1:-1);bU=bZ+b4*aI.cos(bO);cp=bY+b2*aI.sin(bO);b8=ab(bU,cp,b4,b2,bW,0,E,b3,bR,[bO,b0,bZ,bY])}bT=bO-bP;var S=aI.cos(bP),co=aI.sin(bP),R=aI.cos(bO),cn=aI.sin(bO),cb=aI.tan(bT/4),ce=4/3*b4*cb,cc=4/3*b2*cb,cl=[bV,cq],cj=[bV+ce*co,cq-cc*S],ci=[bU+ce*cn,cp-cc*R],cg=[bU,cp];cj[0]=2*cl[0]-cj[0];cj[1]=2*cl[1]-cj[1];if(bX){return[cj,ci,cg][av](b8)}else{b8=[cj,ci,cg][av](b8).join()[l](",");var b6=[];for(var ch=0,b7=b8.length;ch<b7;ch++){b6[ch]=ch%2?cm(b8[ch-1],b8[ch],b).y:cm(b8[ch],b8[ch+1],b).x}return b6}},bL=function(d,b,i,g,bP,bO,S,R,bQ){var E=1-bQ;return{x:aS(E,3)*d+aS(E,2)*3*bQ*i+E*3*bQ*bQ*bP+aS(bQ,3)*S,y:aS(E,3)*b+aS(E,2)*3*bQ*g+E*3*bQ*bQ*bO+aS(bQ,3)*R}},aX=H(function(i,d,R,E,bX,bW,bT,bQ){var bV=(bX-2*R+i)-(bT-2*bX+R),bS=2*(R-i)-2*(bX-R),bP=i-R,bO=(-bS+aI.sqrt(bS*bS-4*bV*bP))/2/bV,S=(-bS-aI.sqrt(bS*bS-4*bV*bP))/2/bV,bR=[d,bQ],bU=[i,bT],g;ak(bO)>"1e12"&&(bO=0.5);ak(S)>"1e12"&&(S=0.5);if(bO>0&&bO<1){g=bL(i,d,R,E,bX,bW,bT,bQ,bO);bU.push(g.x);bR.push(g.y)}if(S>0&&S<1){g=bL(i,d,R,E,bX,bW,bT,bQ,S);bU.push(g.x);bR.push(g.y)}bV=(bW-2*E+d)-(bQ-2*bW+E);bS=2*(E-d)-2*(bW-E);bP=d-E;bO=(-bS+aI.sqrt(bS*bS-4*bV*bP))/2/bV;S=(-bS-aI.sqrt(bS*bS-4*bV*bP))/2/bV;ak(bO)>"1e12"&&(bO=0.5);ak(S)>"1e12"&&(S=0.5);if(bO>0&&bO<1){g=bL(i,d,R,E,bX,bW,bT,bQ,bO);bU.push(g.x);bR.push(g.y)}if(S>0&&S<1){g=bL(i,d,R,E,bX,bW,bT,bQ,S);bU.push(g.x);bR.push(g.y)}return{min:{x:ai[bs](0,bU),y:ai[bs](0,bR)},max:{x:bI[bs](0,bU),y:bI[bs](0,bR)}}}),bk=bi._path2curve=H(function(bX,bS){var bQ=!bS&&aR(bX);if(!bS&&bQ.curve){return aY(bQ.curve)}var E=p(bX),bT=bS&&p(bS),bU={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},d={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},S=function(b0,b1,bY){var i,b2,bZ={T:1,Q:1};if(!b0){return["C",b1.x,b1.y,b1.x,b1.y,b1.x,b1.y]}!(b0[0] in bZ)&&(b1.qx=b1.qy=null);switch(b0[0]){case"M":b1.X=b0[1];b1.Y=b0[2];break;case"A":b0=["C"][av](ab[bs](0,[b1.x,b1.y][av](b0.slice(1))));break;case"S":if(bY=="C"||bY=="S"){i=b1.x*2-b1.bx;b2=b1.y*2-b1.by}else{i=b1.x;b2=b1.y}b0=["C",i,b2][av](b0.slice(1));break;case"T":if(bY=="Q"||bY=="T"){b1.qx=b1.x*2-b1.qx;b1.qy=b1.y*2-b1.qy}else{b1.qx=b1.x;b1.qy=b1.y}b0=["C"][av](z(b1.x,b1.y,b1.qx,b1.qy,b0[1],b0[2]));break;case"Q":b1.qx=b0[1];b1.qy=b0[2];b0=["C"][av](z(b1.x,b1.y,b0[1],b0[2],b0[3],b0[4]));break;case"L":b0=["C"][av](aW(b1.x,b1.y,b0[1],b0[2]));break;case"H":b0=["C"][av](aW(b1.x,b1.y,b0[1],b1.y));break;case"V":b0=["C"][av](aW(b1.x,b1.y,b1.x,b0[1]));break;case"Z":b0=["C"][av](aW(b1.x,b1.y,b1.X,b1.Y));break}return b0},b=function(bY,bZ){if(bY[bZ].length>7){bY[bZ].shift();var b0=bY[bZ];while(b0.length){bY.splice(bZ++,0,["C"][av](b0.splice(0,6)))}bY.splice(bZ,1);bV=bI(E.length,bT&&bT.length||0)}},g=function(b2,b1,bZ,bY,b0){if(b2&&b1&&b2[b0][0]=="M"&&b1[b0][0]!="M"){b1.splice(b0,0,["M",bY.x,bY.y]);bZ.bx=0;bZ.by=0;bZ.x=b2[b0][1];bZ.y=b2[b0][2];bV=bI(E.length,bT&&bT.length||0)}};for(var bP=0,bV=bI(E.length,bT&&bT.length||0);bP<bV;bP++){E[bP]=S(E[bP],bU);b(E,bP);bT&&(bT[bP]=S(bT[bP],d));bT&&b(bT,bP);g(E,bT,bU,d,bP);g(bT,E,d,bU,bP);var bO=E[bP],bW=bT&&bT[bP],R=bO.length,bR=bT&&bW.length;bU.x=bO[R-2];bU.y=bO[R-1];bU.bx=bM(bO[R-4])||bU.x;bU.by=bM(bO[R-3])||bU.y;d.bx=bT&&(bM(bW[bR-4])||d.x);d.by=bT&&(bM(bW[bR-3])||d.y);d.x=bT&&bW[bR-2];d.y=bT&&bW[bR-1]}if(!bT){bQ.curve=aY(E)}return bT?[E,bT]:E},null,aY),ba=bi._parseDots=H(function(bR){var bQ=[];for(var S=0,bS=bR.length;S<bS;S++){var b={},bP=bR[S].match(/^([^:]*):?([\d\.]*)/);b.color=bi.getRGB(bP[1]);if(b.color.error){return null}b.color=b.color.hex;bP[2]&&(b.offset=bP[2]+"%");bQ.push(b)}for(S=1,bS=bQ.length-1;S<bS;S++){if(!bQ[S].offset){var g=bM(bQ[S-1].offset||0),E=0;for(var R=S+1;R<bS;R++){if(bQ[R].offset){E=bQ[R].offset;break}}if(!E){E=100;R=bS}E=bM(E);var bO=(E-g)/(R-S+1);for(;S<R;S++){g+=bO;bQ[S].offset=g+"%"}}}return bQ}),aH=bi._tear=function(b,d){b==d.top&&(d.top=b.prev);b==d.bottom&&(d.bottom=b.next);b.next&&(b.next.prev=b.prev);b.prev&&(b.prev.next=b.next)},L=bi._tofront=function(b,d){if(d.top===b){return}aH(b,d);b.next=null;b.prev=d.top;d.top.next=b;d.top=b},y=bi._toback=function(b,d){if(d.bottom===b){return}aH(b,d);b.next=d.bottom;b.prev=null;d.bottom.prev=b;d.bottom=b},ar=bi._insertafter=function(d,b,g){aH(d,g);b==g.top&&(g.top=d);b.next&&(b.next.prev=d);d.next=b.next;d.prev=b;b.next=d},m=bi._insertbefore=function(d,b,g){aH(d,g);b==g.bottom&&(g.bottom=d);b.prev&&(b.prev.next=d);d.prev=b.prev;b.prev=d;d.next=b},t=bi.toMatrix=function(g,b){var i=I(g),d={_:{transform:bn},getBBox:function(){return i}};Y(d,b);return d.matrix},ay=bi.transformPath=function(d,b){return Q(d,t(d,b))},Y=bi._extractTransform=function(d,b2){if(b2==null){return d._.transform}b2=k(b2).replace(/\.{3}|\u2026/g,d._.transform||bn);var bU=bi.parseTransformString(b2),bS=0,bQ=0,bP=0,bW=1,bV=1,b3=d._,bX=new a9;b3.transform=bU||[];if(bU){for(var bY=0,bR=bU.length;bY<bR;bY++){var bT=bU[bY],b=bT.length,R=k(bT[0]).toLowerCase(),b1=bT[0]!=R,bO=b1?bX.invert():0,b0,E,bZ,g,S;if(R=="t"&&b==3){if(b1){b0=bO.x(0,0);E=bO.y(0,0);bZ=bO.x(bT[1],bT[2]);g=bO.y(bT[1],bT[2]);bX.translate(bZ-b0,g-E)}else{bX.translate(bT[1],bT[2])}}else{if(R=="r"){if(b==2){S=S||d.getBBox(1);bX.rotate(bT[1],S.x+S.width/2,S.y+S.height/2);bS+=bT[1]}else{if(b==4){if(b1){bZ=bO.x(bT[2],bT[3]);g=bO.y(bT[2],bT[3]);bX.rotate(bT[1],bZ,g)}else{bX.rotate(bT[1],bT[2],bT[3])}bS+=bT[1]}}}else{if(R=="s"){if(b==2||b==3){S=S||d.getBBox(1);bX.scale(bT[1],bT[b-1],S.x+S.width/2,S.y+S.height/2);bW*=bT[1];bV*=bT[b-1]}else{if(b==5){if(b1){bZ=bO.x(bT[3],bT[4]);g=bO.y(bT[3],bT[4]);bX.scale(bT[1],bT[2],bZ,g)}else{bX.scale(bT[1],bT[2],bT[3],bT[4])}bW*=bT[1];bV*=bT[2]}}}else{if(R=="m"&&b==7){bX.add(bT[1],bT[2],bT[3],bT[4],bT[5],bT[6])}}}}b3.dirtyT=1;d.matrix=bX}}d.matrix=bX;b3.sx=bW;b3.sy=bV;b3.deg=bS;b3.dx=bQ=bX.e;b3.dy=bP=bX.f;if(bW==1&&bV==1&&!bS&&b3.bbox){b3.bbox.x+=+bQ;b3.bbox.y+=+bP}else{b3.dirtyT=1}},o=function(d){var b=d[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":if(d.length==4){return[b,0,d[2],d[3]]}else{return[b,0]}case"s":if(d.length==5){return[b,1,1,d[3],d[4]]}else{if(d.length==3){return[b,1,1]}else{return[b,1]}}}},bd=bi._equaliseTransform=function(R,E){E=k(E).replace(/\.{3}|\u2026/g,R);R=bi.parseTransformString(R)||[];E=bi.parseTransformString(E)||[];var b=bI(R.length,E.length),bQ=[],bR=[],g=0,d,S,bP,bO;for(;g<b;g++){bP=R[g]||o(E[g]);bO=E[g]||o(bP);if((bP[0]!=bO[0])||(bP[0].toLowerCase()=="r"&&(bP[2]!=bO[2]||bP[3]!=bO[3]))||(bP[0].toLowerCase()=="s"&&(bP[3]!=bO[3]||bP[4]!=bO[4]))){return}bQ[g]=[];bR[g]=[];for(d=0,S=bI(bP.length,bO.length);d<S;d++){d in bP&&(bQ[g][d]=bP[d]);d in bO&&(bR[g][d]=bO[d])}}return{from:bQ,to:bR}};bi._getContainer=function(b,E,g,i){var d;d=i==null&&!bi.is(b,"object")?a5.doc.getElementById(b):b;if(d==null){return}if(d.tagName){if(E==null){return{container:d,width:d.style.pixelWidth||d.offsetWidth,height:d.style.pixelHeight||d.offsetHeight}}else{return{container:d,width:E,height:g}}}return{container:1,x:b,y:E,width:g,height:i}};bi.pathToRelative=j;bi._engine={};bi.path2curve=bk;bi.matrix=function(i,g,bO,S,R,E){return new a9(i,g,bO,S,R,E)};function a9(i,g,bO,S,R,E){if(i!=null){this.a=+i;this.b=+g;this.c=+bO;this.d=+S;this.e=+R;this.f=+E}else{this.a=1;this.b=0;this.c=0;this.d=1;this.e=0;this.f=0}}(function(g){g.add=function(bW,bT,bR,bP,S,R){var E=[[],[],[]],i=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],bV=[[bW,bR,S],[bT,bP,R],[0,0,1]],bU,bS,bQ,bO;if(bW&&bW instanceof a9){bV=[[bW.a,bW.c,bW.e],[bW.b,bW.d,bW.f],[0,0,1]]}for(bU=0;bU<3;bU++){for(bS=0;bS<3;bS++){bO=0;for(bQ=0;bQ<3;bQ++){bO+=i[bU][bQ]*bV[bQ][bS]}E[bU][bS]=bO}}this.a=E[0][0];this.b=E[1][0];this.c=E[0][1];this.d=E[1][1];this.e=E[0][2];this.f=E[1][2]};g.invert=function(){var E=this,i=E.a*E.d-E.b*E.c;return new a9(E.d/i,-E.b/i,-E.c/i,E.a/i,(E.c*E.f-E.d*E.e)/i,(E.b*E.e-E.a*E.f)/i)};g.clone=function(){return new a9(this.a,this.b,this.c,this.d,this.e,this.f)};g.translate=function(i,E){this.add(1,0,0,1,i,E)};g.scale=function(E,S,i,R){S==null&&(S=E);(i||R)&&this.add(1,0,0,1,i,R);this.add(E,0,0,S,0,0);(i||R)&&this.add(1,0,0,1,-i,-R)};g.rotate=function(E,i,bO){E=bi.rad(E);i=i||0;bO=bO||0;var S=+aI.cos(E).toFixed(9),R=+aI.sin(E).toFixed(9);this.add(S,R,-R,S,i,bO);this.add(1,0,0,1,-i,-bO)};g.x=function(i,E){return i*this.a+E*this.c+this.e};g.y=function(i,E){return i*this.b+E*this.d+this.f};g.get=function(E){return +this[k.fromCharCode(97+E)].toFixed(4)};g.toString=function(){return bi.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()};g.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"};g.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]};function d(i){return i[0]*i[0]+i[1]*i[1]}function b(i){var E=aI.sqrt(d(i));i[0]&&(i[0]/=E);i[1]&&(i[1]/=E)}g.split=function(){var E={};E.dx=this.e;E.dy=this.f;var S=[[this.a,this.c],[this.b,this.d]];E.scalex=aI.sqrt(d(S[0]));b(S[0]);E.shear=S[0][0]*S[1][0]+S[0][1]*S[1][1];S[1]=[S[1][0]-S[0][0]*E.shear,S[1][1]-S[0][1]*E.shear];E.scaley=aI.sqrt(d(S[1]));b(S[1]);E.shear/=E.scaley;var i=-S[0][1],R=S[1][1];if(R<0){E.rotate=bi.deg(aI.acos(R));if(i<0){E.rotate=360-E.rotate}}else{E.rotate=bi.deg(aI.asin(i))}E.isSimple=!+E.shear.toFixed(9)&&(E.scalex.toFixed(9)==E.scaley.toFixed(9)||!E.rotate);E.isSuperSimple=!+E.shear.toFixed(9)&&E.scalex.toFixed(9)==E.scaley.toFixed(9)&&!E.rotate;E.noRotation=!+E.shear.toFixed(9)&&!E.rotate;return E};g.toTransformString=function(i){var E=i||this[l]();if(E.isSimple){E.scalex=+E.scalex.toFixed(4);E.scaley=+E.scaley.toFixed(4);E.rotate=+E.rotate.toFixed(4);return(E.dx||E.dy?"t"+[E.dx,E.dy]:bn)+(E.scalex!=1||E.scaley!=1?"s"+[E.scalex,E.scaley,0,0]:bn)+(E.rotate?"r"+[E.rotate,0,0]:bn)}else{return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}})(a9.prototype);var al=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);if((navigator.vendor=="Apple Computer, Inc.")&&(al&&al[1]<4||navigator.platform.slice(0,2)=="iP")||(navigator.vendor=="Google Inc."&&al&&al[1]<8)){ao.safari=function(){var b=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){b.remove()})}}else{ao.safari=ad}var bD=function(){this.returnValue=false},n=function(){return this.originalEvent.preventDefault()},aJ=function(){this.cancelBubble=true},V=function(){return this.originalEvent.stopPropagation()},ae=function(d){var b=a5.doc.documentElement.scrollTop||a5.doc.body.scrollTop,g=a5.doc.documentElement.scrollLeft||a5.doc.body.scrollLeft;return{x:d.clientX+g,y:d.clientY+b}},F=(function(){if(a5.doc.addEventListener){return function(E,g,d,b){var i=function(S){var bO=ae(S);return d.call(b,S,bO.x,bO.y)};E.addEventListener(g,i,false);if(O&&bp[g]){var R=function(bQ){var bR=ae(bQ),bO=bQ;for(var S=0,bP=bQ.targetTouches&&bQ.targetTouches.length;S<bP;S++){if(bQ.targetTouches[S].target==E){bQ=bQ.targetTouches[S];bQ.originalEvent=bO;bQ.preventDefault=n;bQ.stopPropagation=V;break}}return d.call(b,bQ,bR.x,bR.y)};E.addEventListener(bp[g],R,false)}return function(){E.removeEventListener(g,i,false);if(O&&bp[g]){E.removeEventListener(bp[g],i,false)}return true}}}else{if(a5.doc.attachEvent){return function(R,i,g,d){var E=function(bP){bP=bP||a5.win.event;var bO=a5.doc.documentElement.scrollTop||a5.doc.body.scrollTop,bQ=a5.doc.documentElement.scrollLeft||a5.doc.body.scrollLeft,S=bP.clientX+bQ,bR=bP.clientY+bO;bP.preventDefault=bP.preventDefault||bD;bP.stopPropagation=bP.stopPropagation||aJ;return g.call(d,bP,S,bR)};R.attachEvent("on"+i,E);var b=function(){R.detachEvent("on"+i,E);return true};return b}}}})(),aA=[],br=function(bP){var bS=bP.clientX,bR=bP.clientY,bU=a5.doc.documentElement.scrollTop||a5.doc.body.scrollTop,bV=a5.doc.documentElement.scrollLeft||a5.doc.body.scrollLeft,g,E=aA.length;while(E--){g=aA[E];if(O&&bP.touches){var S=bP.touches.length,R;while(S--){R=bP.touches[S];if(R.identifier==g.el._drag.id){bS=R.clientX;bR=R.clientY;(bP.originalEvent?bP.originalEvent:bP).preventDefault();break}}}else{bP.preventDefault()}var d=g.el.node,b,bO=d.nextSibling,bT=d.parentNode,bQ=d.style.display;a5.win.opera&&bT.removeChild(d);d.style.display="none";b=g.el.paper.getElementByPoint(bS,bR);d.style.display=bQ;a5.win.opera&&(bO?bT.insertBefore(d,bO):bT.appendChild(d));b&&bc("raphael.drag.over."+g.el.id,g.el,b);bS+=bV;bR+=bU;bc("raphael.drag.move."+g.el.id,g.move_scope||g.el,bS-g.el._drag.x,bR-g.el._drag.y,bS,bR,bP)}},e=function(g){bi.unmousemove(br).unmouseup(e);var d=aA.length,b;while(d--){b=aA[d];b.el._drag={};bc("raphael.drag.end."+b.el.id,b.end_scope||b.start_scope||b.move_scope||b.el,g)}aA=[]},aq=bi.el={};for(var a3=bB.length;a3--;){(function(b){bi[b]=aq[b]=function(g,d){if(bi.is(g,"function")){this.events=this.events||[];this.events.push({name:b,f:g,unbind:F(this.shape||this.node||a5.doc,b,g,d||this)})}return this};bi["un"+b]=aq["un"+b]=function(i){var g=this.events||[],d=g.length;while(d--){if(g[d].name==b&&(bi.is(i,"undefined")||g[d].f==i)){g[d].unbind();g.splice(d,1);!g.length&&delete this.events}}return this}})(bB[a3])}aq.data=function(d,E){var g=M[this.id]=M[this.id]||{};if(arguments.length==0){return g}if(arguments.length==1){if(bi.is(d,"object")){for(var b in d){if(d[bw](b)){this.data(b,d[b])}}return this}bc("raphael.data.get."+this.id,this,g[d],d);return g[d]}g[d]=E;bc("raphael.data.set."+this.id,this,E,d);return this};aq.removeData=function(b){if(b==null){M[this.id]={}}else{M[this.id]&&delete M[this.id][b]}return this};aq.getData=function(){return bl(M[this.id]||{})};aq.hover=function(i,b,g,d){return this.mouseover(i,g).mouseout(b,d||g)};aq.unhover=function(d,b){return this.unmouseover(d).unmouseout(b)};var ah=[];aq.drag=function(d,R,E,b,g,i){function S(bR){(bR.originalEvent||bR).preventDefault();var bO=bR.clientX,bU=bR.clientY,bQ=a5.doc.documentElement.scrollTop||a5.doc.body.scrollTop,bS=a5.doc.documentElement.scrollLeft||a5.doc.body.scrollLeft;this._drag.id=bR.identifier;if(O&&bR.touches){var bP=bR.touches.length,bT;while(bP--){bT=bR.touches[bP];this._drag.id=bT.identifier;if(bT.identifier==this._drag.id){bO=bT.clientX;bU=bT.clientY;break}}}this._drag.x=bO+bS;this._drag.y=bU+bQ;!aA.length&&bi.mousemove(br).mouseup(e);aA.push({el:this,move_scope:b,start_scope:g,end_scope:i});R&&bc.on("raphael.drag.start."+this.id,R);d&&bc.on("raphael.drag.move."+this.id,d);E&&bc.on("raphael.drag.end."+this.id,E);bc("raphael.drag.start."+this.id,g||b||this,bR.clientX+bS,bR.clientY+bQ,bR)}this._drag={};ah.push({el:this,start:S});this.mousedown(S);return this};aq.onDragOver=function(b){b?bc.on("raphael.drag.over."+this.id,b):bc.unbind("raphael.drag.over."+this.id)};aq.undrag=function(){var b=ah.length;while(b--){if(ah[b].el==this){this.unmousedown(ah[b].start);ah.splice(b,1);bc.unbind("raphael.drag.*."+this.id)}}!ah.length&&bi.unmousemove(br).unmouseup(e);aA=[]};ao.circle=function(b,i,g){var d=bi._engine.circle(this,b||0,i||0,g||0);this.__set__&&this.__set__.push(d);return d};ao.rect=function(b,R,d,i,E){var g=bi._engine.rect(this,b||0,R||0,d||0,i||0,E||0);this.__set__&&this.__set__.push(g);return g};ao.ellipse=function(b,E,i,g){var d=bi._engine.ellipse(this,b||0,E||0,i||0,g||0);this.__set__&&this.__set__.push(d);return d};ao.path=function(b){b&&!bi.is(b,a)&&!bi.is(b[0],u)&&(b+=bn);var d=bi._engine.path(bi.format[bs](bi,arguments),this);this.__set__&&this.__set__.push(d);return d};ao.image=function(E,b,R,d,i){var g=bi._engine.image(this,E||"about:blank",b||0,R||0,d||0,i||0);this.__set__&&this.__set__.push(g);return g};ao.text=function(b,i,g){var d=bi._engine.text(this,b||0,i||0,k(g));this.__set__&&this.__set__.push(d);return d};ao.set=function(d){!bi.is(d,"array")&&(d=Array.prototype.splice.call(arguments,0,arguments.length));var b=new X(d);this.__set__&&this.__set__.push(b);b.paper=this;b.type="set";return b};ao.setStart=function(b){this.__set__=b||this.set()};ao.setFinish=function(d){var b=this.__set__;delete this.__set__;return b};ao.setSize=function(d,b){return bi._engine.setSize.call(this,d,b)};ao.setViewBox=function(b,E,d,i,g){return bi._engine.setViewBox.call(this,b,E,d,i,g)};ao.top=ao.bottom=null;ao.raphael=bi;var bN=function(g){var E=g.getBoundingClientRect(),bP=g.ownerDocument,R=bP.body,b=bP.documentElement,i=b.clientTop||R.clientTop||0,S=b.clientLeft||R.clientLeft||0,bO=E.top+(a5.win.pageYOffset||b.scrollTop||R.scrollTop)-i,d=E.left+(a5.win.pageXOffset||b.scrollLeft||R.scrollLeft)-S;return{y:bO,x:d}};ao.getElementByPoint=function(d,bO){var S=this,g=S.canvas,R=a5.doc.elementFromPoint(d,bO);if(a5.win.opera&&R.tagName=="svg"){var E=bN(g),i=g.createSVGRect();i.x=d-E.x;i.y=bO-E.y;i.width=i.height=1;var b=g.getIntersectionList(i,null);if(b.length){R=b[b.length-1]}}if(!R){return null}while(R.parentNode&&R!=g.parentNode&&!R.raphael){R=R.parentNode}R==S.canvas.parentNode&&(R=g);R=R&&R.raphael?S.getById(R.raphaelid):null;return R};ao.getElementsByBBox=function(b){var d=this.set();this.forEach(function(g){if(bi.isBBoxIntersect(g.getBBox(),b)){d.push(g)}});return d};ao.getById=function(d){var b=this.bottom;while(b){if(b.id==d){return b}b=b.next}return null};ao.forEach=function(g,b){var d=this.bottom;while(d){if(g.call(b,d)===false){return this}d=d.next}return this};ao.getElementsByPoint=function(b,g){var d=this.set();this.forEach(function(i){if(i.isPointInside(b,g)){d.push(i)}});return d};function bx(){return this.x+bh+this.y}function a6(){return this.x+bh+this.y+bh+this.width+" \xd7 "+this.height}aq.isPointInside=function(b,g){var d=this.realPath=af[this.type](this);if(this.attr("transform")&&this.attr("transform").length){d=bi.transformPath(d,this.attr("transform"))}return bi.isPointInsidePath(d,b,g)};aq.getBBox=function(d){if(this.removed){return{}}var b=this._;if(d){if(b.dirty||!b.bboxwt){this.realPath=af[this.type](this);b.bboxwt=I(this.realPath);b.bboxwt.toString=a6;b.dirty=0}return b.bboxwt}if(b.dirty||b.dirtyT||!b.bbox){if(b.dirty||!this.realPath){b.bboxwt=0;this.realPath=af[this.type](this)}b.bbox=I(Q(this.realPath,this.matrix));b.bbox.toString=a6;b.dirty=b.dirtyT=0}return b.bbox};aq.clone=function(){if(this.removed){return null}var b=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(b);return b};aq.glow=function(bO){if(this.type=="text"){return null}bO=bO||{};var g={width:(bO.width||10)+(+this.attr("stroke-width")||1),fill:bO.fill||false,opacity:bO.opacity||0.5,offsetx:bO.offsetx||0,offsety:bO.offsety||0,color:bO.color||"#000"},S=g.width/2,E=this.paper,b=E.set(),R=this.realPath||af[this.type](this);R=this.matrix?Q(R,this.matrix):R;for(var d=1;d<S+1;d++){b.push(E.path(R).attr({stroke:g.color,fill:g.fill?g.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(g.width/S*d).toFixed(3),opacity:+(g.opacity/S).toFixed(3)}))}return b.insertBefore(this).translate(g.offsetx,g.offsety)};var aZ={},aO=function(d,b,E,i,bP,bO,S,R,g){if(g==null){return bb(d,b,E,i,bP,bO,S,R)}else{return bi.findDotsAtSegment(d,b,E,i,bP,bO,S,R,aK(d,b,E,i,bP,bO,S,R,g))}},aD=function(b,d){return function(bW,R,S){bW=bk(bW);var bS,bR,g,bO,E="",bV={},bT,bQ=0;for(var bP=0,bU=bW.length;bP<bU;bP++){g=bW[bP];if(g[0]=="M"){bS=+g[1];bR=+g[2]}else{bO=aO(bS,bR,g[1],g[2],g[3],g[4],g[5],g[6]);if(bQ+bO>R){if(d&&!bV.start){bT=aO(bS,bR,g[1],g[2],g[3],g[4],g[5],g[6],R-bQ);E+=["C"+bT.start.x,bT.start.y,bT.m.x,bT.m.y,bT.x,bT.y];if(S){return E}bV.start=E;E=["M"+bT.x,bT.y+"C"+bT.n.x,bT.n.y,bT.end.x,bT.end.y,g[5],g[6]].join();bQ+=bO;bS=+g[5];bR=+g[6];continue}if(!b&&!d){bT=aO(bS,bR,g[1],g[2],g[3],g[4],g[5],g[6],R-bQ);return{x:bT.x,y:bT.y,alpha:bT.alpha}}}bQ+=bO;bS=+g[5];bR=+g[6]}E+=g.shift()+g}bV.end=E;bT=b?bQ:d?bV:bi.findDotsAtSegment(bS,bR,g[0],g[1],g[2],g[3],g[4],g[5],1);bT.alpha&&(bT={x:bT.x,y:bT.y,alpha:bT.alpha});return bT}};var bG=aD(1),by=aD(),aB=aD(0,1);bi.getTotalLength=bG;bi.getPointAtLength=by;bi.getSubpath=function(d,i,g){if(this.getTotalLength(d)-g<0.000001){return aB(d,i).end}var b=aB(d,g,1);return i?aB(b,i).end:b};aq.getTotalLength=function(){var b=this.getPath();if(!b){return}if(this.node.getTotalLength){return this.node.getTotalLength()}return bG(b)};aq.getPointAtLength=function(b){var d=this.getPath();if(!d){return}return by(d,b)};aq.getPath=function(){var d,b=bi._getPath[this.type];if(this.type=="text"||this.type=="set"){return}if(b){d=b(this)}return d};aq.getSubpath=function(g,d){var b=this.getPath();if(!b){return}return bi.getSubpath(b,g,d)};var aG=bi.easing_formulas={linear:function(b){return b},"<":function(b){return aS(b,1.7)},">":function(b){return aS(b,0.48)},"<>":function(bO){var i=0.48-bO/1.04,g=aI.sqrt(0.1734+i*i),b=g-i,S=aS(ak(b),1/3)*(b<0?-1:1),R=-g-i,E=aS(ak(R),1/3)*(R<0?-1:1),d=S+E+0.5;return(1-d)*3*d*d+d*d*d},backIn:function(d){var b=1.70158;return d*d*((b+1)*d-b)},backOut:function(d){d=d-1;var b=1.70158;return d*d*((b+1)*d+b)+1},elastic:function(b){if(b==!!b){return b}return aS(2,-10*b)*aI.sin((b-0.075)*(2*ag)/0.3)+1},bounce:function(i){var d=7.5625,g=2.75,b;if(i<(1/g)){b=d*i*i}else{if(i<(2/g)){i-=(1.5/g);b=d*i*i+0.75}else{if(i<(2.5/g)){i-=(2.25/g);b=d*i*i+0.9375}else{i-=(2.625/g);b=d*i*i+0.984375}}}return b}};aG.easeIn=aG["ease-in"]=aG["<"];aG.easeOut=aG["ease-out"]=aG[">"];aG.easeInOut=aG["ease-in-out"]=aG["<>"];aG["back-in"]=aG.backIn;aG["back-out"]=aG.backOut;var bF=[],bH=aT.requestAnimationFrame||aT.webkitRequestAnimationFrame||aT.mozRequestAnimationFrame||aT.oRequestAnimationFrame||aT.msRequestAnimationFrame||function(b){setTimeout(b,16)},at=function(){var bO=+new Date,bW=0;for(;bW<bF.length;bW++){var b2=bF[bW];if(b2.el.removed||b2.paused){continue}var E=bO-b2.start,bU=b2.ms,bT=b2.easing,bX=b2.from,bR=b2.diff,d=b2.to,bQ=b2.t,S=b2.el,bS={},b,b0={},b4;if(b2.initstatus){E=(b2.initstatus*b2.anim.top-b2.prev)/(b2.percent-b2.prev)*bU;b2.status=b2.initstatus;delete b2.initstatus;b2.stop&&bF.splice(bW--,1)}else{b2.status=(b2.prev+(b2.percent-b2.prev)*(E/bU))/b2.anim.top}if(E<0){continue}if(E<bU){var g=bT(E/bU);for(var bV in bX){if(bX[bw](bV)){switch(bo[bV]){case bj:b=+bX[bV]+g*bU*bR[bV];break;case"colour":b="rgb("+[a1(C(bX[bV].r+g*bU*bR[bV].r)),a1(C(bX[bV].g+g*bU*bR[bV].g)),a1(C(bX[bV].b+g*bU*bR[bV].b))].join(",")+")";break;case"path":b=[];for(var bZ=0,bP=bX[bV].length;bZ<bP;bZ++){b[bZ]=[bX[bV][bZ][0]];for(var bY=1,b1=bX[bV][bZ].length;bY<b1;bY++){b[bZ][bY]=+bX[bV][bZ][bY]+g*bU*bR[bV][bZ][bY]}b[bZ]=b[bZ].join(bh)}b=b.join(bh);break;case"transform":if(bR[bV].real){b=[];for(bZ=0,bP=bX[bV].length;bZ<bP;bZ++){b[bZ]=[bX[bV][bZ][0]];for(bY=1,b1=bX[bV][bZ].length;bY<b1;bY++){b[bZ][bY]=bX[bV][bZ][bY]+g*bU*bR[bV][bZ][bY]}}}else{var b3=function(b5){return +bX[bV][b5]+g*bU*bR[bV][b5]};b=[["m",b3(0),b3(1),b3(2),b3(3),b3(4),b3(5)]]}break;case"csv":if(bV=="clip-rect"){b=[];bZ=4;while(bZ--){b[bZ]=+bX[bV][bZ]+g*bU*bR[bV][bZ]}}break;default:var R=[][av](bX[bV]);b=[];bZ=S.paper.customAttributes[bV].length;while(bZ--){b[bZ]=+R[bZ]+g*bU*bR[bV][bZ]}break}bS[bV]=b}}S.attr(bS);(function(b6,i,b5){setTimeout(function(){bc("raphael.anim.frame."+b6,i,b5)})})(S.id,S,b2.anim)}else{(function(b6,b5,i){setTimeout(function(){bc("raphael.anim.frame."+b5.id,b5,i);bc("raphael.anim.finish."+b5.id,b5,i);bi.is(b6,"function")&&b6.call(b5)})})(b2.callback,S,b2.anim);S.attr(d);bF.splice(bW--,1);if(b2.repeat>1&&!b2.next){for(b4 in d){if(d[bw](b4)){b0[b4]=b2.totalOrigin[b4]}}b2.el.attr(b0);T(b2.anim,b2.el,b2.anim.percents[0],null,b2.totalOrigin,b2.repeat-1)}if(b2.next&&!b2.stop){T(b2.anim,b2.el,b2.next,null,b2.totalOrigin,b2.repeat)}}}bi.svg&&S&&S.paper&&S.paper.safari();bF.length&&bH(at)},a1=function(b){return b>255?255:b<0?0:b};aq.animateWith=function(d,E,g,b,bO,bT){var S=this;if(S.removed){bT&&bT.call(S);return S}var bR=g instanceof f?g:bi.animation(g,b,bO,bT),bQ,bP;T(bR,S,bR.percents[0],null,S.attr());for(var R=0,bS=bF.length;R<bS;R++){if(bF[R].anim==E&&bF[R].el==d){bF[bS-1].start=bF[R].start;break}}return S};function a0(bU,i,d,bT,bS,bO){var bP=3*i,bR=3*(bT-i)-bP,b=1-bP-bR,S=3*d,bQ=3*(bS-d)-S,bV=1-S-bQ;function R(bW){return((b*bW+bR)*bW+bP)*bW}function g(bW,bY){var bX=E(bW,bY);return((bV*bX+bQ)*bX+S)*bX}function E(bW,b3){var b2,b1,bZ,bX,b0,bY;for(bZ=bW,bY=0;bY<8;bY++){bX=R(bZ)-bW;if(ak(bX)<b3){return bZ}b0=(3*b*bZ+2*bR)*bZ+bP;if(ak(b0)<0.000001){break}bZ=bZ-bX/b0}b2=0;b1=1;bZ=bW;if(bZ<b2){return b2}if(bZ>b1){return b1}while(b2<b1){bX=R(bZ);if(ak(bX-bW)<b3){return bZ}if(bW>bX){b2=bZ}else{b1=bZ}bZ=(b1-b2)/2+b2}return bZ}return g(bU,1/(200*bO))}aq.onAnimation=function(b){b?bc.on("raphael.anim.frame."+this.id,b):bc.unbind("raphael.anim.frame."+this.id);return this};function f(E,g){var d=[],i={};this.ms=g;this.times=1;if(E){for(var b in E){if(E[bw](b)){i[bM(b)]=E[b];d.push(bM(b))}}d.sort(bu)}this.anim=i;this.top=d[d.length-1];this.percents=d}f.prototype.delay=function(d){var b=new f(this.anim,this.ms);b.times=this.times;b.del=+d||0;return b};f.prototype.repeat=function(d){var b=new f(this.anim,this.ms);b.del=this.del;b.times=aI.floor(bI(d,0))||1;return b};function T(b6,g,b,b4,bO,bS){b=bM(b);var cd,S,bR,ce=[],bY,bX,R,b0=b6.ms,b5={},E={},bU={};if(b4){for(b9=0,bT=bF.length;b9<bT;b9++){var cb=bF[b9];if(cb.el.id==g.id&&cb.anim==b6){if(cb.percent!=b){bF.splice(b9,1);bR=1}else{S=cb}g.attr(cb.totalOrigin);break}}}else{b4=+E}for(var b9=0,bT=b6.percents.length;b9<bT;b9++){if(b6.percents[b9]==b||b6.percents[b9]>b4*b6.top){b=b6.percents[b9];bX=b6.percents[b9-1]||0;b0=b0/b6.top*(b-bX);bY=b6.percents[b9+1];cd=b6.anim[b];break}else{if(b4){g.attr(b6.anim[b6.percents[b9]])}}}if(!cd){return}if(!S){for(var b2 in cd){if(cd[bw](b2)){if(bo[bw](b2)||g.paper.customAttributes[bw](b2)){b5[b2]=g.attr(b2);(b5[b2]==null)&&(b5[b2]=bq[b2]);E[b2]=cd[b2];switch(bo[b2]){case bj:bU[b2]=(E[b2]-b5[b2])/b0;break;case"colour":b5[b2]=bi.getRGB(b5[b2]);var b3=bi.getRGB(E[b2]);bU[b2]={r:(b3.r-b5[b2].r)/b0,g:(b3.g-b5[b2].g)/b0,b:(b3.b-b5[b2].b)/b0};break;case"path":var bP=bk(b5[b2],E[b2]),bW=bP[1];b5[b2]=bP[0];bU[b2]=[];for(b9=0,bT=b5[b2].length;b9<bT;b9++){bU[b2][b9]=[0];for(var b8=1,ca=b5[b2][b9].length;b8<ca;b8++){bU[b2][b9][b8]=(bW[b9][b8]-b5[b2][b9][b8])/b0}}break;case"transform":var cg=g._,cf=bd(cg[b2],E[b2]);if(cf){b5[b2]=cf.from;E[b2]=cf.to;bU[b2]=[];bU[b2].real=true;for(b9=0,bT=b5[b2].length;b9<bT;b9++){bU[b2][b9]=[b5[b2][b9][0]];for(b8=1,ca=b5[b2][b9].length;b8<ca;b8++){bU[b2][b9][b8]=(E[b2][b9][b8]-b5[b2][b9][b8])/b0}}}else{var b1=(g.matrix||new a9),cc={_:{transform:cg.transform},getBBox:function(){return g.getBBox(1)}};b5[b2]=[b1.a,b1.b,b1.c,b1.d,b1.e,b1.f];Y(cc,E[b2]);E[b2]=cc._.transform;bU[b2]=[(cc.matrix.a-b1.a)/b0,(cc.matrix.b-b1.b)/b0,(cc.matrix.c-b1.c)/b0,(cc.matrix.d-b1.d)/b0,(cc.matrix.e-b1.e)/b0,(cc.matrix.f-b1.f)/b0]}break;case"csv":var d=k(cd[b2])[l](bv),bQ=k(b5[b2])[l](bv);if(b2=="clip-rect"){b5[b2]=bQ;bU[b2]=[];b9=bQ.length;while(b9--){bU[b2][b9]=(d[b9]-b5[b2][b9])/b0}}E[b2]=d;break;default:d=[][av](cd[b2]);bQ=[][av](b5[b2]);bU[b2]=[];b9=g.paper.customAttributes[b2].length;while(b9--){bU[b2][b9]=((d[b9]||0)-(bQ[b9]||0))/b0}break}}}}var bZ=cd.easing,b7=bi.easing_formulas[bZ];if(!b7){b7=k(bZ).match(an);if(b7&&b7.length==5){var bV=b7;b7=function(i){return a0(i,+bV[1],+bV[2],+bV[3],+bV[4],b0)}}else{b7=aw}}R=cd.start||b6.start||+new Date;cb={anim:b6,percent:b,timestamp:R,start:R+(b6.del||0),status:0,initstatus:b4||0,stop:false,ms:b0,easing:b7,from:b5,diff:bU,to:E,el:g,callback:cd.callback,prev:bX,next:bY,repeat:bS||b6.times,origin:g.attr(),totalOrigin:bO};bF.push(cb);if(b4&&!S&&!bR){cb.stop=true;cb.start=new Date-b0*b4;if(bF.length==1){return at()}}if(bR){cb.start=new Date-cb.ms*b4}bF.length==1&&bH(at)}else{S.initstatus=b4;S.start=new Date-S.ms*b4}bc("raphael.anim.start."+g.id,g,b6)}bi.animation=function(E,d,S,R){if(E instanceof f){return E}if(bi.is(S,"function")||!S){R=R||S||null;S=null}E=Object(E);d=+d||0;var i={},g,b;for(b in E){if(E[bw](b)&&bM(b)!=b&&bM(b)+"%"!=b){g=true;i[b]=E[b]}}if(!g){return new f(E,d)}else{S&&(i.easing=S);R&&(i.callback=R);return new f({100:i},d)}};aq.animate=function(i,b,R,E){var d=this;if(d.removed){E&&E.call(d);return d}var g=i instanceof f?i:bi.animation(i,b,R,E);T(g,d,g.percents[0],null,d.attr());return d};aq.setTime=function(d,b){if(d&&b!=null){this.status(d,ai(b,d.ms)/d.ms)}return this};aq.status=function(R,E){var d=[],g=0,b,S;if(E!=null){T(R,this,-1,ai(E,1));return this}else{b=bF.length;for(;g<b;g++){S=bF[g];if(S.el.id==this.id&&(!R||S.anim==R)){if(R){return S.status}d.push({anim:S.anim,status:S.status})}}if(R){return 0}return d}};aq.pause=function(d){for(var b=0;b<bF.length;b++){if(bF[b].el.id==this.id&&(!d||bF[b].anim==d)){if(bc("raphael.anim.pause."+this.id,this,bF[b].anim)!==false){bF[b].paused=true}}}return this};aq.resume=function(d){for(var b=0;b<bF.length;b++){if(bF[b].el.id==this.id&&(!d||bF[b].anim==d)){var g=bF[b];if(bc("raphael.anim.resume."+this.id,this,g.anim)!==false){delete g.paused;this.status(g.anim,g.status)}}}return this};aq.stop=function(d){for(var b=0;b<bF.length;b++){if(bF[b].el.id==this.id&&(!d||bF[b].anim==d)){if(bc("raphael.anim.stop."+this.id,this,bF[b].anim)!==false){bF.splice(b--,1)}}}return this};function be(d){for(var b=0;b<bF.length;b++){if(bF[b].el.paper==d){bF.splice(b--,1)}}}bc.on("raphael.remove",be);bc.on("raphael.clear",be);aq.toString=function(){return"Rapha\xebl\u2019s object"};var X=function(b){this.items=[];this.length=0;this.type="set";if(b){for(var d=0,g=b.length;d<g;d++){if(b[d]&&(b[d].constructor==aq.constructor||b[d].constructor==X)){this[this.items.length]=this.items[this.items.length]=b[d];this.length++}}}},v=X.prototype;v.push=function(){var E,b;for(var d=0,g=arguments.length;d<g;d++){E=arguments[d];if(E&&(E.constructor==aq.constructor||E.constructor==X)){b=this.items.length;this[b]=this.items[b]=E;this.length++}}return this};v.pop=function(){this.length&&delete this[this.length--];return this.items.pop()};v.forEach=function(E,b){for(var d=0,g=this.items.length;d<g;d++){if(E.call(b,this.items[d],d)===false){return this}}return this};for(var aF in aq){if(aq[bw](aF)){v[aF]=(function(b){return function(){var d=arguments;return this.forEach(function(g){g[b][bs](g,d)})}})(aF)}}v.attr=function(d,S){if(d&&bi.is(d,u)&&bi.is(d[0],"object")){for(var b=0,R=d.length;b<R;b++){this.items[b].attr(d[b])}}else{for(var g=0,E=this.items.length;g<E;g++){this.items[g].attr(d,S)}}return this};v.clear=function(){while(this.length){this.pop()}};v.splice=function(E,bO,bP){E=E<0?bI(this.length+E,0):E;bO=bI(0,ai(this.length-E,bO));var g=[],b=[],d=[],R;for(R=2;R<arguments.length;R++){d.push(arguments[R])}for(R=0;R<bO;R++){b.push(this[E+R])}for(;R<this.length-E;R++){g.push(this[E+R])}var S=d.length;for(R=0;R<S+g.length;R++){this.items[E+R]=this[E+R]=R<S?d[R]:g[R-S]}R=this.items.length=this.length-=bO-S;while(this[R]){delete this[R++]}return new X(b)};v.exclude=function(g){for(var b=0,d=this.length;b<d;b++){if(this[b]==g){this.splice(b,1);return true}}};v.animate=function(g,b,bO,bQ){(bi.is(bO,"function")||!bO)&&(bQ=bO||null);var S=this.items.length,E=S,bR,bP=this,R;if(!S){return this}bQ&&(R=function(){!--S&&bQ.call(bP)});bO=bi.is(bO,a)?bO:R;var d=bi.animation(g,b,bO,R);bR=this.items[--E].animate(d);while(E--){this.items[E]&&!this.items[E].removed&&this.items[E].animateWith(bR,d,d);(this.items[E]&&!this.items[E].removed)||S--}return this};v.insertAfter=function(d){var b=this.items.length;while(b--){this.items[b].insertAfter(d)}return this};v.getBBox=function(){var b=[],S=[],d=[],E=[];for(var g=this.items.length;g--;){if(!this.items[g].removed){var R=this.items[g].getBBox();b.push(R.x);S.push(R.y);d.push(R.x+R.width);E.push(R.y+R.height)}}b=ai[bs](0,b);S=ai[bs](0,S);d=bI[bs](0,d);E=bI[bs](0,E);return{x:b,y:S,x2:d,y2:E,width:d-b,height:E-S}};v.clone=function(g){g=this.paper.set();for(var b=0,d=this.items.length;b<d;b++){g.push(this.items[b].clone())}return g};v.toString=function(){return"Rapha\xebl\u2018s set"};v.glow=function(d){var b=this.paper.set();this.forEach(function(i,E){var R=i.glow(d);if(R!=null){R.forEach(function(g,S){b.push(g)})}});return b};v.isPointInside=function(b,g){var d=false;this.forEach(function(i){if(i.isPointInside(b,g)){d=true;return false}});return d};bi.registerFont=function(d){if(!d.face){return d}this.fonts=this.fonts||{};var i={w:d.w,face:{},glyphs:{}},g=d.face["font-family"];for(var S in d.face){if(d.face[bw](S)){i.face[S]=d.face[S]}}if(this.fonts[g]){this.fonts[g].push(i)}else{this.fonts[g]=[i]}if(!d.svg){i.face["units-per-em"]=bK(d.face["units-per-em"],10);for(var E in d.glyphs){if(d.glyphs[bw](E)){var R=d.glyphs[E];i.glyphs[E]={w:R.w,k:{},d:R.d&&"M"+R.d.replace(/[mlcxtrv]/g,function(bO){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[bO]||"M"})+"z"};if(R.k){for(var b in R.k){if(R[bw](b)){i.glyphs[E].k[b]=R.k[b]}}}}}}return d};ao.getFont=function(bP,bQ,d,E){E=E||"normal";d=d||"normal";bQ=+bQ||{normal:400,bold:700,lighter:300,bolder:800}[bQ]||400;if(!bi.fonts){return}var R=bi.fonts[bP];if(!R){var g=new RegExp("(^|\\s)"+bP.replace(/[^\w\d\s+!~.:_-]/g,bn)+"(\\s|$)","i");for(var b in bi.fonts){if(bi.fonts[bw](b)){if(g.test(b)){R=bi.fonts[b];break}}}}var S;if(R){for(var bO=0,bR=R.length;bO<bR;bO++){S=R[bO];if(S.face["font-weight"]==bQ&&(S.face["font-style"]==d||!S.face["font-style"])&&S.face["font-stretch"]==E){break}}}return S};ao.print=function(bP,bO,b,bS,bU,b2,g,d){b2=b2||"middle";g=bI(ai(g||0,1),-1);d=bI(ai(d||1,3),1);var b1=k(b)[l](bn),bY=0,b0=0,bW=bn,b3;bi.is(bS,"string")&&(bS=this.getFont(bS));if(bS){b3=(bU||16)/bS.face["units-per-em"];var R=bS.face.bbox[l](bv),bR=+R[0],E=R[3]-R[1],S=0,bT=+R[1]+(b2=="baseline"?E+(+bS.face.descent):E/2);for(var bX=0,bQ=b1.length;bX<bQ;bX++){if(b1[bX]=="\n"){bY=0;bZ=0;b0=0;S+=E*d}else{var bV=b0&&bS.glyphs[b1[bX-1]]||{},bZ=bS.glyphs[b1[bX]];bY+=b0?(bV.w||bS.w)+(bV.k&&bV.k[b1[bX]]||0)+(bS.w*g):0;b0=1}if(bZ&&bZ.d){bW+=bi.transformPath(bZ.d,["t",bY*b3,S*b3,"s",b3,b3,bR,bT,"t",(bP-bR)/b3,(bO-bT)/b3])}}}return this.path(bW).attr({fill:"#000",stroke:"none"})};ao.add=function(E){if(bi.is(E,"array")){var g=this.set(),d=0,R=E.length,b;for(;d<R;d++){b=E[d]||{};au[bw](b.type)&&g.push(this[b.type]().attr(b))}}return g};bi.format=function(d,g){var b=bi.is(g,u)?[0][av](g):arguments;d&&bi.is(d,a)&&b.length-1&&(d=d.replace(W,function(R,E){return b[++E]==null?bn:b[E]}));return d||bn};bi.fullfill=(function(){var g=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,d=function(R,E,S){var i=S;E.replace(b,function(bQ,bP,bO,bS,bR){bP=bP||bS;if(i){if(bP in i){i=i[bP]}typeof i=="function"&&bR&&(i=i())}});i=(i==null||i==S?R:i)+"";return i};return function(E,i){return String(E).replace(g,function(S,R){return d(S,R,i)})}})();bi.ninja=function(){aE.was?(a5.win.Raphael=aE.is):delete Raphael;return bi};bi.st=v;(function(i,d,g){if(i.readyState==null&&i.addEventListener){i.addEventListener(d,g=function(){i.removeEventListener(d,g,false);i.readyState="complete"},false);i.readyState="loading"}function b(){(/in/).test(i.readyState)?setTimeout(b,9):bi.eve("raphael.DOMload")}b()})(document,"DOMContentLoaded");bc.on("raphael.DOMload",function(){K=true});(function(){if(!bi.svg){return}var i="hasOwnProperty",b9=String,bV=parseFloat,bY=parseInt,bO=Math,ca=bO.max,b0=bO.abs,bQ=bO.pow,bP=/[, ]+/,b7=bi.eve,bZ="",bS=" ";var bW="http://www.w3.org/1999/xlink",b6={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},b2={};bi.toString=function(){return"Your browser supports SVG.\nYou are running Rapha\xebl "+this.version};var bR=function(cb,E){if(E){if(typeof cb=="string"){cb=bR(cb)}for(var S in E){if(E[i](S)){if(S.substring(0,6)=="xlink:"){cb.setAttributeNS(bW,S.substring(6),b9(E[S]))}else{cb.setAttribute(S,b9(E[S]))}}}}else{cb=bi._g.doc.createElementNS("http://www.w3.org/2000/svg",cb);cb.style&&(cb.style.webkitTapHighlightColor="rgba(0,0,0,0)")}return cb},b=function(ci,cm){var ck="linear",S=ci.id+cm,cg=0.5,ce=0.5,cc=ci.node,E=ci.paper,co=cc.style,cb=bi._g.doc.getElementById(S);if(!cb){cm=b9(cm).replace(bi._radial_gradient,function(cr,cp,cs){ck="radial";if(cp&&cs){cg=bV(cp);ce=bV(cs);var cq=((ce>0.5)*2-1);bQ(cg-0.5,2)+bQ(ce-0.5,2)>0.25&&(ce=bO.sqrt(0.25-bQ(cg-0.5,2))*cq+0.5)&&ce!=0.5&&(ce=ce.toFixed(5)-0.00001*cq)}return bZ});cm=cm.split(/\s*\-\s*/);if(ck=="linear"){var cf=cm.shift();cf=-bV(cf);if(isNaN(cf)){return null}var cd=[0,0,bO.cos(bi.rad(cf)),bO.sin(bi.rad(cf))],cl=1/(ca(b0(cd[2]),b0(cd[3]))||1);cd[2]*=cl;cd[3]*=cl;if(cd[2]<0){cd[0]=-cd[2];cd[2]=0}if(cd[3]<0){cd[1]=-cd[3];cd[3]=0}}var cj=bi._parseDots(cm);if(!cj){return null}S=S.replace(/[\(\)\s,\xb0#]/g,"_");if(ci.gradient&&S!=ci.gradient.id){E.defs.removeChild(ci.gradient);delete ci.gradient}if(!ci.gradient){cb=bR(ck+"Gradient",{id:S});ci.gradient=cb;bR(cb,ck=="radial"?{fx:cg,fy:ce}:{x1:cd[0],y1:cd[1],x2:cd[2],y2:cd[3],gradientTransform:ci.matrix.invert()});E.defs.appendChild(cb);for(var ch=0,cn=cj.length;ch<cn;ch++){cb.appendChild(bR("stop",{offset:cj[ch].offset?cj[ch].offset:ch?"100%":"0%","stop-color":cj[ch].color||"#fff"}))}}}bR(cc,{fill:"url(#"+S+")",opacity:1,"fill-opacity":1});co.fill=bZ;co.opacity=1;co.fillOpacity=1;return 1},d=function(S){var E=S.getBBox(1);bR(S.pattern,{patternTransform:S.matrix.invert()+" translate("+E.x+","+E.y+")"})},g=function(ck,cm,cf){if(ck.type=="path"){var E=b9(cm).toLowerCase().split("-"),cj=ck.paper,cx=cf?"end":"start",co=ck.node,cl=ck.attrs,ce=cl["stroke-width"],cs=E.length,cc="classic",cr,cb,ch,cp,cn,cg=3,ct=3,ci=5;while(cs--){switch(E[cs]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":cc=E[cs];break;case"wide":ct=5;break;case"narrow":ct=2;break;case"long":cg=5;break;case"short":cg=2;break}}if(cc=="open"){cg+=2;ct+=2;ci+=2;ch=1;cp=cf?4:1;cn={fill:"none",stroke:cl.stroke}}else{cp=ch=cg/2;cn={fill:cl.stroke,stroke:"none"}}if(ck._.arrows){if(cf){ck._.arrows.endPath&&b2[ck._.arrows.endPath]--;ck._.arrows.endMarker&&b2[ck._.arrows.endMarker]--}else{ck._.arrows.startPath&&b2[ck._.arrows.startPath]--;ck._.arrows.startMarker&&b2[ck._.arrows.startMarker]--}}else{ck._.arrows={}}if(cc!="none"){var S="raphael-marker-"+cc,cw="raphael-marker-"+cx+cc+cg+ct;if(!bi._g.doc.getElementById(S)){cj.defs.appendChild(bR(bR("path"),{"stroke-linecap":"round",d:b6[cc],id:S}));b2[S]=1}else{b2[S]++}var cd=bi._g.doc.getElementById(cw),cq;if(!cd){cd=bR(bR("marker"),{id:cw,markerHeight:ct,markerWidth:cg,orient:"auto",refX:cp,refY:ct/2});cq=bR(bR("use"),{"xlink:href":"#"+S,transform:(cf?"rotate(180 "+cg/2+" "+ct/2+") ":bZ)+"scale("+cg/ci+","+ct/ci+")","stroke-width":(1/((cg/ci+ct/ci)/2)).toFixed(4)});cd.appendChild(cq);cj.defs.appendChild(cd);b2[cw]=1}else{b2[cw]++;cq=cd.getElementsByTagName("use")[0]}bR(cq,cn);var cv=ch*(cc!="diamond"&&cc!="oval");if(cf){cr=ck._.arrows.startdx*ce||0;cb=bi.getTotalLength(cl.path)-cv*ce}else{cr=cv*ce;cb=bi.getTotalLength(cl.path)-(ck._.arrows.enddx*ce||0)}cn={};cn["marker-"+cx]="url(#"+cw+")";if(cb||cr){cn.d=bi.getSubpath(cl.path,cr,cb)}bR(co,cn);ck._.arrows[cx+"Path"]=S;ck._.arrows[cx+"Marker"]=cw;ck._.arrows[cx+"dx"]=cv;ck._.arrows[cx+"Type"]=cc;ck._.arrows[cx+"String"]=cm}else{if(cf){cr=ck._.arrows.startdx*ce||0;cb=bi.getTotalLength(cl.path)-cr}else{cr=0;cb=bi.getTotalLength(cl.path)-(ck._.arrows.enddx*ce||0)}ck._.arrows[cx+"Path"]&&bR(co,{d:bi.getSubpath(cl.path,cr,cb)});delete ck._.arrows[cx+"Path"];delete ck._.arrows[cx+"Marker"];delete ck._.arrows[cx+"dx"];delete ck._.arrows[cx+"Type"];delete ck._.arrows[cx+"String"]}for(cn in b2){if(b2[i](cn)&&!b2[cn]){var cu=bi._g.doc.getElementById(cn);cu&&cu.parentNode.removeChild(cu)}}}},b3={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},bT=function(cf,cd,ce){cd=b3[b9(cd).toLowerCase()];if(cd){var cb=cf.attrs["stroke-width"]||"1",E={round:cb,square:cb,butt:0}[cf.attrs["stroke-linecap"]||ce["stroke-linecap"]]||0,cc=[],S=cd.length;while(S--){cc[S]=cd[S]*cb+((S%2)?1:-1)*E}bR(cf.node,{"stroke-dasharray":cc.join(",")})}},b4=function(cl,cv){var cp=cl.node,cm=cl.attrs,cj=cp.style.visibility;cp.style.visibility="hidden";for(var co in cv){if(cv[i](co)){if(!bi._availableAttrs[i](co)){continue}var cn=cv[co];cm[co]=cn;switch(co){case"blur":cl.blur(cn);break;case"title":var cx=cp.getElementsByTagName("title");if(cx.length&&(cx=cx[0])){cx.firstChild.nodeValue=cn}else{cx=bR("title");var cy=bi._g.doc.createTextNode(cn);cx.appendChild(cy);cp.appendChild(cx)}break;case"href":case"target":var cr=cp.parentNode;if(cr.tagName.toLowerCase()!="a"){var cd=bR("a");cr.insertBefore(cd,cp);cd.appendChild(cp);cr=cd}if(co=="target"){cr.setAttributeNS(bW,"show",cn=="blank"?"new":cn)}else{cr.setAttributeNS(bW,co,cn)}break;case"cursor":cp.style.cursor=cn;break;case"transform":cl.transform(cn);break;case"arrow-start":g(cl,cn);break;case"arrow-end":g(cl,cn,1);break;case"clip-rect":var S=b9(cn).split(bP);if(S.length==4){cl.clip&&cl.clip.parentNode.parentNode.removeChild(cl.clip.parentNode);var cb=bR("clipPath"),cq=bR("rect");cb.id=bi.createUUID();bR(cq,{x:S[0],y:S[1],width:S[2],height:S[3]});cb.appendChild(cq);cl.paper.defs.appendChild(cb);bR(cp,{"clip-path":"url(#"+cb.id+")"});cl.clip=cq}if(!cn){var ck=cp.getAttribute("clip-path");if(ck){var cu=bi._g.doc.getElementById(ck.replace(/(^url\(#|\)$)/g,bZ));cu&&cu.parentNode.removeChild(cu);bR(cp,{"clip-path":bZ});delete cl.clip}}break;case"path":if(cl.type=="path"){bR(cp,{d:cn?cm.path=bi._pathToAbsolute(cn):"M0,0"});cl._.dirty=1;if(cl._.arrows){"startString" in cl._.arrows&&g(cl,cl._.arrows.startString);"endString" in cl._.arrows&&g(cl,cl._.arrows.endString,1)}}break;case"width":cp.setAttribute(co,cn);cl._.dirty=1;if(cm.fx){co="x";cn=cm.x}else{break}case"x":if(cm.fx){cn=-cm.x-(cm.width||0)}case"rx":if(co=="rx"&&cl.type=="rect"){break}case"cx":cp.setAttribute(co,cn);cl.pattern&&d(cl);cl._.dirty=1;break;case"height":cp.setAttribute(co,cn);cl._.dirty=1;if(cm.fy){co="y";cn=cm.y}else{break}case"y":if(cm.fy){cn=-cm.y-(cm.height||0)}case"ry":if(co=="ry"&&cl.type=="rect"){break}case"cy":cp.setAttribute(co,cn);cl.pattern&&d(cl);cl._.dirty=1;break;case"r":if(cl.type=="rect"){bR(cp,{rx:cn,ry:cn})}else{cp.setAttribute(co,cn)}cl._.dirty=1;break;case"src":if(cl.type=="image"){cp.setAttributeNS(bW,"href",cn)}break;case"stroke-width":if(cl._.sx!=1||cl._.sy!=1){cn/=ca(b0(cl._.sx),b0(cl._.sy))||1}if(cl.paper._vbSize){cn*=cl.paper._vbSize}cp.setAttribute(co,cn);if(cm["stroke-dasharray"]){bT(cl,cm["stroke-dasharray"],cv)}if(cl._.arrows){"startString" in cl._.arrows&&g(cl,cl._.arrows.startString);"endString" in cl._.arrows&&g(cl,cl._.arrows.endString,1)}break;case"stroke-dasharray":bT(cl,cn,cv);break;case"fill":var ce=b9(cn).match(bi._ISURL);if(ce){var ct=0;var cs=0;var cg=0;var cw=0;if(ce.length>2&&ce[2]!=""){offsetValues=ce[2].split(",");ol=offsetValues.length;ct=ol>0?parseFloat(offsetValues[0]):0;cs=ol>1?parseFloat(offsetValues[1]):0;cg=ol>2?parseFloat(offsetValues[2]):0;cw=ol>3?parseFloat(offsetValues[3]):0}cb=bR("pattern");var ci=bR("image");cb.id=bi.createUUID(),bR(cb,{x:ct,y:cs,patternUnits:"userSpaceOnUse",height:1,width:1}),bR(ci,{x:0,y:0,"xlink:href":ce[1]}),cb.appendChild(ci),function(cz){bi._preload(ce[1],function(){var cA=(cg==0?this.offsetWidth:cg),cB=(cw==0?this.offsetHeight:cg);bR(cz,{width:cA,height:cB}),bR(ci,{width:cA,height:cB}),cl.paper.safari()})}(cb),cl.paper.defs.appendChild(cb),bR(cp,{fill:"url(#"+cb.id+")"}),cl.pattern=cb,cl.pattern&&d(cl);break}var cc=bi.getRGB(cn);if(!cc.error){delete cv.gradient;delete cm.gradient;!bi.is(cm.opacity,"undefined")&&bi.is(cv.opacity,"undefined")&&bR(cp,{opacity:cm.opacity});!bi.is(cm["fill-opacity"],"undefined")&&bi.is(cv["fill-opacity"],"undefined")&&bR(cp,{"fill-opacity":cm["fill-opacity"]})}else{if((cl.type=="circle"||cl.type=="ellipse"||b9(cn).charAt()!="r")&&b(cl,cn)){if("opacity" in cm||"fill-opacity" in cm){var E=bi._g.doc.getElementById(cp.getAttribute("fill").replace(/^url\(#|\)$/g,bZ));if(E){var cf=E.getElementsByTagName("stop");bR(cf[cf.length-1],{"stop-opacity":("opacity" in cm?cm.opacity:1)*("fill-opacity" in cm?cm["fill-opacity"]:1)})}}cm.gradient=cn;cm.fill="none";break}}cc[i]("opacity")&&bR(cp,{"fill-opacity":cc.opacity>1?cc.opacity/100:cc.opacity});case"stroke":cc=bi.getRGB(cn);cp.setAttribute(co,cc.hex);co=="stroke"&&cc[i]("opacity")&&bR(cp,{"stroke-opacity":cc.opacity>1?cc.opacity/100:cc.opacity});if(co=="stroke"&&cl._.arrows){"startString" in cl._.arrows&&g(cl,cl._.arrows.startString);"endString" in cl._.arrows&&g(cl,cl._.arrows.endString,1)}break;case"gradient":(cl.type=="circle"||cl.type=="ellipse"||b9(cn).charAt()!="r")&&b(cl,cn);break;case"opacity":if(cm.gradient&&!cm[i]("stroke-opacity")){bR(cp,{"stroke-opacity":cn>1?cn/100:cn})}case"fill-opacity":if(cm.gradient){E=bi._g.doc.getElementById(cp.getAttribute("fill").replace(/^url\(#|\)$/g,bZ));if(E){cf=E.getElementsByTagName("stop");bR(cf[cf.length-1],{"stop-opacity":cn})}break}default:co=="font-size"&&(cn=bY(cn,10)+"px");var ch=co.replace(/(\-.)/g,function(cz){return cz.substring(1).toUpperCase()});cp.style[ch]=cn;cl._.dirty=1;cp.setAttribute(co,cn);break}}}bX(cl,cv);cp.style.visibility=cj},b8=1.2,bX=function(E,cd){if(E.type!="text"||!(cd[i]("text")||cd[i]("font")||cd[i]("font-size")||cd[i]("x")||cd[i]("y"))){return}var ci=E.attrs,cb=E.node,ck=cb.firstChild?bY(bi._g.doc.defaultView.getComputedStyle(cb.firstChild,bZ).getPropertyValue("font-size"),10):10;if(cd[i]("text")){ci.text=cd.text;while(cb.firstChild){cb.removeChild(cb.firstChild)}var cc=b9(cd.text).split("\n"),S=[],cg;for(var ce=0,cj=cc.length;ce<cj;ce++){cg=bR("tspan");ce&&bR(cg,{dy:ck*b8,x:ci.x});cg.appendChild(bi._g.doc.createTextNode(cc[ce]));cb.appendChild(cg);S[ce]=cg}}else{S=cb.getElementsByTagName("tspan");for(ce=0,cj=S.length;ce<cj;ce++){if(ce){bR(S[ce],{dy:ck*b8,x:ci.x})}else{bR(S[0],{dy:0})}}}bR(cb,{x:ci.x,y:ci.y});E._.dirty=1;var cf=E._getBBox(),ch=ci.y-(cf.y+cf.height/2);ch&&bi.is(ch,"finite")&&bR(S[0],{dy:ch})},b1=function(S,E){var cc=0,cb=0;this[0]=this.node=S;S.raphael=true;this.id=bi._oid++;S.raphaelid=this.id;this.matrix=bi.matrix();this.realPath=null;this.paper=E;this.attrs=this.attrs||{};this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1};!E.bottom&&(E.bottom=this);this.prev=E.top;E.top&&(E.top.next=this);E.top=this;this.next=null},bU=bi.el;b1.prototype=bU;bU.constructor=b1;bi._engine.path=function(E,cc){var S=bR("path");cc.canvas&&cc.canvas.appendChild(S);var cb=new b1(S,cc);cb.type="path";b4(cb,{fill:"none",stroke:"#000",path:E});return cb};bU.rotate=function(S,E,cc){if(this.removed){return this}S=b9(S).split(bP);if(S.length-1){E=bV(S[1]);cc=bV(S[2])}S=bV(S[0]);(cc==null)&&(E=cc);if(E==null||cc==null){var cb=this.getBBox(1);E=cb.x+cb.width/2;cc=cb.y+cb.height/2}this.transform(this._.transform.concat([["r",S,E,cc]]));return this};bU.scale=function(cd,cb,E,cc){if(this.removed){return this}cd=b9(cd).split(bP);if(cd.length-1){cb=bV(cd[1]);E=bV(cd[2]);cc=bV(cd[3])}cd=bV(cd[0]);(cb==null)&&(cb=cd);(cc==null)&&(E=cc);if(E==null||cc==null){var S=this.getBBox(1)}E=E==null?S.x+S.width/2:E;cc=cc==null?S.y+S.height/2:cc;this.transform(this._.transform.concat([["s",cd,cb,E,cc]]));return this};bU.translate=function(S,E){if(this.removed){return this}S=b9(S).split(bP);if(S.length-1){E=bV(S[1])}S=bV(S[0])||0;E=+E||0;this.transform(this._.transform.concat([["t",S,E]]));return this};bU.transform=function(S){var cb=this._;if(S==null){return cb.transform}bi._extractTransform(this,S);this.clip&&bR(this.clip,{transform:this.matrix.invert()});this.pattern&&d(this);this.node&&bR(this.node,{transform:this.matrix});if(cb.sx!=1||cb.sy!=1){var E=this.attrs[i]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":E})}return this};bU.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this};bU.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this};bU.remove=function(){if(this.removed||!this.node.parentNode){return}var S=this.paper;S.__set__&&S.__set__.exclude(this);b7.unbind("raphael.*.*."+this.id);if(this.gradient){S.defs.removeChild(this.gradient)}bi._tear(this,S);if(this.node.parentNode.tagName.toLowerCase()=="a"){this.node.parentNode.parentNode.removeChild(this.node.parentNode)}else{this.node.parentNode.removeChild(this.node)}for(var E in this){this[E]=typeof this[E]=="function"?bi._removedFactory(E):null}this.removed=true};bU._getBBox=function(){if(this.node.style.display=="none"){this.show();var E=true}var cb={};try{cb=this.node.getBBox()}catch(S){}finally{cb=cb||{}}E&&this.hide();return cb};bU.attr=function(E,ci){if(this.removed){return this}if(E==null){var cf={};for(var ch in this.attrs){if(this.attrs[i](ch)){cf[ch]=this.attrs[ch]}}cf.gradient&&cf.fill=="none"&&(cf.fill=cf.gradient)&&delete cf.gradient;cf.transform=this._.transform;return cf}if(ci==null&&bi.is(E,"string")){if(E=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient){return this.attrs.gradient}if(E=="transform"){return this._.transform}var cg=E.split(bP),cc={};for(var cd=0,ck=cg.length;cd<ck;cd++){E=cg[cd];if(E in this.attrs){cc[E]=this.attrs[E]}else{if(bi.is(this.paper.customAttributes[E],"function")){cc[E]=this.paper.customAttributes[E].def}else{cc[E]=bi._availableAttrs[E]}}}return ck-1?cc:cc[cg[0]]}if(ci==null&&bi.is(E,"array")){cc={};for(cd=0,ck=E.length;cd<ck;cd++){cc[E[cd]]=this.attr(E[cd])}return cc}if(ci!=null){var S={};S[E]=ci}else{if(E!=null&&bi.is(E,"object")){S=E}}for(var cj in S){b7("raphael.attr."+cj+"."+this.id,this,S[cj])}for(cj in this.paper.customAttributes){if(this.paper.customAttributes[i](cj)&&S[i](cj)&&bi.is(this.paper.customAttributes[cj],"function")){var ce=this.paper.customAttributes[cj].apply(this,[].concat(S[cj]));this.attrs[cj]=S[cj];for(var cb in ce){if(ce[i](cb)){S[cb]=ce[cb]}}}}b4(this,S);return this};bU.toFront=function(){if(this.removed){return this}if(this.node.parentNode.tagName.toLowerCase()=="a"){this.node.parentNode.parentNode.appendChild(this.node.parentNode)}else{this.node.parentNode.appendChild(this.node)}var E=this.paper;E.top!=this&&bi._tofront(this,E);return this};bU.toBack=function(){if(this.removed){return this}var S=this.node.parentNode;if(S.tagName.toLowerCase()=="a"){S.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild)}else{if(S.firstChild!=this.node){S.insertBefore(this.node,this.node.parentNode.firstChild)}}bi._toback(this,this.paper);var E=this.paper;return this};bU.insertAfter=function(E){if(this.removed){return this}var S=E.node||E[E.length-1].node;if(S.nextSibling){S.parentNode.insertBefore(this.node,S.nextSibling)}else{S.parentNode.appendChild(this.node)}bi._insertafter(this,E,this.paper);return this};bU.insertBefore=function(E){if(this.removed){return this}var S=E.node||E[0].node;S.parentNode.insertBefore(this.node,S);bi._insertbefore(this,E,this.paper);return this};bU.blur=function(S){var E=this;if(+S!==0){var cb=bR("filter"),cc=bR("feGaussianBlur");E.attrs.blur=S;cb.id=bi.createUUID();bR(cc,{stdDeviation:+S||1.5});cb.appendChild(cc);E.paper.defs.appendChild(cb);E._blur=cb;bR(E.node,{filter:"url(#"+cb.id+")"})}else{if(E._blur){E._blur.parentNode.removeChild(E._blur);delete E._blur;delete E.attrs.blur}E.node.removeAttribute("filter")}return E};bi._engine.circle=function(S,E,ce,cd){var cc=bR("circle");S.canvas&&S.canvas.appendChild(cc);var cb=new b1(cc,S);cb.attrs={cx:E,cy:ce,r:cd,fill:"none",stroke:"#000"};cb.type="circle";bR(cc,cb.attrs);return cb};bi._engine.rect=function(cb,E,cg,S,ce,cf){var cd=bR("rect");cb.canvas&&cb.canvas.appendChild(cd);var cc=new b1(cd,cb);cc.attrs={x:E,y:cg,width:S,height:ce,r:cf||0,rx:cf||0,ry:cf||0,fill:"none",stroke:"#000"};cc.type="rect";bR(cd,cc.attrs);return cc};bi._engine.ellipse=function(S,E,cf,ce,cd){var cc=bR("ellipse");S.canvas&&S.canvas.appendChild(cc);var cb=new b1(cc,S);cb.attrs={cx:E,cy:cf,rx:ce,ry:cd,fill:"none",stroke:"#000"};cb.type="ellipse";bR(cc,cb.attrs);return cb};bi._engine.image=function(cb,cf,E,cg,S,ce){var cd=bR("image");bR(cd,{x:E,y:cg,width:S,height:ce,preserveAspectRatio:"none"});cd.setAttributeNS(bW,"href",cf);cb.canvas&&cb.canvas.appendChild(cd);var cc=new b1(cd,cb);cc.attrs={x:E,y:cg,width:S,height:ce,src:cf};cc.type="image";return cc};bi._engine.text=function(S,E,ce,cd){var cc=bR("text");S.canvas&&S.canvas.appendChild(cc);var cb=new b1(cc,S);cb.attrs={x:E,y:ce,"text-anchor":"middle",text:cd,font:bi._availableAttrs.font,stroke:"none",fill:"#000"};cb.type="text";b4(cb,cb.attrs);return cb};bi._engine.setSize=function(S,E){this.width=S||this.width;this.height=E||this.height;this.canvas.setAttribute("width",this.width);this.canvas.setAttribute("height",this.height);if(this._viewBox){this.setViewBox.apply(this,this._viewBox)}return this};bi._engine.create=function(){var cc=bi._getContainer.apply(0,arguments),S=cc&&cc.container,cg=cc.x,cf=cc.y,cb=cc.width,ch=cc.height;if(!S){throw new Error("SVG container not found.")}var E=bR("svg"),ce="overflow:hidden;",cd;cg=cg||0;cf=cf||0;cb=cb||512;ch=ch||342;bR(E,{height:ch,version:1.1,width:cb,xmlns:"http://www.w3.org/2000/svg"});if(S==1){E.style.cssText=ce+"position:absolute;left:"+cg+"px;top:"+cf+"px";bi._g.doc.body.appendChild(E);cd=1}else{E.style.cssText=ce+"position:relative";if(S.firstChild){S.insertBefore(E,S.firstChild)}else{S.appendChild(E)}}S=new bi._Paper;S.width=cb;S.height=ch;S.canvas=E;S.clear();S._left=S._top=0;cd&&(S.renderfix=function(){});S.renderfix();return S};bi._engine.setViewBox=function(ce,cc,cg,E,S){b7("raphael.setViewBox",this,this._viewBox,[ce,cc,cg,E,S]);var ci=ca(cg/this.width,E/this.height),cd=this.top,ch=S?"xMidYMid meet":"xMinYMin",cb,cf;if(ce==null){if(this._vbSize){ci=1}delete this._vbSize;cb="0 0 "+this.width+bS+this.height}else{this._vbSize=ci;cb=ce+bS+cc+bS+cg+bS+E}bR(this.canvas,{viewBox:cb,preserveAspectRatio:ch});while(ci&&cd){cf="stroke-width" in cd.attrs?cd.attrs["stroke-width"]:1;cd.attr({"stroke-width":cf});cd._.dirty=1;cd._.dirtyT=1;cd=cd.prev}this._viewBox=[ce,cc,cg,E,!!S];return this};bi.prototype.renderfix=function(){var ce=this.canvas,E=ce.style,cd;try{cd=ce.getScreenCTM()||ce.createSVGMatrix()}catch(cc){cd=ce.createSVGMatrix()}var cb=-cd.e%1,S=-cd.f%1;if(cb||S){if(cb){this._left=(this._left+cb)%1;E.left=this._left+"px"}if(S){this._top=(this._top+S)%1;E.top=this._top+"px"}}};bi.prototype.clear=function(){bi.eve("raphael.clear",this);var E=this.canvas;while(E.firstChild){E.removeChild(E.firstChild)}this.bottom=this.top=null;(this.desc=bR("desc")).appendChild(bi._g.doc.createTextNode("Created with Rapha\xebl "+bi.version));E.appendChild(this.desc);E.appendChild(this.defs=bR("defs"))};bi.prototype.remove=function(){b7("raphael.remove",this);this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var E in this){this[E]=typeof this[E]=="function"?bi._removedFactory(E):null}};var b5=bi.st;for(var R in bU){if(bU[i](R)&&!b5[i](R)){b5[R]=(function(E){return function(){var S=arguments;return this.forEach(function(cb){cb[E].apply(cb,S)})}})(R)}}})();(function(){if(!bi.vml){return}var R="hasOwnProperty",cc=String,bV=parseFloat,bQ=Math,b9=bQ.round,cf=bQ.max,ca=bQ.min,b0=bQ.abs,b3="fill",bR=/[, ]+/,b8=bi.eve,b4=" progid:DXImageTransform.Microsoft",bT=" ",bY="",cb={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},bS=/([clmz]),?([^clmz]*)/gi,b1=/ progid:\S+Blur\([^\)]+\)/g,ce=/-?[^,\s-]+/g,i="position:absolute;left:0;top:0;width:1px;height:1px",d=21600,b7={path:1,rect:1,image:1},bZ={circle:1,ellipse:1},bO=function(co){var cl=/[ahqstv]/ig,cg=bi._pathToAbsolute;cc(co).match(cl)&&(cg=bi._path2curve);cl=/[clmz]/g;if(cg==bi._pathToAbsolute&&!cc(co).match(cl)){var ck=cc(co).replace(bS,function(cs,cu,cq){var ct=[],cp=cu.toLowerCase()=="m",cr=cb[cu];cq.replace(ce,function(cv){if(cp&&ct.length==2){cr+=ct+cb[cu=="m"?"l":"L"];ct=[]}ct.push(b9(cv*d))});return cr+ct});return ck}var cm=cg(co),S,E;ck=[];for(var ci=0,cn=cm.length;ci<cn;ci++){S=cm[ci];E=cm[ci][0].toLowerCase();E=="z"&&(E="x");for(var ch=1,cj=S.length;ch<cj;ch++){E+=b9(S[ch]*d)+(ch!=cj-1?",":bY)}ck.push(E)}return ck.join(bT)},bW=function(ch,cg,S){var E=bi.matrix();E.rotate(-ch,0.5,0.5);return{dx:E.x(cg,S),dy:E.y(cg,S)}},bX=function(cn,cm,cl,ci,ch,cj){var cv=cn._,cp=cn.matrix,E=cv.fillpos,co=cn.node,ck=co.style,cg=1,S="",cr,ct=d/cm,cs=d/cl;ck.visibility="hidden";if(!cm||!cl){return}co.coordsize=b0(ct)+bT+b0(cs);ck.rotation=cj*(cm*cl<0?-1:1);if(cj){var cu=bW(cj,ci,ch);ci=cu.dx;ch=cu.dy}cm<0&&(S+="x");cl<0&&(S+=" y")&&(cg=-1);ck.flip=S;co.coordorigin=(ci*-ct)+bT+(ch*-cs);if(E||cv.fillsize){var cq=co.getElementsByTagName(b3);cq=cq&&cq[0];co.removeChild(cq);if(E){cu=bW(cj,cp.x(E[0],E[1]),cp.y(E[0],E[1]));cq.position=cu.dx*cg+bT+cu.dy*cg}if(cv.fillsize){cq.size=cv.fillsize[0]*b0(cm)+bT+cv.fillsize[1]*b0(cl)}co.appendChild(cq)}ck.visibility="visible"};bi.toString=function(){return"Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl "+this.version};var g=function(E,ck,S){var cm=cc(ck).toLowerCase().split("-"),ci=S?"end":"start",cg=cm.length,cj="classic",cl="medium",ch="medium";while(cg--){switch(cm[cg]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":cj=cm[cg];break;case"wide":case"narrow":ch=cm[cg];break;case"long":case"short":cl=cm[cg];break}}var cn=E.node.getElementsByTagName("stroke")[0];cn[ci+"arrow"]=cj;cn[ci+"arrowlength"]=cl;cn[ci+"arrowwidth"]=ch},b5=function(cv,cH){cv.attrs=cv.attrs||{};var cC=cv.node,cL=cv.attrs,cr=cC.style,cn,cF=b7[cv.type]&&(cH.x!=cL.x||cH.y!=cL.y||cH.width!=cL.width||cH.height!=cL.height||cH.cx!=cL.cx||cH.cy!=cL.cy||cH.rx!=cL.rx||cH.ry!=cL.ry||cH.r!=cL.r),cu=bZ[cv.type]&&(cL.cx!=cH.cx||cL.cy!=cH.cy||cL.r!=cH.r||cL.rx!=cH.rx||cL.ry!=cH.ry),cO=cv;for(var cs in cH){if(cH[R](cs)){cL[cs]=cH[cs]}}if(cF){cL.path=bi._getPath[cv.type](cv);cv._.dirty=1}cH.href&&(cC.href=cH.href);cH.title&&(cC.title=cH.title);cH.target&&(cC.target=cH.target);cH.cursor&&(cr.cursor=cH.cursor);"blur" in cH&&cv.blur(cH.blur);if(cH.path&&cv.type=="path"||cF){cC.path=bO(~cc(cL.path).toLowerCase().indexOf("r")?bi._pathToAbsolute(cL.path):cL.path);if(cv.type=="image"){cv._.fillpos=[cL.x,cL.y];cv._.fillsize=[cL.width,cL.height];bX(cv,1,1,0,0,0)}}"transform" in cH&&cv.transform(cH.transform);if(cu){var ci=+cL.cx,cg=+cL.cy,cm=+cL.rx||+cL.r||0,cl=+cL.ry||+cL.r||0;cC.path=bi.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",b9((ci-cm)*d),b9((cg-cl)*d),b9((ci+cm)*d),b9((cg+cl)*d),b9(ci*d));cv._.dirty=1}if("clip-rect" in cH){var S=cc(cH["clip-rect"]).split(bR);if(S.length==4){S[2]=+S[2]+(+S[0]);S[3]=+S[3]+(+S[1]);var ct=cC.clipRect||bi._g.doc.createElement("div"),cN=ct.style;cN.clip=bi.format("rect({1}px {2}px {3}px {0}px)",S);if(!cC.clipRect){cN.position="absolute";cN.top=0;cN.left=0;cN.width=cv.paper.width+"px";cN.height=cv.paper.height+"px";cC.parentNode.insertBefore(ct,cC);ct.appendChild(cC);cC.clipRect=ct}}if(!cH["clip-rect"]){cC.clipRect&&(cC.clipRect.style.clip="auto")}}if(cv.textpath){var cJ=cv.textpath.style;cH.font&&(cJ.font=cH.font);cH["font-family"]&&(cJ.fontFamily='"'+cH["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,bY)+'"');cH["font-size"]&&(cJ.fontSize=cH["font-size"]);cH["font-weight"]&&(cJ.fontWeight=cH["font-weight"]);cH["font-style"]&&(cJ.fontStyle=cH["font-style"])}if("arrow-start" in cH){g(cO,cH["arrow-start"])}if("arrow-end" in cH){g(cO,cH["arrow-end"],1)}if(cH.opacity!=null||cH["stroke-width"]!=null||cH.fill!=null||cH.src!=null||cH.stroke!=null||cH["stroke-width"]!=null||cH["stroke-opacity"]!=null||cH["fill-opacity"]!=null||cH["stroke-dasharray"]!=null||cH["stroke-miterlimit"]!=null||cH["stroke-linejoin"]!=null||cH["stroke-linecap"]!=null){var cD=cC.getElementsByTagName(b3),cK=false;cD=cD&&cD[0];!cD&&(cK=cD=cd(b3));if(cv.type=="image"&&cH.src){cD.src=cH.src}cH.fill&&(cD.on=true);if(cD.on==null||cH.fill=="none"||cH.fill===null){cD.on=false}if(cD.on&&cH.fill){var ck=cc(cH.fill).match(bi._ISURL);if(ck){cD.parentNode==cC&&cC.removeChild(cD);cD.rotate=true;cD.src=ck[1];cD.type="tile";var E=cv.getBBox(1);cD.position=E.x+bT+E.y;cv._.fillpos=[E.x,E.y];bi._preload(ck[1],function(){cv._.fillsize=[this.offsetWidth,this.offsetHeight]})}else{cD.color=bi.getRGB(cH.fill).hex;cD.src=bY;cD.type="solid";if(bi.getRGB(cH.fill).error&&(cO.type in {circle:1,ellipse:1}||cc(cH.fill).charAt()!="r")&&b(cO,cH.fill,cD)){cL.fill="none";cL.gradient=cH.fill;cD.rotate=false}}}if("fill-opacity" in cH||"opacity" in cH){var cj=((+cL["fill-opacity"]+1||2)-1)*((+cL.opacity+1||2)-1)*((+bi.getRGB(cH.fill).o+1||2)-1);cj=ca(cf(cj,0),1);cD.opacity=cj;if(cD.src){cD.color="none"}}cC.appendChild(cD);var co=(cC.getElementsByTagName("stroke")&&cC.getElementsByTagName("stroke")[0]),cM=false;!co&&(cM=co=cd("stroke"));if((cH.stroke&&cH.stroke!="none")||cH["stroke-width"]||cH["stroke-opacity"]!=null||cH["stroke-dasharray"]||cH["stroke-miterlimit"]||cH["stroke-linejoin"]||cH["stroke-linecap"]){co.on=true}(cH.stroke=="none"||cH.stroke===null||co.on==null||cH.stroke==0||cH["stroke-width"]==0)&&(co.on=false);var cB=bi.getRGB(cH.stroke);co.on&&cH.stroke&&(co.color=cB.hex);cj=((+cL["stroke-opacity"]+1||2)-1)*((+cL.opacity+1||2)-1)*((+cB.o+1||2)-1);var cw=(bV(cH["stroke-width"])||1)*0.75;cj=ca(cf(cj,0),1);cH["stroke-width"]==null&&(cw=cL["stroke-width"]);cH["stroke-width"]&&(co.weight=cw);cw&&cw<1&&(cj*=cw)&&(co.weight=1);co.opacity=cj;cH["stroke-linejoin"]&&(co.joinstyle=cH["stroke-linejoin"]||"miter");co.miterlimit=cH["stroke-miterlimit"]||8;cH["stroke-linecap"]&&(co.endcap=cH["stroke-linecap"]=="butt"?"flat":cH["stroke-linecap"]=="square"?"square":"round");if("stroke-dasharray" in cH){var cA={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};co.dashstyle=cA[R](cH["stroke-dasharray"])?cA[cH["stroke-dasharray"]]:bY}cM&&cC.appendChild(co)}if(cO.type=="text"){cO.paper.canvas.style.display=bY;var cE=cO.paper.span,cz=100,ch=cL.font&&cL.font.match(/\d+(?:\.\d*)?(?=px)/);cr=cE.style;cL.font&&(cr.font=cL.font);cL["font-family"]&&(cr.fontFamily=cL["font-family"]);cL["font-weight"]&&(cr.fontWeight=cL["font-weight"]);cL["font-style"]&&(cr.fontStyle=cL["font-style"]);ch=bV(cL["font-size"]||ch&&ch[0])||10;cr.fontSize=ch*cz+"px";cO.textpath.string&&(cE.innerHTML=cc(cO.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var cq=cE.getBoundingClientRect();cO.W=cL.w=(cq.right-cq.left)/cz;cO.H=cL.h=(cq.bottom-cq.top)/cz;cO.X=cL.x;cO.Y=cL.y+cO.H/2;("x" in cH||"y" in cH)&&(cO.path.v=bi.format("m{0},{1}l{2},{1}",b9(cL.x*d),b9(cL.y*d),b9(cL.x*d)+1));var cp=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var cG=0,cI=cp.length;cG<cI;cG++){if(cp[cG] in cH){cO._.dirty=1;break}}switch(cL["text-anchor"]){case"start":cO.textpath.style["v-text-align"]="left";cO.bbx=cO.W/2;break;case"end":cO.textpath.style["v-text-align"]="right";cO.bbx=-cO.W/2;break;default:cO.textpath.style["v-text-align"]="center";cO.bbx=0;break}cO.textpath.style["v-text-kern"]=true}},b=function(E,cn,cq){E.attrs=E.attrs||{};var co=E.attrs,ch=Math.pow,ci,cj,cl="linear",cm=".5 .5";E.attrs.gradient=cn;cn=cc(cn).replace(bi._radial_gradient,function(ct,cu,cs){cl="radial";if(cu&&cs){cu=bV(cu);cs=bV(cs);ch(cu-0.5,2)+ch(cs-0.5,2)>0.25&&(cs=bQ.sqrt(0.25-ch(cu-0.5,2))*((cs>0.5)*2-1)+0.5);cm=cu+bT+cs}return bY});cn=cn.split(/\s*\-\s*/);if(cl=="linear"){var S=cn.shift();S=-bV(S);if(isNaN(S)){return null}}var ck=bi._parseDots(cn);if(!ck){return null}E=E.shape||E.node;if(ck.length){E.removeChild(cq);cq.on=true;cq.method="none";cq.color=ck[0].color;cq.color2=ck[ck.length-1].color;var cr=[];for(var cg=0,cp=ck.length;cg<cp;cg++){ck[cg].offset&&cr.push(ck[cg].offset+bT+ck[cg].color)}cq.colors=cr.length?cr.join():"0% "+cq.color;if(cl=="radial"){cq.type="gradientTitle";cq.focus="100%";cq.focussize="0 0";cq.focusposition=cm;cq.angle=0}else{cq.type="gradient";cq.angle=(270-S)%360}E.appendChild(cq)}return 1},b2=function(S,E){this[0]=this.node=S;S.raphael=true;this.id=bi._oid++;S.raphaelid=this.id;this.X=0;this.Y=0;this.attrs={};this.paper=E;this.matrix=bi.matrix();this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1};!E.bottom&&(E.bottom=this);this.prev=E.top;E.top&&(E.top.next=this);E.top=this;this.next=null};var bU=bi.el;b2.prototype=bU;bU.constructor=b2;bU.transform=function(ci){if(ci==null){return this._.transform}var ck=this.paper._viewBoxShift,cj=ck?"s"+[ck.scale,ck.scale]+"-1-1t"+[ck.dx,ck.dy]:bY,cn;if(ck){cn=ci=cc(ci).replace(/\.{3}|\u2026/g,this._.transform||bY)}bi._extractTransform(this,cj+ci);var co=this.matrix.clone(),cq=this.skew,cg=this.node,cm,ch=~cc(this.attrs.fill).indexOf("-"),E=!cc(this.attrs.fill).indexOf("url(");co.translate(1,1);if(E||ch||this.type=="image"){cq.matrix="1 0 0 1";cq.offset="0 0";cm=co.split();if((ch&&cm.noRotation)||!cm.isSimple){cg.style.filter=co.toFilter();var cl=this.getBBox(),S=this.getBBox(1),cr=cl.x-S.x,cp=cl.y-S.y;cg.coordorigin=(cr*-d)+bT+(cp*-d);bX(this,1,1,cr,cp,0)}else{cg.style.filter=bY;bX(this,cm.scalex,cm.scaley,cm.dx,cm.dy,cm.rotate)}}else{cg.style.filter=bY;cq.matrix=cc(co);cq.offset=co.offset()}cn&&(this._.transform=cn);return this};bU.rotate=function(S,E,ch){if(this.removed){return this}if(S==null){return}S=cc(S).split(bR);if(S.length-1){E=bV(S[1]);ch=bV(S[2])}S=bV(S[0]);(ch==null)&&(E=ch);if(E==null||ch==null){var cg=this.getBBox(1);E=cg.x+cg.width/2;ch=cg.y+cg.height/2}this._.dirtyT=1;this.transform(this._.transform.concat([["r",S,E,ch]]));return this};bU.translate=function(S,E){if(this.removed){return this}S=cc(S).split(bR);if(S.length-1){E=bV(S[1])}S=bV(S[0])||0;E=+E||0;if(this._.bbox){this._.bbox.x+=S;this._.bbox.y+=E}this.transform(this._.transform.concat([["t",S,E]]));return this};bU.scale=function(ci,cg,E,ch){if(this.removed){return this}ci=cc(ci).split(bR);if(ci.length-1){cg=bV(ci[1]);E=bV(ci[2]);ch=bV(ci[3]);isNaN(E)&&(E=null);isNaN(ch)&&(ch=null)}ci=bV(ci[0]);(cg==null)&&(cg=ci);(ch==null)&&(E=ch);if(E==null||ch==null){var S=this.getBBox(1)}E=E==null?S.x+S.width/2:E;ch=ch==null?S.y+S.height/2:ch;this.transform(this._.transform.concat([["s",ci,cg,E,ch]]));this._.dirtyT=1;return this};bU.hide=function(){!this.removed&&(this.node.style.display="none");return this};bU.show=function(){!this.removed&&(this.node.style.display=bY);return this};bU._getBBox=function(){if(this.removed){return{}}return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}};bU.remove=function(){if(this.removed||!this.node.parentNode){return}this.paper.__set__&&this.paper.__set__.exclude(this);bi.eve.unbind("raphael.*.*."+this.id);bi._tear(this,this.paper);this.node.parentNode.removeChild(this.node);this.shape&&this.shape.parentNode.removeChild(this.shape);for(var E in this){this[E]=typeof this[E]=="function"?bi._removedFactory(E):null}this.removed=true};bU.attr=function(E,cn){if(this.removed){return this}if(E==null){var ck={};for(var cm in this.attrs){if(this.attrs[R](cm)){ck[cm]=this.attrs[cm]}}ck.gradient&&ck.fill=="none"&&(ck.fill=ck.gradient)&&delete ck.gradient;ck.transform=this._.transform;return ck}if(cn==null&&bi.is(E,"string")){if(E==b3&&this.attrs.fill=="none"&&this.attrs.gradient){return this.attrs.gradient}var cl=E.split(bR),ch={};for(var ci=0,cp=cl.length;ci<cp;ci++){E=cl[ci];if(E in this.attrs){ch[E]=this.attrs[E]}else{if(bi.is(this.paper.customAttributes[E],"function")){ch[E]=this.paper.customAttributes[E].def}else{ch[E]=bi._availableAttrs[E]}}}return cp-1?ch:ch[cl[0]]}if(this.attrs&&cn==null&&bi.is(E,"array")){ch={};for(ci=0,cp=E.length;ci<cp;ci++){ch[E[ci]]=this.attr(E[ci])}return ch}var S;if(cn!=null){S={};S[E]=cn}cn==null&&bi.is(E,"object")&&(S=E);for(var co in S){b8("raphael.attr."+co+"."+this.id,this,S[co])}if(S){for(co in this.paper.customAttributes){if(this.paper.customAttributes[R](co)&&S[R](co)&&bi.is(this.paper.customAttributes[co],"function")){var cj=this.paper.customAttributes[co].apply(this,[].concat(S[co]));this.attrs[co]=S[co];for(var cg in cj){if(cj[R](cg)){S[cg]=cj[cg]}}}}if(S.text&&this.type=="text"){this.textpath.string=S.text}b5(this,S)}return this};bU.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node);this.paper&&this.paper.top!=this&&bi._tofront(this,this.paper);return this};bU.toBack=function(){if(this.removed){return this}if(this.node.parentNode.firstChild!=this.node){this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild);bi._toback(this,this.paper)}return this};bU.insertAfter=function(E){if(this.removed){return this}if(E.constructor==bi.st.constructor){E=E[E.length-1]}if(E.node.nextSibling){E.node.parentNode.insertBefore(this.node,E.node.nextSibling)}else{E.node.parentNode.appendChild(this.node)}bi._insertafter(this,E,this.paper);return this};bU.insertBefore=function(E){if(this.removed){return this}if(E.constructor==bi.st.constructor){E=E[0]}E.node.parentNode.insertBefore(this.node,E.node);bi._insertbefore(this,E,this.paper);return this};bU.blur=function(E){var S=this.node.runtimeStyle,cg=S.filter;cg=cg.replace(b1,bY);if(+E!==0){this.attrs.blur=E;S.filter=cg+bT+b4+".Blur(pixelradius="+(+E||1.5)+")";S.margin=bi.format("-{0}px 0 0 -{0}px",b9(+E||1.5))}else{S.filter=cg;S.margin=0;delete this.attrs.blur}return this};bi._engine.path=function(ch,S){var ci=cd("shape");ci.style.cssText=i;ci.coordsize=d+bT+d;ci.coordorigin=S.coordorigin;var cj=new b2(ci,S),E={fill:"none",stroke:"#000"};ch&&(E.path=ch);cj.type="path";cj.path=[];cj.Path=bY;b5(cj,E);S.canvas.appendChild(ci);var cg=cd("skew");cg.on=true;ci.appendChild(cg);cj.skew=cg;cj.transform(bY);return cj};bi._engine.rect=function(S,ck,ci,cl,cg,E){var cm=bi._rectPath(ck,ci,cl,cg,E),ch=S.path(cm),cj=ch.attrs;ch.X=cj.x=ck;ch.Y=cj.y=ci;ch.W=cj.width=cl;ch.H=cj.height=cg;cj.r=E;cj.path=cm;ch.type="rect";return ch};bi._engine.ellipse=function(S,E,ck,cj,ci){var ch=S.path(),cg=ch.attrs;ch.X=E-cj;ch.Y=ck-ci;ch.W=cj*2;ch.H=ci*2;ch.type="ellipse";b5(ch,{cx:E,cy:ck,rx:cj,ry:ci});return ch};bi._engine.circle=function(S,E,cj,ci){var ch=S.path(),cg=ch.attrs;ch.X=E-ci;ch.Y=cj-ci;ch.W=ch.H=ci*2;ch.type="circle";b5(ch,{cx:E,cy:cj,r:ci});return ch};bi._engine.image=function(S,E,cl,cj,cm,ch){var co=bi._rectPath(cl,cj,cm,ch),ci=S.path(co).attr({stroke:"none"}),ck=ci.attrs,cg=ci.node,cn=cg.getElementsByTagName(b3)[0];ck.src=E;ci.X=ck.x=cl;ci.Y=ck.y=cj;ci.W=ck.width=cm;ci.H=ck.height=ch;ck.path=co;ci.type="image";cn.parentNode==cg&&cg.removeChild(cn);cn.rotate=true;cn.src=E;cn.type="tile";ci._.fillpos=[cl,cj];ci._.fillsize=[cm,ch];cg.appendChild(cn);bX(ci,1,1,0,0,0);return ci};bi._engine.text=function(E,ck,cj,cl){var ch=cd("shape"),cn=cd("path"),cg=cd("textpath");ck=ck||0;cj=cj||0;cl=cl||"";cn.v=bi.format("m{0},{1}l{2},{1}",b9(ck*d),b9(cj*d),b9(ck*d)+1);cn.textpathok=true;cg.string=cc(cl);cg.on=true;ch.style.cssText=i;ch.coordsize=d+bT+d;ch.coordorigin="0 0";var S=new b2(ch,E),ci={fill:"#000",stroke:"none",font:bi._availableAttrs.font,text:cl};S.shape=ch;S.path=cn;S.textpath=cg;S.type="text";S.attrs.text=cc(cl);S.attrs.x=ck;S.attrs.y=cj;S.attrs.w=1;S.attrs.h=1;b5(S,ci);ch.appendChild(cg);ch.appendChild(cn);E.canvas.appendChild(ch);var cm=cd("skew");cm.on=true;ch.appendChild(cm);S.skew=cm;S.transform(bY);return S};bi._engine.setSize=function(cg,E){var S=this.canvas.style;this.width=cg;this.height=E;cg==+cg&&(cg+="px");E==+E&&(E+="px");S.width=cg;S.height=E;S.clip="rect(0 "+cg+" "+E+" 0)";if(this._viewBox){bi._engine.setViewBox.apply(this,this._viewBox)}return this};bi._engine.setViewBox=function(cj,ci,ck,cg,ch){bi.eve("raphael.setViewBox",this,this._viewBox,[cj,ci,ck,cg,ch]);var E=this.width,cm=this.height,cn=1/cf(ck/E,cg/cm),cl,S;if(ch){cl=cm/cg;S=E/ck;if(ck*cl<E){cj-=(E-ck*cl)/2/cl}if(cg*S<cm){ci-=(cm-cg*S)/2/S}}this._viewBox=[cj,ci,ck,cg,!!ch];this._viewBoxShift={dx:-cj,dy:-ci,scale:cn};this.forEach(function(co){co.transform("...")});return this};var cd;bi._engine.initWin=function(cg){var S=cg.document;S.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!S.namespaces.rvml&&S.namespaces.add("rvml","urn:schemas-microsoft-com:vml");cd=function(ch){return S.createElement("<rvml:"+ch+' class="rvml">')}}catch(E){cd=function(ch){return S.createElement("<"+ch+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}};bi._engine.initWin(bi._g.win);bi._engine.create=function(){var cg=bi._getContainer.apply(0,arguments),E=cg.container,cm=cg.height,cn,S=cg.width,cl=cg.x,ck=cg.y;if(!E){throw new Error("VML container not found.")}var ci=new bi._Paper,cj=ci.canvas=bi._g.doc.createElement("div"),ch=cj.style;cl=cl||0;ck=ck||0;S=S||512;cm=cm||342;ci.width=S;ci.height=cm;S==+S&&(S+="px");cm==+cm&&(cm+="px");ci.coordsize=d*1000+bT+d*1000;ci.coordorigin="0 0";ci.span=bi._g.doc.createElement("span");ci.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";cj.appendChild(ci.span);ch.cssText=bi.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",S,cm);if(E==1){bi._g.doc.body.appendChild(cj);ch.left=cl+"px";ch.top=ck+"px";ch.position="absolute"}else{if(E.firstChild){E.insertBefore(cj,E.firstChild)}else{E.appendChild(cj)}}ci.renderfix=function(){};return ci};bi.prototype.clear=function(){bi.eve("raphael.clear",this);this.canvas.innerHTML=bY;this.span=bi._g.doc.createElement("span");this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";this.canvas.appendChild(this.span);this.bottom=this.top=null};bi.prototype.remove=function(){bi.eve("raphael.remove",this);this.canvas.parentNode.removeChild(this.canvas);for(var E in this){this[E]=typeof this[E]=="function"?bi._removedFactory(E):null}return true};var b6=bi.st;for(var bP in bU){if(bU[R](bP)&&!b6[R](bP)){b6[bP]=(function(E){return function(){var S=arguments;return this.forEach(function(cg){cg[E].apply(cg,S)})}})(bP)}}})();aE.was?(a5.win.Raphael=bi):(Raphael=bi);return bi}));
function isMob() {
   if ($("#device").val() != 'mobile') {
      return false;
   } else {
      return true;
   }
}
function isTablet() {
   if ($("#device").val() != 'tablet') {
      return false;
   } else {
      return true;
   }
}
function isSmall(){
    return ($(window).width() <= 768);
}
function isModal() {
   return $("body").hasClass("modal-open");
}

function fullscreen(element) {
    if (element == false) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozExitFullScreen) {
            document.mozExitFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

    } else {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
}

/* @license
morris.js v0.5.0
Copyright 2014 Olly Smith All rights reserved.
Licensed under the BSD-2-Clause License.
*/
(function(){var a,b,c,d,e=[].slice,f=function(a,b){return function(){return a.apply(b,arguments)}},g={}.hasOwnProperty,h=function(a,b){function c(){this.constructor=a}for(var d in b)g.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},i=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};b=window.Morris={},a=jQuery,b.EventEmitter=function(){function a(){}return a.prototype.on=function(a,b){return null==this.handlers&&(this.handlers={}),null==this.handlers[a]&&(this.handlers[a]=[]),this.handlers[a].push(b),this},a.prototype.fire=function(){var a,b,c,d,f,g,h;if(c=arguments[0],a=2<=arguments.length?e.call(arguments,1):[],null!=this.handlers&&null!=this.handlers[c]){for(g=this.handlers[c],h=[],d=0,f=g.length;f>d;d++)b=g[d],h.push(b.apply(null,a));return h}},a}(),b.commas=function(a){var b,c,d,e;return null!=a?(d=0>a?"-":"",b=Math.abs(a),c=Math.floor(b).toFixed(0),d+=c.replace(/(?=(?:\d{3})+$)(?!^)/g,","),e=b.toString(),e.length>c.length&&(d+=e.slice(c.length)),d):"-"},b.pad2=function(a){return(10>a?"0":"")+a},b.Grid=function(c){function d(b){this.resizeHandler=f(this.resizeHandler,this);var c=this;if(this.el="string"==typeof b.element?a(document.getElementById(b.element)):a(b.element),null==this.el||0===this.el.length)throw new Error("Graph container element not found");"static"===this.el.css("position")&&this.el.css("position","relative"),this.options=a.extend({},this.gridDefaults,this.defaults||{},b),"string"==typeof this.options.units&&(this.options.postUnits=b.units),this.raphael=new Raphael(this.el[0]),this.elementWidth=null,this.elementHeight=null,this.dirty=!1,this.selectFrom=null,this.init&&this.init(),this.setData(this.options.data),this.el.bind("mousemove",function(a){var b,d,e,f,g;return d=c.el.offset(),g=a.pageX-d.left,c.selectFrom?(b=c.data[c.hitTest(Math.min(g,c.selectFrom))]._x,e=c.data[c.hitTest(Math.max(g,c.selectFrom))]._x,f=e-b,c.selectionRect.attr({x:b,width:f})):c.fire("hovermove",g,a.pageY-d.top)}),this.el.bind("mouseleave",function(){return c.selectFrom&&(c.selectionRect.hide(),c.selectFrom=null),c.fire("hoverout")}),this.el.bind("touchstart touchmove touchend",function(a){var b,d;return d=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],b=c.el.offset(),c.fire("hover",d.pageX-b.left,d.pageY-b.top),d}),this.el.bind("click",function(a){var b;return b=c.el.offset(),c.fire("gridclick",a.pageX-b.left,a.pageY-b.top)}),this.options.rangeSelect&&(this.selectionRect=this.raphael.rect(0,0,0,this.el.innerHeight()).attr({fill:this.options.rangeSelectColor,stroke:!1}).toBack().hide(),this.el.bind("mousedown",function(a){var b;return b=c.el.offset(),c.startRange(a.pageX-b.left)}),this.el.bind("mouseup",function(a){var b;return b=c.el.offset(),c.endRange(a.pageX-b.left),c.fire("hovermove",a.pageX-b.left,a.pageY-b.top)})),this.options.resize&&a(window).bind("resize",function(){return null!=c.timeoutId&&window.clearTimeout(c.timeoutId),c.timeoutId=window.setTimeout(c.resizeHandler,100)}),this.postInit&&this.postInit()}return h(d,c),d.prototype.gridDefaults={dateFormat:null,axes:!0,grid:!0,gridLineColor:"#aaa",gridStrokeWidth:.5,gridTextColor:"#888",gridTextSize:12,gridTextFamily:"sans-serif",gridTextWeight:"normal",hideHover:!1,yLabelFormat:null,xLabelAngle:0,numLines:5,padding:25,parseTime:!0,postUnits:"",preUnits:"",ymax:"auto",ymin:"auto 0",goals:[],goalStrokeWidth:1,goalLineColors:["#666633","#999966","#cc6666","#663333"],events:[],eventStrokeWidth:1,eventLineColors:["#005a04","#ccffbb","#3a5f0b","#005502"],rangeSelect:null,rangeSelectColor:"#eef",resize:!1},d.prototype.setData=function(a,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;return null==c&&(c=!0),this.options.data=a,null==a||0===a.length?(this.data=[],this.raphael.clear(),null!=this.hover&&this.hover.hide(),void 0):(o=this.cumulative?0:null,p=this.cumulative?0:null,this.options.goals.length>0&&(h=Math.min.apply(Math,this.options.goals),g=Math.max.apply(Math,this.options.goals),p=null!=p?Math.min(p,h):h,o=null!=o?Math.max(o,g):g),this.data=function(){var c,d,g;for(g=[],f=c=0,d=a.length;d>c;f=++c)j=a[f],i={src:j},i.label=j[this.options.xkey],this.options.parseTime?(i.x=b.parseDate(i.label),this.options.dateFormat?i.label=this.options.dateFormat(i.x):"number"==typeof i.label&&(i.label=new Date(i.label).toString())):(i.x=f,this.options.xLabelFormat&&(i.label=this.options.xLabelFormat(i))),l=0,i.y=function(){var a,b,c,d;for(c=this.options.ykeys,d=[],e=a=0,b=c.length;b>a;e=++a)n=c[e],q=j[n],"string"==typeof q&&(q=parseFloat(q)),null!=q&&"number"!=typeof q&&(q=null),null!=q&&(this.cumulative?l+=q:null!=o?(o=Math.max(q,o),p=Math.min(q,p)):o=p=q),this.cumulative&&null!=l&&(o=Math.max(l,o),p=Math.min(l,p)),d.push(q);return d}.call(this),g.push(i);return g}.call(this),this.options.parseTime&&(this.data=this.data.sort(function(a,b){return(a.x>b.x)-(b.x>a.x)})),this.xmin=this.data[0].x,this.xmax=this.data[this.data.length-1].x,this.events=[],this.options.events.length>0&&(this.events=this.options.parseTime?function(){var a,c,e,f;for(e=this.options.events,f=[],a=0,c=e.length;c>a;a++)d=e[a],f.push(b.parseDate(d));return f}.call(this):this.options.events,this.xmax=Math.max(this.xmax,Math.max.apply(Math,this.events)),this.xmin=Math.min(this.xmin,Math.min.apply(Math,this.events))),this.xmin===this.xmax&&(this.xmin-=1,this.xmax+=1),this.ymin=this.yboundary("min",p),this.ymax=this.yboundary("max",o),this.ymin===this.ymax&&(p&&(this.ymin-=1),this.ymax+=1),((r=this.options.axes)===!0||"both"===r||"y"===r||this.options.grid===!0)&&(this.options.ymax===this.gridDefaults.ymax&&this.options.ymin===this.gridDefaults.ymin?(this.grid=this.autoGridLines(this.ymin,this.ymax,this.options.numLines),this.ymin=Math.min(this.ymin,this.grid[0]),this.ymax=Math.max(this.ymax,this.grid[this.grid.length-1])):(k=(this.ymax-this.ymin)/(this.options.numLines-1),this.grid=function(){var a,b,c,d;for(d=[],m=a=b=this.ymin,c=this.ymax;k>0?c>=a:a>=c;m=a+=k)d.push(m);return d}.call(this))),this.dirty=!0,c?this.redraw():void 0)},d.prototype.yboundary=function(a,b){var c,d;return c=this.options["y"+a],"string"==typeof c?"auto"===c.slice(0,4)?c.length>5?(d=parseInt(c.slice(5),10),null==b?d:Math[a](b,d)):null!=b?b:0:parseInt(c,10):c},d.prototype.autoGridLines=function(a,b,c){var d,e,f,g,h,i,j,k,l;return h=b-a,l=Math.floor(Math.log(h)/Math.log(10)),j=Math.pow(10,l),e=Math.floor(a/j)*j,d=Math.ceil(b/j)*j,i=(d-e)/(c-1),1===j&&i>1&&Math.ceil(i)!==i&&(i=Math.ceil(i),d=e+i*(c-1)),0>e&&d>0&&(e=Math.floor(a/i)*i,d=Math.ceil(b/i)*i),1>i?(g=Math.floor(Math.log(i)/Math.log(10)),f=function(){var a,b;for(b=[],k=a=e;i>0?d>=a:a>=d;k=a+=i)b.push(parseFloat(k.toFixed(1-g)));return b}()):f=function(){var a,b;for(b=[],k=a=e;i>0?d>=a:a>=d;k=a+=i)b.push(k);return b}(),f},d.prototype._calc=function(){var a,b,c,d,e,f,g,h;return e=this.el.width(),c=this.el.height(),(this.elementWidth!==e||this.elementHeight!==c||this.dirty)&&(this.elementWidth=e,this.elementHeight=c,this.dirty=!1,this.left=this.options.padding,this.right=this.elementWidth-this.options.padding,this.top=this.options.padding,this.bottom=this.elementHeight-this.options.padding,((g=this.options.axes)===!0||"both"===g||"y"===g)&&(f=function(){var a,c,d,e;for(d=this.grid,e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(this.measureText(this.yAxisFormat(b)).width);return e}.call(this),this.left+=Math.max.apply(Math,f)),((h=this.options.axes)===!0||"both"===h||"x"===h)&&(a=function(){var a,b,c;for(c=[],d=a=0,b=this.data.length;b>=0?b>a:a>b;d=b>=0?++a:--a)c.push(this.measureText(this.data[d].text,-this.options.xLabelAngle).height);return c}.call(this),this.bottom-=Math.max.apply(Math,a)),this.width=Math.max(1,this.right-this.left),this.height=Math.max(1,this.bottom-this.top),this.dx=this.width/(this.xmax-this.xmin),this.dy=this.height/(this.ymax-this.ymin),this.calc)?this.calc():void 0},d.prototype.transY=function(a){return this.bottom-(a-this.ymin)*this.dy},d.prototype.transX=function(a){return 1===this.data.length?(this.left+this.right)/2:this.left+(a-this.xmin)*this.dx},d.prototype.redraw=function(){return this.raphael.clear(),this._calc(),this.drawGrid(),this.drawGoals(),this.drawEvents(),this.draw?this.draw():void 0},d.prototype.measureText=function(a,b){var c,d;return null==b&&(b=0),d=this.raphael.text(100,100,a).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).rotate(b),c=d.getBBox(),d.remove(),c},d.prototype.yAxisFormat=function(a){return this.yLabelFormat(a)},d.prototype.yLabelFormat=function(a){return"function"==typeof this.options.yLabelFormat?this.options.yLabelFormat(a):""+this.options.preUnits+b.commas(a)+this.options.postUnits},d.prototype.drawGrid=function(){var a,b,c,d,e,f,g,h;if(this.options.grid!==!1||(e=this.options.axes)===!0||"both"===e||"y"===e){for(f=this.grid,h=[],c=0,d=f.length;d>c;c++)a=f[c],b=this.transY(a),((g=this.options.axes)===!0||"both"===g||"y"===g)&&this.drawYAxisLabel(this.left-this.options.padding/2,b,this.yAxisFormat(a)),this.options.grid?h.push(this.drawGridLine("M"+this.left+","+b+"H"+(this.left+this.width))):h.push(void 0);return h}},d.prototype.drawGoals=function(){var a,b,c,d,e,f,g;for(f=this.options.goals,g=[],c=d=0,e=f.length;e>d;c=++d)b=f[c],a=this.options.goalLineColors[c%this.options.goalLineColors.length],g.push(this.drawGoal(b,a));return g},d.prototype.drawEvents=function(){var a,b,c,d,e,f,g;for(f=this.events,g=[],c=d=0,e=f.length;e>d;c=++d)b=f[c],a=this.options.eventLineColors[c%this.options.eventLineColors.length],g.push(this.drawEvent(b,a));return g},d.prototype.drawGoal=function(a,b){return this.raphael.path("M"+this.left+","+this.transY(a)+"H"+this.right).attr("stroke",b).attr("stroke-width",this.options.goalStrokeWidth)},d.prototype.drawEvent=function(a,b){return this.raphael.path("M"+this.transX(a)+","+this.bottom+"V"+this.top).attr("stroke",b).attr("stroke-width",this.options.eventStrokeWidth)},d.prototype.drawYAxisLabel=function(a,b,c){return this.raphael.text(a,b,c).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).attr("fill",this.options.gridTextColor).attr("text-anchor","end")},d.prototype.drawGridLine=function(a){return this.raphael.path(a).attr("stroke",this.options.gridLineColor).attr("stroke-width",this.options.gridStrokeWidth)},d.prototype.startRange=function(a){return this.hover.hide(),this.selectFrom=a,this.selectionRect.attr({x:a,width:0}).show()},d.prototype.endRange=function(a){var b,c;return this.selectFrom?(c=Math.min(this.selectFrom,a),b=Math.max(this.selectFrom,a),this.options.rangeSelect.call(this.el,{start:this.data[this.hitTest(c)].x,end:this.data[this.hitTest(b)].x}),this.selectFrom=null):void 0},d.prototype.resizeHandler=function(){return this.timeoutId=null,this.raphael.setSize(this.el.width(),this.el.height()),this.redraw()},d}(b.EventEmitter),b.parseDate=function(a){var b,c,d,e,f,g,h,i,j,k,l;return"number"==typeof a?a:(c=a.match(/^(\d+) Q(\d)$/),e=a.match(/^(\d+)-(\d+)$/),f=a.match(/^(\d+)-(\d+)-(\d+)$/),h=a.match(/^(\d+) W(\d+)$/),i=a.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+)(Z|([+-])(\d\d):?(\d\d))?$/),j=a.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+):(\d+(\.\d+)?)(Z|([+-])(\d\d):?(\d\d))?$/),c?new Date(parseInt(c[1],10),3*parseInt(c[2],10)-1,1).getTime():e?new Date(parseInt(e[1],10),parseInt(e[2],10)-1,1).getTime():f?new Date(parseInt(f[1],10),parseInt(f[2],10)-1,parseInt(f[3],10)).getTime():h?(k=new Date(parseInt(h[1],10),0,1),4!==k.getDay()&&k.setMonth(0,1+(4-k.getDay()+7)%7),k.getTime()+6048e5*parseInt(h[2],10)):i?i[6]?(g=0,"Z"!==i[6]&&(g=60*parseInt(i[8],10)+parseInt(i[9],10),"+"===i[7]&&(g=0-g)),Date.UTC(parseInt(i[1],10),parseInt(i[2],10)-1,parseInt(i[3],10),parseInt(i[4],10),parseInt(i[5],10)+g)):new Date(parseInt(i[1],10),parseInt(i[2],10)-1,parseInt(i[3],10),parseInt(i[4],10),parseInt(i[5],10)).getTime():j?(l=parseFloat(j[6]),b=Math.floor(l),d=Math.round(1e3*(l-b)),j[8]?(g=0,"Z"!==j[8]&&(g=60*parseInt(j[10],10)+parseInt(j[11],10),"+"===j[9]&&(g=0-g)),Date.UTC(parseInt(j[1],10),parseInt(j[2],10)-1,parseInt(j[3],10),parseInt(j[4],10),parseInt(j[5],10)+g,b,d)):new Date(parseInt(j[1],10),parseInt(j[2],10)-1,parseInt(j[3],10),parseInt(j[4],10),parseInt(j[5],10),b,d).getTime()):new Date(parseInt(a,10),0,1).getTime())},b.Hover=function(){function c(c){null==c&&(c={}),this.options=a.extend({},b.Hover.defaults,c),this.el=a("<div class='"+this.options["class"]+"'></div>"),this.el.hide(),this.options.parent.append(this.el)}return c.defaults={"class":"morris-hover morris-default-style"},c.prototype.update=function(a,b,c){return this.html(a),this.show(),this.moveTo(b,c)},c.prototype.html=function(a){return this.el.html(a)},c.prototype.moveTo=function(a,b){var c,d,e,f,g,h;return g=this.options.parent.innerWidth(),f=this.options.parent.innerHeight(),d=this.el.outerWidth(),c=this.el.outerHeight(),e=Math.min(Math.max(0,a-d/2),g-d),null!=b?(h=b-c-10,0>h&&(h=b+10,h+c>f&&(h=f/2-c/2))):h=f/2-c/2,this.el.css({left:e+"px",top:parseInt(h)+"px"})},c.prototype.show=function(){return this.el.show()},c.prototype.hide=function(){return this.el.hide()},c}(),b.Line=function(a){function c(a){return this.hilight=f(this.hilight,this),this.onHoverOut=f(this.onHoverOut,this),this.onHoverMove=f(this.onHoverMove,this),this.onGridClick=f(this.onGridClick,this),this instanceof b.Line?(c.__super__.constructor.call(this,a),void 0):new b.Line(a)}return h(c,a),c.prototype.init=function(){return"always"!==this.options.hideHover?(this.hover=new b.Hover({parent:this.el}),this.on("hovermove",this.onHoverMove),this.on("hoverout",this.onHoverOut),this.on("gridclick",this.onGridClick)):void 0},c.prototype.defaults={lineWidth:3,pointSize:4,lineColors:["#0b62a4","#7A92A3","#4da74d","#afd8f8","#edc240","#cb4b4b","#9440ed"],pointStrokeWidths:[1],pointStrokeColors:["#ffffff"],pointFillColors:[],smooth:!0,xLabels:"auto",xLabelFormat:null,xLabelMargin:24,continuousLine:!0,hideHover:!1},c.prototype.calc=function(){return this.calcPoints(),this.generatePaths()},c.prototype.calcPoints=function(){var a,b,c,d,e,f;for(e=this.data,f=[],c=0,d=e.length;d>c;c++)a=e[c],a._x=this.transX(a.x),a._y=function(){var c,d,e,f;for(e=a.y,f=[],c=0,d=e.length;d>c;c++)b=e[c],null!=b?f.push(this.transY(b)):f.push(b);return f}.call(this),f.push(a._ymax=Math.min.apply(Math,[this.bottom].concat(function(){var c,d,e,f;for(e=a._y,f=[],c=0,d=e.length;d>c;c++)b=e[c],null!=b&&f.push(b);return f}())));return f},c.prototype.hitTest=function(a){var b,c,d,e,f;if(0===this.data.length)return null;for(f=this.data.slice(1),b=d=0,e=f.length;e>d&&(c=f[b],!(a<(c._x+this.data[b]._x)/2));b=++d);return b},c.prototype.onGridClick=function(a,b){var c;return c=this.hitTest(a),this.fire("click",c,this.data[c].src,a,b)},c.prototype.onHoverMove=function(a){var b;return b=this.hitTest(a),this.displayHoverForRow(b)},c.prototype.onHoverOut=function(){return this.options.hideHover!==!1?this.displayHoverForRow(null):void 0},c.prototype.displayHoverForRow=function(a){var b;return null!=a?((b=this.hover).update.apply(b,this.hoverContentForRow(a)),this.hilight(a)):(this.hover.hide(),this.hilight())},c.prototype.hoverContentForRow=function(a){var b,c,d,e,f,g,h;for(d=this.data[a],b="<div class='morris-hover-row-label'>"+d.label+"</div>",h=d.y,c=f=0,g=h.length;g>f;c=++f)e=h[c],b+="<div class='morris-hover-point' style='color: "+this.colorFor(d,c,"label")+"'>\n  "+this.options.labels[c]+":\n  "+this.yLabelFormat(e)+"\n</div>";return"function"==typeof this.options.hoverCallback&&(b=this.options.hoverCallback(a,this.options,b,d.src)),[b,d._x,d._ymax]},c.prototype.generatePaths=function(){var a,c,d,e,f;return this.paths=function(){var g,h,j,k;for(k=[],d=g=0,h=this.options.ykeys.length;h>=0?h>g:g>h;d=h>=0?++g:--g)f="boolean"==typeof this.options.smooth?this.options.smooth:(j=this.options.ykeys[d],i.call(this.options.smooth,j)>=0),c=function(){var a,b,c,f;for(c=this.data,f=[],a=0,b=c.length;b>a;a++)e=c[a],void 0!==e._y[d]&&f.push({x:e._x,y:e._y[d]});return f}.call(this),this.options.continuousLine&&(c=function(){var b,d,e;for(e=[],b=0,d=c.length;d>b;b++)a=c[b],null!==a.y&&e.push(a);return e}()),c.length>1?k.push(b.Line.createPath(c,f,this.bottom)):k.push(null);return k}.call(this)},c.prototype.draw=function(){var a;return((a=this.options.axes)===!0||"both"===a||"x"===a)&&this.drawXAxis(),this.drawSeries(),this.options.hideHover===!1?this.displayHoverForRow(this.data.length-1):void 0},c.prototype.drawXAxis=function(){var a,c,d,e,f,g,h,i,j,k,l=this;for(h=this.bottom+this.options.padding/2,f=null,e=null,a=function(a,b){var c,d,g,i,j;return c=l.drawXAxisLabel(l.transX(b),h,a),j=c.getBBox(),c.transform("r"+-l.options.xLabelAngle),d=c.getBBox(),c.transform("t0,"+d.height/2+"..."),0!==l.options.xLabelAngle&&(i=-.5*j.width*Math.cos(l.options.xLabelAngle*Math.PI/180),c.transform("t"+i+",0...")),d=c.getBBox(),(null==f||f>=d.x+d.width||null!=e&&e>=d.x)&&d.x>=0&&d.x+d.width<l.el.width()?(0!==l.options.xLabelAngle&&(g=1.25*l.options.gridTextSize/Math.sin(l.options.xLabelAngle*Math.PI/180),e=d.x-g),f=d.x-l.options.xLabelMargin):c.remove()},d=this.options.parseTime?1===this.data.length&&"auto"===this.options.xLabels?[[this.data[0].label,this.data[0].x]]:b.labelSeries(this.xmin,this.xmax,this.width,this.options.xLabels,this.options.xLabelFormat):function(){var a,b,c,d;for(c=this.data,d=[],a=0,b=c.length;b>a;a++)g=c[a],d.push([g.label,g.x]);return d}.call(this),d.reverse(),k=[],i=0,j=d.length;j>i;i++)c=d[i],k.push(a(c[0],c[1]));return k},c.prototype.drawSeries=function(){var a,b,c,d,e,f;for(this.seriesPoints=[],a=b=d=this.options.ykeys.length-1;0>=d?0>=b:b>=0;a=0>=d?++b:--b)this._drawLineFor(a);for(f=[],a=c=e=this.options.ykeys.length-1;0>=e?0>=c:c>=0;a=0>=e?++c:--c)f.push(this._drawPointFor(a));return f},c.prototype._drawPointFor=function(a){var b,c,d,e,f,g;for(this.seriesPoints[a]=[],f=this.data,g=[],d=0,e=f.length;e>d;d++)c=f[d],b=null,null!=c._y[a]&&(b=this.drawLinePoint(c._x,c._y[a],this.colorFor(c,a,"point"),a)),g.push(this.seriesPoints[a].push(b));return g},c.prototype._drawLineFor=function(a){var b;return b=this.paths[a],null!==b?this.drawLinePath(b,this.colorFor(null,a,"line"),a):void 0},c.createPath=function(a,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r;for(k="",c&&(g=b.Line.gradients(a)),l={y:null},h=q=0,r=a.length;r>q;h=++q)e=a[h],null!=e.y&&(null!=l.y?c?(f=g[h],j=g[h-1],i=(e.x-l.x)/4,m=l.x+i,o=Math.min(d,l.y+i*j),n=e.x-i,p=Math.min(d,e.y-i*f),k+="C"+m+","+o+","+n+","+p+","+e.x+","+e.y):k+="L"+e.x+","+e.y:c&&null==g[h]||(k+="M"+e.x+","+e.y)),l=e;return k},c.gradients=function(a){var b,c,d,e,f,g,h,i;for(c=function(a,b){return(a.y-b.y)/(a.x-b.x)},i=[],d=g=0,h=a.length;h>g;d=++g)b=a[d],null!=b.y?(e=a[d+1]||{y:null},f=a[d-1]||{y:null},null!=f.y&&null!=e.y?i.push(c(f,e)):null!=f.y?i.push(c(f,b)):null!=e.y?i.push(c(b,e)):i.push(null)):i.push(null);return i},c.prototype.hilight=function(a){var b,c,d,e,f;if(null!==this.prevHilight&&this.prevHilight!==a)for(b=c=0,e=this.seriesPoints.length-1;e>=0?e>=c:c>=e;b=e>=0?++c:--c)this.seriesPoints[b][this.prevHilight]&&this.seriesPoints[b][this.prevHilight].animate(this.pointShrinkSeries(b));if(null!==a&&this.prevHilight!==a)for(b=d=0,f=this.seriesPoints.length-1;f>=0?f>=d:d>=f;b=f>=0?++d:--d)this.seriesPoints[b][a]&&this.seriesPoints[b][a].animate(this.pointGrowSeries(b));return this.prevHilight=a},c.prototype.colorFor=function(a,b,c){return"function"==typeof this.options.lineColors?this.options.lineColors.call(this,a,b,c):"point"===c?this.options.pointFillColors[b%this.options.pointFillColors.length]||this.options.lineColors[b%this.options.lineColors.length]:this.options.lineColors[b%this.options.lineColors.length]},c.prototype.drawXAxisLabel=function(a,b,c){return this.raphael.text(a,b,c).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).attr("fill",this.options.gridTextColor)},c.prototype.drawLinePath=function(a,b,c){return this.raphael.path(a).attr("stroke",b).attr("stroke-width",this.lineWidthForSeries(c))},c.prototype.drawLinePoint=function(a,b,c,d){return this.raphael.circle(a,b,this.pointSizeForSeries(d)).attr("fill",c).attr("stroke-width",this.pointStrokeWidthForSeries(d)).attr("stroke",this.pointStrokeColorForSeries(d))},c.prototype.pointStrokeWidthForSeries=function(a){return this.options.pointStrokeWidths[a%this.options.pointStrokeWidths.length]},c.prototype.pointStrokeColorForSeries=function(a){return this.options.pointStrokeColors[a%this.options.pointStrokeColors.length]},c.prototype.lineWidthForSeries=function(a){return this.options.lineWidth instanceof Array?this.options.lineWidth[a%this.options.lineWidth.length]:this.options.lineWidth},c.prototype.pointSizeForSeries=function(a){return this.options.pointSize instanceof Array?this.options.pointSize[a%this.options.pointSize.length]:this.options.pointSize},c.prototype.pointGrowSeries=function(a){return Raphael.animation({r:this.pointSizeForSeries(a)+3},25,"linear")},c.prototype.pointShrinkSeries=function(a){return Raphael.animation({r:this.pointSizeForSeries(a)},25,"linear")},c}(b.Grid),b.labelSeries=function(c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r;if(j=200*(d-c)/e,i=new Date(c),n=b.LABEL_SPECS[f],void 0===n)for(r=b.AUTO_LABEL_ORDER,p=0,q=r.length;q>p;p++)if(k=r[p],m=b.LABEL_SPECS[k],j>=m.span){n=m;break}for(void 0===n&&(n=b.LABEL_SPECS.second),g&&(n=a.extend({},n,{fmt:g})),h=n.start(i),l=[];(o=h.getTime())<=d;)o>=c&&l.push([n.fmt(h),o]),n.incr(h);return l},c=function(a){return{span:60*a*1e3,start:function(a){return new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours())},fmt:function(a){return""+b.pad2(a.getHours())+":"+b.pad2(a.getMinutes())},incr:function(b){return b.setUTCMinutes(b.getUTCMinutes()+a)}}},d=function(a){return{span:1e3*a,start:function(a){return new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes())},fmt:function(a){return""+b.pad2(a.getHours())+":"+b.pad2(a.getMinutes())+":"+b.pad2(a.getSeconds())},incr:function(b){return b.setUTCSeconds(b.getUTCSeconds()+a)}}},b.LABEL_SPECS={decade:{span:1728e8,start:function(a){return new Date(a.getFullYear()-a.getFullYear()%10,0,1)},fmt:function(a){return""+a.getFullYear()},incr:function(a){return a.setFullYear(a.getFullYear()+10)}},year:{span:1728e7,start:function(a){return new Date(a.getFullYear(),0,1)},fmt:function(a){return""+a.getFullYear()},incr:function(a){return a.setFullYear(a.getFullYear()+1)}},month:{span:24192e5,start:function(a){return new Date(a.getFullYear(),a.getMonth(),1)},fmt:function(a){return""+a.getFullYear()+"-"+b.pad2(a.getMonth()+1)},incr:function(a){return a.setMonth(a.getMonth()+1)}},week:{span:6048e5,start:function(a){return new Date(a.getFullYear(),a.getMonth(),a.getDate())},fmt:function(a){return""+a.getFullYear()+"-"+b.pad2(a.getMonth()+1)+"-"+b.pad2(a.getDate())},incr:function(a){return a.setDate(a.getDate()+7)}},day:{span:864e5,start:function(a){return new Date(a.getFullYear(),a.getMonth(),a.getDate())},fmt:function(a){return""+a.getFullYear()+"-"+b.pad2(a.getMonth()+1)+"-"+b.pad2(a.getDate())},incr:function(a){return a.setDate(a.getDate()+1)}},hour:c(60),"30min":c(30),"15min":c(15),"10min":c(10),"5min":c(5),minute:c(1),"30sec":d(30),"15sec":d(15),"10sec":d(10),"5sec":d(5),second:d(1)},b.AUTO_LABEL_ORDER=["decade","year","month","week","day","hour","30min","15min","10min","5min","minute","30sec","15sec","10sec","5sec","second"],b.Area=function(c){function d(c){var f;return this instanceof b.Area?(f=a.extend({},e,c),this.cumulative=!f.behaveLikeLine,"auto"===f.fillOpacity&&(f.fillOpacity=f.behaveLikeLine?.8:1),d.__super__.constructor.call(this,f),void 0):new b.Area(c)}var e;return h(d,c),e={fillOpacity:"auto",behaveLikeLine:!1},d.prototype.calcPoints=function(){var a,b,c,d,e,f,g;for(f=this.data,g=[],d=0,e=f.length;e>d;d++)a=f[d],a._x=this.transX(a.x),b=0,a._y=function(){var d,e,f,g;for(f=a.y,g=[],d=0,e=f.length;e>d;d++)c=f[d],this.options.behaveLikeLine?g.push(this.transY(c)):(b+=c||0,g.push(this.transY(b)));return g}.call(this),g.push(a._ymax=Math.max.apply(Math,a._y));return g},d.prototype.drawSeries=function(){var a,b,c,d,e,f,g,h;for(this.seriesPoints=[],b=this.options.behaveLikeLine?function(){f=[];for(var a=0,b=this.options.ykeys.length-1;b>=0?b>=a:a>=b;b>=0?a++:a--)f.push(a);return f}.apply(this):function(){g=[];for(var a=e=this.options.ykeys.length-1;0>=e?0>=a:a>=0;0>=e?a++:a--)g.push(a);return g}.apply(this),h=[],c=0,d=b.length;d>c;c++)a=b[c],this._drawFillFor(a),this._drawLineFor(a),h.push(this._drawPointFor(a));return h},d.prototype._drawFillFor=function(a){var b;return b=this.paths[a],null!==b?(b+="L"+this.transX(this.xmax)+","+this.bottom+"L"+this.transX(this.xmin)+","+this.bottom+"Z",this.drawFilledPath(b,this.fillForSeries(a))):void 0},d.prototype.fillForSeries=function(a){var b;return b=Raphael.rgb2hsl(this.colorFor(this.data[a],a,"line")),Raphael.hsl(b.h,this.options.behaveLikeLine?.9*b.s:.75*b.s,Math.min(.98,this.options.behaveLikeLine?1.2*b.l:1.25*b.l))},d.prototype.drawFilledPath=function(a,b){return this.raphael.path(a).attr("fill",b).attr("fill-opacity",this.options.fillOpacity).attr("stroke","none")},d}(b.Line),b.Bar=function(c){function d(c){return this.onHoverOut=f(this.onHoverOut,this),this.onHoverMove=f(this.onHoverMove,this),this.onGridClick=f(this.onGridClick,this),this instanceof b.Bar?(d.__super__.constructor.call(this,a.extend({},c,{parseTime:!1})),void 0):new b.Bar(c)}return h(d,c),d.prototype.init=function(){return this.cumulative=this.options.stacked,"always"!==this.options.hideHover?(this.hover=new b.Hover({parent:this.el}),this.on("hovermove",this.onHoverMove),this.on("hoverout",this.onHoverOut),this.on("gridclick",this.onGridClick)):void 0},d.prototype.defaults={barSizeRatio:.75,barGap:3,barColors:["#0b62a4","#7a92a3","#4da74d","#afd8f8","#edc240","#cb4b4b","#9440ed"],barOpacity:1,barRadius:[0,0,0,0],xLabelMargin:50},d.prototype.calc=function(){var a;return this.calcBars(),this.options.hideHover===!1?(a=this.hover).update.apply(a,this.hoverContentForRow(this.data.length-1)):void 0},d.prototype.calcBars=function(){var a,b,c,d,e,f,g;for(f=this.data,g=[],a=d=0,e=f.length;e>d;a=++d)b=f[a],b._x=this.left+this.width*(a+.5)/this.data.length,g.push(b._y=function(){var a,d,e,f;for(e=b.y,f=[],a=0,d=e.length;d>a;a++)c=e[a],null!=c?f.push(this.transY(c)):f.push(null);return f}.call(this));return g},d.prototype.draw=function(){var a;return((a=this.options.axes)===!0||"both"===a||"x"===a)&&this.drawXAxis(),this.drawSeries()},d.prototype.drawXAxis=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;for(j=this.bottom+(this.options.xAxisLabelTopPadding||this.options.padding/2),g=null,f=null,m=[],a=k=0,l=this.data.length;l>=0?l>k:k>l;a=l>=0?++k:--k)h=this.data[this.data.length-1-a],b=this.drawXAxisLabel(h._x,j,h.label),i=b.getBBox(),b.transform("r"+-this.options.xLabelAngle),c=b.getBBox(),b.transform("t0,"+c.height/2+"..."),0!==this.options.xLabelAngle&&(e=-.5*i.width*Math.cos(this.options.xLabelAngle*Math.PI/180),b.transform("t"+e+",0...")),(null==g||g>=c.x+c.width||null!=f&&f>=c.x)&&c.x>=0&&c.x+c.width<this.el.width()?(0!==this.options.xLabelAngle&&(d=1.25*this.options.gridTextSize/Math.sin(this.options.xLabelAngle*Math.PI/180),f=c.x-d),m.push(g=c.x-this.options.xLabelMargin)):m.push(b.remove());return m},d.prototype.drawSeries=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o;return c=this.width/this.options.data.length,h=null!=this.options.stacked?1:this.options.ykeys.length,a=(c*this.options.barSizeRatio-this.options.barGap*(h-1))/h,this.options.barSize&&(a=Math.min(a,this.options.barSize)),l=c-a*h-this.options.barGap*(h-1),g=l/2,o=this.ymin<=0&&this.ymax>=0?this.transY(0):null,this.bars=function(){var h,l,p,q;for(p=this.data,q=[],d=h=0,l=p.length;l>h;d=++h)i=p[d],e=0,q.push(function(){var h,l,p,q;for(p=i._y,q=[],j=h=0,l=p.length;l>h;j=++h)n=p[j],null!==n?(o?(m=Math.min(n,o),b=Math.max(n,o)):(m=n,b=this.bottom),f=this.left+d*c+g,this.options.stacked||(f+=j*(a+this.options.barGap)),k=b-m,this.options.stacked&&(m-=e),this.drawBar(f,m,a,k,this.colorFor(i,j,"bar"),this.options.barOpacity,this.options.barRadius),q.push(e+=k)):q.push(null);return q}.call(this));return q}.call(this)},d.prototype.colorFor=function(a,b,c){var d,e;return"function"==typeof this.options.barColors?(d={x:a.x,y:a.y[b],label:a.label},e={index:b,key:this.options.ykeys[b],label:this.options.labels[b]},this.options.barColors.call(this,d,e,c)):this.options.barColors[b%this.options.barColors.length]},d.prototype.hitTest=function(a){return 0===this.data.length?null:(a=Math.max(Math.min(a,this.right),this.left),Math.min(this.data.length-1,Math.floor((a-this.left)/(this.width/this.data.length))))},d.prototype.onGridClick=function(a,b){var c;return c=this.hitTest(a),this.fire("click",c,this.data[c].src,a,b)},d.prototype.onHoverMove=function(a){var b,c;return b=this.hitTest(a),(c=this.hover).update.apply(c,this.hoverContentForRow(b))},d.prototype.onHoverOut=function(){return this.options.hideHover!==!1?this.hover.hide():void 0},d.prototype.hoverContentForRow=function(a){var b,c,d,e,f,g,h,i;for(d=this.data[a],b="<div class='morris-hover-row-label'>"+d.label+"</div>",i=d.y,c=g=0,h=i.length;h>g;c=++g)f=i[c],b+="<div class='morris-hover-point' style='color: "+this.colorFor(d,c,"label")+"'>\n  "+this.options.labels[c]+":\n  "+this.yLabelFormat(f)+"\n</div>";return"function"==typeof this.options.hoverCallback&&(b=this.options.hoverCallback(a,this.options,b,d.src)),e=this.left+(a+.5)*this.width/this.data.length,[b,e]},d.prototype.drawXAxisLabel=function(a,b,c){var d;return d=this.raphael.text(a,b,c).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).attr("fill",this.options.gridTextColor)},d.prototype.drawBar=function(a,b,c,d,e,f,g){var h,i;return h=Math.max.apply(Math,g),i=0===h||h>d?this.raphael.rect(a,b,c,d):this.raphael.path(this.roundedRect(a,b,c,d,g)),i.attr("fill",e).attr("fill-opacity",f).attr("stroke","none")},d.prototype.roundedRect=function(a,b,c,d,e){return null==e&&(e=[0,0,0,0]),["M",a,e[0]+b,"Q",a,b,a+e[0],b,"L",a+c-e[1],b,"Q",a+c,b,a+c,b+e[1],"L",a+c,b+d-e[2],"Q",a+c,b+d,a+c-e[2],b+d,"L",a+e[3],b+d,"Q",a,b+d,a,b+d-e[3],"Z"]},d}(b.Grid),b.Donut=function(c){function d(c){this.resizeHandler=f(this.resizeHandler,this),this.select=f(this.select,this),this.click=f(this.click,this);var d=this;if(!(this instanceof b.Donut))return new b.Donut(c);if(this.options=a.extend({},this.defaults,c),this.el="string"==typeof c.element?a(document.getElementById(c.element)):a(c.element),null===this.el||0===this.el.length)throw new Error("Graph placeholder not found.");void 0!==c.data&&0!==c.data.length&&(this.raphael=new Raphael(this.el[0]),this.options.resize&&a(window).bind("resize",function(){return null!=d.timeoutId&&window.clearTimeout(d.timeoutId),d.timeoutId=window.setTimeout(d.resizeHandler,100)}),this.setData(c.data))}return h(d,c),d.prototype.defaults={colors:["#0B62A4","#3980B5","#679DC6","#95BBD7","#B0CCE1","#095791","#095085","#083E67","#052C48","#042135"],backgroundColor:"#FFFFFF",labelColor:"#000000",formatter:b.commas,resize:!1},d.prototype.redraw=function(){var a,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x;for(this.raphael.clear(),c=this.el.width()/2,d=this.el.height()/2,n=(Math.min(c,d)-10)/3,l=0,u=this.values,o=0,r=u.length;r>o;o++)m=u[o],l+=m;for(i=5/(2*n),a=1.9999*Math.PI-i*this.data.length,g=0,f=0,this.segments=[],v=this.values,e=p=0,s=v.length;s>p;e=++p)m=v[e],j=g+i+a*(m/l),k=new b.DonutSegment(c,d,2*n,n,g,j,this.data[e].color||this.options.colors[f%this.options.colors.length],this.options.backgroundColor,f,this.raphael),k.render(),this.segments.push(k),k.on("hover",this.select),k.on("click",this.click),g=j,f+=1;for(this.text1=this.drawEmptyDonutLabel(c,d-10,this.options.labelColor,15,800),this.text2=this.drawEmptyDonutLabel(c,d+10,this.options.labelColor,14),h=Math.max.apply(Math,this.values),f=0,w=this.values,x=[],q=0,t=w.length;t>q;q++){if(m=w[q],m===h){this.select(f);
break}x.push(f+=1)}return x},d.prototype.setData=function(a){var b;return this.data=a,this.values=function(){var a,c,d,e;for(d=this.data,e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(parseFloat(b.value));return e}.call(this),this.redraw()},d.prototype.click=function(a){return this.fire("click",a,this.data[a])},d.prototype.select=function(a){var b,c,d,e,f,g;for(g=this.segments,e=0,f=g.length;f>e;e++)c=g[e],c.deselect();return d=this.segments[a],d.select(),b=this.data[a],this.setLabels(b.label,this.options.formatter(b.value,b))},d.prototype.setLabels=function(a,b){var c,d,e,f,g,h,i,j;return c=2*(Math.min(this.el.width()/2,this.el.height()/2)-10)/3,f=1.8*c,e=c/2,d=c/3,this.text1.attr({text:a,transform:""}),g=this.text1.getBBox(),h=Math.min(f/g.width,e/g.height),this.text1.attr({transform:"S"+h+","+h+","+(g.x+g.width/2)+","+(g.y+g.height)}),this.text2.attr({text:b,transform:""}),i=this.text2.getBBox(),j=Math.min(f/i.width,d/i.height),this.text2.attr({transform:"S"+j+","+j+","+(i.x+i.width/2)+","+i.y})},d.prototype.drawEmptyDonutLabel=function(a,b,c,d,e){var f;return f=this.raphael.text(a,b,"").attr("font-size",d).attr("fill",c),null!=e&&f.attr("font-weight",e),f},d.prototype.resizeHandler=function(){return this.timeoutId=null,this.raphael.setSize(this.el.width(),this.el.height()),this.redraw()},d}(b.EventEmitter),b.DonutSegment=function(a){function b(a,b,c,d,e,g,h,i,j,k){this.cx=a,this.cy=b,this.inner=c,this.outer=d,this.color=h,this.backgroundColor=i,this.index=j,this.raphael=k,this.deselect=f(this.deselect,this),this.select=f(this.select,this),this.sin_p0=Math.sin(e),this.cos_p0=Math.cos(e),this.sin_p1=Math.sin(g),this.cos_p1=Math.cos(g),this.is_long=g-e>Math.PI?1:0,this.path=this.calcSegment(this.inner+3,this.inner+this.outer-5),this.selectedPath=this.calcSegment(this.inner+3,this.inner+this.outer),this.hilight=this.calcArc(this.inner)}return h(b,a),b.prototype.calcArcPoints=function(a){return[this.cx+a*this.sin_p0,this.cy+a*this.cos_p0,this.cx+a*this.sin_p1,this.cy+a*this.cos_p1]},b.prototype.calcSegment=function(a,b){var c,d,e,f,g,h,i,j,k,l;return k=this.calcArcPoints(a),c=k[0],e=k[1],d=k[2],f=k[3],l=this.calcArcPoints(b),g=l[0],i=l[1],h=l[2],j=l[3],"M"+c+","+e+("A"+a+","+a+",0,"+this.is_long+",0,"+d+","+f)+("L"+h+","+j)+("A"+b+","+b+",0,"+this.is_long+",1,"+g+","+i)+"Z"},b.prototype.calcArc=function(a){var b,c,d,e,f;return f=this.calcArcPoints(a),b=f[0],d=f[1],c=f[2],e=f[3],"M"+b+","+d+("A"+a+","+a+",0,"+this.is_long+",0,"+c+","+e)},b.prototype.render=function(){var a=this;return this.arc=this.drawDonutArc(this.hilight,this.color),this.seg=this.drawDonutSegment(this.path,this.color,this.backgroundColor,function(){return a.fire("hover",a.index)},function(){return a.fire("click",a.index)})},b.prototype.drawDonutArc=function(a,b){return this.raphael.path(a).attr({stroke:b,"stroke-width":2,opacity:0})},b.prototype.drawDonutSegment=function(a,b,c,d,e){return this.raphael.path(a).attr({fill:b,stroke:c,"stroke-width":3}).hover(d).click(e)},b.prototype.select=function(){return this.selected?void 0:(this.seg.animate({path:this.selectedPath},150,"<>"),this.arc.animate({opacity:1},150,"<>"),this.selected=!0)},b.prototype.deselect=function(){return this.selected?(this.seg.animate({path:this.path},150,"<>"),this.arc.animate({opacity:0},150,"<>"),this.selected=!1):void 0},b}(b.EventEmitter)}).call(this);
/*!
 * g.Raphael 0.5 - Charting library, based on RaphaÃ«l
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.el.popup=function(d,k,h,g){var c=this.paper||this[0].paper,f,j,b,e,a;if(!c){return}switch(this.type){case"text":case"circle":case"ellipse":b=true;break;default:b=false}d=d==null?"up":d;k=k||5;f=this.getBBox();h=typeof h=="number"?h:(b?f.x+f.width/2:f.x);g=typeof g=="number"?g:(b?f.y+f.height/2:f.y);e=Math.max(f.width/2-k,0);a=Math.max(f.height/2-k,0);this.translate(h-f.x-(b?f.width/2:0),g-f.y-(b?f.height/2:0));f=this.getBBox();var i={up:["M",h,g,"l",-k,-k,-e,0,"a",k,k,0,0,1,-k,-k,"l",0,-f.height,"a",k,k,0,0,1,k,-k,"l",k*2+e*2,0,"a",k,k,0,0,1,k,k,"l",0,f.height,"a",k,k,0,0,1,-k,k,"l",-e,0,"z"].join(","),down:["M",h,g,"l",k,k,e,0,"a",k,k,0,0,1,k,k,"l",0,f.height,"a",k,k,0,0,1,-k,k,"l",-(k*2+e*2),0,"a",k,k,0,0,1,-k,-k,"l",0,-f.height,"a",k,k,0,0,1,k,-k,"l",e,0,"z"].join(","),left:["M",h,g,"l",-k,k,0,a,"a",k,k,0,0,1,-k,k,"l",-f.width,0,"a",k,k,0,0,1,-k,-k,"l",0,-(k*2+a*2),"a",k,k,0,0,1,k,-k,"l",f.width,0,"a",k,k,0,0,1,k,k,"l",0,a,"z"].join(","),right:["M",h,g,"l",k,-k,0,-a,"a",k,k,0,0,1,k,-k,"l",f.width,0,"a",k,k,0,0,1,k,k,"l",0,k*2+a*2,"a",k,k,0,0,1,-k,k,"l",-f.width,0,"a",k,k,0,0,1,-k,-k,"l",0,-a,"z"].join(",")};j={up:{x:-!b*(f.width/2),y:-k*2-(b?f.height/2:f.height)},down:{x:-!b*(f.width/2),y:k*2+(b?f.height/2:f.height)},left:{x:-k*2-(b?f.width/2:f.width),y:-!b*(f.height/2)},right:{x:k*2+(b?f.width/2:f.width),y:-!b*(f.height/2)}}[d];this.translate(j.x,j.y);return c.path(i[d]).attr({fill:"#000",stroke:"none"}).insertBefore(this.node?this:this[0])};Raphael.el.tag=function(f,b,l,k){var i=3,e=this.paper||this[0].paper;if(!e){return}var c=e.path().attr({fill:"#000",stroke:"#000"}),j=this.getBBox(),m,h,a,g;switch(this.type){case"text":case"circle":case"ellipse":a=true;break;default:a=false}f=f||0;l=typeof l=="number"?l:(a?j.x+j.width/2:j.x);k=typeof k=="number"?k:(a?j.y+j.height/2:j.y);b=b==null?5:b;h=0.5522*b;if(j.height>=b*2){c.attr({path:["M",l,k+b,"a",b,b,0,1,1,0,-b*2,b,b,0,1,1,0,b*2,"m",0,-b*2-i,"a",b+i,b+i,0,1,0,0,(b+i)*2,"L",l+b+i,k+j.height/2+i,"l",j.width+2*i,0,0,-j.height-2*i,-j.width-2*i,0,"L",l,k-b-i].join(",")})}else{m=Math.sqrt(Math.pow(b+i,2)-Math.pow(j.height/2+i,2));c.attr({path:["M",l,k+b,"c",-h,0,-b,h-b,-b,-b,0,-h,b-h,-b,b,-b,h,0,b,b-h,b,b,0,h,h-b,b,-b,b,"M",l+m,k-j.height/2-i,"a",b+i,b+i,0,1,0,0,j.height+2*i,"l",b+i-m+j.width+2*i,0,0,-j.height-2*i,"L",l+m,k-j.height/2-i].join(",")})}f=360-f;c.rotate(f,l,k);if(this.attrs){this.attr(this.attrs.x?"x":"cx",l+b+i+(!a?this.type=="text"?j.width:0:j.width/2)).attr("y",a?k:k-j.height/2);this.rotate(f,l,k);f>90&&f<270&&this.attr(this.attrs.x?"x":"cx",l-b-i-(!a?j.width:j.width/2)).rotate(180,l,k)}else{if(f>90&&f<270){this.translate(l-j.x-j.width-b-i,k-j.y-j.height/2);this.rotate(f-180,j.x+j.width+b+i,j.y+j.height/2)}else{this.translate(l-j.x+b+i,k-j.y-j.height/2);this.rotate(f,j.x-b-i,j.y+j.height/2)}}return c.insertBefore(this.node?this:this[0])};Raphael.el.drop=function(d,g,f){var e=this.getBBox(),c=this.paper||this[0].paper,a,j,b,i,h;if(!c){return}switch(this.type){case"text":case"circle":case"ellipse":a=true;break;default:a=false}d=d||0;g=typeof g=="number"?g:(a?e.x+e.width/2:e.x);f=typeof f=="number"?f:(a?e.y+e.height/2:e.y);j=Math.max(e.width,e.height)+Math.min(e.width,e.height);b=c.path(["M",g,f,"l",j,0,"A",j*0.4,j*0.4,0,1,0,g+j*0.7,f-j*0.7,"z"]).attr({fill:"#000",stroke:"none"}).rotate(22.5-d,g,f);d=(d+90)*Math.PI/180;i=(g+j*Math.sin(d))-(a?0:e.width/2);h=(f+j*Math.cos(d))-(a?0:e.height/2);this.attrs?this.attr(this.attrs.x?"x":"cx",i).attr(this.attrs.y?"y":"cy",h):this.translate(i-e.x,h-e.y);return b.insertBefore(this.node?this:this[0])};Raphael.el.flag=function(e,k,j){var g=3,c=this.paper||this[0].paper;if(!c){return}var b=c.path().attr({fill:"#000",stroke:"#000"}),i=this.getBBox(),f=i.height/2,a;switch(this.type){case"text":case"circle":case"ellipse":a=true;break;default:a=false}e=e||0;k=typeof k=="number"?k:(a?i.x+i.width/2:i.x);j=typeof j=="number"?j:(a?i.y+i.height/2:i.y);b.attr({path:["M",k,j,"l",f+g,-f-g,i.width+2*g,0,0,i.height+2*g,-i.width-2*g,0,"z"].join(",")});e=360-e;b.rotate(e,k,j);if(this.attrs){this.attr(this.attrs.x?"x":"cx",k+f+g+(!a?this.type=="text"?i.width:0:i.width/2)).attr("y",a?j:j-i.height/2);this.rotate(e,k,j);e>90&&e<270&&this.attr(this.attrs.x?"x":"cx",k-f-g-(!a?i.width:i.width/2)).rotate(180,k,j)}else{if(e>90&&e<270){this.translate(k-i.x-i.width-f-g,j-i.y-i.height/2);this.rotate(e-180,i.x+i.width+f+g,i.y+i.height/2)}else{this.translate(k-i.x+f+g,j-i.y-i.height/2);this.rotate(e,i.x-f-g,i.y+i.height/2)}}return b.insertBefore(this.node?this:this[0])};Raphael.el.label=function(){var c=this.getBBox(),b=this.paper||this[0].paper,a=Math.min(20,c.width+10,c.height+10)/2;if(!b){return}return b.rect(c.x-a/2,c.y-a/2,c.width+a,c.height+a,a).attr({stroke:"none",fill:"#000"}).insertBefore(this.node?this:this[0])};Raphael.el.blob=function(z,j,i){var g=this.getBBox(),B=Math.PI/180,n=this.paper||this[0].paper,r,A,q;if(!n){return}switch(this.type){case"text":case"circle":case"ellipse":A=true;break;default:A=false}r=n.path().attr({fill:"#000",stroke:"none"});z=(+z+1?z:45)+90;q=Math.min(g.height,g.width);j=typeof j=="number"?j:(A?g.x+g.width/2:g.x);i=typeof i=="number"?i:(A?g.y+g.height/2:g.y);var m=Math.max(g.width+q,q*25/12),t=Math.max(g.height+q,q*25/12),u=j+q*Math.sin((z-22.5)*B),b=i+q*Math.cos((z-22.5)*B),v=j+q*Math.sin((z+22.5)*B),d=i+q*Math.cos((z+22.5)*B),o=(v-u)/2,l=(d-b)/2,f=m/2,e=t/2,s=-Math.sqrt(Math.abs(f*f*e*e-f*f*l*l-e*e*o*o)/(f*f*l*l+e*e*o*o)),c=s*f*l/e+(v+u)/2,a=s*-e*o/f+(d+b)/2;r.attr({x:c,y:a,path:["M",j,i,"L",v,d,"A",f,e,0,1,1,u,b,"z"].join(",")});this.translate(c-g.x-g.width/2,a-g.y-g.height/2);return r.insertBefore(this.node?this:this[0])};Raphael.fn.label=function(a,d,b){var c=this.set();b=this.text(a,d,b).attr(Raphael.g.txtattr);return c.push(b.label(),b)};Raphael.fn.popup=function(a,f,d,b,c){var e=this.set();d=this.text(a,f,d).attr(Raphael.g.txtattr);return e.push(d.popup(b,c),d)};Raphael.fn.tag=function(a,f,d,c,b){var e=this.set();d=this.text(a,f,d).attr(Raphael.g.txtattr);return e.push(d.tag(c,b),d)};Raphael.fn.flag=function(a,e,c,b){var d=this.set();c=this.text(a,e,c).attr(Raphael.g.txtattr);return d.push(c.flag(b),c)};Raphael.fn.drop=function(a,e,c,b){var d=this.set();c=this.text(a,e,c).attr(Raphael.g.txtattr);return d.push(c.drop(b),c)};Raphael.fn.blob=function(a,e,c,b){var d=this.set();c=this.text(a,e,c).attr(Raphael.g.txtattr);return d.push(c.blob(b),c)};Raphael.el.lighter=function(b){b=b||2;var a=[this.attrs.fill,this.attrs.stroke];this.fs=this.fs||[a[0],a[1]];a[0]=Raphael.rgb2hsb(Raphael.getRGB(a[0]).hex);a[1]=Raphael.rgb2hsb(Raphael.getRGB(a[1]).hex);a[0].b=Math.min(a[0].b*b,1);a[0].s=a[0].s/b;a[1].b=Math.min(a[1].b*b,1);a[1].s=a[1].s/b;this.attr({fill:"hsb("+[a[0].h,a[0].s,a[0].b]+")",stroke:"hsb("+[a[1].h,a[1].s,a[1].b]+")"});return this};Raphael.el.darker=function(b){b=b||2;var a=[this.attrs.fill,this.attrs.stroke];this.fs=this.fs||[a[0],a[1]];a[0]=Raphael.rgb2hsb(Raphael.getRGB(a[0]).hex);a[1]=Raphael.rgb2hsb(Raphael.getRGB(a[1]).hex);a[0].s=Math.min(a[0].s*b,1);a[0].b=a[0].b/b;a[1].s=Math.min(a[1].s*b,1);a[1].b=a[1].b/b;this.attr({fill:"hsb("+[a[0].h,a[0].s,a[0].b]+")",stroke:"hsb("+[a[1].h,a[1].s,a[1].b]+")"});return this};Raphael.el.resetBrightness=function(){if(this.fs){this.attr({fill:this.fs[0],stroke:this.fs[1]});delete this.fs}return this};(function(){var c=["lighter","darker","resetBrightness"],a=["popup","tag","flag","label","drop","blob"];for(var b in a){(function(d){Raphael.st[d]=function(){return Raphael.el[d].apply(this,arguments)}})(a[b])}for(var b in c){(function(d){Raphael.st[d]=function(){for(var e=0;e<this.length;e++){this[e][d].apply(this[e],arguments)}return this}})(c[b])}})();Raphael.g={shim:{stroke:"none",fill:"#000","fill-opacity":0},txtattr:{font:"12px Arial, sans-serif",fill:"#fff"},colors:(function(){var c=[0.6,0.2,0.05,0.1333,0.75,0],a=[];for(var b=0;b<10;b++){if(b<c.length){a.push("hsb("+c[b]+",.75, .75)")}else{a.push("hsb("+c[b-c.length]+", 1, .5)")}}return a})(),snapEnds:function(j,k,h){var e=j,l=k;if(e==l){return{from:e,to:l,power:0}}function m(d){return Math.abs(d-0.5)<0.25?~~(d)+0.5:Math.round(d)}var g=(l-e)/h,a=~~(g),c=a,b=0;if(a){while(c){b--;c=~~(g*Math.pow(10,b))/Math.pow(10,b)}b++}else{while(!a){b=b||1;a=~~(g*Math.pow(10,b))/Math.pow(10,b);b++}b&&b--}l=m(k*Math.pow(10,b))/Math.pow(10,b);if(l<k){l=m((k+0.5)*Math.pow(10,b))/Math.pow(10,b)}e=m((j-(b>0?0:0.5))*Math.pow(10,b))/Math.pow(10,b);return{from:e,to:l,power:b}},axis:function(p,o,k,D,e,G,g,J,h,a,q){a=a==null?2:a;h=h||"t";G=G||10;q=arguments[arguments.length-1];var C=h=="|"||h==" "?["M",p+0.5,o,"l",0,0.001]:g==1||g==3?["M",p+0.5,o,"l",0,-k]:["M",p,o+0.5,"l",k,0],s=this.snapEnds(D,e,G),H=s.from,z=s.to,F=s.power,E=0,w={font:"11px 'Fontin Sans', Fontin-Sans, sans-serif"},v=q.set(),I;I=(z-H)/G;var n=H,m=F>0?F:0;r=k/G;if(+g==1||+g==3){var b=o,u=(g-1?1:-1)*(a+3+!!(g-1));while(b>=o-k){h!="-"&&h!=" "&&(C=C.concat(["M",p-(h=="+"||h=="|"?a:!(g-1)*a*2),b+0.5,"l",a*2+1,0]));v.push(q.text(p+u,b,(J&&J[E++])||(Math.round(n)==n?n:+n.toFixed(m))).attr(w).attr({"text-anchor":g-1?"start":"end"}));n+=I;b-=r}if(Math.round(b+r-(o-k))){h!="-"&&h!=" "&&(C=C.concat(["M",p-(h=="+"||h=="|"?a:!(g-1)*a*2),o-k+0.5,"l",a*2+1,0]));v.push(q.text(p+u,o-k,(J&&J[E])||(Math.round(n)==n?n:+n.toFixed(m))).attr(w).attr({"text-anchor":g-1?"start":"end"}))}}else{n=H;m=(F>0)*F;u=(g?-1:1)*(a+9+!g);var c=p,r=k/G,A=0,B=0;while(c<=p+k){h!="-"&&h!=" "&&(C=C.concat(["M",c+0.5,o-(h=="+"?a:!!g*a*2),"l",0,a*2+1]));v.push(A=q.text(c,o+u,(J&&J[E++])||(Math.round(n)==n?n:+n.toFixed(m))).attr(w));var l=A.getBBox();if(B>=l.x-5){v.pop(v.length-1).remove()}else{B=l.x+l.width}n+=I;c+=r}if(Math.round(c-r-p-k)){h!="-"&&h!=" "&&(C=C.concat(["M",p+k+0.5,o-(h=="+"?a:!!g*a*2),"l",0,a*2+1]));v.push(q.text(p+k,o+u,(J&&J[E])||(Math.round(n)==n?n:+n.toFixed(m))).attr(w))}}var K=q.path(C);K.text=v;K.all=q.set([K,v]);K.remove=function(){this.text.remove();this.constructor.prototype.remove.call(this)};return K},labelise:function(a,c,b){if(a){return(a+"").replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g,function(d,f,e){if(f){return(+c).toFixed(f.replace(/^#+\.?/g,"").length)}if(e){return(c*100/b).toFixed(e.replace(/^%+\.?/g,"").length)+"%"}})}else{return(+c).toFixed(0)}}};
/*!
 * g.Raphael 0.51 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009-2012 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function(){function f(p,k,l,r,s,o,j,g){var q;if(s&&!r||!s&&!l){return j?"":g.path()}o={round:"round",sharp:"sharp",soft:"soft",square:"square"}[o]||"square";r=Math.round(r);l=Math.round(l);p=Math.round(p);k=Math.round(k);switch(o){case"round":s?(s=~~(l/2),q=r<s?["M",p-~~(l/2),k,"l",0,0,"a",~~(l/2),r,0,0,1,l,0,"l",0,0,"z"]:["M",p-s,k,"l",0,s-r,"a",s,s,0,1,1,l,0,"l",0,r-s,"z"]):(s=~~(r/2),q=l<s?["M",p+0.5,k+0.5-~~(r/2),"l",0,0,"a",l,~~(r/2),0,0,1,0,r,"l",0,0,"z"]:["M",p+0.5,k+0.5-s,"l",l-s,0,"a",s,s,0,1,1,0,r,"l",s-l,0,"z"]);break;case"sharp":s?(s=~~(l/2),q=["M",p+s,k,"l",-l,0,0,-d(r-s,0),s,-e(s,r),s,e(s,r),s,"z"]):(s=~~(r/2),q=["M",p,k+s,"l",0,-r,d(l-s,0),0,e(s,l),s,-e(s,l),s+(2*s<r),"z"]);break;case"square":q=s?["M",p+~~(l/2),k,"l",1-l,0,0,-r,l-1,0,"z"]:["M",p,k+~~(r/2),"l",0,-r,l,0,0,r,"z"];break;case"soft":s?(s=e(Math.round(l/5),r),q=["M",p-~~(l/2),k,"l",0,s-r,"a",s,s,0,0,1,s,-s,"l",l-2*s,0,"a",s,s,0,0,1,s,s,"l",0,r-s,"z"]):(s=e(l,Math.round(r/5)),q=["M",p+0.5,k+0.5-~~(r/2),"l",l-s,0,"a",s,s,0,0,1,s,s,"l",0,r-2*s,"a",s,s,0,0,1,-s,s,"l",s-l,0,"z"])}return j?q.join(","):g.path(q)}function c(aa,T,X,ae,af,Y,S){var S=S||{},P=S.type||"square",ad=parseFloat(S.gutter||"20%"),M=aa.set(),J=aa.set(),Q=aa.set(),K=aa.set(),G=Math.max.apply(Math,Y),Z=[],U=0,C=S.colors||this.colors,O=Y.length;if(Raphael.is(Y[0],"array")){for(var G=[],U=O,O=0,ab=Y.length;ab--;){J.push(aa.set()),G.push(Math.max.apply(Math,Y[ab])),O=Math.max(O,Y[ab].length)}if(S.stacked){for(ab=O;ab--;){for(var V=0,ac=Y.length;ac--;){V+=+Y[ac][ab]||0}Z.push(V)}}for(ab=Y.length;ab--;){if(Y[ab].length<O){for(ac=O;ac--;){Y[ab].push(0)}}}G=Math.max.apply(Math,S.stacked?Z:G)}var G=S.to||G,ae=100*(ae/(O*(100+ad)+ad)),ad=ae*ad/100,N=null==S.vgutter?20:S.vgutter,Z=[],V=T+ad,I=(af-2*N)/G;S.stretch||(ad=Math.round(ad),ae=Math.floor(ae));!S.stacked&&(ae/=U||1);for(ab=0;ab<O;ab++){Z=[];for(ac=0;ac<(U||1);ac++){var W=Math.round((U?Y[ac][ab]:Y[ab])*I),E=X+af-N-W,R=f(Math.round(V+ae/2),E+W,ae,W,!0,P,null,aa).attr({stroke:"none",fill:C[U?ac:ab]});U?J[ac].push(R):J.push(R);R.y=E;R.x=Math.round(V+ae/2);R.w=ae;R.h=W;R.value=U?Y[ac][ab]:Y[ab];S.stacked?Z.push(R):V+=ae}if(S.stacked){K.push(ac=aa.rect(Z[0].x-Z[0].w/2,X,ae,af).attr(this.shim));ac.bars=aa.set();for(var E=0,B=Z.length;B--;){Z[B].toFront()}for(var B=0,L=Z.length;B<L;B++){var R=Z[B],W=(E+R.value)*I,F=f(R.x,X+af-N-0.5*!!E,ae,W,!0,P,1,aa);ac.bars.push(R);E&&R.attr({path:F});R.h=W;R.y=X+af-N-0.5*!!E-W;Q.push(W=aa.rect(R.x-R.w/2,R.y,ae,R.value*I).attr(this.shim));W.bar=R;W.value=R.value;E+=R.value}V+=ae}V+=ad}K.toFront();V=T+ad;if(!S.stacked){for(ab=0;ab<O;ab++){for(ac=0;ac<(U||1);ac++){Q.push(W=aa.rect(Math.round(V),X+N,ae,af-N).attr(this.shim)),W.bar=U?J[ac][ab]:J[ab],W.value=W.bar.value,V+=ae}V+=ad}}M.label=function(i,p){i=i||[];this.labels=aa.set();var q,n=-Infinity;if(S.stacked){for(var r=0;r<O;r++){for(var h=0,o=0;o<(U||1);o++){h=h+(U?Y[o][r]:Y[r]);if(o==U-1){q=aa.labelise(i[r],h,G);q=aa.text(J[r*(U||1)+o].x,X+af-N/2,q).attr(txtattr).insertBefore(Q[r*(U||1)+o]);var l=q.getBBox();if(l.x-7<n){q.remove()}else{this.labels.push(q);n=l.x+l.width}}}}}else{for(r=0;r<O;r++){for(o=0;o<(U||1);o++){q=aa.labelise(U?i[o]&&i[o][r]:i[r],U?Y[o][r]:Y[r],G);q=aa.text(J[r*(U||1)+o].x,p?X+af-N/2:J[r*(U||1)+o].y-10,q).attr(txtattr).insertBefore(Q[r*(U||1)+o]);l=q.getBBox();if(l.x-7<n){q.remove()}else{this.labels.push(q);n=l.x+l.width}}}}return this};M.hover=function(h,g){K.hide();Q.show();Q.mouseover(h).mouseout(g);return this};M.hoverColumn=function(h,g){Q.hide();K.show();K.mouseover(h).mouseout(g||function(){});return this};M.click=function(g){K.hide();Q.show();Q.click(g);return this};M.each=function(h){if(!Raphael.is(h,"function")){return this}for(var g=Q.length;g--;){h.call(Q[g])}return this};M.eachColumn=function(h){if(!Raphael.is(h,"function")){return this}for(var g=K.length;g--;){h.call(K[g])}return this};M.clickColumn=function(g){Q.hide();K.show();K.click(g);return this};M.push(J,Q,K);M.bars=J;M.covers=Q;return M}function b(Y,R,V,ac,ad,W,Q){var Q=Q||{},B=Q.type||"square",ab=parseFloat(Q.gutter||"20%"),K=Y.set(),H=Y.set(),O=Y.set(),I=Y.set(),F=Math.max.apply(Math,W),X=[],S=0,M=Q.colors||this.colors,N=W.length;if(Raphael.is(W[0],"array")){for(var F=[],S=N,N=0,Z=W.length;Z--;){H.push(Y.set()),F.push(Math.max.apply(Math,W[Z])),N=Math.max(N,W[Z].length)}if(Q.stacked){for(Z=N;Z--;){for(var T=0,aa=W.length;aa--;){T+=+W[aa][Z]||0}X.push(T)}}for(Z=W.length;Z--;){if(W[Z].length<N){for(aa=N;aa--;){W[Z].push(0)}}}F=Math.max.apply(Math,Q.stacked?X:F)}var F=Q.to||F,L=Math.floor(100*(ad/(N*(100+ab)+ab))),ad=Math.floor(L*ab/100),ab=[],X=V+ad,T=(ac-1)/F;!Q.stacked&&(L/=S||1);for(Z=0;Z<N;Z++){ab=[];for(aa=0;aa<(S||1);aa++){var G=S?W[aa][Z]:W[Z],U=f(R,X+L/2,Math.round(G*T),L-1,!1,B,null,Y).attr({stroke:"none",fill:M[S?aa:Z]});S?H[aa].push(U):H.push(U);U.x=R+Math.round(G*T);U.y=X+L/2;U.w=Math.round(G*T);U.h=L;U.value=+G;Q.stacked?ab.push(U):X+=L}if(Q.stacked){aa=Y.rect(R,ab[0].y-ab[0].h/2,ac,L).attr(this.shim);I.push(aa);aa.bars=Y.set();for(var E=0,P=ab.length;P--;){ab[P].toFront()}for(var P=0,A=ab.length;P<A;P++){var U=ab[P],G=Math.round((E+U.value)*T),J=f(R,U.y,G,L-1,!1,B,1,Y);aa.bars.push(U);E&&U.attr({path:J});U.w=G;U.x=R+G;O.push(G=Y.rect(R+E*T,U.y-U.h/2,U.value*T,L).attr(this.shim));G.bar=U;E+=U.value}X+=L}X+=ad}I.toFront();X=V+ad;if(!Q.stacked){for(Z=0;Z<N;Z++){for(aa=0;aa<(S||1);aa++){G=Y.rect(R,X,ac,L).attr(this.shim),O.push(G),G.bar=S?H[aa][Z]:H[Z],G.value=G.bar.value,X+=L}X+=ad}}K.label=function(i,h){i=i||[];this.labels=Y.set();for(var m=0;m<N;m++){for(var l=0;l<S;l++){var k=Y.labelise(S?i[l]&&i[l][m]:i[m],S?W[l][m]:W[m],F),j=h?"end":"start";this.labels.push(k=Y.text(h?H[m*(S||1)+l].x-L/2+3:R+5,H[m*(S||1)+l].y,k).attr(txtattr).attr({"text-anchor":j}).insertBefore(O[0]));k.getBBox().x<R+5?k.attr({x:R+5,"text-anchor":"start"}):H[m*(S||1)+l].label=k}}return this};K.hover=function(h,g){I.hide();O.show();O.mouseover(h).mouseout(g||function(){});return this};K.hoverColumn=function(h,g){O.hide();I.show();I.mouseover(h).mouseout(g||function(){});return this};K.each=function(h){if(!Raphael.is(h,"function")){return this}for(var g=O.length;g--;){h.call(O[g])}return this};K.eachColumn=function(h){if(!Raphael.is(h,"function")){return this}for(var g=I.length;g--;){h.call(I[g])}return this};K.click=function(g){I.hide();O.show();O.click(g);return this};K.clickColumn=function(g){O.hide();I.show();I.click(g);return this};K.push(H,O,I);K.bars=H;K.covers=O;return K}var e=Math.min,d=Math.max,a=function(){};a.prototype=Raphael.g;b.prototype=c.prototype=new a;Raphael.fn.barchart=function(o,j,l,g,k,n){return new c(this,o,j,l,g,k,n)};Raphael.fn.hbarchart=function(o,j,l,g,k,n){return new b(this,o,j,l,g,k,n)}})();
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.2
 *
 */
(function($){jQuery.fn.extend({slimScroll:function(options){var defaults={width:"auto",height:"250px",size:"4px",color:"#000",position:"right",distance:"1.5px",start:"top",opacity:0.16,alwaysVisible:false,disableFadeOut:false,railVisible:false,railColor:"#333",railOpacity:0.2,railDraggable:true,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:false,wheelStep:20,touchScrollStep:30,borderRadius:"6px",railBorderRadius:"6px"};var o=$.extend(defaults,options);this.each(function(){var isOverPanel,isOverBar,isDragg,queueHide,touchDif,barHeight,percentScroll,lastScroll,divS="<div></div>",minBarHeight=30,releaseScroll=false;var me=$(this);if(me.parent().hasClass(o.wrapperClass)){var offset=me.scrollTop();bar=me.parent().find("."+o.barClass);rail=me.parent().find("."+o.railClass);getBarHeight();if($.isPlainObject(options)){if("height" in options){var height;if(options.height=="auto"){me.parent().css("height","auto");me.css("height","auto");height=me.parent().parent().height()}else{height=options.height}me.parent().css("height",height);me.css("height",height)}if("scrollTo" in options){offset=parseInt(o.scrollTo)}else{if("scrollBy" in options){offset+=parseInt(o.scrollBy)}else{if("destroy" in options){bar.remove();rail.remove();me.unwrap();return}}}scrollContent(offset,false,true)}return}o.height=(options.height=="auto")?me.parent().height():options.height;var wrapper=$(divS).addClass(o.wrapperClass).css({position:"relative",overflow:"hidden",width:o.width,height:o.height});me.css({overflow:"hidden",width:o.width,height:o.height});var rail=$(divS).addClass(o.railClass).css({width:o.size,height:"100%",position:"absolute",top:0,display:(o.alwaysVisible&&o.railVisible)?"block":"none","border-radius":o.railBorderRadius,background:o.railColor,opacity:o.railOpacity,zIndex:1});var bar=$(divS).addClass(o.barClass).css({background:o.color,width:o.size,position:"absolute",top:0,opacity:o.opacity,display:o.alwaysVisible?"block":"none","border-radius":o.borderRadius,BorderRadius:o.borderRadius,MozBorderRadius:o.borderRadius,WebkitBorderRadius:o.borderRadius,zIndex:2});var posCss=(o.position=="right")?{right:o.distance}:{left:o.distance};rail.css(posCss);bar.css(posCss);me.wrap(wrapper);me.parent().append(bar);me.parent().append(rail);if(o.railDraggable){bar.bind("mousedown",function(e){var $doc=$(document);isDragg=true;t=parseFloat(bar.css("top"));pageY=e.pageY;$doc.bind("mousemove.slimscroll",function(e){currTop=t+e.pageY-pageY;bar.css("top",currTop);scrollContent(0,bar.position().top,false)});$doc.bind("mouseup.slimscroll",function(e){isDragg=false;hideBar();$doc.unbind(".slimscroll")});return false}).bind("selectstart.slimscroll",function(e){e.stopPropagation();e.preventDefault();return false})}rail.hover(function(){showBar()},function(){hideBar()});bar.hover(function(){isOverBar=true},function(){isOverBar=false});me.hover(function(){isOverPanel=true;showBar();hideBar()},function(){isOverPanel=false;hideBar()});me.bind("touchstart",function(e,b){if(e.originalEvent.touches.length){touchDif=e.originalEvent.touches[0].pageY}});me.bind("touchmove",function(e){if(!releaseScroll){e.originalEvent.preventDefault()}if(e.originalEvent.touches.length){var diff=(touchDif-e.originalEvent.touches[0].pageY)/o.touchScrollStep;scrollContent(diff,true);touchDif=e.originalEvent.touches[0].pageY}});getBarHeight();if(o.start==="bottom"){bar.css({top:me.outerHeight()-bar.outerHeight()});scrollContent(0,true)}else{if(o.start!=="top"){scrollContent($(o.start).position().top,null,true);if(!o.alwaysVisible){bar.hide()}}}attachWheel();function _onWheel(e){if(!isOverPanel){return}var e=e||window.event;var delta=0;if(e.wheelDelta){delta=-e.wheelDelta/120}if(e.detail){delta=e.detail/3}var target=e.target||e.srcTarget||e.srcElement;if($(target).closest("."+o.wrapperClass).is(me.parent())){scrollContent(delta,true)}if(e.preventDefault&&!releaseScroll){e.preventDefault()}if(!releaseScroll){e.returnValue=false}}function scrollContent(y,isWheel,isJump){releaseScroll=false;var delta=y;var maxTop=me.outerHeight()-bar.outerHeight();if(isWheel){delta=parseInt(bar.css("top"))+y*parseInt(o.wheelStep)/100*bar.outerHeight();delta=Math.min(Math.max(delta,0),maxTop);delta=(y>0)?Math.ceil(delta):Math.floor(delta);bar.css({top:delta+"px"})}percentScroll=parseInt(bar.css("top"))/(me.outerHeight()-bar.outerHeight());delta=percentScroll*(me[0].scrollHeight-me.outerHeight());if(isJump){delta=y;var offsetTop=delta/me[0].scrollHeight*me.outerHeight();offsetTop=Math.min(Math.max(offsetTop,0),maxTop);bar.css({top:offsetTop+"px"})}me.scrollTop(delta);me.trigger("slimscrolling",~~delta);showBar();hideBar()}function attachWheel(){if(window.addEventListener){this.addEventListener("DOMMouseScroll",_onWheel,false);this.addEventListener("mousewheel",_onWheel,false)}else{document.attachEvent("onmousewheel",_onWheel)}}function getBarHeight(){barHeight=Math.max((me.outerHeight()/me[0].scrollHeight)*me.outerHeight(),minBarHeight);bar.css({height:barHeight+"px"});var display=barHeight==me.outerHeight()?"none":"block";bar.css({display:display})}function showBar(){getBarHeight();clearTimeout(queueHide);if(percentScroll==~~percentScroll){releaseScroll=o.allowPageScroll;if(lastScroll!=percentScroll){var msg=(~~percentScroll==0)?"top":"bottom";me.trigger("slimscroll",msg)}}else{releaseScroll=false}lastScroll=percentScroll;if(barHeight>=me.outerHeight()){releaseScroll=true;return}bar.stop(true,true).fadeIn("fast");if(o.railVisible){rail.stop(true,true).fadeIn("fast")}}function hideBar(){if(!o.alwaysVisible){queueHide=setTimeout(function(){if(!(o.disableFadeOut&&isOverPanel)&&!isOverBar&&!isDragg){bar.fadeOut("slow");rail.fadeOut("slow")}},1000)}}});return this}});jQuery.fn.extend({slimscroll:jQuery.fn.slimScroll})})(jQuery);

!function(e){var t=function(){return!1===e.support.boxModel&&e.support.objectAll&&e.support.leadingWhitespace}();e.jGrowl=function(t,i){0==e("#jGrowl").size()&&e('<div id="jGrowl"></div>').addClass(i&&i.position?i.position:e.jGrowl.defaults.position).appendTo("body"),e("#jGrowl").jGrowl(t,i)},e.fn.jGrowl=function(t,i){if(e.isFunction(this.each)){var o=arguments;return this.each(function(){void 0==e(this).data("jGrowl.instance")&&(e(this).data("jGrowl.instance",e.extend(new e.fn.jGrowl,{notifications:[],element:null,interval:null})),e(this).data("jGrowl.instance").startup(this)),e.isFunction(e(this).data("jGrowl.instance")[t])?e(this).data("jGrowl.instance")[t].apply(e(this).data("jGrowl.instance"),e.makeArray(o).slice(1)):e(this).data("jGrowl.instance").create(t,i)})}},e.extend(e.fn.jGrowl.prototype,{defaults:{pool:0,header:"",group:"",sticky:!1,position:"top-right",glue:"after",theme:"default",themeState:"highlight",corners:"10px",check:250,life:3e3,closeDuration:"normal",openDuration:"normal",easing:"swing",closer:!0,closeTemplate:"&times;",closerTemplate:"<div>[ close all ]</div>",log:function(){},beforeOpen:function(){},afterOpen:function(){},open:function(){},beforeClose:function(){},close:function(){},animateOpen:{opacity:"show"},animateClose:{opacity:"hide"}},notifications:[],element:null,interval:null,create:function(t,i){var i=e.extend({},this.defaults,i);"undefined"!=typeof i.speed&&(i.openDuration=i.speed,i.closeDuration=i.speed),this.notifications.push({message:t,options:i}),i.log.apply(this.element,[this.element,t,i])},render:function(t){var i=this,o=t.message,n=t.options;n.themeState=""==n.themeState?"":"ui-state-"+n.themeState;var t=e("<div/>").addClass("jGrowl-notification "+n.themeState+" ui-corner-all"+(void 0!=n.group&&""!=n.group?" "+n.group:"")).append(e("<div/>").addClass("jGrowl-close").html(n.closeTemplate)).append(e("<div/>").addClass("jGrowl-header").html(n.header)).append(e("<div/>").addClass("jGrowl-message").html(o)).data("jGrowl",n).addClass(n.theme).children("div.jGrowl-close").bind("click.jGrowl",function(){e(this).parent().trigger("jGrowl.beforeClose")}).parent();e(t).bind("mouseover.jGrowl",function(){e("div.jGrowl-notification",i.element).data("jGrowl.pause",!0)}).bind("mouseout.jGrowl",function(){e("div.jGrowl-notification",i.element).data("jGrowl.pause",!1)}).bind("jGrowl.beforeOpen",function(){n.beforeOpen.apply(t,[t,o,n,i.element])!==!1&&e(this).trigger("jGrowl.open")}).bind("jGrowl.open",function(){n.open.apply(t,[t,o,n,i.element])!==!1&&("after"==n.glue?e("div.jGrowl-notification:last",i.element).after(t):e("div.jGrowl-notification:first",i.element).before(t),e(this).animate(n.animateOpen,n.openDuration,n.easing,function(){e.support.opacity===!1&&this.style.removeAttribute("filter"),null!==e(this).data("jGrowl")&&(e(this).data("jGrowl").created=new Date),e(this).trigger("jGrowl.afterOpen")}))}).bind("jGrowl.afterOpen",function(){n.afterOpen.apply(t,[t,o,n,i.element])}).bind("jGrowl.beforeClose",function(){n.beforeClose.apply(t,[t,o,n,i.element])!==!1&&e(this).trigger("jGrowl.close")}).bind("jGrowl.close",function(){e(this).data("jGrowl.pause",!0),e(this).animate(n.animateClose,n.closeDuration,n.easing,function(){e.isFunction(n.close)?n.close.apply(t,[t,o,n,i.element])!==!1&&e(this).remove():e(this).remove()})}).trigger("jGrowl.beforeOpen"),""!=n.corners&&void 0!=e.fn.corner&&e(t).corner(n.corners),e("div.jGrowl-notification:parent",i.element).size()>1&&0==e("div.jGrowl-closer",i.element).size()&&this.defaults.closer!==!1&&e(this.defaults.closerTemplate).addClass("jGrowl-closer "+this.defaults.themeState+" ui-corner-all").addClass(this.defaults.theme).appendTo(i.element).animate(this.defaults.animateOpen,this.defaults.speed,this.defaults.easing).bind("click.jGrowl",function(){e(this).siblings().trigger("jGrowl.beforeClose"),e.isFunction(i.defaults.closer)&&i.defaults.closer.apply(e(this).parent()[0],[e(this).parent()[0]])})},update:function(){e(this.element).find("div.jGrowl-notification:parent").each(function(){void 0!=e(this).data("jGrowl")&&void 0!==e(this).data("jGrowl").created&&e(this).data("jGrowl").created.getTime()+parseInt(e(this).data("jGrowl").life)<(new Date).getTime()&&e(this).data("jGrowl").sticky!==!0&&(void 0==e(this).data("jGrowl.pause")||e(this).data("jGrowl.pause")!==!0)&&e(this).trigger("jGrowl.beforeClose")}),this.notifications.length>0&&(0==this.defaults.pool||e(this.element).find("div.jGrowl-notification:parent").size()<this.defaults.pool)&&this.render(this.notifications.shift()),e(this.element).find("div.jGrowl-notification:parent").size()<2&&e(this.element).find("div.jGrowl-closer").animate(this.defaults.animateClose,this.defaults.speed,this.defaults.easing,function(){e(this).remove()})},startup:function(i){this.element=e(i).addClass("jGrowl").append('<div class="jGrowl-notification"></div>'),this.interval=setInterval(function(){e(i).data("jGrowl.instance").update()},parseInt(this.defaults.check)),t&&e(this.element).addClass("ie6")},shutdown:function(){e(this.element).removeClass("jGrowl").find("div.jGrowl-notification").trigger("jGrowl.close").parent().empty(),clearInterval(this.interval)},close:function(){e(this.element).find("div.jGrowl-notification").each(function(){e(this).trigger("jGrowl.beforeClose")})}}),e.jGrowl.defaults=e.fn.jGrowl.prototype.defaults}(jQuery);


(function(e){e.fn.veditor=function(t){function l(e,t,n,r,i){var s=f.length+1;return f.push({name:e,cls:s,command:t,key:n,tag:r,emphasis:i})}var n=[{title:"Text Format"},{title:"Font Size"},{title:"Color"},{title:"Bold",hotkey:"B"},{title:"Italic",hotkey:"I"},{title:"Underline",hotkey:"U"},{title:"Ordered List",hotkey:"."},{title:"Unordered List",hotkey:","},{title:"Subscript",hotkey:"down arrow"},{title:"Superscript",hotkey:"up arrow"},{title:"Outdent",hotkey:"left arrow"},{title:"Indent",hotkey:"right arrow"},{title:"Justify Left"},{title:"Justify Center"},{title:"Justify Right"},{title:"Strike Through",hotkey:"K"},{title:"Add Link",hotkey:"L"},{title:"Remove Link"},{title:"Cleaner Style",hotkey:"Delete"},{title:"Horizontal Rule",hotkey:"H"},{title:"Source"}];var r=[["p","Normal"],["h1","Header 1"],["h2","Header 2"],["h3","Header 3"],["h4","Header 4"],["h5","Header 5"],["h6","Header 6"],["pre","Preformatted"]];var i=["10","12","16","18","20","24","28"];var s=["0,0,0","68,68,68","102,102,102","153,153,153","204,204,204","238,238,238","243,243,243","255,255,255",null,"255,0,0","255,153,0","255,255,0","0,255,0","0,255,255","0,0,255","153,0,255","255,0,255",null,"244,204,204","252,229,205","255,242,204","217,234,211","208,224,227","207,226,243","217,210,233","234,209,220","234,153,153","249,203,156","255,229,153","182,215,168","162,196,201","159,197,232","180,167,214","213,166,189","224,102,102","246,178,107","255,217,102","147,196,125","118,165,175","111,168,220","142,124,195","194,123,160","204,0,0","230,145,56","241,194,50","106,168,79","69,129,142","61,133,198","103,78,167","166,77,121","153,0,0","180,95,6","191,144,0","56,118,29","19,79,92","11,83,148","53,28,117","116,27,71","102,0,0","120,63,4","127,96,0","39,78,19","12,52,61","7,55,99","32,18,77","76,17,48"];var o=["Web Address","E-mail Address","Picture URL"];var u=e.extend({status:true,css:"veditor",title:true,titletext:n,button:"OK",format:true,formats:r,fsize:true,fsizes:i,funit:"px",color:true,linktypes:o,b:true,i:true,u:true,ol:true,ul:true,sub:true,sup:true,outdent:true,indent:true,left:true,center:true,right:true,strike:true,link:true,unlink:true,remove:true,rule:true,source:true,placeholder:false,br:true,p:true,change:"",focus:"",blur:""},t);e.fn.veditorVal=function(t){e(this).closest("."+u.css).find("."+u.css+"_editor").html(t)};var a=navigator.userAgent.toLowerCase();if(/msie [1-7]./.test(a))u.title=false;var f=[];l("format","formats","","",false);l("fsize","fSize","","",false);l("color","colors","","",false);l("b","Bold","B",["b","strong"],true);l("i","Italic","I",["i","em"],true);l("u","Underline","U",["u"],true);l("ol","insertorderedlist","¾",["ol"],true);l("ul","insertunorderedlist","¼",["ul"],true);l("sub","subscript","(",["sub"],true);l("sup","superscript","&",["sup"],true);l("outdent","outdent","%",["blockquote"],false);l("indent","indent","'",["blockquote"],true);l("left","justifyLeft","","",false);l("center","justifyCenter","","",false);l("right","justifyRight","","",false);l("strike","strikeThrough","K",["strike"],true);l("link","linkcreator","L",["a"],true);l("unlink","unlink","",["a"],false);l("remove","removeformat",".","",false);l("rule","inserthorizontalrule","H",["hr"],false);l("source","displaysource","","",false);return this.each(function(){function B(){if(window.getSelection)return window.getSelection();else if(document.selection&&document.selection.createRange&&document.selection.type!="None")return document.selection.createRange()}function j(e,t){var n,r=B();if(window.getSelection){if(r.anchorNode&&r.getRangeAt)n=r.getRangeAt(0);if(n){r.removeAllRanges();r.addRange(n)}if(!a.match(/msie/))document.execCommand("StyleWithCSS",false,false);document.execCommand(e,false,t)}else if(document.selection&&document.selection.createRange&&document.selection.type!="None"){n=document.selection.createRange();n.execCommand(e,false,t)}q(false,false)}function F(t,n,r){if(v.not(":focus"))v.focus();if(window.getSelection){var i=B(),s,o,u;if(i.anchorNode&&i.getRangeAt){s=i.getRangeAt(0);o=document.createElement(t);e(o).attr(n,r);u=s.extractContents();o.appendChild(u);s.insertNode(o);i.removeAllRanges();if(n=="style")q(e(o),r);else q(e(o),false)}}else if(document.selection&&document.selection.createRange&&document.selection.type!="None"){var a=document.selection.createRange();var f=a.htmlText;var l="<"+t+" "+n+'="'+r+'">'+f+"</"+t+">";document.selection.createRange().pasteHTML(l)}}function q(e,t){var n=I();n=n?n:e;if(n&&t==false){if(n.parent().is("[style]"))n.attr("style",n.parent().attr("style"));if(n.is("[style]"))n.find("*").attr("style",n.attr("style"))}else if(e&&t&&e.is("[style]")){var r=t.split(";");r=r[0].split(":");if(e.is("[style*="+r[0]+"]"))e.find("*").css(r[0],r[1]);R(e)}}function R(t){if(t){var t=t[0];if(document.body.createTextRange){var n=document.body.createTextRange();n.moveToElementText(t);n.select()}else if(window.getSelection){var r=window.getSelection();var n=document.createRange();if(t!="undefined"&&t!=null){n.selectNodeContents(t);r.removeAllRanges();r.addRange(n);if(e(t).is(":empty")){e(t).append(" ");R(e(t))}}}}}function U(){if(!p.data("sourceOpened")){var t=I();var n="http://";W(true);if(t){var r=t.prop("tagName").toLowerCase();if(r=="a"&&t.is("[href]")){n=t.attr("href");t.attr(S,"")}else F("a",S,"")}else y.val(n).focus();g.click(function(t){if(e(t.target).hasClass(u.css+"_linktypetext")||e(t.target).hasClass(u.css+"_linktypearrow"))X(true)});w.find("a").click(function(){var t=e(this).attr(u.css+"-linktype");w.data("linktype",t);E.find("."+u.css+"_linktypetext").html(w.find("a:eq("+w.data("linktype")+")").text());V(n);X()});V(n);y.focus().val(n).bind("keypress keyup",function(e){if(e.keyCode==13){z(h.find("["+S+"]"));return false}});b.click(function(){z(h.find("["+S+"]"))})}else W(false)}function z(t){y.focus();R(t);t.removeAttr(S);if(w.data("linktype")!="2")j("createlink",y.val());else{j("insertImage",y.val());v.find("img").each(function(){var t=e(this).prev("a");var n=e(this).next("a");if(t.length>0&&t.html()=="")t.remove();else if(n.length>0&&n.html()=="")n.remove()})}W();v.trigger("change")}function W(e){Q("["+S+"]:not([href])");h.find("["+S+"][href]").removeAttr(S);if(e){p.data("linkOpened",true);d.show()}else{p.data("linkOpened",false);d.hide()}X()}function X(e){if(e)w.show();else w.hide()}function V(e){var t=w.data("linktype");if(t=="1"&&(y.val()=="http://"||y.is("[value^=http://]")||!y.is("[value^=mailto]")))y.val("mailto:");else if(t!="1"&&!y.is("[value^=http://]"))y.val("http://");else y.val(e)}function J(t){if(!p.data("sourceOpened")){if(t=="fSize")styleField=P;else if(t=="colors")styleField=H;K(styleField,true);styleField.find("a").unbind("click").click(function(){var n=e(this).attr(u.css+"-styleval");if(t=="fSize"){styleType="font-size";n=n+u.funit}else if(t=="colors"){styleType="color";n="rgb("+n+")"}var r=G(styleType);F("span","style",styleType+":"+n+";"+r);K("",false);e("."+u.css+"_title").remove();v.trigger("change")})}else K(styleField,false);W(false)}function K(e,t){var n="",r=[{d:"fsizeOpened",f:P},{d:"cpallOpened",f:H}];if(e!=""){for(var i=0;i<r.length;i++){if(e==r[i]["f"])n=r[i]}}if(t){p.data(n["d"],true);n["f"].slideDown(100);for(var i=0;i<r.length;i++){if(n["d"]!=r[i]["d"]){p.data(r[i]["d"],false);r[i]["f"].slideUp(100)}}}else{for(var i=0;i<r.length;i++){p.data(r[i]["d"],false);r[i]["f"].slideUp(100)}}}function Q(t){h.find(t).each(function(){e(this).before(e(this).html()).remove()})}function G(e){var t=I();if(t&&t.is("[style]")&&t.css(e)!=""){var n=t.css(e);t.css(e,"");var r=t.attr("style");t.css(e,n);return r}else return""}function Y(){Z(true);D.find("a").click(function(){e("*",this).click(function(e){e.preventDefault();return false});et(e(this).text());var t=e(this).attr(u.css+"-formatval");j("formatBlock","<"+t+">");Z(false)})}function Z(e){var t=e?true:false;t=e&&D.data("status")?true:false;if(t||!e)D.data("status",false).slideUp(200);else D.data("status",true).slideDown(200)}function et(e){var t=D.closest("."+u.css+"_tool").find("."+u.css+"_tool_label").find("."+u.css+"_tool_text");if(e.length>10)e=e.substr(0,7)+"...";t.html(e)}function tt(e){var t,n,r;t=e.replace(/\n/gim,"").replace(/\r/gim,"").replace(/\t/gim,"").replace(/ /gim," ");n=[/\<span(|\s+.*?)><span(|\s+.*?)>(.*?)<\/span><\/span>/gim,/<(\w*[^p])\s*[^\/>]*>\s*<\/\1>/gim,/\<div(|\s+.*?)>(.*?)\<\/div>/gim,/\<strong(|\s+.*?)>(.*?)\<\/strong>/gim,/\<em(|\s+.*?)>(.*?)\<\/em>/gim];r=["<span$2>$3</span>","","<p$1>$2</p>","<b$1>$2</b>","<i$1>$2</i>"];for(A=0;A<5;A++){for(var i=0;i<n.length;i++){t=t.replace(n[i],r[i])}}if(!u.p)t=t.replace(/\<p(|\s+.*?)>(.*?)\<\/p>/ig,"<br/>$2");if(!u.br){n=[/\<br>(.*?)/ig,/\<br\/>(.*?)/ig];r=["<p>$1</p>","<p>$1</p>"];for(var i=0;i<n.length;i++){t=t.replace(n[i],r[i])}}if(!u.p&&!u.br)t=t.replace(/\<p>(.*?)\<\/p>/ig,"<div>$1</div>");return t}function nt(){var e=v.text()==""&&v.html().length<12?"":v.html();l.val(tt(e))}function rt(){v.html(tt(l.val()))}function it(t){var n=false,r=I(),i;if(r){e.each(t,function(t,s){i=r.prop("tagName").toLowerCase();if(i==s)n=true;else{r.parents().each(function(){i=e(this).prop("tagName").toLowerCase();if(i==s)n=true})}});return n}else return false}function st(t){for(var n=0;n<f.length;n++){if(u[f[n].name]&&f[n].emphasis&&f[n].tag!="")it(f[n].tag)?p.find("."+u.css+"_tool_"+f[n].cls).addClass(m):e("."+u.css+"_tool_"+f[n].cls).removeClass(m)}if(u.format&&e.isArray(u.formats)){var r=false;for(var i=0;i<u.formats.length;i++){var s=[];s[0]=u.formats[i][0];if(u.formats[i][0].length>0&&it(s)){et(u.formats[i][1]);r=true;break}}if(!r)et(u.formats[0][1])}K("",false);Z(false)}if(!e(this).data("veditor")||e(this).data("veditor")==null||e(this).data("veditor")=="undefined")e(this).data("veditor",true);else e(this).data("veditor",false);if(!u.status||!e(this).data("veditor")){if(e(this).closest("."+u.css).length>0){var t=e(this).closest("."+u.css).find("."+u.css+"_editor").html();var n="";e(e(this)[0].attributes).each(function(){if(this.nodeName!="style")n=n+" "+this.nodeName+'="'+this.nodeValue+'"'});var r=e(this).is("[data-origin]")&&e(this).attr("data-origin")!=""?e(this).attr("data-origin"):"textarea";var i=">"+t;if(r=="input"||r=="option"){t=t.replace(/"/g,"&#34;").replace(/'/g,"&#39;").replace(/</g,"<").replace(/>/g,">");i='value="'+t+'">'}var o=e(this).clone();e(this).data("veditor",false).closest("."+u.css).before(o).remove();o.replaceWith("<"+r+n+i+"</"+r+">")}return}var l=e(this);var r=e(this).prop("tagName").toLowerCase();e(this).attr("data-origin",r);var c=e(this).is("[value]")||r=="textarea"?e(this).val():e(this).html();c=c.replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/</g,"<").replace(/>/g,">").replace(/&/g,"&");e(this).after('<div class="'+u.css+'"></div>');var h=e(this).next("."+u.css);h.html('<div class="'+u.css+"_toolbar"+'" role="toolbar" unselectable></div><div class="'+u.css+'_linkform" style="display:none" role="dialog"></div><div class="'+u.css+"_editor"+'"></div>');var p=h.find("."+u.css+"_toolbar");var d=h.find("."+u.css+"_linkform");var v=h.find("."+u.css+"_editor");var m=u.css+"_tool_depressed";d.append('<div class="'+u.css+'_linktypeselect" unselectable></div><input class="'+u.css+'_linkinput" type="text/css" value=""><div class="'+u.css+'_linkbutton" unselectable>'+u.button+'</div> <div style="height:1px;float:none;clear:both"></div>');var g=d.find("."+u.css+"_linktypeselect");var y=d.find("."+u.css+"_linkinput");var b=d.find("."+u.css+"_linkbutton");g.append('<div class="'+u.css+'_linktypeview" unselectable></div><div class="'+u.css+'_linktypes" role="menu" unselectable></div>');var w=g.find("."+u.css+"_linktypes");var E=g.find("."+u.css+"_linktypeview");var S=u.css+"-setlink";v.after('<div class="'+u.css+"_source "+u.css+'_hiddenField"></div>');var x=h.find("."+u.css+"_source");l.appendTo(x);if(r!="textarea"){var n="";e(l[0].attributes).each(function(){if(this.nodeName!="type"&&this.nodeName!="value")n=n+" "+this.nodeName+'="'+this.nodeValue+'"'});l.replaceWith("<textarea "+n+">"+c+"</textarea>");l=x.find("textarea")}v.attr("contenteditable","true").html(c);for(var T=0;T<f.length;T++){if(u[f[T].name]){var N=f[T].key.length>0?u.titletext[T].hotkey!=null&&u.titletext[T].hotkey!="undefined"&&u.titletext[T].hotkey!=""?" (Ctrl+"+u.titletext[T].hotkey+")":"":"";var C=u.titletext[T].title!=null&&u.titletext[T].title!="undefined"&&u.titletext[T].title!=""?u.titletext[T].title+N:"";p.append('<div class="'+u.css+"_tool "+u.css+"_tool_"+f[T].cls+'" role="button" data-tool="'+T+'" unselectable><a class="'+u.css+'_tool_icon" unselectable></a></div>');p.find("."+u.css+"_tool[data-tool="+T+"]").data({tag:f[T].tag,command:f[T].command,emphasis:f[T].emphasis,title:C});if(f[T].name=="format"&&e.isArray(u.formats)){var k=u.formats[0][1].length>0&&u.formats[0][1]!="undefined"?u.formats[0][1]:"";p.find("."+u.css+"_tool_"+f[T].cls).find("."+u.css+"_tool_icon").replaceWith('<a class="'+u.css+'_tool_label" unselectable><span class="'+u.css+'_tool_text" unselectable>'+k+'</span><span class="'+u.css+'_tool_icon" unselectable></span></a>');p.find("."+u.css+"_tool_"+f[T].cls).append('<div class="'+u.css+'_formats" unselectable></div>');for(var L=0;L<u.formats.length;L++){p.find("."+u.css+"_formats").append("<a "+u.css+'-formatval="'+u.formats[L][0]+'" class="'+u.css+"_format"+" "+u.css+"_format_"+L+'" role="menuitem" unselectable>'+u.formats[L][1]+"</a>")}p.find("."+u.css+"_formats").data("status",false)}else if(f[T].name=="fsize"&&e.isArray(u.fsizes)){p.find("."+u.css+"_tool_"+f[T].cls).append('<div class="'+u.css+'_fontsizes" unselectable></div>');for(var L=0;L<u.fsizes.length;L++){p.find("."+u.css+"_fontsizes").append("<a "+u.css+'-styleval="'+u.fsizes[L]+'" class="'+u.css+"_fontsize"+'" style="font-size:'+u.fsizes[L]+u.funit+'" role="menuitem" unselectable>Abcdefgh...</a>')}}else if(f[T].name=="color"&&e.isArray(s)){p.find("."+u.css+"_tool_"+f[T].cls).append('<div class="'+u.css+'_cpalette" unselectable></div>');for(var A=0;A<s.length;A++){if(s[A]!=null)p.find("."+u.css+"_cpalette").append("<a "+u.css+'-styleval="'+s[A]+'" class="'+u.css+"_color"+'" style="background-color: rgb('+s[A]+')" role="gridcell" unselectable></a>');else p.find("."+u.css+"_cpalette").append('<div class="'+u.css+"_colorSeperator"+'"></div>')}}}}w.data("linktype","0");for(var T=0;T<3;T++){w.append("<a "+u.css+'-linktype="'+T+'" unselectable>'+u.linktypes[T]+"</a>");E.html('<div class="'+u.css+'_linktypearrow" unselectable></div><div class="'+u.css+'_linktypetext">'+w.find("a:eq("+w.data("linktype")+")").text()+"</div>")}var O="";if(/msie/.test(a))O="-ms-";else if(/chrome/.test(a)||/safari/.test(a)||/yandex/.test(a))O="-webkit-";else if(/mozilla/.test(a))O="-moz-";else if(/opera/.test(a))O="-o-";else if(/konqueror/.test(a))O="-khtml-";else O="";if(u.placeholder&&u.placeholder!=""){h.prepend('<div class="'+u.css+'_placeholder" unselectable><div class="'+u.css+'_placeholder_text">'+u.placeholder+"</div></div>");var M=h.find("."+u.css+"_placeholder");M.click(function(){v.focus()})}h.find("[unselectable]").css(O+"user-select","none").addClass("unselectable").attr("unselectable","on").on("selectstart mousedown",false);var _=p.find("."+u.css+"_tool");var D=p.find("."+u.css+"_formats");var P=p.find("."+u.css+"_fontsizes");var H=p.find("."+u.css+"_cpalette");var I=function(){var t,n;if(window.getSelection){n=getSelection();t=n.anchorNode}if(!t&&document.selection&&document.selection.createRange&&document.selection.type!="None"){n=document.selection;var r=n.getRangeAt?n.getRangeAt(0):n.createRange();t=r.commonAncestorContainer?r.commonAncestorContainer:r.parentElement?r.parentElement():r.item(0)}if(t){return t.nodeName=="#text"?e(t.parentNode):e(t)}else return false};_.unbind("click").click(function(t){if(e(this).data("command")=="displaysource"&&!p.data("sourceOpened")){p.find("."+u.css+"_tool").addClass(u.css+"_hiddenField");e(this).removeClass(u.css+"_hiddenField");p.data("sourceOpened",true);l.css("height",v.outerHeight());x.removeClass(u.css+"_hiddenField");v.addClass(u.css+"_hiddenField");l.focus();W(false);K("",false);Z();if(u.placeholder&&u.placeholder!="")M.hide()}else{if(!p.data("sourceOpened")){if(e(this).data("command")=="linkcreator"){if(!p.data("linkOpened"))U();else{W(false);Z(false)}}else if(e(this).data("command")=="formats"){if(e(this).data("command")=="formats"&&!e(t.target).hasClass(u.css+"_format"))Y();K("",false);if(v.not(":focus"))v.focus()}else if(e(this).data("command")=="fSize"||e(this).data("command")=="colors"){if(e(this).data("command")=="fSize"&&!e(t.target).hasClass(u.css+"_fontsize")||e(this).data("command")=="colors"&&!e(t.target).hasClass(u.css+"_color"))J(e(this).data("command"));Z(false);if(v.not(":focus"))v.focus()}else{if(v.not(":focus"))v.focus();j(e(this).data("command"),null);K("",false);Z(false);X();e(this).data("emphasis")==true&&!e(this).hasClass(m)?e(this).addClass(m):e(this).removeClass(m);x.addClass(u.css+"_hiddenField");v.removeClass(u.css+"_hiddenField")}}else{p.data("sourceOpened",false);p.find("."+u.css+"_tool").removeClass(u.css+"_hiddenField");x.addClass(u.css+"_hiddenField");v.removeClass(u.css+"_hiddenField")}if(u.placeholder&&u.placeholder!="")v.html()!=""?M.hide():M.show()}v.trigger("change")}).hover(function(t){if(u.title&&e(this).data("title")!=""&&(e(t.target).hasClass(u.css+"_tool")||e(t.target).hasClass(u.css+"_tool_icon"))){e("."+u.css+"_title").remove();h.append('<div class="'+u.css+'_title"><div class="'+u.css+'_titleArrow"><div class="'+u.css+'_titleArrowIcon"></div></div><div class="'+u.css+'_titleText">'+e(this).data("title")+"</div></div>");var n=e("."+u.css+"_title:first");var r=n.find("."+u.css+"_titleArrowIcon");var i=e(this).position();var s=i.left+e(this).outerWidth()-n.outerWidth()/2-e(this).outerWidth()/2;var o=i.top+e(this).outerHeight()+5;n.delay(400).css({top:o,left:s}).fadeIn(200)}},function(){e("."+u.css+"_title").remove()});var ot=null;v.bind("keypress keyup keydown drop cut copy paste DOMCharacterDataModified DOMSubtreeModified",function(){if(!p.data("sourceOpened"))e(this).trigger("change");X();if(e.isFunction(u.change))u.change();if(u.placeholder&&u.placeholder!="")e(this).text()!=""?M.hide():M.show()}).bind("change",function(){if(!p.data("sourceOpened")){clearTimeout(ot);ot=setTimeout(nt,10)}}).keydown(function(e){if(e.ctrlKey){for(var t=0;t<f.length;t++){if(u[f[t].name]&&e.keyCode==f[t].key.charCodeAt(0)){if(f[t].command!=""&&f[t].command!="linkcreator")j(f[t].command,null);else if(f[t].command=="linkcreator")U();return false}}}}).bind("mouseup keyup",st).focus(function(){if(e.isFunction(u.focus))u.focus();h.addClass(u.css+"_focused");if(/opera/.test(a)){var t=document.createRange();t.selectNodeContents(v[0]);t.collapse(false);var n=window.getSelection();n.removeAllRanges();n.addRange(t)}}).focusout(function(){_.removeClass(m);K("",false);Z(false);X();if(e.isFunction(u.blur))u.blur();h.removeClass(u.css+"_focused");if(e.isArray(u.formats))et(u.formats[0][1])});l.bind("keydown keyup",function(){setTimeout(rt,0);e(this).height(e(this)[0].scrollHeight);if(e(this).val()=="")e(this).height(0)}).focus(function(){h.addClass(u.css+"_focused")}).focusout(function(){h.removeClass(u.css+"_focused")})})}})(jQuery);
//# sourceMappingURL=jquery.jgrowl.map

/*!
 * Project: Bootstrap Hover Dropdown
 * Author: Cameron Spear
 * Contributors: Mattia Larentis
 *
 * Dependencies: Bootstrap's Dropdown plugin, jQuery
 *
 * A simple plugin to enable Bootstrap dropdowns to active on hover and provide a nice user experience.
 *
 * License: MIT
 *
 * http://cameronspear.com/blog/bootstrap-dropdown-on-hover-plugin/
 */
(function(b,a,c){var d=b();b.fn.dropdownHover=function(e){if("ontouchstart" in document){return this}d=d.add(this.parent());return this.each(function(){var m=b(this),l=m.parent(),k={delay:500,instantlyCloseOthers:true},i={delay:b(this).data("delay"),instantlyCloseOthers:b(this).data("close-others")},f="show.bs.dropdown",j="hide.bs.dropdown",g=b.extend(true,{},k,e,i),h;l.hover(function(n){if(!l.hasClass("open")&&!m.is(n.target)){return true}d.find(":focus").blur();if(g.instantlyCloseOthers===true){d.removeClass("open")}a.clearTimeout(h);l.addClass("open");m.trigger(f)},function(){h=a.setTimeout(function(){l.removeClass("open");m.trigger(j)},g.delay)});m.hover(function(){d.find(":focus").blur();if(g.instantlyCloseOthers===true){d.removeClass("open")}a.clearTimeout(h);l.addClass("open");m.trigger(f)});l.find(".dropdown-submenu").each(function(){var o=b(this);var n;o.hover(function(){a.clearTimeout(n);o.children(".dropdown-menu").show();o.siblings().children(".dropdown-menu").hide()},function(){var p=o.children(".dropdown-menu");n=a.setTimeout(function(){p.hide()},g.delay)})})})};b(document).ready(function(){b('[data-hover="dropdown"]').dropdownHover()})})(jQuery,this);

//Object.keys polyfill
if (!Object.keys) Object.keys = function(o) {
  if (o !== Object(o))
    throw new TypeError('Object.keys called on a non-object');
  var k=[],p;
  for (p in o) if (o.hasOwnProperty(p)) k.push(p);
  return k;
}

//formatfilesize
function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
        return 'nope';
    }
    if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB';
    }
    if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(2) + ' KB';
}

function loadstyle(value, callback) {

    if ($.inArray(value.id, scrloaded) === -1) {
        yepnope.injectCss(value.src, function() {
            if (callback)
                callback.call();

            scrloaded.push(value.id);
        }, {//stylesheet attributes ie => media: "print"
            id: value.id
        }, 30000);
    } else {
        if (callback)
            callback.call();
    }
}

function loadscript(value, vcallback) {
    callback = (vcallback && typeof vcallback !== 'undefined') ? vcallback : false;
    if ($.inArray(value.id, scrloaded) === -1) {
        yepnope.injectJs(value.src, function() {
            setTimeout(function() {
                if (callback) {
                    callback.call();
                }
            }, 500);//be sure its loaded...for bad timings!
            scrloaded.push(value.id);
        }, {
            charset: "utf-8",
            id: value.id
        }, 30000);
    } else { //dont load script again on folder changes ie... a smart way...
        if (callback) {
            callback.call();
        }
    }
}

//convert images to canvas objects. Required image as an jQuery object
function ImageToCanvas(url, w, h) {
    
    var imageObj = new Image();
    imageObj.src = url;
    
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = parseInt(w);
    canvas.height = parseInt(h);
    var cx = ((imageObj.width-w)/2)*-1,
            cy = ((imageObj.height-h)/2)*-1;
    
    console.log(cx,cy)
    imageObj.onload = function() {
        context.drawImage(imageObj, cx, cy);
    };
    return canvas;
}
//return responsive preview image obj
function responsiveImagePreview(img, w, h) {
    return $(img).css({'position': 'absolute', 'left': 2, 'bottom': 2});

    //return $cont;
}

//copy all attributes
function copyattributes(source, target) {
    var attributes = $(source).prop("attributes");
    $.each(attributes, function() {
        $(target).attr(this.name, this.value);
    });
}

//return css styles of an element
function cssme(a) {
    var o = {};
    var rules = window.getMatchedCSSRules(a.get(0));
    for (var r in rules) {
        o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
    }
    return o;
}
function css2jsonme(css) {
    var s = {};
    if (!css)
        return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    }
    else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
        ;
    }
    return s;
}
/*
* jQuery File Download Plugin v1.4.2 
*
* http://www.johnculviner.com
*
* Copyright (c) 2013 - John Culviner
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* !!!!NOTE!!!!
* You must also write a cookie in conjunction with using this plugin as mentioned in the orignal post:
* http://johnculviner.com/jquery-file-download-plugin-for-ajax-like-feature-rich-file-downloads/
* !!!!NOTE!!!!
*/

(function($, window){
	// i'll just put them here to get evaluated on script load
	var htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
	var htmlSpecialCharsPlaceHolders = {
				'<': 'lt;',
				'>': 'gt;',
				'&': 'amp;',
				'\r': "#13;",
				'\n': "#10;",
				'"': 'quot;',
				"'": 'apos;' /*single quotes just to be safe*/
	};

$.extend({
    //
    //$.fileDownload('/path/to/url/', options)
    //  see directly below for possible 'options'
    fileDownload: function (fileUrl, options) {

        //provide some reasonable defaults to any unspecified options below
        var settings = $.extend({

            //
            //Requires jQuery UI: provide a message to display to the user when the file download is being prepared before the browser's dialog appears
            //
            preparingMessageHtml: null,

            //
            //Requires jQuery UI: provide a message to display to the user when a file download fails
            //
            failMessageHtml: null,

            //
            //the stock android browser straight up doesn't support file downloads initiated by a non GET: http://code.google.com/p/android/issues/detail?id=1780
            //specify a message here to display if a user tries with an android browser
            //if jQuery UI is installed this will be a dialog, otherwise it will be an alert
            //
            androidPostUnsupportedMessageHtml: "Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.",

            //
            //Requires jQuery UI: options to pass into jQuery UI Dialog
            //
            dialogOptions: { modal: true },

            //
            //a function to call while the dowload is being prepared before the browser's dialog appears
            //Args:
            //  url - the original url attempted
            //
            prepareCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  url - the original url attempted
            //
            successCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  responseHtml    - the html that came back in response to the file download. this won't necessarily come back depending on the browser.
            //                      in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
            //                      server's error message with a "helpful" IE built in message
            //  url             - the original url attempted
            //
            failCallback: function (responseHtml, url) { },

            //
            // the HTTP method to use. Defaults to "GET".
            //
            httpMethod: "GET",

            //
            // if specified will perform a "httpMethod" request to the specified 'fileUrl' using the specified data.
            // data must be an object (which will be $.param serialized) or already a key=value param string
            //
            data: null,

            //
            //a period in milliseconds to poll to determine if a successful file download has occured or not
            //
            checkInterval: 100,

            //
            //the cookie name to indicate if a file download has occured
            //
            cookieName: "CLO_OCT",

            //
            //the cookie value for the above name to indicate that a file download has occured
            //
            cookieValue: "true",

            //
            //the cookie path for above name value pair
            //
            cookiePath: "/",

            //
            //the title for the popup second window as a download is processing in the case of a mobile browser
            //
            popupWindowTitle: "Initiating file download...",

            //
            //Functionality to encode HTML entities for a POST, need this if data is an object with properties whose values contains strings with quotation marks.
            //HTML entity encoding is done by replacing all &,<,>,',",\r,\n characters.
            //Note that some browsers will POST the string htmlentity-encoded whilst others will decode it before POSTing.
            //It is recommended that on the server, htmlentity decoding is done irrespective.
            //
            encodeHTMLEntities: true
            
        }, options);

        var deferred = new $.Deferred();

        //Setup mobile browser detection: Partial credit: http://detectmobilebrowser.com/
        var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

        var isIos;                  //has full support of features in iOS 4.0+, uses a new window to accomplish this.
        var isAndroid;              //has full support of GET features in 4.0+ by using a new window. Non-GET is completely unsupported by the browser. See above for specifying a message.
        var isOtherMobileBrowser;   //there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

        if (/ip(ad|hone|od)/.test(userAgent)) {

            isIos = true;

        } else if (userAgent.indexOf('android') !== -1) {

            isAndroid = true;

        } else {

            isOtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

        }

        var httpMethodUpper = settings.httpMethod.toUpperCase();

        if (isAndroid && httpMethodUpper !== "GET") {
            //the stock android browser straight up doesn't support file downloads initiated by non GET requests: http://code.google.com/p/android/issues/detail?id=1780

            if ($().dialog) {
                $("<div>").html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);
            } else {
                alert(settings.androidPostUnsupportedMessageHtml);
            }

            return deferred.reject();
        }

        var $preparingDialog = null;

        var internalCallbacks = {

            onPrepare: function (url) {

                //wire up a jquery dialog to display the preparing message if specified
                if (settings.preparingMessageHtml) {

                    $preparingDialog = $("<div>").html(settings.preparingMessageHtml).dialog(settings.dialogOptions);

                } else if (settings.prepareCallback) {

                    settings.prepareCallback(url);

                }

            },

            onSuccess: function (url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                };

                settings.successCallback(url);

                deferred.resolve(url);
            },

            onFail: function (responseHtml, url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                };

                //wire up a jquery dialog to display the fail message if specified
                if (settings.failMessageHtml) {
                    $("<div>").html(settings.failMessageHtml).dialog(settings.dialogOptions);
                }

                settings.failCallback(responseHtml, url);
                
                deferred.reject(responseHtml, url);
            }
        };

        internalCallbacks.onPrepare(fileUrl);

        //make settings.data a param string if it exists and isn't already
        if (settings.data !== null && typeof settings.data !== "string") {
            settings.data = $.param(settings.data);
        }


        var $iframe,
            downloadWindow,
            formDoc,
            $form;

        if (httpMethodUpper === "GET") {

            if (settings.data !== null) {
                //need to merge any fileUrl params with the data object

                var qsStart = fileUrl.indexOf('?');

                if (qsStart !== -1) {
                    //we have a querystring in the url

                    if (fileUrl.substring(fileUrl.length - 1) !== "&") {
                        fileUrl = fileUrl + "&";
                    }
                } else {

                    fileUrl = fileUrl + "?";
                }

                fileUrl = fileUrl + settings.data;
            }

            if (isIos || isAndroid) {

                downloadWindow = window.open(fileUrl);
                downloadWindow.document.title = settings.popupWindowTitle;
                window.focus();

            } else if (isOtherMobileBrowser) {

                window.location(fileUrl);

            } else {

                //create a temporary iframe that is used to request the fileUrl as a GET request
                $iframe = $("<iframe>")
                    .hide()
                    .prop("src", fileUrl)
                    .appendTo("body");
            }

        } else {

            var formInnerHtml = "";

            if (settings.data !== null) {

                $.each(settings.data.replace(/\+/g, ' ').split("&"), function () {

                    var kvp = this.split("=");

                    var key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
                    if (key) {
                        var value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);
                    formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '" />';
                    }
                });
            }

            if (isOtherMobileBrowser) {

                $form = $("<form>").appendTo("body");
                $form.hide()
                    .prop('method', settings.httpMethod)
                    .prop('action', fileUrl)
                    .html(formInnerHtml);

            } else {

                if (isIos) {

                    downloadWindow = window.open("about:blank");
                    downloadWindow.document.title = settings.popupWindowTitle;
                    formDoc = downloadWindow.document;
                    window.focus();

                } else {

                    $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");
                    formDoc = getiframeDocument($iframe);
                }

                formDoc.write("<html><head></head><body><form method='" + settings.httpMethod + "' action='" + fileUrl + "'>" + formInnerHtml + "</form>" + settings.popupWindowTitle + "</body></html>");
                $form = $(formDoc).find('form');
            }

            $form.submit();
        }


        //check if the file download has completed every checkInterval ms
        setTimeout(checkFileDownloadComplete, settings.checkInterval);


        function checkFileDownloadComplete() {

            //has the cookie been written due to a file download occuring?
            if (document.cookie.indexOf(settings.cookieName + "=" + settings.cookieValue) != -1) {

                //execute specified callback
                internalCallbacks.onSuccess(fileUrl);

                //remove the cookie and iframe
                document.cookie = settings.cookieName + "=; expires=" + new Date(1000).toUTCString() + "; path=" + settings.cookiePath;

                cleanUp(false);

                return;
            }

            //has an error occured?
            //if neither containers exist below then the file download is occuring on the current window
            if (downloadWindow || $iframe) {

                //has an error occured?
                try {

                    var formDoc = downloadWindow ? downloadWindow.document : getiframeDocument($iframe);

                    if (formDoc && formDoc.body != null && formDoc.body.innerHTML.length) {

                        var isFailure = true;

                        if ($form && $form.length) {
                            var $contents = $(formDoc.body).contents().first();

                            try {
                                if ($contents.length && $contents[0] === $form[0]) {
                                    isFailure = false;
                                }
                            } catch (e) {
                                if (e && e.number == -2146828218) {
                                    // IE 8-10 throw a permission denied after the form reloads on the "$contents[0] === $form[0]" comparison
                                    isFailure = true;
                                } else {
                                    throw e;
                                }
                            } 
                        }

                        if (isFailure) {
                            // IE 8-10 don't always have the full content available right away, they need a litle bit to finish
                            setTimeout(function () {
                                internalCallbacks.onFail(formDoc.body.innerHTML, fileUrl);
                                cleanUp(true);
                            }, 100);
                            
                            return;
                        }
                    }
                }
                catch (err) {

                    //500 error less than IE9
                    internalCallbacks.onFail('', fileUrl);

                    cleanUp(true);

                    return;
                }
            }


            //keep checking...
            setTimeout(checkFileDownloadComplete, settings.checkInterval);
        }

        //gets an iframes document in a cross browser compatible manner
        function getiframeDocument($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
        }

        function cleanUp(isFailure) {

            setTimeout(function() {

                if (downloadWindow) {

                    if (isAndroid) {
                        downloadWindow.close();
                    }

                    if (isIos) {
                        if (downloadWindow.focus) {
                            downloadWindow.focus(); //ios safari bug doesn't allow a window to be closed unless it is focused
                            if (isFailure) {
                                downloadWindow.close();
                            }
                        }
                    }
                }
                
                //iframe cleanup appears to randomly cause the download to fail
                //not doing it seems better than failure...
                //if ($iframe) {
                //    $iframe.remove();
                //}

            }, 0);
        }


        function htmlSpecialCharsEntityEncode(str) {
            return str.replace(htmlSpecialCharsRegEx, function(match) {
                return '&' + htmlSpecialCharsPlaceHolders[match];
        	});
        }

        return deferred.promise();
    }
});

})(jQuery, this);

/*
  PHP style date() plugin
  Call in exactly the same way as you do the "date" command in PHP
  e.g. s = $.PHPDate("l, jS F Y", dtDate);

  License:
  PHPDate 1.0 jQuery Plugin

  Copyright (c) 2008 Jon Combe (http://joncom.be)
*/

(function($) {
  var aDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var aMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // main function
  $.pdate = function(sString, dtDate) {
    var sElement = "";
    var sOutput = "";

    // we can cheat with "r"...
    sString = sString.replace(/r/g, "D, j M Y H;i:s O");

    // loop through string
    for (var i = 0; i < sString.length; i++) {
      sElement = sString.charAt(i);
      switch (sElement) {
        case "a": sElement = AMPM(dtDate.getHours()); break;
        case "c":
          sElement = (dtDate.getFullYear() + "-" +
                      AddLeadingZero(dtDate.getMonth()) + "-" +
                      AddLeadingZero(dtDate.getDate()) + "T" +
                      AddLeadingZero(dtDate.getHours()) + ":" +
                      AddLeadingZero(dtDate.getMinutes()) + ":" +
                      AddLeadingZero(dtDate.getSeconds()));
          var sTemp = dtDate.toString().split(" ")[5];
          if (sTemp.indexOf("-") > -1) {
            sElement += sTemp.substr(sTemp.indexOf("-"));
          } else if (sTemp.indexOf("+") > -1) {
            sElement += sTemp.substr(sTemp.indexOf("+"));
          } else {
            sElement += "+0000";
          }
          break;
        case "d": sElement = AddLeadingZero(dtDate.getDate()); break;
        case "g": sElement = TwelveHourClock(dtDate.getHours()); break;
        case "h": sElement = AddLeadingZero(TwelveHourClock(dtDate.getHours())); break;
        case "i": sElement = AddLeadingZero(dtDate.getMinutes()); break;
        case "j": sElement = dtDate.getDate(); break;
        case "l": sElement = aDays[dtDate.getDay()]; break;
        case "m": sElement = AddLeadingZero(dtDate.getMonth() + 1); break;
        case "n": sElement = dtDate.getMonth() + 1; break;
        case "o": (new Date(FirstMonday(dtDate.getFullYear())) > dtDate) ? sElement = (dtDate.getFullYear() - 1) : sElement = dtDate.getFullYear(); break;
        case "s": sElement = AddLeadingZero(dtDate.getSeconds()); break;
        case "t":
          var dtTemp = new Date(dtDate.valueOf());
          dtTemp.setMonth(dtTemp.getMonth() + 1)
          dtTemp.setDate(0);
          sElement = dtTemp.getDate();
          break;
        case "u": sElement = dtDate.getMilliseconds(); break;
        case "w": sElement = dtDate.getDay(); break;
        case "y": sElement = dtDate.getFullYear().toString().substr(2, 2); break;
        case "z":
          var dtFirst = new Date(dtDate.getFullYear(), 0, 1, 0, 0, 0, 0);
          var dtLast = new Date(dtDate.getFullYear(), dtDate.getMonth(), dtDate.getDate(), 0, 0, 0, 0);
          sElement = Math.round((dtLast.valueOf() - dtFirst.valueOf()) / 1000 / 60 / 60/ 24);
          break;
        case "A": sElement = AMPM(dtDate.getHours()).toUpperCase(); break;
        case "B":
          sElement = Math.floor(((dtDate.getHours() * 60 * 60 * 1000) +
          (dtDate.getMinutes() * 60 * 1000) +
          (dtDate.getSeconds() * 1000) +
          (dtDate.getMilliseconds())) / 86400);
          break;
        case "D": sElement = aDays[dtDate.getDay()].substr(0, 3); break;
        case "F": sElement = aMonths[dtDate.getMonth()]; break;
        case "G": sElement = dtDate.getHours(); break;
        case "H": sElement = AddLeadingZero(dtDate.getHours()); break;
        case "I":
          var dtTempFirst = new Date(dtDate.getFullYear(), 0, 1);
          var dtTempLast = new Date(dtDate.getFullYear(), dtDate.getMonth(), dtDate.getDate());
          var iDaysDiff = (dtTempLast.valueOf() - dtTempFirst.valueOf()) / 1000 / 60 / 60 / 24;
          (iDaysDiff == Math.round(iDaysDiff)) ? sElement = 0 : sElement = 1;
          break;
        case "L": ((new Date(dtDate.getFullYear(), 2, 0)).getDate() == 29) ? sElement = 1 : sElement = 0; break;
        case "M": sElement = aMonths[dtDate.getMonth()].substr(0, 3); break;
        case "N": (dtDate.getDay() == 0) ? sElement = 7 : sElement = dtDate.getDay(); break;
        case "O":
          var sTemp = dtDate.toString().split(" ")[5];
          if (sTemp.indexOf("-") > -1) {
            sElement = sTemp.substr(sTemp.indexOf("-"));
          } else if (sTemp.indexOf("+") > -1) {
            sElement = sTemp.substr(sTemp.indexOf("+"));
          } else {
            sElement = "+0000";
          }
          break;
        case "P":
          var sTemp = dtDate.toString().split(" ")[5];
          if (sTemp.indexOf("-") > -1) {
            var aTemp = sTemp.substr(sTemp.indexOf("-") + 1).split("");
            sElement = ("-" + aTemp[0] + aTemp[1] + ":" + aTemp[2] + aTemp[3]);
          } else if (sTemp.indexOf("+") > -1) {
            var aTemp = sTemp.substr(sTemp.indexOf("+") + 1).split("");
            sElement = ("+" + aTemp[0] + aTemp[1] + ":" + aTemp[2] + aTemp[3]);
          } else {
            sElement = "+00:00";
          }
          break;
        case "S": sElement = DateSuffix(dtDate.getDate()); break;
        case "T":
          sElement = dtDate.toString().split(" ")[5];
          if (sElement.indexOf("+") > -1) {
            sElement = sElement.substr(0, sElement.indexOf("+"));
          } else if (sElement.indexOf("-") > -1) {
            sElement = sElement.substr(0, sElement.indexOf("-"));
          }
          break;
        case "U": sElement = Math.floor(dtDate.getTime() / 1000); break;
        case "W":
          var dtTempFirst = new Date(FirstMonday(dtDate.getFullYear()));
          var dtTempLast = new Date(dtDate.getFullYear(), dtDate.getMonth(), dtDate.getDate());
          sElement = Math.ceil(Math.round((dtTempLast.valueOf() - dtTempFirst.valueOf()) / 1000 / 60 / 60/ 24) / 7);
          break;
        case "Y": sElement = dtDate.getFullYear(); break;
        case "Z":
          (dtDate.getTimezoneOffset() < 0) ? sElement = Math.abs(dtDate.getTimezoneOffset() * 60) : sElement = (0 - (dtDate.getTimezoneOffset() * 60));
          break;
      }
      sOutput += sElement.toString();
      }
    return sOutput;
  }

  // add leading zero
  function AddLeadingZero(iValue) {
    if (iValue < 10) {
      iValue = ("0" + iValue);
    }
    return iValue;
  }

  // Ante meridiem and Post meridiem
  function AMPM(iHours) {
    if (iHours > 11) {
      return "pm";
    } else {
      return "am";
    }
  }

  // date suffix
  function DateSuffix(iDay) {
    var sSuffix = "th";
    switch (parseInt(iDay)) {
      case 1:
      case 21:
      case 31:
        sSuffix = "st";
        break;
      case 2:
      case 22:
        sSuffix = "nd";
        break;
      case 3:
      case 23:
        sSuffix = "rd";
    }
    return sSuffix;
  }

  // find the first Monday in a given year (for ISO 8601 dates)
  function FirstMonday(iYear) {
    var dtTemp = new Date(iYear, 0, 1);
    while (dtTemp.getDay() != 1) {
      dtTemp.setDate(dtTemp.getDate() + 1);
    }
    return dtTemp.valueOf();
  }

  // 12-Hour clock
  function TwelveHourClock(iHours) {
    if (iHours == 0) {
      iHours = 24;
    } else if (iHours > 12) {
      iHours -= 12;
    }
    return iHours;
  }
})(jQuery);
/*!
 * FooTable - Awesome Responsive Tables
 * Version : 2.0.1.4
 * http://fooplugins.com/plugins/footable-jquery/
 *
 * Requires jQuery - http://jquery.com/
 *
 * Copyright 2014 Steven Usher & Brad Vincent
 * Released under the MIT license
 * You are free to use FooTable in commercial projects as long as this copyright header is left intact.
 *
 * Date: 16 Feb 2014
 */
(function(d,a,f){a.footable={options:{delay:100,breakpoints:{phone:480,tablet:1024},parsers:{alpha:function(g){return d(g).data("value")||d.trim(d(g).text())},numeric:function(g){var h=d(g).data("value")||d(g).text().replace(/[^0-9.\-]/g,"");h=parseFloat(h);if(isNaN(h)){h=0}return h}},addRowToggle:true,calculateWidthOverride:null,toggleSelector:" > tbody > tr:not(.footable-row-detail)",columnDataSelector:"> thead > tr:last-child > th, > thead > tr:last-child > td",detailSeparator:":",toggleHTMLElement:"<span />",createGroupedDetail:function(k){var g={_none:{name:null,data:[]}};for(var j=0;j<k.length;j++){var h=k[j].group;if(h!==null){if(!(h in g)){g[h]={name:k[j].groupName||k[j].group,data:[]}}g[h].data.push(k[j])}else{g._none.data.push(k[j])}}return g},createDetail:function(m,l,p,k,h){var g=p(l);for(var o in g){if(g[o].data.length===0){continue}if(o!=="_none"){m.append('<div class="'+h.detailInnerGroup+'">'+g[o].name+"</div>")}for(var i=0;i<g[o].data.length;i++){var n=(g[o].data[i].name)?k:"";m.append('<div class="'+h.detailInnerRow+'"><div class="'+h.detailInnerName+'">'+g[o].data[i].name+n+'</div><div class="'+h.detailInnerValue+'">'+g[o].data[i].display+"</div></div>")}}},classes:{main:"footable",loading:"footable-loading",loaded:"footable-loaded",toggle:"footable-toggle",disabled:"footable-disabled",detail:"footable-row-detail",detailCell:"footable-row-detail-cell",detailInner:"footable-row-detail-inner",detailInnerRow:"footable-row-detail-row",detailInnerGroup:"footable-row-detail-group",detailInnerName:"footable-row-detail-name",detailInnerValue:"footable-row-detail-value",detailShow:"footable-detail-show"},triggers:{initialize:"footable_initialize",resize:"footable_resize",redraw:"footable_redraw",toggleRow:"footable_toggle_row",expandFirstRow:"footable_expand_first_row",expandAll:"footable_expand_all",collapseAll:"footable_collapse_all"},events:{alreadyInitialized:"footable_already_initialized",initializing:"footable_initializing",initialized:"footable_initialized",resizing:"footable_resizing",resized:"footable_resized",redrawn:"footable_redrawn",breakpoint:"footable_breakpoint",columnData:"footable_column_data",rowDetailUpdating:"footable_row_detail_updating",rowDetailUpdated:"footable_row_detail_updated",rowCollapsed:"footable_row_collapsed",rowExpanded:"footable_row_expanded",rowRemoved:"footable_row_removed",reset:"footable_reset"},debug:false,log:null},version:{major:0,minor:5,toString:function(){return a.footable.version.major+"."+a.footable.version.minor},parse:function(g){version=/(\d+)\.?(\d+)?\.?(\d+)?/.exec(g);return{major:parseInt(version[1],10)||0,minor:parseInt(version[2],10)||0,patch:parseInt(version[3],10)||0}}},plugins:{_validate:function(g){if(!d.isFunction(g)){if(a.footable.options.debug===true){console.error('Validation failed, expected type "function", received type "{0}".',typeof g)}return false}var h=new g();if(typeof h.name!=="string"){if(a.footable.options.debug===true){console.error('Validation failed, plugin does not implement a string property called "name".',h)}return false}if(!d.isFunction(h.init)){if(a.footable.options.debug===true){console.error('Validation failed, plugin "'+h.name+'" does not implement a function called "init".',h)}return false}if(a.footable.options.debug===true){console.log('Validation succeeded for plugin "'+h.name+'".',h)}return true},registered:[],register:function(h,g){if(a.footable.plugins._validate(h)){a.footable.plugins.registered.push(h);if(typeof g==="object"){d.extend(true,a.footable.options,g)}}},load:function(g){var h=[],l,j;for(j=0;j<a.footable.plugins.registered.length;j++){try{l=a.footable.plugins.registered[j];h.push(new l(g))}catch(k){if(a.footable.options.debug===true){console.error(k)}}}return h},init:function(g){for(var h=0;h<g.plugins.length;h++){try{g.plugins[h]["init"](g)}catch(j){if(a.footable.options.debug===true){console.error(j)}}}}}};var c=0;d.fn.footable=function(g){g=g||{};var h=d.extend(true,{},a.footable.options,g);return this.each(function(){c++;var i=new e(this,h,c);d(this).data("footable",i)})};function b(){var g=this;g.id=null;g.busy=false;g.start=function(i,h){if(g.busy){return}g.stop();g.id=setTimeout(function(){i();g.id=null;g.busy=false},h);g.busy=true};g.stop=function(){if(g.id!==null){clearTimeout(g.id);g.id=null;g.busy=false}}}function e(n,j,h){var l=this;l.id=h;l.table=n;l.options=j;l.breakpoints=[];l.breakpointNames="";l.columns={};l.plugins=a.footable.plugins.load(l);var i=l.options,p=i.classes,m=i.events,g=i.triggers,k=0;l.timers={resize:new b(),register:function(o){l.timers[o]=new b();return l.timers[o]}};l.init=function(){var r=d(a),q=d(l.table);a.footable.plugins.init(l);if(q.hasClass(p.loaded)){l.raise(m.alreadyInitialized);return}l.raise(m.initializing);q.addClass(p.loading);q.find(i.columnDataSelector).each(function(){var s=l.getColumnData(this);l.columns[s.index]=s});for(var o in i.breakpoints){l.breakpoints.push({name:o,width:i.breakpoints[o]});l.breakpointNames+=(o+" ")}l.breakpoints.sort(function(t,s){return t.width-s.width});q.unbind(g.initialize).bind(g.initialize,function(){q.removeData("footable_info");q.data("breakpoint","");q.trigger(g.resize);q.removeClass(p.loading);q.addClass(p.loaded).addClass(p.main);l.raise(m.initialized)}).unbind(g.redraw).bind(g.redraw,function(){l.redraw()}).unbind(g.resize).bind(g.resize,function(){l.resize()}).unbind(g.expandFirstRow).bind(g.expandFirstRow,function(){q.find(i.toggleSelector).first().not("."+p.detailShow).trigger(g.toggleRow)}).unbind(g.expandAll).bind(g.expandAll,function(){q.find(i.toggleSelector).not("."+p.detailShow).trigger(g.toggleRow)}).unbind(g.collapseAll).bind(g.collapseAll,function(){q.find("."+p.detailShow).trigger(g.toggleRow)});q.trigger(g.initialize);r.bind("resize.footable",function(){l.timers.resize.stop();l.timers.resize.start(function(){l.raise(g.resize)},i.delay)})};l.addRowToggle=function(){if(!i.addRowToggle){return}var r=d(l.table),t=false;r.find("span."+p.toggle).remove();for(var s in l.columns){var q=l.columns[s];if(q.toggle){t=true;var o="> tbody > tr:not(."+p.detail+",."+p.disabled+") > td:nth-child("+(parseInt(q.index,10)+1)+")";r.find(o).not("."+p.detailCell).prepend(d(i.toggleHTMLElement).addClass(p.toggle));return}}if(!t){r.find("> tbody > tr:not(."+p.detail+",."+p.disabled+") > td:first-child").not("."+p.detailCell).prepend(d(i.toggleHTMLElement).addClass(p.toggle))}};l.setColumnClasses=function(){$table=d(l.table);for(var s in l.columns){var q=l.columns[s];if(q.className!==null){var o="",r=true;d.each(q.matches,function(t,u){if(!r){o+=", "}o+="> tbody > tr:not(."+p.detail+") > td:nth-child("+(parseInt(u,10)+1)+")";r=false});$table.find(o).not("."+p.detailCell).addClass(q.className)}}};l.bindToggleSelectors=function(){var o=d(l.table);if(!l.hasAnyBreakpointColumn()){return}o.find(i.toggleSelector).unbind(g.toggleRow).bind(g.toggleRow,function(r){var q=d(this).is("tr")?d(this):d(this).parents("tr:first");l.toggleDetail(q)});o.find(i.toggleSelector).unbind("click.footable").bind("click.footable",function(q){if(o.is(".breakpoint")&&d(q.target).is("td,."+p.toggle)){d(this).trigger(g.toggleRow)}})};l.parse=function(o,q){var r=i.parsers[q.type]||i.parsers.alpha;return r(o)};l.getColumnData=function(q){var C=d(q),x=C.data("hide"),y=C.index();x=x||"";x=jQuery.map(x.split(","),function(D){return jQuery.trim(D)});var w={index:y,hide:{},type:C.data("type")||"alpha",name:C.data("name")||d.trim(C.text()),ignore:C.data("ignore")||false,toggle:C.data("toggle")||false,className:C.data("class")||null,matches:[],names:{},group:C.data("group")||null,groupName:null};if(w.group!==null){var B=d(l.table).find('> thead > tr.footable-group-row > th[data-group="'+w.group+'"], > thead > tr.footable-group-row > td[data-group="'+w.group+'"]').first();w.groupName=l.parse(B,{type:"alpha"})}var r=parseInt(C.prev().attr("colspan")||0,10);k+=r>1?r-1:0;var s=parseInt(C.attr("colspan")||0,10),u=w.index+k;if(s>1){var A=C.data("names");A=A||"";A=A.split(",");for(var v=0;v<s;v++){w.matches.push(v+u);if(v<A.length){w.names[v+u]=A[v]}}}else{w.matches.push(u)}w.hide["default"]=(C.data("hide")==="all")||(d.inArray("default",x)>=0);var t=false;for(var o in i.breakpoints){w.hide[o]=(C.data("hide")==="all")||(d.inArray(o,x)>=0);t=t||w.hide[o]}w.hasBreakpoint=t;var z=l.raise(m.columnData,{column:{data:w,th:q}});return z.column.data};l.getViewportWidth=function(){return window.innerWidth||(document.body?document.body.offsetWidth:0)};l.calculateWidth=function(o,q){if(jQuery.isFunction(i.calculateWidthOverride)){return i.calculateWidthOverride(o,q)}if(q.viewportWidth<q.width){q.width=q.viewportWidth}if(q.parentWidth<q.width){q.width=q.parentWidth}return q};l.hasBreakpointColumn=function(o){for(var q in l.columns){if(l.columns[q].hide[o]){if(l.columns[q].ignore){continue}return true}}return false};l.hasAnyBreakpointColumn=function(){for(var o in l.columns){if(l.columns[o].hasBreakpoint){return true}}return false};l.resize=function(){var x=d(l.table);if(!x.is(":visible")){return}if(!l.hasAnyBreakpointColumn()){return}var q={width:x.width(),viewportWidth:l.getViewportWidth(),parentWidth:x.parent().width()};q=l.calculateWidth(x,q);var s=x.data("footable_info");x.data("footable_info",q);l.raise(m.resizing,{old:s,info:q});if(!s||(s&&s.width&&s.width!==q.width)){var t=null,v;for(var r=0;r<l.breakpoints.length;r++){v=l.breakpoints[r];if(v&&v.width&&q.width<=v.width){t=v;break}}var w=(t===null?"default":t.name),o=l.hasBreakpointColumn(w),u=x.data("breakpoint");x.data("breakpoint",w).removeClass("default breakpoint").removeClass(l.breakpointNames).addClass(w+(o?" breakpoint":""));if(w!==u){x.trigger(g.redraw);l.raise(m.breakpoint,{breakpoint:w,info:q})}}l.raise(m.resized,{old:s,info:q})};l.redraw=function(){l.addRowToggle();l.bindToggleSelectors();l.setColumnClasses();var o=d(l.table),q=o.data("breakpoint"),r=l.hasBreakpointColumn(q);o.find("> tbody > tr:not(."+p.detail+")").data("detail_created",false).end().find("> thead > tr:last-child > th").each(function(){var w=l.columns[d(this).index()],s="",y=true;d.each(w.matches,function(z,A){if(!y){s+=", "}var B=A+1;s+="> tbody > tr:not(."+p.detail+") > td:nth-child("+B+")";s+=", > tfoot > tr:not(."+p.detail+") > td:nth-child("+B+")";s+=", > colgroup > col:nth-child("+B+")";y=false});s+=', > thead > tr[data-group-row="true"] > th[data-group="'+w.group+'"]';var x=o.find(s).add(this);if(q!==""){if(w.hide[q]===false){x.addClass("footable-visible").show()}else{x.removeClass("footable-visible").hide()}}if(o.find("> thead > tr.footable-group-row").length===1){var u=o.find('> thead > tr:last-child > th[data-group="'+w.group+'"]:visible, > thead > tr:last-child > th[data-group="'+w.group+'"]:visible'),v=o.find('> thead > tr.footable-group-row > th[data-group="'+w.group+'"], > thead > tr.footable-group-row > td[data-group="'+w.group+'"]'),t=0;d.each(u,function(){t+=parseInt(d(this).attr("colspan")||1,10)});if(t>0){v.attr("colspan",t).show()}else{v.hide()}}}).end().find("> tbody > tr."+p.detailShow).each(function(){l.createOrUpdateDetailRow(this)});o.find("> tbody > tr."+p.detailShow+":visible").each(function(){var s=d(this).next();if(s.hasClass(p.detail)){if(!r){s.hide()}else{s.show()}}});o.find("> thead > tr > th.footable-last-column, > tbody > tr > td.footable-last-column").removeClass("footable-last-column");o.find("> thead > tr > th.footable-first-column, > tbody > tr > td.footable-first-column").removeClass("footable-first-column");o.find("> thead > tr, > tbody > tr").find("> th.footable-visible:last, > td.footable-visible:last").addClass("footable-last-column").end().find("> th.footable-visible:first, > td.footable-visible:first").addClass("footable-first-column");l.raise(m.redrawn)};l.toggleDetail=function(r){var o=(r.jquery)?r:d(r),q=o.next();if(o.hasClass(p.detailShow)){o.removeClass(p.detailShow);if(q.hasClass(p.detail)){q.hide()}l.raise(m.rowCollapsed,{row:o[0]})}else{l.createOrUpdateDetailRow(o[0]);o.addClass(p.detailShow).next().show();l.raise(m.rowExpanded,{row:o[0]})}};l.removeRow=function(r){var o=(r.jquery)?r:d(r);if(o.hasClass(p.detail)){o=o.prev()}var q=o.next();if(o.data("detail_created")===true){q.remove()}o.remove();l.raise(m.rowRemoved)};l.appendRow=function(q){var o=(q.jquery)?q:d(q);d(l.table).find("tbody").append(o);l.redraw()};l.getColumnFromTdIndex=function(q){var o=null;for(var r in l.columns){if(d.inArray(q,l.columns[r].matches)>=0){o=l.columns[r];break}}return o};l.createOrUpdateDetailRow=function(v){var o=d(v),q=o.next(),t,r=[];if(o.data("detail_created")===true){return true}if(o.is(":hidden")){return false}l.raise(m.rowDetailUpdating,{row:o,detail:q});o.find("> td:hidden").each(function(){var x=d(this).index(),y=l.getColumnFromTdIndex(x),w=y.name;if(y.ignore===true){return true}if(x in y.names){w=y.names[x]}r.push({name:w,value:l.parse(this,y),display:d.trim(d(this).html()),group:y.group,groupName:y.groupName});return true});if(r.length===0){return false}var u=o.find("> td:visible").length;var s=q.hasClass(p.detail);if(!s){q=d('<tr class="'+p.detail+'"><td class="'+p.detailCell+'"><div class="'+p.detailInner+'"></div></td></tr>');o.after(q)}q.find("> td:first").attr("colspan",u);t=q.find("."+p.detailInner).empty();i.createDetail(t,r,i.createGroupedDetail,i.detailSeparator,p);o.data("detail_created",true);l.raise(m.rowDetailUpdated,{row:o,detail:q});return !s};l.raise=function(o,q){if(l.options.debug===true&&d.isFunction(l.options.log)){l.options.log(o,"event")}q=q||{};var r={ft:l};d.extend(true,r,q);var s=d.Event(o,r);if(!s.ft){d.extend(true,s,r)}d(l.table).trigger(s);return s};l.reset=function(){var o=d(l.table);o.removeData("footable_info").data("breakpoint","").removeClass(p.loading).removeClass(p.loaded);o.find(i.toggleSelector).unbind(g.toggleRow).unbind("click.footable");o.find("> tbody > tr").removeClass(p.detailShow);o.find("> tbody > tr."+p.detail).remove();l.raise(m.reset)};l.init();return l}})(jQuery,window);(function(c,a,f){if(a.footable===f||a.footable===null){throw new Error("Please check and make sure footable.js is included in the page and is loaded prior to this script.")}var d={paginate:true,pageSize:10,pageNavigation:".pagination",firstText:"&laquo;",previousText:"&lsaquo;",nextText:"&rsaquo;",lastText:"&raquo;",limitNavigation:0,limitPreviousText:"...",limitNextText:"..."};function b(i){var g=c(i.table),h=g.data();this.pageNavigation=h.pageNavigation||i.options.pageNavigation;this.pageSize=h.pageSize||i.options.pageSize;this.firstText=h.firstText||i.options.firstText;this.previousText=h.previousText||i.options.previousText;this.nextText=h.nextText||i.options.nextText;this.lastText=h.lastText||i.options.lastText;this.limitNavigation=parseInt(h.limitNavigation||i.options.limitNavigation||d.limitNavigation,10);this.limitPreviousText=h.limitPreviousText||i.options.limitPreviousText;this.limitNextText=h.limitNextText||i.options.limitNextText;this.limit=this.limitNavigation>0;this.currentPage=h.currentPage||0;this.pages=[];this.control=false}function e(){var g=this;g.name="Footable Paginate";g.init=function(h){if(h.options.paginate===true){if(c(h.table).data("page")===false){return}g.footable=h;c(h.table).unbind(".paging").bind({"footable_initialized.paging footable_row_removed.paging footable_redrawn.paging footable_sorted.paging footable_filtered.paging":function(){g.setupPaging()}}).data("footable-paging",g)}};g.setupPaging=function(){var i=g.footable,h=c(i.table).find("> tbody");i.pageInfo=new b(i);g.createPages(i,h);g.createNavigation(i,h);g.fillPage(i,h,i.pageInfo.currentPage)};g.createPages=function(o,j){var h=1;var n=o.pageInfo;var i=h*n.pageSize;var m=[];var l=[];n.pages=[];var k=j.find("> tr:not(.footable-filtered,.footable-row-detail)");k.each(function(p,q){m.push(q);if(p===i-1){n.pages.push(m);h++;i=h*n.pageSize;m=[]}else{if(p>=k.length-(k.length%n.pageSize)){l.push(q)}}});if(l.length>0){n.pages.push(l)}if(n.currentPage>=n.pages.length){n.currentPage=n.pages.length-1}if(n.currentPage<0){n.currentPage=0}if(n.pages.length===1){c(o.table).addClass("no-paging")}else{c(o.table).removeClass("no-paging")}};g.createNavigation=function(k,i){var h=c(k.table).find(k.pageInfo.pageNavigation);if(h.length===0){h=c(k.pageInfo.pageNavigation);if(h.parents("table:first").length>0&&h.parents("table:first")!==c(k.table)){return}if(h.length>1&&k.options.debug===true){console.error("More than one pagination control was found!")}}if(h.length===0){return}if(!h.is("ul")){if(h.find("ul:first").length===0){h.append("<ul />")}h=h.find("ul")}h.find("li").remove();var j=k.pageInfo;j.control=h;if(j.pages.length>0){h.append('<li class="footable-page-arrow"><a data-page="first" href="#first">'+k.pageInfo.firstText+"</a>");h.append('<li class="footable-page-arrow"><a data-page="prev" href="#prev">'+k.pageInfo.previousText+"</a></li>");if(j.limit){h.append('<li class="footable-page-arrow"><a data-page="limit-prev" href="#limit-prev">'+k.pageInfo.limitPreviousText+"</a></li>")}if(!j.limit){c.each(j.pages,function(l,m){if(m.length>0){h.append('<li class="footable-page"><a data-page="'+l+'" href="#">'+(l+1)+"</a></li>")}})}if(j.limit){h.append('<li class="footable-page-arrow"><a data-page="limit-next" href="#limit-next">'+k.pageInfo.limitNextText+"</a></li>");g.createLimited(h,j,0)}h.append('<li class="footable-page-arrow"><a data-page="next" href="#next">'+k.pageInfo.nextText+"</a></li>");h.append('<li class="footable-page-arrow"><a data-page="last" href="#last">'+k.pageInfo.lastText+"</a></li>")}h.off("click","a[data-page]").on("click","a[data-page]",function(o){o.preventDefault();var n=c(this).data("page");var l=j.currentPage;if(n==="first"){l=0}else{if(n==="prev"){if(l>0){l--}}else{if(n==="next"){if(l<j.pages.length-1){l++}}else{if(n==="last"){l=j.pages.length-1}else{if(n==="limit-prev"){l=-1;var p=h.find(".footable-page:first a").data("page");g.createLimited(h,j,p-j.limitNavigation);g.setPagingClasses(h,j.currentPage,j.pages.length)}else{if(n==="limit-next"){l=-1;var m=h.find(".footable-page:last a").data("page");g.createLimited(h,j,m+1);g.setPagingClasses(h,j.currentPage,j.pages.length)}else{l=n}}}}}}if(l>=0){if(j.limit&&j.currentPage!=l){var q=l;while(q%j.limitNavigation!==0){q-=1}g.createLimited(h,j,q)}g.paginate(k,l)}});g.setPagingClasses(h,j.currentPage,j.pages.length)};g.createLimited=function(n,m,o){o=o||0;n.find("li.footable-page").remove();var k,l,j=n.find('li.footable-page-arrow > a[data-page="limit-prev"]').parent(),h=n.find('li.footable-page-arrow > a[data-page="limit-next"]').parent();for(k=m.pages.length-1;k>=0;k--){l=m.pages[k];if(k>=o&&k<o+m.limitNavigation&&l.length>0){j.after('<li class="footable-page"><a data-page="'+k+'" href="#">'+(k+1)+"</a></li>")}}if(o===0){j.hide()}else{j.show()}if(o+m.limitNavigation>=m.pages.length){h.hide()}else{h.show()}};g.paginate=function(l,i){var k=l.pageInfo;if(k.currentPage!==i){var h=c(l.table).find("> tbody");var j=l.raise("footable_paging",{page:i,size:k.pageSize});if(j&&j.result===false){return}g.fillPage(l,h,i);k.control.find("li").removeClass("active disabled");g.setPagingClasses(k.control,k.currentPage,k.pages.length)}};g.setPagingClasses=function(j,i,h){j.find("li.footable-page > a[data-page="+i+"]").parent().addClass("active");if(i>=h-1){j.find('li.footable-page-arrow > a[data-page="next"]').parent().addClass("disabled");j.find('li.footable-page-arrow > a[data-page="last"]').parent().addClass("disabled")}if(i<1){j.find('li.footable-page-arrow > a[data-page="first"]').parent().addClass("disabled");j.find('li.footable-page-arrow > a[data-page="prev"]').parent().addClass("disabled")}};g.fillPage=function(j,i,h){j.pageInfo.currentPage=h;c(j.table).data("currentPage",h);i.find("> tr").hide();c(j.pageInfo.pages[h]).each(function(){g.showRow(this,j)});j.raise("footable_page_filled")};g.showRow=function(k,l){var h=c(k),i=h.next(),j=c(l.table);if(j.hasClass("breakpoint")&&h.hasClass("footable-detail-show")&&i.hasClass("footable-row-detail")){h.add(i).show();l.createOrUpdateDetailRow(k)}else{h.show()}}}a.footable.plugins.register(e,d)})(jQuery,window);(function(c,a,e){if(a.footable===e||a.footable===null){throw new Error("Please check and make sure footable.js is included in the page and is loaded prior to this script.")}var d={filter:{enabled:true,input:".footable-filter",timeout:300,minimum:2,disableEnter:false,filterFunction:function(g){var j=c(this),f=j.parents("table:first"),h=f.data("current-filter").toUpperCase(),i=j.find("td").text();if(!f.data("filter-text-only")){j.find("td[data-value]").each(function(){i+=c(this).data("value")})}return i.toUpperCase().indexOf(h)>=0}}};function b(){var f=this;f.name="Footable Filter";f.init=function(g){f.footable=g;if(g.options.filter.enabled===true){if(c(g.table).data("filter")===false){return}g.timers.register("filter");c(g.table).unbind(".filtering").bind({"footable_initialized.filtering":function(j){var h=c(g.table);var i={input:h.data("filter")||g.options.filter.input,timeout:h.data("filter-timeout")||g.options.filter.timeout,minimum:h.data("filter-minimum")||g.options.filter.minimum,disableEnter:h.data("filter-disable-enter")||g.options.filter.disableEnter};if(i.disableEnter){c(i.input).keypress(function(k){if(window.event){return(window.event.keyCode!==13)}else{return(k.which!==13)}})}h.bind("footable_clear_filter",function(){c(i.input).val("");f.clearFilter()});h.bind("footable_filter",function(l,k){f.filter(k.filter)});c(i.input).keyup(function(k){g.timers.filter.stop();if(k.which===27){c(i.input).val("")}g.timers.filter.start(function(){var l=c(i.input).val()||"";f.filter(l)},i.timeout)})},"footable_redrawn.filtering":function(j){var h=c(g.table),i=h.data("filter-string");if(i){f.filter(i)}}}).data("footable-filter",f)}};f.filter=function(m){var n=f.footable,h=c(n.table),l=h.data("filter-minimum")||n.options.filter.minimum,g=!m;var j=n.raise("footable_filtering",{filter:m,clear:g});if(j&&j.result===false){return}if(j.filter&&j.filter.length<l){return}if(j.clear){f.clearFilter()}else{var i=j.filter.split(" ");h.find("> tbody > tr").hide().addClass("footable-filtered");var k=h.find("> tbody > tr:not(.footable-row-detail)");c.each(i,function(o,p){if(p&&p.length>0){h.data("current-filter",p);k=k.filter(n.options.filter.filterFunction)}});k.each(function(){f.showRow(this,n);c(this).removeClass("footable-filtered")});h.data("filter-string",j.filter);n.raise("footable_filtered",{filter:j.filter,clear:false})}};f.clearFilter=function(){var h=f.footable,g=c(h.table);g.find("> tbody > tr:not(.footable-row-detail)").removeClass("footable-filtered").each(function(){f.showRow(this,h)});g.removeData("filter-string");h.raise("footable_filtered",{clear:true})};f.showRow=function(j,k){var g=c(j),h=g.next(),i=c(k.table);if(g.is(":visible")){return}if(i.hasClass("breakpoint")&&g.hasClass("footable-detail-show")&&h.hasClass("footable-row-detail")){g.add(h).show();k.createOrUpdateDetailRow(j)}else{g.show()}}}a.footable.plugins.register(b,d)})(jQuery,window);

/*!
 * bootstrap-tagfield
 * https://github.com/sliptree/bootstrap-tagfield
 * Copyright 2013-2014 Sliptree and other contributors; Licensed MIT
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // For CommonJS and CommonJS-like environments where a window with jQuery
    // is present, execute the factory with the jQuery instance from the window object
    // For environments that do not inherently posses a window with a document
    // (such as Node.js), expose a Tokenfield-making factory as module.exports
    // This accentuates the need for the creation of a real window or passing in a jQuery instance
    // e.g. require("bootstrap-tagfield")(window); or require("bootstrap-tagfield")($);
    module.exports = global.window && global.window.$ ?
      factory( global.window.$ ) :
      function( input ) {
        if ( !input.$ && !input.fn ) {
          throw new Error( "Tokenfield requires a window object with jQuery or a jQuery instance" );
        }
        return factory( input.$ || input );
      };
  } else {
    // Browser globals
    factory(jQuery, window);
  }
}(function ($, window) {

  "use strict"; // jshint ;_;

 /* TOKENFIELD PUBLIC CLASS DEFINITION
  * ============================== */

  var Tokenfield = function (element, options) {
    var _self = this

    this.$element = $(element)
    this.textDirection = this.$element.css('direction');

    // Extend options
    this.options = $.extend(true, {}, $.fn.tagfield.defaults, { tokens: this.$element.val() }, this.$element.data(), options)

    // Setup delimiters and trigger keys
    this._delimiters = (typeof this.options.delimiter === 'string') ? [this.options.delimiter] : this.options.delimiter
    this._triggerKeys = $.map(this._delimiters, function (delimiter) {
      return delimiter.charCodeAt(0);
    });
    this._firstDelimiter = this._delimiters[0];

    // Check for whitespace, dash and special characters
    var whitespace = $.inArray(' ', this._delimiters)
      , dash = $.inArray('-', this._delimiters)

    if (whitespace >= 0)
      this._delimiters[whitespace] = '\\s'

    if (dash >= 0) {
      delete this._delimiters[dash]
      this._delimiters.unshift('-')
    }

    var specialCharacters = ['\\', '$', '[', '{', '^', '.', '|', '?', '*', '+', '(', ')']
    $.each(this._delimiters, function (index, character) {
      var pos = $.inArray(character, specialCharacters)
      if (pos >= 0) _self._delimiters[index] = '\\' + character;
    });

    // Store original input width
    var elRules = (window && typeof window.getMatchedCSSRules === 'function') ? window.getMatchedCSSRules( element ) : null
      , elStyleWidth = element.style.width
      , elCSSWidth
      , elWidth = this.$element.width()

    if (elRules) {
      $.each( elRules, function (i, rule) {
        if (rule.style.width) {
          elCSSWidth = rule.style.width;
        }
      });
    }

    // Move original input out of the way
    var hidingPosition = $('body').css('direction') === 'rtl' ? 'right' : 'left',
        originalStyles = { position: this.$element.css('position') };
    originalStyles[hidingPosition] = this.$element.css(hidingPosition);

    this.$element
      .data('original-styles', originalStyles)
      .data('original-tabindex', this.$element.prop('tabindex'))
      .css('position', 'absolute')
      .css(hidingPosition, '-10000px')
      .prop('tabindex', -1)

    // Create a wrapper
    this.$wrapper = $('<div class="tagfield form-control" />')
    if (this.$element.hasClass('input-lg')) this.$wrapper.addClass('input-lg')
    if (this.$element.hasClass('input-sm')) this.$wrapper.addClass('input-sm')
    if (this.textDirection === 'rtl') this.$wrapper.addClass('rtl')

    // Create a new input
    var id = this.$element.prop('id') || new Date().getTime() + '' + Math.floor((1 + Math.random()) * 100)
    this.$input = $('<input type="text" class="token-input" autocomplete="off" />')
                    .appendTo( this.$wrapper )
                    .prop( 'placeholder',  this.$element.prop('placeholder') )
                    .prop( 'id', id + '-tagfield' )
                    .prop( 'tabindex', this.$element.data('original-tabindex') )

    // Re-route original input label to new input
    var $label = $( 'label[for="' + this.$element.prop('id') + '"]' )
    if ( $label.length ) {
      $label.prop( 'for', this.$input.prop('id') )
    }

    // Set up a copy helper to handle copy & paste
    this.$copyHelper = $('<input type="text" />').css('position', 'absolute').css(hidingPosition, '-10000px').prop('tabindex', -1).prependTo( this.$wrapper )

    // Set wrapper width
    if (elStyleWidth) {
      this.$wrapper.css('width', elStyleWidth);
    }
    else if (elCSSWidth) {
      this.$wrapper.css('width', elCSSWidth);
    }
    // If input is inside inline-form with no width set, set fixed width
    else if (this.$element.parents('.form-inline').length) {
      this.$wrapper.width( elWidth )
    }

    // Set tagfield disabled, if original or fieldset input is disabled
    if (this.$element.prop('disabled') || this.$element.parents('fieldset[disabled]').length) {
      this.disable();
    }

    // Set tagfield readonly, if original input is readonly
    if (this.$element.prop('readonly')) {
      this.readonly();
    }

    // Set up mirror for input auto-sizing
    this.$mirror = $('<span style="position:absolute; top:-999px; left:0; white-space:pre;"/>');
    this.$input.css('min-width', this.options.minWidth + 'px')
    $.each([
        'fontFamily',
        'fontSize',
        'fontWeight',
        'fontStyle',
        'letterSpacing',
        'textTransform',
        'wordSpacing',
        'textIndent'
    ], function (i, val) {
        _self.$mirror[0].style[val] = _self.$input.css(val);
    });
    this.$mirror.appendTo( 'body' )

    // Insert tagfield to HTML
    this.$wrapper.insertBefore( this.$element )
    this.$element.prependTo( this.$wrapper )

    // Calculate inner input width
    this.update()

    // Create initial tokens, if any
    this.setTokens(this.options.tokens, false, ! this.$element.val() && this.options.tokens )

    // Start listening to events
    this.listen()

    // Initialize autocomplete, if necessary
    if ( ! $.isEmptyObject( this.options.autocomplete ) ) {
      var side = this.textDirection === 'rtl' ? 'right' : 'left'
       ,  autocompleteOptions = $.extend({
            minLength: this.options.showAutocompleteOnFocus ? 0 : null,
            position: { my: side + " top", at: side + " bottom", of: this.$wrapper }
          }, this.options.autocomplete )

      this.$input.autocomplete( autocompleteOptions )
    }

    // Initialize typeahead, if necessary
    if ( ! $.isEmptyObject( this.options.typeahead ) ) {

      var typeaheadOptions = this.options.typeahead
        , defaults = {
            minLength: this.options.showAutocompleteOnFocus ? 0 : null
          }
        , args = $.isArray( typeaheadOptions ) ? typeaheadOptions : [typeaheadOptions, typeaheadOptions]

      args[0] = $.extend( {}, defaults, args[0] )

      this.$input.typeahead.apply( this.$input, args )
      this.typeahead = true
    }
  }

  Tokenfield.prototype = {

    constructor: Tokenfield

  , createToken: function (attrs, triggerChange) {
      var _self = this

      if (typeof attrs === 'string') {
        attrs = { value: attrs, label: attrs }
      } else {
        // Copy objects to prevent contamination of data sources.
        attrs = $.extend( {}, attrs )
      }

      if (typeof triggerChange === 'undefined') {
         triggerChange = true
      }

      // Normalize label and value
      attrs.value = $.trim(attrs.value);
      attrs.label = attrs.label && attrs.label.length ? $.trim(attrs.label) : attrs.value

      // Bail out if has no value or label, or label is too short
      if (!attrs.value.length || !attrs.label.length || attrs.label.length <= this.options.minLength) return

      // Bail out if maximum number of tokens is reached
      if (this.options.limit && this.getTokens().length >= this.options.limit) return

      // Allow changing token data before creating it
      var createEvent = $.Event('tagfield:createtoken', { attrs: attrs })
      this.$element.trigger(createEvent)

      // Bail out if there if attributes are empty or event was defaultPrevented
      if (!createEvent.attrs || createEvent.isDefaultPrevented()) return

      var $token = $('<div class="token" />')
            .append('<span class="opicon">'+(this.options.opicon ? this.options.opicon : '#')+'</span>')
            .append('<span class="token-label" />')
            .append('<a href="#" class="close" tabindex="-1">&times;</a>')
            .data('attrs', attrs)

      // Insert token into HTML
      if (this.$input.hasClass('tt-input')) {
        // If the input has typeahead enabled, insert token before it's parent
        this.$input.parent().before( $token )
      } else {
        this.$input.before( $token )
      }

      // Temporarily set input width to minimum
      this.$input.css('width', this.options.minWidth + 'px')

      var $tokenLabel = $token.find('.token-label')
        , $closeButton = $token.find('.close')

      // Determine maximum possible token label width
      if (!this.maxTokenWidth) {
        this.maxTokenWidth =
          this.$wrapper.width() - $closeButton.outerWidth() -
          parseInt($closeButton.css('margin-left'), 10) -
          parseInt($closeButton.css('margin-right'), 10) -
          parseInt($token.css('border-left-width'), 10) -
          parseInt($token.css('border-right-width'), 10) -
          parseInt($token.css('padding-left'), 10) -
          parseInt($token.css('padding-right'), 10)
          parseInt($tokenLabel.css('border-left-width'), 10) -
          parseInt($tokenLabel.css('border-right-width'), 10) -
          parseInt($tokenLabel.css('padding-left'), 10) -
          parseInt($tokenLabel.css('padding-right'), 10)
          parseInt($tokenLabel.css('margin-left'), 10) -
          parseInt($tokenLabel.css('margin-right'), 10)
      }

      $tokenLabel
        .text(attrs.label)
        .css('max-width', this.maxTokenWidth)

      // Listen to events on token
      $token
        .on('mousedown',  function (e) {
          if (_self._disabled || _self._readonly) return false
          _self.preventDeactivation = true
        })
        .on('click',    function (e) {
          if (_self._disabled || _self._readonly) return false
          _self.preventDeactivation = false

          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            return _self.toggle( $token )
          }

          _self.activate( $token, e.shiftKey, e.shiftKey )
        })
        .on('dblclick', function (e) {
          if (_self._disabled || _self._readonly || !_self.options.allowEditing ) return false
          _self.edit( $token )
        })

      $closeButton
          .on('click',  $.proxy(this.remove, this))

      // Trigger createdtoken event on the original field
      // indicating that the token is now in the DOM
      this.$element.trigger($.Event('tagfield:createdtoken', {
        attrs: attrs,
        relatedTarget: $token.get(0)
      }))

      // Trigger change event on the original field
      if (triggerChange) {
        this.$element.val( this.getTokensList() ).trigger( $.Event('change', { initiator: 'tagfield' }) )
      }

      // Update tagfield dimensions
      this.update()

      // Return original element
      return this.$element.get(0)
    }

  , setTokens: function (tokens, add, triggerChange) {
      if (!tokens) return

      if (!add) this.$wrapper.find('.token').remove()

      if (typeof triggerChange === 'undefined') {
          triggerChange = true
      }

      if (typeof tokens === 'string') {
        if (this._delimiters.length) {
          // Split based on delimiters
          tokens = tokens.split( new RegExp( '[' + this._delimiters.join('') + ']' ) )
        } else {
          tokens = [tokens];
        }
      }

      var _self = this
      $.each(tokens, function (i, attrs) {
        _self.createToken(attrs, triggerChange)
      })

      return this.$element.get(0)
    }

  , getTokenData: function($token) {
      var data = $token.map(function() {
        var $token = $(this);
        return $token.data('attrs')
      }).get();

      if (data.length == 1) {
        data = data[0];
      }

      return data;
    }

  , getTokens: function(active) {
      var self = this
        , tokens = []
        , activeClass = active ? '.active' : '' // get active tokens only
      this.$wrapper.find( '.token' + activeClass ).each( function() {
        tokens.push( self.getTokenData( $(this) ) )
      })
      return tokens
  }

  , getTokensList: function(delimiter, beautify, active) {
      delimiter = delimiter || this._firstDelimiter
      beautify = ( typeof beautify !== 'undefined' && beautify !== null ) ? beautify : this.options.beautify

      var separator = delimiter + ( beautify && delimiter !== ' ' ? ' ' : '')
      return $.map( this.getTokens(active), function (token) {
        return token.value
      }).join(separator)
  }

  , getInput: function() {
    return this.$input.val()
  }

  , listen: function () {
      var _self = this

      this.$element
        .on('change',   $.proxy(this.change, this))

      this.$wrapper
        .on('mousedown',$.proxy(this.focusInput, this))

      this.$input
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('paste',    $.proxy(this.paste, this))
        .on('keydown',  $.proxy(this.keydown, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      this.$copyHelper
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keydown',  $.proxy(this.keydown, this))
        .on('keyup',    $.proxy(this.keyup, this))

      // Secondary listeners for input width calculation
      this.$input
        .on('keypress', $.proxy(this.update, this))
        .on('keyup',    $.proxy(this.update, this))

      this.$input
        .on('autocompletecreate', function() {
          // Set minimum autocomplete menu width
          var $_menuElement = $(this).data('ui-autocomplete').menu.element

          var minWidth = _self.$wrapper.outerWidth() -
              parseInt( $_menuElement.css('border-left-width'), 10 ) -
              parseInt( $_menuElement.css('border-right-width'), 10 )

          $_menuElement.css( 'min-width', minWidth + 'px' )
        })
        .on('autocompleteselect', function (e, ui) {
          if (_self.createToken( ui.item )) {
            _self.$input.val('')
            if (_self.$input.data( 'edit' )) {
              _self.unedit(true)
            }
          }
          return false
        })
        .on('typeahead:selected typeahead:autocompleted', function (e, datum, dataset) {
          // Create token
          if (_self.createToken( datum )) {
            _self.$input.typeahead('val', '')
            if (_self.$input.data( 'edit' )) {
              _self.unedit(true)
            }
          }
        })

      // Listen to window resize
      $(window).on('resize', $.proxy(this.update, this ))

    }

  , keydown: function (e) {

      if (!this.focused) return

      var _self = this

      switch(e.keyCode) {
        case 8: // backspace
          if (!this.$input.is(document.activeElement)) break
          this.lastInputValue = this.$input.val()
          break

        case 37: // left arrow
          leftRight( this.textDirection === 'rtl' ? 'next': 'prev' )
          break

        case 38: // up arrow
          upDown('prev')
          break

        case 39: // right arrow
          leftRight( this.textDirection === 'rtl' ? 'prev': 'next' )
          break

        case 40: // down arrow
          upDown('next')
          break

        case 65: // a (to handle ctrl + a)
          if (this.$input.val().length > 0 || !(e.ctrlKey || e.metaKey)) break
          this.activateAll()
          e.preventDefault()
          break

        case 9: // tab
        case 13: // enter
        case 32: // enter
          // We will handle creating tokens from autocomplete in autocomplete events
          if (this.$input.data('ui-autocomplete') && this.$input.data('ui-autocomplete').menu.element.find("li:has(a.ui-state-focus)").length) break

          // We will handle creating tokens from typeahead in typeahead events
          if (this.$input.hasClass('tt-input') && this.$wrapper.find('.tt-cursor').length ) break
          if (this.$input.hasClass('tt-input') && this.$wrapper.find('.tt-hint').val().length) break

          // Create token
          if (this.$input.is(document.activeElement) && this.$input.val().length || this.$input.data('edit')) {
            return this.createTokensFromInput(e, this.$input.data('edit'));
          }

          // Edit token
          if (e.keyCode === 13) {
            if (!this.$copyHelper.is(document.activeElement) || this.$wrapper.find('.token.active').length !== 1) break
            if (!_self.options.allowEditing) break
            this.edit( this.$wrapper.find('.token.active') )
          }
      }

      function leftRight(direction) {
        if (_self.$input.is(document.activeElement)) {
          if (_self.$input.val().length > 0) return

          direction += 'All'
          var $token = _self.$input.hasClass('tt-input') ? _self.$input.parent()[direction]('.token:first') : _self.$input[direction]('.token:first')
          if (!$token.length) return

          _self.preventInputFocus = true
          _self.preventDeactivation = true

          _self.activate( $token )
          e.preventDefault()

        } else {
          _self[direction]( e.shiftKey )
          e.preventDefault()
        }
      }

      function upDown(direction) {
        if (!e.shiftKey) return

        if (_self.$input.is(document.activeElement)) {
          if (_self.$input.val().length > 0) return

          var $token = _self.$input.hasClass('tt-input') ? _self.$input.parent()[direction + 'All']('.token:first') : _self.$input[direction + 'All']('.token:first')
          if (!$token.length) return

          _self.activate( $token )
        }

        var opposite = direction === 'prev' ? 'next' : 'prev'
          , position = direction === 'prev' ? 'first' : 'last'

        _self.firstActiveToken[opposite + 'All']('.token').each(function() {
          _self.deactivate( $(this) )
        })

        _self.activate( _self.$wrapper.find('.token:' + position), true, true )
        e.preventDefault()
      }

      this.lastKeyDown = e.keyCode
    }

  , keypress: function(e) {
      this.lastKeyPressCode = e.keyCode
      this.lastKeyPressCharCode = e.charCode

      // Comma
      if ($.inArray( e.charCode, this._triggerKeys) !== -1 && this.$input.is(document.activeElement)) {
        if (this.$input.val()) {
          this.createTokensFromInput(e)
        }
        return false;
      }
    }

  , keyup: function (e) {
      this.preventInputFocus = false

      if (!this.focused) return

      switch(e.keyCode) {
        case 8: // backspace
          if (this.$input.is(document.activeElement)) {
            if (this.$input.val().length || this.lastInputValue.length && this.lastKeyDown === 8) break

            this.preventDeactivation = true
            var $prevToken = this.$input.hasClass('tt-input') ? this.$input.parent().prevAll('.token:first') : this.$input.prevAll('.token:first')

            if (!$prevToken.length) break

            this.activate( $prevToken )
          } else {
            this.remove(e)
          }
          break

        case 46: // delete
          this.remove(e, 'next')
          break
      }
      this.lastKeyUp = e.keyCode
    }

  , focus: function (e) {
      this.focused = true
      this.$wrapper.addClass('focus')

      if (this.$input.is(document.activeElement)) {
        this.$wrapper.find('.active').removeClass('active')
        this.$firstActiveToken = null

        if (this.options.showAutocompleteOnFocus) {
          this.search()
        }
      }
    }

  , blur: function (e) {

      this.focused = false
      this.$wrapper.removeClass('focus')

      if (!this.preventDeactivation && !this.$element.is(document.activeElement)) {
        this.$wrapper.find('.active').removeClass('active')
        this.$firstActiveToken = null
      }

      if (!this.preventCreateTokens && (this.$input.data('edit') && !this.$input.is(document.activeElement) || this.options.createTokensOnBlur )) {
        this.createTokensFromInput(e)
      }

      this.preventDeactivation = false
      this.preventCreateTokens = false
    }

  , paste: function (e) {
      var _self = this

      // Add tokens to existing ones
      if (_self.options.allowPasting) {
        setTimeout(function () {
          _self.createTokensFromInput(e)
        }, 1)
      }
    }

  , change: function (e) {
      if ( e.initiator === 'tagfield' ) return // Prevent loops

      this.setTokens( this.$element.val() )
    }

  , createTokensFromInput: function (e, focus) {
      if (this.$input.val().length < this.options.minLength)
        return // No input, simply return

      var tokensBefore = this.getTokensList()
      this.setTokens( this.$input.val(), true )

      if (tokensBefore == this.getTokensList() && this.$input.val().length)
        return false // No tokens were added, do nothing (prevent form submit)

      if (this.$input.hasClass('tt-input')) {
        // Typeahead acts weird when simply setting input value to empty,
        // so we set the query to empty instead
        this.$input.typeahead('val', '')
      } else {
        this.$input.val('')
      }

      if (this.$input.data( 'edit' )) {
        this.unedit(focus)
      }

      return false // Prevent form being submitted
    }

  , next: function (add) {
      if (add) {
        var $firstActiveToken = this.$wrapper.find('.active:first')
          , deactivate = $firstActiveToken && this.$firstActiveToken ? $firstActiveToken.index() < this.$firstActiveToken.index() : false

        if (deactivate) return this.deactivate( $firstActiveToken )
      }

      var $lastActiveToken = this.$wrapper.find('.active:last')
        , $nextToken = $lastActiveToken.nextAll('.token:first')

      if (!$nextToken.length) {
        this.$input.focus()
        return
      }

      this.activate($nextToken, add)
    }

  , prev: function (add) {

      if (add) {
        var $lastActiveToken = this.$wrapper.find('.active:last')
          , deactivate = $lastActiveToken && this.$firstActiveToken ? $lastActiveToken.index() > this.$firstActiveToken.index() : false

        if (deactivate) return this.deactivate( $lastActiveToken )
      }

      var $firstActiveToken = this.$wrapper.find('.active:first')
        , $prevToken = $firstActiveToken.prevAll('.token:first')

      if (!$prevToken.length) {
        $prevToken = this.$wrapper.find('.token:first')
      }

      if (!$prevToken.length && !add) {
        this.$input.focus()
        return
      }

      this.activate( $prevToken, add )
    }

  , activate: function ($token, add, multi, remember) {

      if (!$token) return

      if (typeof remember === 'undefined') var remember = true

      if (multi) var add = true

      this.$copyHelper.focus()

      if (!add) {
        this.$wrapper.find('.active').removeClass('active')
        if (remember) {
          this.$firstActiveToken = $token
        } else {
          delete this.$firstActiveToken
        }
      }

      if (multi && this.$firstActiveToken) {
        // Determine first active token and the current tokens indicies
        // Account for the 1 hidden textarea by subtracting 1 from both
        var i = this.$firstActiveToken.index() - 2
          , a = $token.index() - 2
          , _self = this

        this.$wrapper.find('.token').slice( Math.min(i, a) + 1, Math.max(i, a) ).each( function() {
          _self.activate( $(this), true )
        })
      }

      $token.addClass('active')
      this.$copyHelper.val( this.getTokensList( null, null, true ) ).select()
    }

  , activateAll: function() {
      var _self = this

      this.$wrapper.find('.token').each( function (i) {
        _self.activate($(this), i !== 0, false, false)
      })
    }

  , deactivate: function($token) {
      if (!$token) return

      $token.removeClass('active')
      this.$copyHelper.val( this.getTokensList( null, null, true ) ).select()
    }

  , toggle: function($token) {
      if (!$token) return

      $token.toggleClass('active')
      this.$copyHelper.val( this.getTokensList( null, null, true ) ).select()
    }

  , edit: function ($token) {
      if (!$token) return

      var attrs = $token.data('attrs')

      // Allow changing input value before editing
      var options = { attrs: attrs, relatedTarget: $token.get(0) }
      var editEvent = $.Event('tagfield:edittoken', options)
      this.$element.trigger( editEvent )

      // Edit event can be cancelled if default is prevented
      if (editEvent.isDefaultPrevented()) return

      $token.find('.token-label').text(attrs.value)
      var tokenWidth = $token.outerWidth()

      var $_input = this.$input.hasClass('tt-input') ? this.$input.parent() : this.$input

      $token.replaceWith( $_input )

      this.preventCreateTokens = true

      this.$input.val( attrs.value )
                .select()
                .data( 'edit', true )
                .width( tokenWidth )

      this.update();

      // Indicate that token is now being edited, and is replaced with an input field in the DOM
      this.$element.trigger($.Event('tagfield:editedtoken', options ))
    }

  , unedit: function (focus) {
      var $_input = this.$input.hasClass('tt-input') ? this.$input.parent() : this.$input
      $_input.appendTo( this.$wrapper )

      this.$input.data('edit', false)
      this.$mirror.text('')

      this.update()

      // Because moving the input element around in DOM
      // will cause it to lose focus, we provide an option
      // to re-focus the input after appending it to the wrapper
      if (focus) {
        var _self = this
        setTimeout(function () {
          _self.$input.focus()
        }, 1)
      }
    }

  , remove: function (e, direction) {
      if (this.$input.is(document.activeElement) || this._disabled || this._readonly) return

      var $token = (e.type === 'click') ? $(e.target).closest('.token') : this.$wrapper.find('.token.active')

      if (e.type !== 'click') {
        if (!direction) var direction = 'prev'
        this[direction]()

        // Was it the first token?
        if (direction === 'prev') var firstToken = $token.first().prevAll('.token:first').length === 0
      }

      // Prepare events and their options
      var options = { attrs: this.getTokenData( $token ), relatedTarget: $token.get(0) }
        , removeEvent = $.Event('tagfield:removetoken', options)

      this.$element.trigger(removeEvent);

      // Remove event can be intercepted and cancelled
      if (removeEvent.isDefaultPrevented()) return

      var removedEvent = $.Event('tagfield:removedtoken', options)
        , changeEvent = $.Event('change', { initiator: 'tagfield' })

      // Remove token from DOM
      $token.remove()

      // Trigger events
      this.$element.val( this.getTokensList() ).trigger( removedEvent ).trigger( changeEvent )

      // Focus, when necessary:
      // When there are no more tokens, or if this was the first token
      // and it was removed with backspace or it was clicked on
      if (!this.$wrapper.find('.token').length || e.type === 'click' || firstToken) this.$input.focus()

      // Adjust input width
      this.$input.css('width', this.options.minWidth + 'px')
      this.update()

      // Cancel original event handlers
      e.preventDefault()
      e.stopPropagation()
    }

    /**
     * Update tagfield dimensions
     */
  , update: function (e) {
      var value = this.$input.val()
        , inputPaddingLeft = parseInt(this.$input.css('padding-left'), 10)
        , inputPaddingRight = parseInt(this.$input.css('padding-right'), 10)
        , inputPadding = inputPaddingLeft + inputPaddingRight

      if (this.$input.data('edit')) {

        if (!value) {
          value = this.$input.prop("placeholder")
        }
        if (value === this.$mirror.text()) return

        this.$mirror.text(value)

        var mirrorWidth = this.$mirror.width() + 10;
        if ( mirrorWidth > this.$wrapper.width() ) {
          return this.$input.width( this.$wrapper.width() )
        }

        this.$input.width( mirrorWidth )
      }
      else {
        var w = (this.textDirection === 'rtl')
              ? this.$input.offset().left + this.$input.outerWidth() - this.$wrapper.offset().left - parseInt(this.$wrapper.css('padding-left'), 10) - inputPadding - 1
              : this.$wrapper.offset().left + this.$wrapper.width() + parseInt(this.$wrapper.css('padding-left'), 10) - this.$input.offset().left - inputPadding;
        //
        // some usecases pre-render widget before attaching to DOM,
        // dimensions returned by jquery will be NaN -> we default to 100%
        // so placeholder won't be cut off.
        isNaN(w) ? this.$input.width('100%') : this.$input.width(w);
      }
    }

  , focusInput: function (e) {
      if ( $(e.target).closest('.token').length || $(e.target).closest('.token-input').length || $(e.target).closest('.tt-dropdown-menu').length ) return
      // Focus only after the current call stack has cleared,
      // otherwise has no effect.
      // Reason: mousedown is too early - input will lose focus
      // after mousedown. However, since the input may be moved
      // in DOM, there may be no click or mouseup event triggered.
      var _self = this
      setTimeout(function() {
        _self.$input.focus()
      }, 0)
    }

  , search: function () {
      if ( this.$input.data('ui-autocomplete') ) {
        this.$input.autocomplete('search')
      }
    }

  , disable: function () {
      this.setProperty('disabled', true);
    }

  , enable: function () {
      this.setProperty('disabled', false);
    }

  , readonly: function () {
      this.setProperty('readonly', true);
    }

  , writeable: function () {
      this.setProperty('readonly', false);
    }

  , setProperty: function(property, value) {
      this['_' + property] = value;
      this.$input.prop(property, value);
      this.$element.prop(property, value);
      this.$wrapper[ value ? 'addClass' : 'removeClass' ](property);
  }

  , destroy: function() {
      // Set field value
      this.$element.val( this.getTokensList() );
      // Restore styles and properties
      this.$element.css( this.$element.data('original-styles') );
      this.$element.prop( 'tabindex', this.$element.data('original-tabindex') );

      // Re-route tagfield label to original input
      var $label = $( 'label[for="' + this.$input.prop('id') + '"]' )
      if ( $label.length ) {
        $label.prop( 'for', this.$element.prop('id') )
      }

      // Move original element outside of tagfield wrapper
      this.$element.insertBefore( this.$wrapper );

      // Remove tagfield-related data
      this.$element.removeData('original-styles')
                   .removeData('original-tabindex')
                   .removeData('bs.tagfield');

      // Remove tagfield from DOM
      this.$wrapper.remove();
      this.$mirror.remove();

      var $_element = this.$element;
      delete this;

      return $_element;
  }

  }


 /* TOKENFIELD PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.tagfield

  $.fn.tagfield = function (option, param) {
    var value
      , args = []

    Array.prototype.push.apply( args, arguments );

    var elements = this.each(function () {
      var $this = $(this)
        , data = $this.data('bs.tagfield')
        , options = typeof option == 'object' && option

      if (typeof option === 'string' && data && data[option]) {
        args.shift()
        value = data[option].apply(data, args)
      } else {
        if (!data && typeof option !== 'string' && !param) {
          $this.data('bs.tagfield', (data = new Tokenfield(this, options)))
          $this.trigger('tagfield:initialize')
        }
      }
    })

    return typeof value !== 'undefined' ? value : elements;
  }

  $.fn.tagfield.defaults = {
    minWidth: 60,
    minLength: 0,
    allowEditing: true,
    allowPasting: true,
    limit: 0,
    autocomplete: {},
    typeahead: {},
    showAutocompleteOnFocus: false,
    createTokensOnBlur: false,
    delimiter: ',',
    beautify: true,
    opicon : false
  }

  $.fn.tagfield.Constructor = Tokenfield


 /* TOKENFIELD NO CONFLICT
  * ================== */

  $.fn.tagfield.noConflict = function () {
    $.fn.tagfield = old
    return this
  }

  return Tokenfield;
}));

/*!
 * typeahead.js 0.10.4
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

(function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);
                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            getUniqueId: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            }(),
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;
                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this, args = arguments, later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(), remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            noop: function() {}
        };
    }();
    var VERSION = "0.10.4";
    var tokenizers = function() {
        "use strict";
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };
        function whitespace(str) {
            str = _.toStr(str);
            return str ? str.split(/\s+/) : [];
        }
        function nonword(str) {
            str = _.toStr(str);
            return str ? str.split(/\W+/) : [];
        }
        function getObjTokenizer(tokenizer) {
            return function setKey() {
                var args = [].slice.call(arguments, 0);
                return function tokenize(o) {
                    var tokens = [];
                    _.each(args, function(k) {
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));
                    });
                    return tokens;
                };
            };
        }
    }();
    var LruCache = function() {
        "use strict";
        function LruCache(maxSize) {
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
            this.reset();
            if (this.maxSize <= 0) {
                this.set = this.get = $.noop;
            }
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail, node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            },
            reset: function reset() {
                this.size = 0;
                this.hash = {};
                this.list = new List();
            }
        });
        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });
        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        "use strict";
        var ls, methods;
        try {
            ls = window.localStorage;
            ls.setItem("~~~", "!");
            ls.removeItem("~~~");
        } catch (err) {
            ls = null;
        }
        function PersistentStorage(namespace) {
            this.prefix = [ "__", namespace, "__" ].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
        }
        if (ls && window.JSON) {
            methods = {
                _prefix: function(key) {
                    return this.prefix + key;
                },
                _ttlKey: function(key) {
                    return this._prefix(key) + this.ttlKey;
                },
                get: function(key) {
                    if (this.isExpired(key)) {
                        this.remove(key);
                    }
                    return decode(ls.getItem(this._prefix(key)));
                },
                set: function(key, val, ttl) {
                    if (_.isNumber(ttl)) {
                        ls.setItem(this._ttlKey(key), encode(now() + ttl));
                    } else {
                        ls.removeItem(this._ttlKey(key));
                    }
                    return ls.setItem(this._prefix(key), encode(val));
                },
                remove: function(key) {
                    ls.removeItem(this._ttlKey(key));
                    ls.removeItem(this._prefix(key));
                    return this;
                },
                clear: function() {
                    var i, key, keys = [], len = ls.length;
                    for (i = 0; i < len; i++) {
                        if ((key = ls.key(i)).match(this.keyMatcher)) {
                            keys.push(key.replace(this.keyMatcher, ""));
                        }
                    }
                    for (i = keys.length; i--; ) {
                        this.remove(keys[i]);
                    }
                    return this;
                },
                isExpired: function(key) {
                    var ttl = decode(ls.getItem(this._ttlKey(key)));
                    return _.isNumber(ttl) && now() > ttl ? true : false;
                }
            };
        } else {
            methods = {
                get: _.noop,
                set: _.noop,
                remove: _.noop,
                clear: _.noop,
                isExpired: _.noop
            };
        }
        _.mixin(PersistentStorage.prototype, methods);
        return PersistentStorage;
        function now() {
            return new Date().getTime();
        }
        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }
        function decode(val) {
            return JSON.parse(val);
        }
    }();
    var Transport = function() {
        "use strict";
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, sharedCache = new LruCache(10);
        function Transport(o) {
            o = o || {};
            this.cancelled = false;
            this.lastUrl = null;
            this._send = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;
            this.xhrSending = o.xhrSending || function () { };
            this.xhrDone = o.xhrDone || function () { };
        }
        
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function resetCache() {
            sharedCache.reset();
        };
        _.mixin(Transport.prototype, {
            _get: function(url, o, cb) {
                var that = this, jqXhr;
                if (this.cancelled || url !== this.lastUrl) {
                    return;
                }
                if (jqXhr = pendingRequests[url]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[url] = this._send(url, o).done(done).fail(fail).always(always);
                    
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }
                function done(resp) {
                    setTimeout(function(){
                        that.xhrDone(url);
                    },100)
                    cb && cb(null, resp);
                    that._cache.set(url, resp);
                }
                function fail() {
                    cb && cb(true);
                }
                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[url];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(url, o, cb) {
                var resp;
                if (_.isFunction(o)) {
                    cb = o;
                    o = {};
                }
                this.cancelled = false;
                this.lastUrl = url;
                if (resp = this._cache.get(url)) {
                    _.defer(function() {
                        cb && cb(null, resp);
                    });
                } else {
                    this.xhrSending();
                    this._get(url, o, cb);
                }
                
                return !!resp;
            },
            cancel: function() {
                this.cancelled = true;
            }
        });
        return Transport;
        function callbackToDeferred(fn) {
            return function customSendWrapper(url, o) {
                var deferred = $.Deferred();
                fn(url, o, onSuccess, onError);
                return deferred;
                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }
                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var SearchIndex = function() {
        "use strict";
        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [ data ];
                _.each(data, function(datum) {
                    var id, tokens;
                    id = that.datums.push(datum) - 1;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node.children[ch] || (node.children[ch] = newNode());
                            node.ids.push(id);
                        }
                    });
                });
            },
            get: function get(query) {
                var that = this, tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node.children[ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node.ids.slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            reset: function reset() {
                this.datums = [];
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;
        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }
        function newNode() {
            return {
                ids: [],
                children: {}
            };
        }
        function unique(array) {
            var seen = {}, uniques = [];
            for (var i = 0, len = array.length; i < len; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }
        function getIntersection(arrayA, arrayB) {
            var ai = 0, bi = 0, intersection = [];
            arrayA = arrayA.sort(compare);
            arrayB = arrayB.sort(compare);
            var lenArrayA = arrayA.length, lenArrayB = arrayB.length;
            while (ai < lenArrayA && bi < lenArrayB) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;
            function compare(a, b) {
                return a - b;
            }
        }
    }();
    var oParser = function() {
        "use strict";
        return {
            local: getLocal,
            prefetch: getPrefetch,
            remote: getRemote
        };
        function getLocal(o) {
            return o.local || null;
        }
        function getPrefetch(o) {
            var prefetch, defaults;
            defaults = {
                url: null,
                thumbprint: "",
                ttl: 24 * 60 * 60 * 1e3,
                filter: null,
                ajax: {}
            };
            if (prefetch = o.prefetch || null) {
                prefetch = _.isString(prefetch) ? {
                    url: prefetch
                } : prefetch;
                prefetch = _.mixin(defaults, prefetch);
                prefetch.thumbprint = VERSION + prefetch.thumbprint;
                prefetch.ajax.type = prefetch.ajax.type || "GET";
                prefetch.ajax.dataType = prefetch.ajax.dataType || "json";
                !prefetch.url && $.error("prefetch requires url to be set");
            }
            return prefetch;
        }
        function getRemote(o) {
            var remote, defaults;
            defaults = {
                url: null,
                cache: true,
                wildcard: "%QUERY",
                replace: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                send: null,
                filter: null,
                ajax: {}
            };
            if (remote = o.remote || null) {
                remote = _.isString(remote) ? {
                    url: remote
                } : remote;
                remote = _.mixin(defaults, remote);
                remote.rateLimiter = /^throttle$/i.test(remote.rateLimitBy) ? byThrottle(remote.rateLimitWait) : byDebounce(remote.rateLimitWait);
                remote.ajax.type = remote.ajax.type || "GET";
                remote.ajax.dataType = remote.ajax.dataType || "json";
                delete remote.rateLimitBy;
                delete remote.rateLimitWait;
                !remote.url && $.error("remote requires url to be set");
            }
            return remote;
            function byDebounce(wait) {
                return function(fn) {
                    return _.debounce(fn, wait);
                };
            }
            function byThrottle(wait) {
                return function(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }
    }();
    (function(root) {
        "use strict";
        var old, keys;
        old = root.Bloodhound;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };
        root.Bloodhound = Bloodhound;
        function Bloodhound(o) {
            if (!o || !o.local && !o.prefetch && !o.remote) {
                $.error("one of local, prefetch, or remote is required");
            }
            this.limit = o.limit || 5;
            this.sorter = getSorter(o.sorter);
            this.dupDetector = o.dupDetector || ignoreDuplicates;
            this.local = oParser.local(o);
            this.prefetch = oParser.prefetch(o);
            this.remote = oParser.remote(o);
            this.cacheKey = this.prefetch ? this.prefetch.cacheKey || this.prefetch.url : null;
            this.index = new SearchIndex({
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            this.storage = this.cacheKey ? new PersistentStorage(this.cacheKey) : null;
        }
        Bloodhound.noConflict = function noConflict() {
            root.Bloodhound = old;
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            _loadPrefetch: function loadPrefetch(o) {
                var that = this, serialized, deferred;
                if (serialized = this._readFromStorage(o.thumbprint)) {
                    this.index.bootstrap(serialized);
                    deferred = $.Deferred().resolve();
                } else {
                    deferred = $.ajax(o.url, o.ajax).done(handlePrefetchResponse);
                }
                return deferred;
                function handlePrefetchResponse(resp) {
                    that.clear();
                    that.add(o.filter ? o.filter(resp) : resp);
                    that._saveToStorage(that.index.serialize(), o.thumbprint, o.ttl);
                }
            },
            _getFromRemote: function getFromRemote(query, cb) {
                var that = this, url, uriEncodedQuery;
                if (!this.transport) {
                    return;
                }
                query = query || "";
                uriEncodedQuery = encodeURIComponent(query);
                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);
                function handleRemoteResponse(err, resp) {
                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
                }
            },
            _cancelLastRemoteRequest: function cancelLastRemoteRequest() {
                this.transport && this.transport.cancel();
            },
            _saveToStorage: function saveToStorage(data, thumbprint, ttl) {
                if (this.storage) {
                    this.storage.set(keys.data, data, ttl);
                    this.storage.set(keys.protocol, location.protocol, ttl);
                    this.storage.set(keys.thumbprint, thumbprint, ttl);
                }
            },
            _readFromStorage: function readFromStorage(thumbprint) {
                var stored = {}, isExpired;
                if (this.storage) {
                    stored.data = this.storage.get(keys.data);
                    stored.protocol = this.storage.get(keys.protocol);
                    stored.thumbprint = this.storage.get(keys.thumbprint);
                }
                isExpired = stored.thumbprint !== thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            _initialize: function initialize() {
                var that = this, local = this.local, deferred;
                deferred = this.prefetch ? this._loadPrefetch(this.prefetch) : $.Deferred().resolve();
                local && deferred.done(addLocalToIndex);
                this.transport = this.remote ? new Transport(this.remote) : null;
                return this.initPromise = deferred.promise();
                function addLocalToIndex() {
                    that.add(_.isFunction(local) ? local() : local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
            },
            get: function get(query, cb) {
                var that = this, matches = [], cacheHit = false;
                matches = this.index.get(query);
                matches = this.sorter(matches).slice(0, this.limit);
                matches.length < this.limit ? cacheHit = this._getFromRemote(query, returnRemoteMatches) : this._cancelLastRemoteRequest();
                if (!cacheHit) {
                    (matches.length > 0 || !this.transport) && cb && cb(matches);
                }
                function returnRemoteMatches(remoteMatches) {
                    var matchesWithBackfill = matches.slice(0);
                    _.each(remoteMatches, function(remoteMatch) {
                        var isDuplicate;
                        isDuplicate = _.some(matchesWithBackfill, function(match) {
                            return that.dupDetector(remoteMatch, match);
                        });
                        !isDuplicate && matchesWithBackfill.push(remoteMatch);
                        return matchesWithBackfill.length < that.limit;
                    });
                    cb && cb(that.sorter(matchesWithBackfill));
                }
            },
            clear: function clear() {
                this.index.reset();
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.storage && this.storage.clear();
            },
            clearRemoteCache: function clearRemoteCache() {
                this.transport && Transport.resetCache();
            },
            ttAdapter: function ttAdapter() {
                return _.bind(this.get, this);
            }
        });
        return Bloodhound;
        function getSorter(sortFn) {
            return _.isFunction(sortFn) ? sort : noSort;
            function sort(array) {
                return array.sort(sortFn);
            }
            function noSort(array) {
                return array;
            }
        }
        function ignoreDuplicates() {
            return false;
        }
    })(this);
    var html = function() {
        return {
            wrapper: '<span class="twitter-typeahead"></span>',
            dropdown: '<span class="tt-dropdown-menu"></span>',
            dataset: '<div class="tt-dataset-%CLASS%"></div>',
            suggestions: '<span class="tt-suggestions"></span>',
            suggestion: '<div class="tt-suggestion"></div>'
        };
    }();
    var css = function() {
        "use strict";
        var css = {
            wrapper: {
                position: "relative",
                display: "inline-block"
            },
            hint: {
                position: "absolute",
                top: "0",
                left: "0",
                borderColor: "transparent",
                boxShadow: "none",
                opacity: "1"
            },
            input: {
                position: "relative",
                verticalAlign: "top",
                backgroundColor: "transparent"
            },
            inputWithNoHint: {
                position: "relative",
                verticalAlign: "top"
            },
            dropdown: {
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: "100",
                display: "none"
            },
            suggestions: {
                display: "block"
            },
            suggestion: {
                whiteSpace: "nowrap",
                cursor: "pointer"
            },
            suggestionChild: {
                whiteSpace: "normal"
            },
            ltr: {
                left: "0",
                right: "auto"
            },
            rtl: {
                left: "auto",
                right: " 0"
            }
        };
        if (_.isMsie()) {
            _.mixin(css.input, {
                backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
            });
        }
        if (_.isMsie() && _.isMsie() <= 7) {
            _.mixin(css.input, {
                marginTop: "-1px"
            });
        }
        return css;
    }();
    var EventBus = function() {
        "use strict";
        var namespace = "typeahead:";
        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            trigger: function(type) {
                var args = [].slice.call(arguments, 1);
                this.$el.trigger(namespace + type, args);
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        "use strict";
        var splitter = /\s+/, nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };
        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }
        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }
        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }
        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }
        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [ type ].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [ type ].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }
        function getFlush(callbacks, context, args) {
            return flush;
            function flush() {
                var cancelled;
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }
        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }
        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        "use strict";
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [ o.pattern ];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);
            function hightlightTextNode(textNode) {
                var match, patternNode, wrapperNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }
            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };
        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [], regexStr;
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        "use strict";
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };
        function Input(o) {
            var that = this, onBlur, onFocus, onKeydown, onInput;
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            onBlur = _.bind(this._onBlur, this);
            onFocus = _.bind(this._onFocus, this);
            onKeydown = _.bind(this._onKeydown, this);
            onInput = _.bind(this._onInput, this);
            this.$hint = $(o.hint);
            this.$input = $(o.input).on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
            if (!_.isMsie()) {
                this.$input.on("input.tt", onInput);
            } else {
                this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                    if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                        return;
                    }
                    _.defer(_.bind(that._onInput, that, $e));
                });
            }
            this.query = this.$input.val();
            this.$overflowHelper = buildOverflowHelper(this.$input);
        }
        Input.normalizeQuery = function(str) {
            return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._checkInputValue();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault, hintValue, inputValue;
                switch (keyName) {
                  case "tab":
                    hintValue = this.getHint();
                    inputValue = this.getInputValue();
                    preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
                    break;

                  case "up":
                  case "down":
                    preventDefault = !withModifier($e);
                    break;

                  default:
                    preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                  case "tab":
                    trigger = !withModifier($e);
                    break;

                  default:
                    trigger = true;
                }
                return trigger;
            },
            _checkInputValue: function checkInputValue() {
                var inputValue, areEquivalent, hasDifferentWhitespace;
                inputValue = this.getInputValue();
                areEquivalent = areQueriesEquivalent(inputValue, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== inputValue.length : false;
                this.query = inputValue;
                if (!areEquivalent) {
                    this.trigger("queryChanged", this.query);
                } else if (hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getQuery: function getQuery() {
                return this.query;
            },
            setQuery: function setQuery(query) {
                this.query = query;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value, silent) {
                this.$input.val(value);
                silent ? this.clearHint() : this._checkInputValue();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query, true);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            getLanguageDirection: function getLanguageDirection() {
                return (this.$input.css("direction") || "ltr").toLowerCase();
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$hint = this.$input = this.$overflowHelper = null;
            }
        });
        return Input;
        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }
        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }
        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        "use strict";
        var datasetKey = "ttDataset", valueKey = "ttValue", datumKey = "ttDatum";
        function Dataset(o) {
            o = o || {};
            o.templates = o.templates || {};
            if (!o.source) {
                $.error("missing source");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            this.query = null;
            this.highlight = !!o.highlight;
            this.name = o.name || _.getUniqueId();
            this.source = o.source;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.queryTokenizer = o.queryTokenizer || function(query) {
                return [ query ];
            };            
            this.$el = $(html.dataset.replace("%CLASS%", this.name));
        }
        Dataset.extractDatasetName = function extractDatasetName(el) {
            return $(el).data(datasetKey);
        };
        Dataset.extractValue = function extractDatum(el) {
            return $(el).data(valueKey);
        };
        Dataset.extractDatum = function extractDatum(el) {
            return $(el).data(datumKey);
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _render: function render(query, suggestions) {
                if (!this.$el) {
                    return;
                }
                var that = this, hasSuggestions;
                this.$el.empty();
                hasSuggestions = suggestions && suggestions.length;
                if (!hasSuggestions && this.templates.empty) {
                    this.$el.html(getEmptyHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                } else if (hasSuggestions) {
                    this.$el.html(getSuggestionsHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                }
                this.trigger("rendered");
                function getEmptyHtml() {
                    return that.templates.empty({
                        query: query,
                        isEmpty: true
                    });
                }
                function getSuggestionsHtml() {
                    var $suggestions, nodes;
                    $suggestions = $(html.suggestions).css(css.suggestions);
                    nodes = _.map(suggestions, getSuggestionNode);
                    $suggestions.append.apply($suggestions, nodes);
                    that.highlight && highlight({
                        className: "tt-highlight",
                        node: $suggestions[0],
                        pattern: cleanPatterns(that.queryTokenizer(query))
                    });
                    return $suggestions;
                    function getSuggestionNode(suggestion) {
                        var $el;
                        $el = $(html.suggestion).append(that.templates.suggestion(suggestion)).data(datasetKey, that.name).data(valueKey, that.displayFn(suggestion)).data(datumKey, suggestion);
                        $el.children().each(function() {
                            $(this).css(css.suggestionChild);
                        });
                        return $el;
                    }
                }
                function getHeaderHtml() {
                    return that.templates.header({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
                function getFooterHtml() {
                    return that.templates.footer({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
            },
            getRoot: function getRoot() {
                return this.$el;
            },
            update: function update(query) {
                var that = this;
                this.query = query;
                this.canceled = false;
                this.source(query, render);
                function render(suggestions) {
                    if (!that.canceled && query === that.query) {
                        that._render(query, suggestions);
                    }
                }
            },
            cancel: function cancel() {
                this.canceled = true;
            },
            clear: function clear() {
                this.cancel();
                this.$el.empty();
                this.trigger("rendered");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = null;
            }
        });
        return Dataset;
        function getDisplayFn(display) {
            display = display || "value";
            return _.isFunction(display) ? display : displayFn;
            function displayFn(obj) {
                return obj[display];
            }
        }
        function getTemplates(templates, displayFn) {
            return {
                empty: templates.empty && _.templatify(templates.empty),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };
            function suggestionTemplate(context) {
                return "<p>" + displayFn(context) + "</p>";
            }
        }
        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
        function cleanPatterns(patterns) {
            var cleaned = [];
            for (var i = 0; i < patterns.length; i++) {
                if (patterns[i].length > 0) cleaned.push(patterns[i]);
            }
            return cleaned;
        }        
        
    }();
    var Dropdown = function() {
        "use strict";
        function Dropdown(o) {
            var that = this, onSuggestionClick, onSuggestionMouseEnter, onSuggestionMouseLeave;
            o = o || {};
            if (!o.menu) {
                $.error("menu is required");
            }
            this.isOpen = false;
            this.isEmpty = true;
            this.datasets = _.map(o.datasets, initializeDataset);
            onSuggestionClick = _.bind(this._onSuggestionClick, this);
            onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
            onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
            this.$menu = $(o.menu).on("click.tt", ".tt-suggestion", onSuggestionClick).on("mouseenter.tt", ".tt-suggestion", onSuggestionMouseEnter).on("mouseleave.tt", ".tt-suggestion", onSuggestionMouseLeave);
            _.each(this.datasets, function(dataset) {
                that.$menu.append(dataset.getRoot());
                dataset.onSync("rendered", that._onRendered, that);
            });
        }
        _.mixin(Dropdown.prototype, EventEmitter, {
            _onSuggestionClick: function onSuggestionClick($e) {
                this.trigger("suggestionClicked", $($e.currentTarget));
            },
            _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
                this._removeCursor();
                this._setCursor($($e.currentTarget), true);
            },
            _onSuggestionMouseLeave: function onSuggestionMouseLeave() {
                this._removeCursor();
            },
            _onRendered: function onRendered() {
                this.isEmpty = _.every(this.datasets, isDatasetEmpty);
                this.isEmpty ? this._hide() : this.isOpen && this._show();
                this.trigger("datasetRendered");
                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _hide: function() {
                this.$menu.hide();
            },
            _show: function() {
                this.$menu.css("display", "block");
            },
            _getSuggestions: function getSuggestions() {
                return this.$menu.find(".tt-suggestion");
            },
            _getCursor: function getCursor() {
                return this.$menu.find(".tt-cursor").first();
            },
            _setCursor: function setCursor($el, silent) {
                $el.first().addClass("tt-cursor");
                !silent && this.trigger("cursorMoved");
            },
            _removeCursor: function removeCursor() {
                this._getCursor().removeClass("tt-cursor");
            },
            _moveCursor: function moveCursor(increment) {
                var $suggestions, $oldCursor, newCursorIndex, $newCursor;
                if (!this.isOpen) {
                    return;
                }
                $oldCursor = this._getCursor();
                $suggestions = this._getSuggestions();
                this._removeCursor();
                newCursorIndex = $suggestions.index($oldCursor) + increment;
                newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
                if (newCursorIndex === -1) {
                    this.trigger("cursorRemoved");
                    return;
                } else if (newCursorIndex < -1) {
                    newCursorIndex = $suggestions.length - 1;
                }
                this._setCursor($newCursor = $suggestions.eq(newCursorIndex));
                this._ensureVisible($newCursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, menuScrollTop, menuHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                menuScrollTop = this.$menu.scrollTop();
                menuHeight = this.$menu.height() + parseInt(this.$menu.css("paddingTop"), 10) + parseInt(this.$menu.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$menu.scrollTop(menuScrollTop + elTop);
                } else if (menuHeight < elBottom) {
                    this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
                }
            },
            close: function close() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this._removeCursor();
                    this._hide();
                    this.trigger("closed");
                }
            },
            open: function open() {
                if (!this.isOpen) {
                    this.isOpen = true;
                    !this.isEmpty && this._show();
                    this.trigger("opened");
                }
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$menu.css(dir === "ltr" ? css.ltr : css.rtl);
            },
            moveCursorUp: function moveCursorUp() {
                this._moveCursor(-1);
            },
            moveCursorDown: function moveCursorDown() {
                this._moveCursor(+1);
            },
            getDatumForSuggestion: function getDatumForSuggestion($el) {
                var datum = null;
                if ($el.length) {
                    datum = {
                        raw: Dataset.extractDatum($el),
                        value: Dataset.extractValue($el),
                        datasetName: Dataset.extractDatasetName($el)
                    };
                }
                return datum;
            },
            getDatumForCursor: function getDatumForCursor() {
                return this.getDatumForSuggestion(this._getCursor().first());
            },
            getDatumForTopSuggestion: function getDatumForTopSuggestion() {
                return this.getDatumForSuggestion(this._getSuggestions().first());
            },
            update: function update(query) {
                _.each(this.datasets, updateDataset);
                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.isEmpty = true;
                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            isVisible: function isVisible() {
                return this.isOpen && !this.isEmpty;
            },
            destroy: function destroy() {
                this.$menu.off(".tt");
                this.$menu = null;
                _.each(this.datasets, destroyDataset);
                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Dropdown;
        function initializeDataset(oDataset) {
            return new Dataset(oDataset);
        }
    }();
    var Typeahead = function() {
        "use strict";
        var attrsKey = "ttAttrs";
        function Typeahead(o) {
            var $menu, $input, $hint;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            this.isActivated = false;
            this.autoselect = !!o.autoselect;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.$node = buildDom(o.input, o.withHint);
            $menu = this.$node.find(".tt-dropdown-menu");
            $input = this.$node.find(".tt-input");
            $hint = this.$node.find(".tt-hint");
            $input.on("blur.tt", function($e) {
                var active, isActive, hasActive;
                active = document.activeElement;
                isActive = $menu.is(active);
                hasActive = $menu.has(active).length > 0;
                if (_.isMsie() && (isActive || hasActive)) {
                    $e.preventDefault();
                    $e.stopImmediatePropagation();
                    _.defer(function() {
                        $input.focus();
                    });
                }
            });
            $menu.on("mousedown.tt", function($e) {
                $e.preventDefault();
            });
            this.eventBus = o.eventBus || new EventBus({
                el: $input
            });
            this.dropdown = new Dropdown({
                menu: $menu,
                datasets: o.datasets
            }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onAsync("datasetRendered", this._onDatasetRendered, this);
            this.input = new Input({
                input: $input,
                hint: $hint
            }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
            this._setLanguageDirection();
        }
        _.mixin(Typeahead.prototype, {
            _onSuggestionClicked: function onSuggestionClicked(type, $el) {
                var datum;
                if (datum = this.dropdown.getDatumForSuggestion($el)) {
                    this._select(datum);
                }
            },
            _onCursorMoved: function onCursorMoved() {
                var datum = this.dropdown.getDatumForCursor();
                this.input.setInputValue(datum.value, true);
                this.eventBus.trigger("cursorchanged", datum.raw, datum.datasetName);
            },
            _onCursorRemoved: function onCursorRemoved() {
                this.input.resetInputValue();
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered() {
                this._updateHint();
            },
            _onOpened: function onOpened() {
                this._updateHint();
                this.eventBus.trigger("opened");
            },
            _onClosed: function onClosed() {
                this.input.clearHint();
                this.eventBus.trigger("closed");
            },
            _onFocused: function onFocused() {
                this.isActivated = true;
                this.dropdown.open();
            },
            _onBlurred: function onBlurred() {
                this.isActivated = false;
                this.dropdown.empty();
                this.dropdown.close();
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var cursorDatum, topSuggestionDatum;
                cursorDatum = this.dropdown.getDatumForCursor();
                topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
                if (cursorDatum) {
                    this._select(cursorDatum);
                    $e.preventDefault();
                } else if (this.autoselect && topSuggestionDatum) {
                    this._select(topSuggestionDatum);
                    $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var datum;
                if (datum = this.dropdown.getDatumForCursor()) {
                    this._select(datum);
                    $e.preventDefault();
                } else {
                    this._autocomplete(true);
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.dropdown.close();
                this.input.resetInputValue();
            },
            _onUpKeyed: function onUpKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorUp();
                this.dropdown.open();
            },
            _onDownKeyed: function onDownKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorDown();
                this.dropdown.open();
            },
            _onLeftKeyed: function onLeftKeyed() {
                this.dir === "rtl" && this._autocomplete();
            },
            _onRightKeyed: function onRightKeyed() {
                this.dir === "ltr" && this._autocomplete();
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this.input.clearHintIfInvalid();
                query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.empty();
                this.dropdown.open();
                this._setLanguageDirection();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
                this.dropdown.open();
            },
            _setLanguageDirection: function setLanguageDirection() {
                var dir;
                if (this.dir !== (dir = this.input.getLanguageDirection())) {
                    this.dir = dir;
                    this.$node.css("direction", dir);
                    this.dropdown.setLanguageDirection(dir);
                }
            },
            _updateHint: function updateHint() {
                var datum, val, query, escapedQuery, frontMatchRegEx, match;
                datum = this.dropdown.getDatumForTopSuggestion();
                if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
                    val = this.input.getInputValue();
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(datum.value);
                    match ? this.input.setHint(val + match[1]) : this.input.clearHint();
                } else {
                    this.input.clearHint();
                }
            },
            _autocomplete: function autocomplete(laxCursor) {
                var hint, query, isCursorAtEnd, datum;
                hint = this.input.getHint();
                query = this.input.getQuery();
                isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
                if (hint && query !== hint && isCursorAtEnd) {
                    datum = this.dropdown.getDatumForTopSuggestion();
                    datum && this.input.setInputValue(datum.value);
                    this.eventBus.trigger("autocompleted", datum.raw, datum.datasetName);
                }
            },
            _select: function select(datum) {
                this.input.setQuery(datum.value);
                this.input.setInputValue(datum.value, true);
                this._setLanguageDirection();
                this.eventBus.trigger("selected", datum.raw, datum.datasetName);
                this.dropdown.close();
                _.defer(_.bind(this.dropdown.empty, this.dropdown));
            },
            open: function open() {
                this.dropdown.open();
            },
            close: function close() {
                this.dropdown.close();
            },
            setVal: function setVal(val) {
                val = _.toStr(val);
                if (this.isActivated) {
                    this.input.setInputValue(val);
                } else {
                    this.input.setQuery(val);
                    this.input.setInputValue(val, true);
                }
                this._setLanguageDirection();
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            destroy: function destroy() {
                this.input.destroy();
                this.dropdown.destroy();
                destroyDomStructure(this.$node);
                this.$node = null;
            }
        });
        return Typeahead;
        function buildDom(input, withHint) {
            var $input, $wrapper, $dropdown, $hint;
            $input = $(input);
            $wrapper = $(html.wrapper).css(css.wrapper);
            $dropdown = $(html.dropdown).css(css.dropdown);
            $hint = $input.clone().css(css.hint).css(getBackgroundStyles($input));
            $hint.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder required").prop("readonly", true).attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            });
            $input.data(attrsKey, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass("tt-input").attr({
                autocomplete: "off",
                spellcheck: false
            }).css(withHint ? css.input : css.inputWithNoHint);
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input.wrap($wrapper).parent().prepend(withHint ? $hint : null).append($dropdown);
        }
        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }
        function destroyDomStructure($node) {
            var $input = $node.find(".tt-input");
            _.each($input.data(attrsKey), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.detach().removeData(attrsKey).removeClass("tt-input").insertAfter($node);
            $node.remove();
        }
    }();
    (function() {
        "use strict";
        var old, typeaheadKey, methods;
        old = $.fn.typeahead;
        typeaheadKey = "ttTypeahead";
        methods = {
            initialize: function initialize(o, datasets) {
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                return this.each(attach);
                function attach() {
                    var $input = $(this), eventBus, typeahead;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    typeahead = new Typeahead({
                        input: $input,
                        eventBus: eventBus = new EventBus({
                            el: $input
                        }),
                        withHint: _.isUndefined(o.hint) ? true : !!o.hint,
                        minLength: o.minLength,
                        autoselect: o.autoselect,
                        datasets: datasets
                    });
                    $input.data(typeaheadKey, typeahead);
                }
            },
            open: function open() {
                return this.each(openTypeahead);
                function openTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.open();
                    }
                }
            },
            close: function close() {
                return this.each(closeTypeahead);
                function closeTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.close();
                    }
                }
            },
            val: function val(newVal) {
                return !arguments.length ? getVal(this.first()) : this.each(setVal);
                function setVal() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.setVal(newVal);
                    }
                }
                function getVal($input) {
                    var typeahead, query;
                    if (typeahead = $input.data(typeaheadKey)) {
                        query = typeahead.getVal();
                    }
                    return query;
                }
            },
            destroy: function destroy() {
                return this.each(unattach);
                function unattach() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.destroy();
                        $input.removeData(typeaheadKey);
                    }
                }
            }
        };
        $.fn.typeahead = function(method) {
            var tts;
            if (methods[method] && method !== "initialize") {
                tts = this.filter(function() {
                    return !!$(this).data(typeaheadKey);
                });
                return methods[method].apply(tts, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };
    })();
})(window.jQuery);
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2014 Rico Sta. Cruz
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */
(function(a,b){if(typeof define==="function"&&define.amd){define(["jquery"],b)}else{if(typeof exports==="object"){module.exports=b(require("jquery"))}else{b(a.jQuery)}}}(this,function(k){k.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var d=document.createElement("div");var q={};function b(v){if(v in d.style){return v}var u=["Moz","Webkit","O","ms"];var r=v.charAt(0).toUpperCase()+v.substr(1);for(var t=0;t<u.length;++t){var s=u[t]+r;if(s in d.style){return s}}}function e(){d.style[q.transform]="";d.style[q.transform]="rotateY(90deg)";return d.style[q.transform]!==""}var a=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;q.transition=b("transition");q.transitionDelay=b("transitionDelay");q.transform=b("transform");q.transformOrigin=b("transformOrigin");q.filter=b("Filter");q.transform3d=e();var i={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var f=q.transitionEnd=i[q.transition]||null;for(var p in q){if(q.hasOwnProperty(p)&&typeof k.support[p]==="undefined"){k.support[p]=q[p]}}d=null;k.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};k.cssHooks["transit:transform"]={get:function(r){return k(r).data("transform")||new j()},set:function(s,r){var t=r;if(!(t instanceof j)){t=new j(t)}if(q.transform==="WebkitTransform"&&!a){s.style[q.transform]=t.toString(true)}else{s.style[q.transform]=t.toString()}k(s).data("transform",t)}};k.cssHooks.transform={set:k.cssHooks["transit:transform"].set};k.cssHooks.filter={get:function(r){return r.style[q.filter]},set:function(r,s){r.style[q.filter]=s}};if(k.fn.jquery<"1.8"){k.cssHooks.transformOrigin={get:function(r){return r.style[q.transformOrigin]},set:function(r,s){r.style[q.transformOrigin]=s}};k.cssHooks.transition={get:function(r){return r.style[q.transition]},set:function(r,s){r.style[q.transition]=s}}}n("scale");n("scaleX");n("scaleY");n("translate");n("rotate");n("rotateX");n("rotateY");n("rotate3d");n("perspective");n("skewX");n("skewY");n("x",true);n("y",true);function j(r){if(typeof r==="string"){this.parse(r)}return this}j.prototype={setFromString:function(t,s){var r=(typeof s==="string")?s.split(","):(s.constructor===Array)?s:[s];r.unshift(t);j.prototype.set.apply(this,r)},set:function(s){var r=Array.prototype.slice.apply(arguments,[1]);if(this.setter[s]){this.setter[s].apply(this,r)}else{this[s]=r.join(",")}},get:function(r){if(this.getter[r]){return this.getter[r].apply(this)}else{return this[r]||0}},setter:{rotate:function(r){this.rotate=o(r,"deg")},rotateX:function(r){this.rotateX=o(r,"deg")},rotateY:function(r){this.rotateY=o(r,"deg")},scale:function(r,s){if(s===undefined){s=r}this.scale=r+","+s},skewX:function(r){this.skewX=o(r,"deg")},skewY:function(r){this.skewY=o(r,"deg")},perspective:function(r){this.perspective=o(r,"px")},x:function(r){this.set("translate",r,null)},y:function(r){this.set("translate",null,r)},translate:function(r,s){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(r!==null&&r!==undefined){this._translateX=o(r,"px")}if(s!==null&&s!==undefined){this._translateY=o(s,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var r=(this.scale||"1,1").split(",");if(r[0]){r[0]=parseFloat(r[0])}if(r[1]){r[1]=parseFloat(r[1])}return(r[0]===r[1])?r[0]:r},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var r=0;r<=3;++r){if(t[r]){t[r]=parseFloat(t[r])}}if(t[3]){t[3]=o(t[3],"deg")}return t}},parse:function(s){var r=this;s.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,v,u){r.setFromString(v,u)})},toString:function(t){var s=[];for(var r in this){if(this.hasOwnProperty(r)){if((!q.transform3d)&&((r==="rotateX")||(r==="rotateY")||(r==="perspective")||(r==="transformOrigin"))){continue}if(r[0]!=="_"){if(t&&(r==="scale")){s.push(r+"3d("+this[r]+",1)")}else{if(t&&(r==="translate")){s.push(r+"3d("+this[r]+",0)")}else{s.push(r+"("+this[r]+")")}}}}}return s.join(" ")}};function m(s,r,t){if(r===true){s.queue(t)}else{if(r){s.queue(r,t)}else{s.each(function(){t.call(this)})}}}function h(s){var r=[];k.each(s,function(t){t=k.camelCase(t);t=k.transit.propertyMap[t]||k.cssProps[t]||t;t=c(t);if(q[t]){t=c(q[t])}if(k.inArray(t,r)===-1){r.push(t)}});return r}function g(s,v,x,r){var t=h(s);if(k.cssEase[x]){x=k.cssEase[x]}var w=""+l(v)+" "+x;if(parseInt(r,10)>0){w+=" "+l(r)}var u=[];k.each(t,function(z,y){u.push(y+" "+w)});return u.join(", ")}k.fn.transition=k.fn.transit=function(A,t,z,D){var E=this;var v=0;var x=true;var r=k.extend(true,{},A);if(typeof t==="function"){D=t;t=undefined}if(typeof t==="object"){z=t.easing;v=t.delay||0;x=typeof t.queue==="undefined"?true:t.queue;D=t.complete;t=t.duration}if(typeof z==="function"){D=z;z=undefined}if(typeof r.easing!=="undefined"){z=r.easing;delete r.easing}if(typeof r.duration!=="undefined"){t=r.duration;delete r.duration}if(typeof r.complete!=="undefined"){D=r.complete;delete r.complete}if(typeof r.queue!=="undefined"){x=r.queue;delete r.queue}if(typeof r.delay!=="undefined"){v=r.delay;delete r.delay}if(typeof t==="undefined"){t=k.fx.speeds._default}if(typeof z==="undefined"){z=k.cssEase._default}t=l(t);var F=g(r,t,z,v);var C=k.transit.enabled&&q.transition;var u=C?(parseInt(t,10)+parseInt(v,10)):0;if(u===0){var B=function(G){E.css(r);if(D){D.apply(E)}if(G){G()}};m(E,x,B);return E}var y={};var s=function(I){var H=false;var G=function(){if(H){E.unbind(f,G)}if(u>0){E.each(function(){this.style[q.transition]=(y[this]||null)})}if(typeof D==="function"){D.apply(E)}if(typeof I==="function"){I()}};if((u>0)&&(f)&&(k.transit.useTransitionEnd)){H=true;E.bind(f,G)}else{window.setTimeout(G,u)}E.each(function(){if(u>0){this.style[q.transition]=F}k(this).css(r)})};var w=function(G){this.offsetWidth;s(G)};m(E,x,w);return this};function n(s,r){if(!r){k.cssNumber[s]=true}k.transit.propertyMap[s]=q.transform;k.cssHooks[s]={get:function(v){var u=k(v).css("transit:transform");return u.get(s)},set:function(v,w){var u=k(v).css("transit:transform");u.setFromString(s,w);k(v).css({"transit:transform":u})}}}function c(r){return r.replace(/([A-Z])/g,function(s){return"-"+s.toLowerCase()})}function o(s,r){if((typeof s==="string")&&(!s.match(/^[\-0-9\.]+$/))){return s}else{return""+s+r}}function l(s){var r=s;if(typeof r==="string"&&(!r.match(/^[\-0-9\.]+/))){r=k.fx.speeds[r]||k.fx.speeds._default}return o(r,"ms")}k.transit.getTransitionValue=g;return k}));

/**
 * imagesLoaded PACKAGED v3.0.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){"use strict";function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},"function"==typeof define&&define.amd?define(function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){"use strict";var t=document.documentElement,n=function(){};t.addEventListener?n=function(e,t,n){e.addEventListener(t,n,!1)}:t.attachEvent&&(n=function(t,n,i){t[n+i]=i.handleEvent?function(){var t=e.event;t.target=t.target||t.srcElement,i.handleEvent.call(i,t)}:function(){var n=e.event;n.target=n.target||n.srcElement,i.call(t,n)},t.attachEvent("on"+n,t[n+i])});var i=function(){};t.removeEventListener?i=function(e,t,n){e.removeEventListener(t,n,!1)}:t.detachEvent&&(i=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var r={bind:n,unbind:i};"function"==typeof define&&define.amd?define(r):e.eventie=r}(this),function(e){"use strict";function t(e,t){for(var n in t)e[n]=t[n];return e}function n(e){return"[object Array]"===c.call(e)}function i(e){var t=[];if(n(e))t=e;else if("number"==typeof e.length)for(var i=0,r=e.length;r>i;i++)t.push(e[i]);else t.push(e);return t}function r(e,n){function r(e,n,s){if(!(this instanceof r))return new r(e,n);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=i(e),this.options=t({},this.options),"function"==typeof n?s=n:t(this.options,n),s&&this.on("always",s),this.getImages(),o&&(this.jqDeferred=new o.Deferred);var a=this;setTimeout(function(){a.check()})}function c(e){this.img=e}r.prototype=new e,r.prototype.options={},r.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,o=i.length;o>r;r++){var s=i[r];this.addImage(s)}}},r.prototype.addImage=function(e){var t=new c(e);this.images.push(t)},r.prototype.check=function(){function e(e,r){return t.options.debug&&a&&s.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},r.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify(t,e)})},r.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},o&&(o.fn.imagesLoaded=function(e,t){var n=new r(this,e,t);return n.jqDeferred.promise(o(this))});var f={};return c.prototype=new e,c.prototype.check=function(){var e=f[this.img.src];if(e)return this.useCached(e),void 0;if(f[this.img.src]=this,this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this.proxyImage=new Image;n.bind(t,"load",this),n.bind(t,"error",this),t.src=this.img.src},c.prototype.useCached=function(e){if(e.isConfirmed)this.confirm(e.isLoaded,"cached was confirmed");else{var t=this;e.on("confirm",function(e){return t.confirm(e.isLoaded,"cache emitted confirmed"),!0})}},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindProxyEvents()},c.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindProxyEvents()},c.prototype.unbindProxyEvents=function(){n.unbind(this.proxyImage,"load",this),n.unbind(this.proxyImage,"error",this)},r}var o=e.jQuery,s=e.console,a=s!==void 0,c=Object.prototype.toString;"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],r):e.imagesLoaded=r(e.EventEmitter,e.eventie)}(window);

/*! iCheck v1.0.2 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
(function(f){function A(a,b,d){var c=a[0],g=/er/.test(d)?_indeterminate:/bl/.test(d)?n:k,e=d==_update?{checked:c[k],disabled:c[n],indeterminate:"true"==a.attr(_indeterminate)||"false"==a.attr(_determinate)}:c[g];if(/^(ch|di|in)/.test(d)&&!e)x(a,g);else if(/^(un|en|de)/.test(d)&&e)q(a,g);else if(d==_update)for(var f in e)e[f]?x(a,f,!0):q(a,f,!0);else if(!b||"toggle"==d){if(!b)a[_callback]("ifClicked");e?c[_type]!==r&&q(a,g):x(a,g)}}function x(a,b,d){var c=a[0],g=a.parent(),e=b==k,u=b==_indeterminate,
v=b==n,s=u?_determinate:e?y:"enabled",F=l(a,s+t(c[_type])),B=l(a,b+t(c[_type]));if(!0!==c[b]){if(!d&&b==k&&c[_type]==r&&c.name){var w=a.closest("form"),p='input[name="'+c.name+'"]',p=w.length?w.find(p):f(p);p.each(function(){this!==c&&f(this).data(m)&&q(f(this),b)})}u?(c[b]=!0,c[k]&&q(a,k,"force")):(d||(c[b]=!0),e&&c[_indeterminate]&&q(a,_indeterminate,!1));D(a,e,b,d)}c[n]&&l(a,_cursor,!0)&&g.find("."+C).css(_cursor,"default");g[_add](B||l(a,b)||"");g.attr("role")&&!u&&g.attr("aria-"+(v?n:k),"true");
g[_remove](F||l(a,s)||"")}function q(a,b,d){var c=a[0],g=a.parent(),e=b==k,f=b==_indeterminate,m=b==n,s=f?_determinate:e?y:"enabled",q=l(a,s+t(c[_type])),r=l(a,b+t(c[_type]));if(!1!==c[b]){if(f||!d||"force"==d)c[b]=!1;D(a,e,s,d)}!c[n]&&l(a,_cursor,!0)&&g.find("."+C).css(_cursor,"pointer");g[_remove](r||l(a,b)||"");g.attr("role")&&!f&&g.attr("aria-"+(m?n:k),"false");g[_add](q||l(a,s)||"")}function E(a,b){if(a.data(m)){a.parent().html(a.attr("style",a.data(m).s||""));if(b)a[_callback](b);a.off(".i").unwrap();
f(_label+'[for="'+a[0].id+'"]').add(a.closest(_label)).off(".i")}}function l(a,b,f){if(a.data(m))return a.data(m).o[b+(f?"":"Class")]}function t(a){return a.charAt(0).toUpperCase()+a.slice(1)}function D(a,b,f,c){if(!c){if(b)a[_callback]("ifToggled");a[_callback]("ifChanged")[_callback]("if"+t(f))}}var m="iCheck",C=m+"-helper",r="radio",k="checked",y="un"+k,n="disabled";_determinate="determinate";_indeterminate="in"+_determinate;_update="update";_type="type";_click="click";_touch="touchbegin.i touchend.i";
_add="addClass";_remove="removeClass";_callback="trigger";_label="label";_cursor="cursor";_mobile=/ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);f.fn[m]=function(a,b){var d='input[type="checkbox"], input[type="'+r+'"]',c=f(),g=function(a){a.each(function(){var a=f(this);c=a.is(d)?c.add(a):c.add(a.find(d))})};if(/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(a))return a=a.toLowerCase(),g(this),c.each(function(){var c=
f(this);"destroy"==a?E(c,"ifDestroyed"):A(c,!0,a);f.isFunction(b)&&b()});if("object"!=typeof a&&a)return this;var e=f.extend({checkedClass:k,disabledClass:n,indeterminateClass:_indeterminate,labelHover:!0},a),l=e.handle,v=e.hoverClass||"hover",s=e.focusClass||"focus",t=e.activeClass||"active",B=!!e.labelHover,w=e.labelHoverClass||"hover",p=(""+e.increaseArea).replace("%","")|0;if("checkbox"==l||l==r)d='input[type="'+l+'"]';-50>p&&(p=-50);g(this);return c.each(function(){var a=f(this);E(a);var c=this,
b=c.id,g=-p+"%",d=100+2*p+"%",d={position:"absolute",top:g,left:g,display:"block",width:d,height:d,margin:0,padding:0,background:"#fff",border:0,opacity:0},g=_mobile?{position:"absolute",visibility:"hidden"}:p?d:{position:"absolute",opacity:0},l="checkbox"==c[_type]?e.checkboxClass||"icheckbox":e.radioClass||"i"+r,z=f(_label+'[for="'+b+'"]').add(a.closest(_label)),u=!!e.aria,y=m+"-"+Math.random().toString(36).substr(2,6),h='<div class="'+l+'" '+(u?'role="'+c[_type]+'" ':"");u&&z.each(function(){h+=
'aria-labelledby="';this.id?h+=this.id:(this.id=y,h+=y);h+='"'});h=a.wrap(h+"/>")[_callback]("ifCreated").parent().append(e.insert);d=f('<ins class="'+C+'"/>').css(d).appendTo(h);a.data(m,{o:e,s:a.attr("style")}).css(g);e.inheritClass&&h[_add](c.className||"");e.inheritID&&b&&h.attr("id",m+"-"+b);"static"==h.css("position")&&h.css("position","relative");A(a,!0,_update);if(z.length)z.on(_click+".i mouseover.i mouseout.i "+_touch,function(b){var d=b[_type],e=f(this);if(!c[n]){if(d==_click){if(f(b.target).is("a"))return;
A(a,!1,!0)}else B&&(/ut|nd/.test(d)?(h[_remove](v),e[_remove](w)):(h[_add](v),e[_add](w)));if(_mobile)b.stopPropagation();else return!1}});a.on(_click+".i focus.i blur.i keyup.i keydown.i keypress.i",function(b){var d=b[_type];b=b.keyCode;if(d==_click)return!1;if("keydown"==d&&32==b)return c[_type]==r&&c[k]||(c[k]?q(a,k):x(a,k)),!1;if("keyup"==d&&c[_type]==r)!c[k]&&x(a,k);else if(/us|ur/.test(d))h["blur"==d?_remove:_add](s)});d.on(_click+" mousedown mouseup mouseover mouseout "+_touch,function(b){var d=
b[_type],e=/wn|up/.test(d)?t:v;if(!c[n]){if(d==_click)A(a,!1,!0);else{if(/wn|er|in/.test(d))h[_add](e);else h[_remove](e+" "+t);if(z.length&&B&&e==v)z[/ut|nd/.test(d)?_remove:_add](w)}if(_mobile)b.stopPropagation();else return!1}})})}})(window.jQuery);

function countUp(a,b,c,d,e,f){for(var g=0,h=["webkit","moz","ms","o"],i=0;i<h.length&&!window.requestAnimationFrame;++i)window.requestAnimationFrame=window[h[i]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[h[i]+"CancelAnimationFrame"]||window[h[i]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a){var c=(new Date).getTime(),d=Math.max(0,16-(c-g)),e=window.setTimeout(function(){a(c+d)},d);return g=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)}),this.options=f||{useEasing:!0,useGrouping:!0,separator:",",decimal:"."},""==this.options.separator&&(this.options.useGrouping=!1),null==this.options.prefix&&(this.options.prefix=""),null==this.options.suffix&&(this.options.suffix="");var j=this;this.d="string"==typeof a?document.getElementById(a):a,this.startVal=Number(b),this.endVal=Number(c),this.countDown=this.startVal>this.endVal?!0:!1,this.startTime=null,this.timestamp=null,this.remaining=null,this.frameVal=this.startVal,this.rAF=null,this.decimals=Math.max(0,d||0),this.dec=Math.pow(10,this.decimals),this.duration=1e3*e||2e3,this.version=function(){return"1.3.2"},this.printValue=function(a){var b=isNaN(a)?"--":j.formatNumber(a);"INPUT"==j.d.tagName?this.d.value=b:"text"==j.d.tagName?this.d.textContent=b:this.d.innerHTML=b},this.easeOutExpo=function(a,b,c,d){return 1024*c*(-Math.pow(2,-10*a/d)+1)/1023+b},this.count=function(a){null===j.startTime&&(j.startTime=a),j.timestamp=a;var b=a-j.startTime;if(j.remaining=j.duration-b,j.options.useEasing)if(j.countDown){var c=j.easeOutExpo(b,0,j.startVal-j.endVal,j.duration);j.frameVal=j.startVal-c}else j.frameVal=j.easeOutExpo(b,j.startVal,j.endVal-j.startVal,j.duration);else if(j.countDown){var c=(j.startVal-j.endVal)*(b/j.duration);j.frameVal=j.startVal-c}else j.frameVal=j.startVal+(j.endVal-j.startVal)*(b/j.duration);j.frameVal=j.countDown?j.frameVal<j.endVal?j.endVal:j.frameVal:j.frameVal>j.endVal?j.endVal:j.frameVal,j.frameVal=Math.round(j.frameVal*j.dec)/j.dec,j.printValue(j.frameVal),b<j.duration?j.rAF=requestAnimationFrame(j.count):null!=j.callback&&j.callback()},this.start=function(a){return j.callback=a,isNaN(j.endVal)||isNaN(j.startVal)?(console.log("countUp error: startVal or endVal is not a number"),j.printValue()):j.rAF=requestAnimationFrame(j.count),!1},this.stop=function(){cancelAnimationFrame(j.rAF)},this.reset=function(){j.startTime=null,j.startVal=b,cancelAnimationFrame(j.rAF),j.printValue(j.startVal)},this.resume=function(){j.stop(),j.startTime=null,j.duration=j.remaining,j.startVal=j.frameVal,requestAnimationFrame(j.count)},this.formatNumber=function(a){a=a.toFixed(j.decimals),a+="";var b,c,d,e;if(b=a.split("."),c=b[0],d=b.length>1?j.options.decimal+b[1]:"",e=/(\d+)(\d{3})/,j.options.useGrouping)for(;e.test(c);)c=c.replace(e,"$1"+j.options.separator+"$2");return j.options.prefix+c+d+j.options.suffix},j.printValue(j.startVal)}