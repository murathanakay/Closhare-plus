/*!
 * Justified Gallery - v3.4.0
 * http://miromannino.com/projects/justified-gallery/
 * Copyright (c) 2014 Miro Mannino
 * Licensed under the MIT license.
 */
!function(a){a.fn.justifiedGallery=function(b){function c(a,b,c){var d;return d=a>b?a:b,100>=d?c.settings.sizeRangeSuffixes.lt100:240>=d?c.settings.sizeRangeSuffixes.lt240:320>=d?c.settings.sizeRangeSuffixes.lt320:500>=d?c.settings.sizeRangeSuffixes.lt500:640>=d?c.settings.sizeRangeSuffixes.lt640:c.settings.sizeRangeSuffixes.lt1024}function d(a,b){return-1!==a.indexOf(b,a.length-b.length)}function e(a,b){return a.substring(0,a.length-b.length)}function f(a,b){var c=!1;for(var e in b.settings.sizeRangeSuffixes)if(0!==b.settings.sizeRangeSuffixes[e].length){if(d(a,b.settings.sizeRangeSuffixes[e]))return b.settings.sizeRangeSuffixes[e]}else c=!0;if(c)return"";throw"unknown suffix for "+a}function g(a,b,d,g){var h=a.match(g.settings.extension),i=null!=h?h[0]:"",j=a.replace(g.settings.extension,"");return j=e(j,f(j,g)),j+=c(b,d,g)+i}function h(b){var c=a(b.currentTarget).find(".caption");b.data.settings.cssAnimation?c.addClass("caption-visible").removeClass("caption-hidden"):c.stop().fadeTo(b.data.settings.captionSettings.animationDuration,b.data.settings.captionSettings.visibleOpacity)}function i(b){var c=a(b.currentTarget).find(".caption");b.data.settings.cssAnimation?c.removeClass("caption-visible").removeClass("caption-hidden"):c.stop().fadeTo(b.data.settings.captionSettings.animationDuration,b.data.settings.captionSettings.nonVisibleOpacity)}function j(a,b,c){c.settings.cssAnimation?(a.addClass("entry-visible"),b()):a.stop().fadeTo(c.settings.imagesAnimationDuration,1,b)}function k(a,b){b.settings.cssAnimation?a.removeClass("entry-visible"):a.stop().fadeTo(0,0)}function l(b,c,d,e,f,k,l){function m(){o!==p&&n.attr("src",p)}var n=b.find("img");n.css("width",e),n.css("height",f),n.css("margin-left",-e/2),n.css("margin-top",-f/2),b.width(e),b.height(k),b.css("top",d),b.css("left",c);var o=n.attr("src"),p=g(o,e,f,l);n.one("error",function(){n.attr("src",n.data("jg.originalSrc"))}),"skipped"===n.data("jg.loaded")?n.one("load",function(){j(b,m,l),n.data("jg.loaded","loaded")}):j(b,m,l);var q=b.data("jg.captionMouseEvents");if(l.settings.captions===!0){var r=b.find(".caption");if(0===r.length){var s=n.attr("alt");"undefined"==typeof s&&(s=b.attr("title")),"undefined"!=typeof s&&(r=a('<div class="caption">'+s+"</div>"),b.append(r))}0!==r.length&&(l.settings.cssAnimation||r.stop().fadeTo(l.settings.imagesAnimationDuration,l.settings.captionSettings.nonVisibleOpacity),"undefined"==typeof q&&(q={mouseenter:h,mouseleave:i},b.on("mouseenter",void 0,l,q.mouseenter),b.on("mouseleave",void 0,l,q.mouseleave),b.data("jg.captionMouseEvents",q)))}else"undefined"!=typeof q&&(b.off("mouseenter",void 0,l,q.mouseenter),b.off("mouseleave",void 0,l,q.mouseleave),b.removeData("jg.captionMouseEvents"))}function m(a,b){var c,d,e,f,g,h,i=a.settings,j=!0,k=0,l=a.galleryWidth-(a.buildingRow.entriesBuff.length-1)*i.margins,m=l/a.buildingRow.aspectRatio,n=a.buildingRow.width/l>i.justifyThreshold;if(b&&"hide"===i.lastRow&&!n){for(c=0;c<a.buildingRow.entriesBuff.length;c++)d=a.buildingRow.entriesBuff[c],i.cssAnimation?d.removeClass("entry-visible"):d.stop().fadeTo(0,0);return-1}for(b&&!n&&"nojustify"===i.lastRow&&(j=!1),c=0;c<a.buildingRow.entriesBuff.length;c++)e=a.buildingRow.entriesBuff[c].find("img"),f=e.data("jg.imgw")/e.data("jg.imgh"),j?(g=m*f,h=m):(g=i.rowHeight*f,h=i.rowHeight),e.data("jg.jimgw",Math.ceil(g)),e.data("jg.jimgh",Math.ceil(h)),(0===c||k>h)&&(k=h);return i.fixedHeight&&k>i.rowHeight&&(k=i.rowHeight),{minHeight:k,justify:j}}function n(a){a.lastAnalyzedIndex=-1,a.buildingRow.entriesBuff=[],a.buildingRow.aspectRatio=0,a.buildingRow.width=0,a.offY=0}function o(a,b){var c,d,e,f,g=a.settings,h=0;if(f=m(a,b),e=f.minHeight,b&&"hide"===g.lastRow&&-1===e)return a.buildingRow.entriesBuff=[],a.buildingRow.aspectRatio=0,void(a.buildingRow.width=0);g.maxRowHeight>0&&g.maxRowHeight<e?e=g.maxRowHeight:0===g.maxRowHeight&&1.5*g.rowHeight<e&&(e=1.5*g.rowHeight);for(var i=0;i<a.buildingRow.entriesBuff.length;i++)c=a.buildingRow.entriesBuff[i],d=c.find("img"),l(c,h,a.offY,d.data("jg.jimgw"),d.data("jg.jimgh"),e,a),h+=d.data("jg.jimgw")+g.margins;a.$gallery.height(a.offY+e+(a.spinner.active?a.spinner.$el.innerHeight():0)),(!b||e<=a.settings.rowHeight&&f.justify)&&(a.offY+=e+a.settings.margins,a.buildingRow.entriesBuff=[],a.buildingRow.aspectRatio=0,a.buildingRow.width=0,a.$gallery.trigger("jg.rowflush"))}function p(a){a.checkWidthIntervalId=setInterval(function(){var b=parseInt(a.$gallery.width(),10);a.galleryWidth!==b&&(a.galleryWidth=b,n(a),t(a,!0))},a.settings.refreshTime)}function q(a){clearInterval(a.intervalId),a.intervalId=setInterval(function(){a.phase<a.$points.length?a.$points.eq(a.phase).fadeTo(a.timeslot,1):a.$points.eq(a.phase-a.$points.length).fadeTo(a.timeslot,0),a.phase=(a.phase+1)%(2*a.$points.length)},a.timeslot)}function r(a){clearInterval(a.intervalId),a.intervalId=null}function s(a){a.yield.flushed=0,null!==a.imgAnalyzerTimeout&&clearTimeout(a.imgAnalyzerTimeout)}function t(a,b){s(a),a.imgAnalyzerTimeout=setTimeout(function(){u(a,b)},.001),u(a,b)}function u(b,c){for(var d,e=b.settings,f=b.lastAnalyzedIndex+1;f<b.entries.length;f++){var g=a(b.entries[f]),h=g.find("img");if(h.data("jg.loaded")===!0||"skipped"===h.data("jg.loaded")){d=f>=b.entries.length-1;var i=b.galleryWidth-(b.buildingRow.entriesBuff.length-1)*e.margins,j=h.data("jg.imgw")/h.data("jg.imgh");if(i/(b.buildingRow.aspectRatio+j)<e.rowHeight&&(o(b,d),++b.yield.flushed>=b.yield.every))return void t(b,c);b.buildingRow.entriesBuff.push(g),b.buildingRow.aspectRatio+=j,b.buildingRow.width+=j*e.rowHeight,b.lastAnalyzedIndex=f}else if("error"!==h.data("jg.loaded"))return}b.buildingRow.entriesBuff.length>0&&o(b,!0),b.spinner.active&&(b.spinner.active=!1,b.$gallery.height(b.$gallery.height()-b.spinner.$el.innerHeight()),b.spinner.$el.detach(),r(b.spinner)),s(b),b.$gallery.trigger(c?"jg.resize":"jg.complete")}function v(a){function b(a){if("string"!=typeof d.sizeRangeSuffixes[a])throw"sizeRangeSuffixes."+a+" must be a string"}function c(a,b){if("string"==typeof a[b]){if(a[b]=parseFloat(a[b],10),isNaN(a[b]))throw"invalid number for "+b}else{if("number"!=typeof a[b])throw b+" must be a number";if(isNaN(a[b]))throw"invalid number for "+b}}var d=a.settings;if("object"!=typeof d.sizeRangeSuffixes)throw"sizeRangeSuffixes must be defined and must be an object";if(b("lt100"),b("lt240"),b("lt320"),b("lt500"),b("lt640"),b("lt1024"),c(d,"rowHeight"),c(d,"maxRowHeight"),d.maxRowHeight>0&&d.maxRowHeight<d.rowHeight&&(d.maxRowHeight=d.rowHeight),c(d,"margins"),"nojustify"!==d.lastRow&&"justify"!==d.lastRow&&"hide"!==d.lastRow)throw'lastRow must be "nojustify", "justify" or "hide"';if(c(d,"justifyThreshold"),d.justifyThreshold<0||d.justifyThreshold>1)throw"justifyThreshold must be in the interval [0,1]";if("boolean"!=typeof d.cssAnimation)throw"cssAnimation must be a boolean";if(c(d.captionSettings,"animationDuration"),c(d,"imagesAnimationDuration"),c(d.captionSettings,"visibleOpacity"),d.captionSettings.visibleOpacity<0||d.captionSettings.visibleOpacity>1)throw"captionSettings.visibleOpacity must be in the interval [0, 1]";if(c(d.captionSettings,"nonVisibleOpacity"),d.captionSettings.visibleOpacity<0||d.captionSettings.visibleOpacity>1)throw"captionSettings.nonVisibleOpacity must be in the interval [0, 1]";if("boolean"!=typeof d.fixedHeight)throw"fixedHeight must be a boolean";if("boolean"!=typeof d.captions)throw"captions must be a boolean";if(c(d,"refreshTime"),"boolean"!=typeof d.randomize)throw"randomize must be a boolean"}var w={sizeRangeSuffixes:{lt100:"_t",lt240:"_m",lt320:"_n",lt500:"",lt640:"_z",lt1024:"_b"},rowHeight:120,maxRowHeight:0,margins:1,lastRow:"nojustify",justifyThreshold:.75,fixedHeight:!1,waitThumbnailsLoad:!0,captions:!0,cssAnimation:!1,imagesAnimationDuration:500,captionSettings:{animationDuration:500,visibleOpacity:.7,nonVisibleOpacity:0},rel:null,target:null,extension:/\.[^.\\/]+$/,refreshTime:100,randomize:!1};return this.each(function(c,d){var e=a(d);e.addClass("justified-gallery");var f=e.data("jg.context");if("undefined"==typeof f){if("undefined"!=typeof b&&null!==b&&"object"!=typeof b)throw"The argument must be an object";var g=a('<div class="spinner"><span></span><span></span><span></span></div>');f={settings:a.extend({},w,b),imgAnalyzerTimeout:null,entries:null,buildingRow:{entriesBuff:[],width:0,aspectRatio:0},lastAnalyzedIndex:-1,"yield":{every:2,flushed:0},offY:0,spinner:{active:!1,phase:0,timeslot:150,$el:g,$points:g.find("span"),intervalId:null},checkWidthIntervalId:null,galleryWidth:e.width(),$gallery:e},e.data("jg.context",f)}else if("norewind"===b)for(var h=0;h<f.buildingRow.entriesBuff.length;h++)k(f.buildingRow.entriesBuff[h],f);else f.settings=a.extend({},f.settings,b),n(f);if(v(f),f.entries=e.find("> a, > div:not(.spinner)").toArray(),0!==f.entries.length){f.settings.randomize&&(f.entries.sort(function(){return 2*Math.random()-1}),a.each(f.entries,function(){a(this).appendTo(e)}));var i=!1;a.each(f.entries,function(b,c){var d=a(c),g=d.find("img");if(g.data("jg.loaded")!==!0&&"skipped"!==g.data("jg.loaded")){null!==f.settings.rel&&d.attr("rel",f.settings.rel),null!==f.settings.target&&d.attr("target",f.settings.target);var h="undefined"!=typeof g.data("safe-src")?g.data("safe-src"):g.attr("src");g.data("jg.originalSrc",h),g.attr("src",h);var j=parseInt(g.attr("width"),10),k=parseInt(g.attr("height"),10);if(f.settings.waitThumbnailsLoad!==!0&&!isNaN(j)&&!isNaN(k))return g.data("jg.imgw",j),g.data("jg.imgh",k),g.data("jg.loaded","skipped"),t(f,!1),!0;g.data("jg.loaded",!1),i=!0,f.spinner.active===!1&&(f.spinner.active=!0,e.append(f.spinner.$el),e.height(f.offY+f.spinner.$el.innerHeight()),q(f.spinner));var l=new Image,m=a(l);m.one("load",function(){g.off("load error"),g.data("jg.imgw",l.width),g.data("jg.imgh",l.height),g.data("jg.loaded",!0),t(f,!1)}),m.one("error",function(){g.off("load error"),g.data("jg.loaded","error"),t(f,!1)}),l.src=h}}),i||t(f,!1),p(f)}})}}(jQuery);
(function($) {
  
  $.fn.imgLoader = function(threshold, callback) {
 
    var $w = $(window),
        th = threshold || 0,
        attrib = "data-src",
        images = this,
        loaded = [],
        inview,
        source;

    this.one("imgLoader", function() {
      var source = this.getAttribute(attrib),
          source = source || this.getAttribute("data-src");
      if (source){
          var $this = $(this);
          $this.removeAttr(attrib).attr("src", source);
      }
    });

    function imgLoader() {
      inview = images.filter(function() {
        var $e = $(this),
            wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.outerHeight();

          return (eb >= wt - th && et <= wb + th);
      });
      
      
      (function showi(i) {
          if (i >= inview.length) return i;
          $(inview[i]).trigger("imgLoader");
          setTimeout(function(){
              showi(i+1);   
          },50);
          
//          console.log(inview.length, i)
          if(i+1 == inview.length){
              if (typeof callback === "function") callback.call(inview);
          }
          
      })(0);
      
  }

   $w.on("scroll.imgLoader resize.imgLoader lookup.imgLoader", imgLoader);
        imgLoader();
        
        return this;        

  };
  
})(window.jQuery);
