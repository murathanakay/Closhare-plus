$(function () {
    uploadButton = $('<button type="button"/ class="startstop dn">')
            .on('click', function () {
                var $this = $(this),
                        data = $this.data() || false;
                data.abort().done(function () {
                    $this.remove();
                });
            });

    clearButton = $('<button type="button"/>')
            .addClass('btn clear dnone')
            .on('click', function () {
                var $this = $(this),
                        data = $this.data() || false;

                if (data) {
                    data.abort();
                    data.context.remove();
                }
            });

    removeButton = $('<button type="button"/>')
            .addClass('btn btn-danger btn-small remove').attr("title", "Remove").append('<i class="icon-remove"/>')
            .on('click', function () {
                var $this = $(this),
                        data = $this.closest("li").find("button.startstop").data() || false;
                if (data) {
                    data.abort();
                }
                if ($('#files').find("li").length == 1) {
                    $toolBarclearbtn.trigger("click");

                } else {
                    if (data)
                        removeNode(data.context.find("li"));
                    else
                        removeNode($this.closest("li"));
                }
            });

    $progBar = $("#uprogress");
    $totalProg = $('#totalProgress');
    $sumProg = $('#sumProgress');
    
    progressHtmlText = {
        "uploading": '<div class="indicator green sm"><span></span><span></span><span></span></div> Uploading Files',
        "completed": '<i class="icon icon-check light-green"></i> Upload Completed!',
        "timeremaining": 'Time remaining',
        "timeelapsed": "Time elapsed"
    }

    var predefinedUo = {
        url: AJAX_PATH,
        dataType: 'json',
        sequentialUploads: true,
        maxFileSize: 500000000, // 50 MB,
        maxChunkSize: 1000000,
        formData: [
            {name: 'uploadme', value: 1},
            {name: 'dir', value: dir.id},
            {name: 'path', value: dir.path}
        ],
        progress: function (e, data) {
            if (e.isDefaultPrevented()) {
                return false;
            }
            var $this = $(this),
                    that = $this.data('xnu-fileupload') ||
                    $this.data('fileupload');


            var cx = $(this).data("xnuFileupload").options.previewMaxWidth / 2,
                    cy = $(this).data("xnuFileupload").options.previewMaxHeight / 2;

            var progress = Math.floor(data.loaded / data.total * 100),
                    rest = parseInt(100 - progress),
                    lastval = (rest == 0 ? 0.01 : rest),
                    progress = progress == 100 ? 99.99 : progress

            var pval = 360 * progress / 100,
                    lval = 360 - pval,
                    paper = data.anim,
                    paths = paper.paths;

            var s0 = [cx, cy, cy, 0, lval, 1, "#8AC53E"];
            paths[0].animate({segment: s0}, 1500, "bounce");
            paths[0].angle = 0;

            var s1 = [cx, cy, cy, 0, pval, 0, "#8AC53E"];
            paths[1].animate({segment: s1}, 1500, "bounce");
            paths[1].angle = 0;

            //create individual file progress
            data.context.each(function (index) {


                var file = data.files[index],
                        fileId = file.uniqueId,
                        $el = $("#" + fileId),
                        $cont = $(".fileupload-progress .current .upload-part").last(),
                        percent = parseInt(data.loaded / data.total * 100, 10);
                //set percent
                $el.find(".percent b").text(percent)
                $el.find(".bar").css("width", percent + "%")
                //set loaded - total
                $el.find(".completed").text(that._formatFileSize(data.loaded))
                $el.find(".total").text(that._formatFileSize(data.total))

            });

        },
        completed: function (e, data) {
            //set opacity to remove upload animation
            //wait a bit to remove
            var paper = data.anim;

            setTimeout(function () {
                paper.bottom.animate({fill: "#fff", "opacity": 0}, 2000, function () {

                    paper.remove();
                });
                paper.bottom.next.animate({"opacity": 0}, 1000);
                paper.bottom.next.next.animate({"opacity": 0}, 1500);

            }, 1000);

            $.each(data.result.files, function (index, file) {

                var $co = $(data.context[index]);

                $co.find(".tnpreviewImageContainer").addClass("done")
                var img;
                img = new Image();
                img.onload = function () {
                    $co.find(".tnpreviewImageContainer").removeClass("done")
                };
                img.src = file.preview;
            });
        },
        failed: function (e, data) {

            if (data._progress.loaded > 0) {
                var path = data.formData[3].value //-> sended path
                $.getJSON(AJAX_PATH, {action: "encr", str: path}).done(function (respond) {
                    $.ajaxQueue({
                        url: AJAX_PATH+'?cancel=true&file=' + data.files[0].name + '&store=' + respond.hash,
                        noind: true,
                        async: false,
                        dataType: 'json',
                        type: 'DELETE',
                        success: function (response) {
                            data.context.detach().remove();
                        }
                    });
                });
            }
        }

    };

    var opt = $.extend(true, predefinedUo, uOptions);

    $('#fileupload').fileupload(opt)
            .on('fileuploadstart', function (e, data) {
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload');
                $list.addClass("listdown");
                //store start time
                that.startedTime = new Date();
                
            }).on('fileuploadstop', function (e) {
        var that = $(this).data('xnu-fileupload') ||
                $(this).data('fileupload');
        
        setTimeout(function(){
            $('.fileupload-progress').slideUp();
//        that._transition($('.fileupload-progress')).done(
//                function () {
//                    $(this).find('.progress .bar').css('width', '0%');
//                    $(".fileupload-progress .current").html("");
//                    //$(this).find('.percent').css('left', 0)
//                }
//        );
        },1600);
        setTimeout(function(){
            $list.removeClass("listdown");
        },2500)
    });

    styleFileInputs();

    $(document).bind("dragover", function (e) {

        var dropZone = $('#dropzone'),
                timeout = window.dropZoneTimeout;
        if (!timeout) {
            dropZone.addClass('in');
        } else {
            clearTimeout(timeout);
        }
        var found = false,
                node = e.target;
        do {
            if (node === dropZone[0]) {
                found = true;
                break;
            }
            node = node.parentNode;
        } while (node !== null && node != null);
        if (found) {
            dropZone.addClass('hover');
            doAnim(dropZone);
        } else {
            dropZone.removeClass('hover');
            doAnim(dropZone);
        }
        window.dropZoneTimeout = setTimeout(function () {
            window.dropZoneTimeout = null;
            dropZone.removeClass('in hover');
        }, 300);
    });

    $(document).on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

});

//create Drag&Drop SVG animation
function doAnim(dropZone) {
    if (dropZone.data("paths")) {

        var data = dropZone.data(),
                paper = data.paths.paper,
                circle = data.paths.circle;
    } else {
        var ww = $(window).width(),
                wh = $(window).height();
        var paths = {},
                paper = Raphael(dropZone[0], ww, wh),
                circle = paper.circle(ww / 2, wh / 2, 240),
                t = paper.text(ww / 2, wh / 2, dropZone.find("span").text());

        t.attr({"font-size": 50, "font-family": "Arial, Helvetica, sans-serif", "fill": "#FFFFFF"});

        dropZone.data("paths", {paper: paper, circle: circle});
    }

    if (circle.attr("stroke-width") > 40) {

        circle.animate({fill: "#223fa3", stroke: "#FFF", "stroke-width": 1, "stroke-opacity": 0.9}, 2000);

    } else if (circle.attr("stroke-width") == 1) {

        circle.animate({fill: "#223fa3", stroke: "#FFF", "stroke-width": 41, "stroke-opacity": 0.9}, 2000);

    }
}

//style file inputs
function styleFileInputs() {
    $(":file").filestyle({
        input: false,
        buttonText: "Upload",
        classButton: 'act btn btn-block fileinput-button dblock',
        classIcon: 'icon-cloud-upload'
    });
}


/* jshint nomen:false */
/* global define, window */
var jqXHR = null;
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'tmpl',
            './cl.fuploader.image',
            './cl.fuploader.audio',
            './cl.fuploader.video',
            './cl.fuploader.validate'
        ], factory);
    } else {
        // Browser globals:
        factory(
                window.jQuery,
                window.tmpl
                );
    }
}(function ($, tmpl) {
    'use strict';

    $.xnu.fileupload.prototype._specialOptions.push(
            'filesContainer',
            'uploadTemplateId',
            'downloadTemplateId'
            );

    // The UI version extends the file upload widget
    // and adds complete user interface interaction:
    $.widget('xnu.fileupload', $.xnu.fileupload, {
        options: {
            // By default, files added to the widget are uploaded as soon
            // as the user clicks on the start buttons. To enable automatic
            // uploads, set the following option to true:
            autoUpload: true,
            // The ID of the upload template:
            uploadTemplateId: 'item-tpl',
            // The ID of the download template:
            downloadTemplateId: 'item-tpl',
            // The container for the list of files. If undefined, it is set to
            // an element with class "files" inside of the widget element:
            filesContainer: $("#list .directoryList"),
            // By default, files are appended to the files container.
            // Set the following option to true, to prepend files instead:
            prependFiles: true,
            // The expected data type of the upload response, sets the dataType
            // option of the $.ajax upload requests:
            dataType: 'json',
            waitt: 300, //wait for complete animation

            // Function returning the current number of files,
            // used by the maxNumberOfFiles validation:
            getNumberOfFiles: function () {
                return this.filesContainer.children()
                        .not('.rendering').length;
            },
            // Callback to retrieve the list of files from the server response:
            getFilesFromResponse: function (data) {
                if (data.result && $.isArray(data.result.files)) {
                    return data.result.files;
                }
                return [];
            },            
            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop or add API call).
            // See the basic file upload widget for more information:
            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var $this = $(this),
                        that = $this.data('xnu-fileupload') ||
                        $this.data('fileupload'),
                        options = that.options;

                //unique id for each context before render html
                $.each(data.files, function (index) {
                    data.files[index].uniqueId = "ui" + guid();
                });


                data.context = that._renderUpload(data.files)
                        .data('data', data)
                        .addClass('rendering tobeUploaded');
                options.filesContainer[
                        options.prependFiles ? 'prepend' : 'append'
                ](data.context);

                //dynamic preview sizes/ depends devices
                var $ac = data.context.find(".tnpreviewImage"),
                        pw = parseInt($ac.width()),
                        ph = parseInt($ac.height());

                that.options.previewMaxWidth = (that.options.previewMaxWidth < pw) ? that.options.previewMaxWidth : pw;
                that.options.previewMaxHeight = (that.options.previewMaxHeight < ph) ? that.options.previewMaxHeight : ph - 2;


                //fix dynamic formData
                that.options.formData = [
                    {name: 'uploadme', value: 1},
                    {name: 'size', value: 1},
                    {name: 'dir', value: dir.id},
                    {name: 'path', value: dir.path},
                    {name: 'now', value: $.pdate("Y-m-d H:i:s", new Date())}
                ];

                that.options = $.extend(true, that.options, uOptions);

                that._forceReflow(data.context);
                that._transition(data.context);

                data.process(function () {
                    return $this.fileupload('process', data);
                }).always(function () {

                    data.context.each(function (index) {

                        //set form data to send file size : index is 1;
                        that.options.formData[1] = {name: 'size', value: data.files[index].size};

                        $(this).find('.tnfileSize').text(
                                that._formatFileSize(data.files[index].size)
                                );

                    }).removeClass('rendering');

                    that._renderPreviews(data, options);

                    emptyDirectory(true);

                }).done(function () {
                    //data.context.find('.start').prop('disabled', false);
                    //create progress container;
                    data.context.each(function (index) {
                        $(this).find(".tnpreviewImage")
                                .append('<span class="tnuploadIndicator"/>')

                    });

                    if ((that._trigger('added', e, data) !== false) &&
                            (options.autoUpload || data.autoUpload) &&
                            data.autoUpload !== false) {

                        jqXHR = data.submit();
                    }
                    data.context.append(uploadButton.clone(true).data(data));

                    data.context.each(function (index) {
                        var $this = $(this);

                        var close = $('<div class="close" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; cursor: pointer; background: transparent; z-index: 4" rel="tip" data-title="Cancel">');
                        if (touchable) {
                            close.append('<b style="width: 100%; position: absolute; top: 50%; height: 36px; margin-top: -18px; text-align: center; color: rgba(0,0,0,0.8)">Cancel</b>');
                        }
                        close.on("click", function () {
                            //jqXHR.abort();
                            $this.find("button.startstop").trigger("click");
                        });
                        $this.prepend(close);
                    });
                    //scroll viewport to top
                    $screl.scrollTop(0);

                }).fail(function () {
                    console.log("failed")
                    if (data.files.error) {
                        data.context.each(function (index) {
                            var error = data.files[index].error,
                                    errorCode = data.files[index].errorCode
                            $this = $(this);
                            if (error) {
                                $this.addClass("failed");
                                $this.find("input[type=checkbox]").remove()
                                switch (errorCode) {
                                    case "0202":
                                        removeNode($this);
                                        break;
                                    case "0203":
                                        $this.find(".tnpreviewImage").addClass("error");
                                        break;
                                    case "0204":
                                        $this.find(".tnfileSize").addClass("danger").append('<b>(' + error + ')</b>').closest(".bleft").css("width", "auto");
                                        break;
                                    case "0205":
                                        $this.find(".tnfileSize").addClass("danger").append('<b>(' + error + ')</b>').closest(".bleft").css("width", "auto");
                                        break;
                                }
                                $this.find(".dwnTip, .tnpreviewDesc").remove().detach();
                            }
                        });
                    }

                });

            },
            // Callback for the start of each file upload request:
            send: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload');

                //all went ok, now create animation with raphael.                    
                data.context.each(function (index) {
                    var $this = $(this),
                            $cont = $this.find(".tnuploadIndicator"),
                            $ac = $this.find(".tnpreviewImage"),
                            aw = $ac.width(),
                            ah = $ac.height(),
                            paper = Raphael($cont[0], aw, ah),
                            rect = paper.rect(0, 0, aw, ah, 0).attr({fill: "#000", "opacity": 0.6, stroke: 1});
                    $ac.append($cont);

                    var preview = data.files[index].preview;
                    var rgBg = ((preview.width >= aw) ? true : ((preview.height >= ah) ? true : false));

                    var anim = paper.rGPie(aw / 2, ah / 2, ah / 2, [359, 0.1], ["label 1", "label 2"], false, preview, rgBg);

                    paper.paths = anim;
                    data.anim = paper;

                    //file progress
                    $("#" + data.files[index].uniqueId).addClass("on").find(".progress-current-cancel-btn").toggleClass("btn-default disabled btn-black")
                    $("#" + data.files[index].uniqueId).addClass("on").find(".progress-current-cancel-btn").on("click", function () {
                        var guid = $(this).closest(".upload-part")[0].id;
                                                
                        var $context = $body.findItem(guid, "preview", "uniqueid");
                                                
                        $context.find("button.startstop").trigger("click");
                        
                        that._resetFineshedProcess(true, {uniqueId: guid});

                        return false;
                    })

                }).removeClass("tobeUploaded").addClass("uploading");

                if (data.context && data.dataType &&
                        data.dataType.substr(0, 6) === 'iframe') {
                    // Iframe Transport does not support progress events.
                    // In lack of an indeterminate progress bar, we set
                    // the progress to 100%, showing the full animated bar:
                    data.context
                            .find('.progress').addClass(
                            !$.support.transition && 'progress-animated'
                            )
                            .attr('aria-valuenow', 100)
                            .children().first().css(
                            'width',
                            '100%'
                            );
                }

                return that._trigger('sent', e, data);
            },
            // Callback for successful uploads:
            done: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload'),
                        getFilesFromResponse = data.getFilesFromResponse ||
                        that.options.getFilesFromResponse,
                        files = getFilesFromResponse(data),
                        template,
                        deferred;

                hideTip(data.context.find(".close")[0]);

                setTimeout(function () {
                    if (data.context) {
                        data.context.each(function (index) {

                            var file = files[index] ||
                                    {error: 'Empty file upload result'};

                            that._resetFineshedProcess(true, data.files[index]);

                            deferred = that._addFinishedDeferreds();

                            that._transition($(this)).done(
                                    function () {
                                        var node = $(this);
                                        template = that._renderDownload([file])
                                                .replaceAll(node);
                                        that._forceReflow(template);
                                        that._transition(template).done(
                                                function () {
                                                    data.context = $(this);
                                                    that._trigger('completed', e, data);
                                                    that._trigger('finished', e, data);
                                                    deferred.resolve();
                                                    //add to viewer
                                                    $(".vpsve").vobox();
                                                }
                                        );
                                    }
                            );

                            if (file.error) {
                                setTimeout(function () {
                                    template.remove();
                                }, 50);
                                return;
                            }

                            //update total item count +1
                            updateItemsTotalText(false, 1, file.filetype);
                            //remove item & notify user after upload completed if it's not dropped into its mime folder. ie: on filter: image a .doc file dropped and uploaded
                            if (currFilter && currFilter != file.filetype) {
                                $(this).fadeOut("fast", function () {

                                    setTimeout(function () {
                                        template.remove();
                                    }, 50);

                                    $notify.jGrowl("Uploaded file type is different than current filtered directory so it was moved to <i>" + file.filetype + "</i> directory.", {header: file.name + " uploaded & moved!", life: 10000});
                                });
                            }

                        }).removeClass("uploading").addClass("success");
                                                
                    } else {

                        template = that._renderDownload(files)[
                                that.options.prependFiles ? 'prependTo' : 'appendTo'
                        ](that.options.filesContainer);
                        that._forceReflow(template);
                        deferred = that._addFinishedDeferreds();
                        that._transition(template).done(
                                function () {
                                    data.context = $(this);
                                    hideTip(data.context.find(".close")[0])
                                    that._trigger('completed', e, data);
                                    that._trigger('finished', e, data);
                                    deferred.resolve();
                                }
                        );
                    }

                }, that.options.waitt);

            },
            // Callback for failed (abort or error) uploads:
            fail: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload'),
                        template,
                        deferred;
                if (data.context) {
                    data.context.each(function (index) {

                        if (data.errorThrown !== 'abort') {
                            console.log("failed")
                            var file = data.files[index];
                            file.error = file.error || data.errorThrown ||
                                    true;

                            deferred = that._addFinishedDeferreds();

                            that._transition($(this)).done(
                                    function () {
                                        var node = $(this);

                                        template = that._renderDownload([file])
                                                .replaceAll(node);

                                        that._forceReflow(template);

                                        that._transition(template).done(
                                                function () {
                                                    data.context = $(this);
                                                    hideTip(data.context.find(".close")[0])
                                                    that._trigger('failed', e, data);
                                                    that._trigger('finished', e, data);
                                                    deferred.resolve();
                                                    node.remove().detach();
                                                }
                                        );
                                    }
                            );
                        } else {
                            console.log("aborted")
                            //aborted upload
                            data.context.each(function (index) {
                                that._resetFineshedProcess(true, data.files[index])
                            });                            
                            deferred = that._addFinishedDeferreds();
                            that._transition($(this)).done(
                                    function () {
                                        hideTip($(this).find(".close")[0])
                                        $(this).remove();
                                        that._trigger('failed', e, data);
                                        that._trigger('finished', e, data);
                                        deferred.resolve();
                                    }
                            );
                        }
                    });
                } else if (data.errorThrown !== 'abort') {
                    console.log("failed")
                    data.context = that._renderUpload(data.files)[
                            that.options.prependFiles ? 'prependTo' : 'appendTo'
                    ](that.options.filesContainer)
                            .data('data', data);
                    that._forceReflow(data.context);
                    deferred = that._addFinishedDeferreds();
                    that._transition(data.context).done(
                            function () {
                                data.context = $(this);
                                hideTip(data.context.find(".close")[0])
                                that._trigger('failed', e, data);
                                that._trigger('finished', e, data);
                                deferred.resolve();
                            }
                    );
                } else {
                    //aborted upload
                    data.context.each(function (index) {
                        that._resetFineshedProcess(true, data.files[index])
                    });
                    
                    that._trigger('failed', e, data);
                    that._trigger('finished', e, data);
                    that._addFinishedDeferreds().resolve();
                }
            },
            // Callback for upload progress events:
            progress: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var progress = Math.floor(data.loaded / data.total * 100);
                if (data.context) {
                    data.context.each(function () {
                        $(this).find('.progress')
                                .attr('aria-valuenow', progress)
                                .children().first().css(
                                'width',
                                progress + '%'
                                );
                    });
                }
            },
            // Callback for global upload progress events:
            progressall: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload'),
                        progress = parseInt(data.loaded / data.total * 100, 10),
                        $this = $(this),
                        globalProgressNode = $('.fileupload-progress'),
                        extendedProgressNode = globalProgressNode
                        .find('.progress-extended');
                if (extendedProgressNode.length) {
                    ($this.data('xnu-fileupload') || $this.data('fileupload'))
                            ._renderExtendedProgress(data, extendedProgressNode)

//                    extendedProgressNode.html(
//                        ($this.data('xnu-fileupload') || $this.data('fileupload'))
//                            ._renderExtendedProgress(data)
//                    );
                }

                globalProgressNode
                        .find('.progress .bar').css('width', progress + '%');
                globalProgressNode
                        .find('.progress .percent b').text(progress);
                
                if (data.loaded == data.total) {
                    
                    //store ended time
                    that.endedTime = new Date(); 
                    
                    //all uploads completed reload current dir etc...
                    setTimeout(function () {
                        sidebarStatistics();
                        emptyDirectory(($list.children().length > 0));
                    }, that.options.waitt + 200)

                    globalProgressNode.find('.upload-heading h4').html(progressHtmlText.completed);
                    
                    //calculate total time
                    var timeElapsed = that._formatTime( (that.endedTime.getTime() - that.startedTime.getTime())/1000 );
                    
                    globalProgressNode
                            .find('.remaining b').text(timeElapsed).prop("title", progressHtmlText.timeelapsed)
                }
            },
            // Callback for uploads start, equivalent to the global ajaxStart event:
            start: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload');
                that._resetFinishedDeferreds();
                
                $('.fileupload-progress').slideDown();
                that._trigger('started', e);
//                that._transition($('.fileupload-progress')).done(
//                        function () {
//                            that._trigger('started', e);
//                        }
//                );
                
                $('.fileupload-progress').find(".cancel").removeClass("disabled");

                that._trigger('started', e);
            },
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            stop: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload'),
                        deferred = that._addFinishedDeferreds();
                $.when.apply($, that._getFinishedDeferreds())
                        .done(function () {
                            that._trigger('stopped', e);
                        });
                                            
                $('.fileupload-progress').find(".cancel").addClass("disabled");

//                that._transition($(this).find('.fileupload-progress'), that.options.waitt+200).done(
//                        function() {
//                            $(this).find('.progress-bar').css('width', '0%');
//                            $(this).find('.progress-extended').html('&nbsp;');
//                            deferred.resolve();
//                        }
//                );
            },
            process: function (e, data) {


                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload');

                data.context.each(function (index) {

                    var file = data.files[index],
                            ipCont = $(".fileupload-progress .current"),
                            itempFunc = tmpl('<div id="{%=o.uniqueId%}" class="upload-part pn animated">\
                                     <div class="upload-file-type">\
                                     <img src="' + ASSURI + '/img/filetypes/{%=o.data.realext[0]%}.png">\
                                     </div>\
                                     <div class="progress-current">\
                                     <span class="name"><b>{%=o.name%}</b></span>\
                                     <span class="percent"><b>0</b>%</span>\
                                     <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>\
                                     <div class="progress-current-info">\
                                     <span class="sizes">\
                                     <b class="completed">156 KB</b> of <b class="total">358 KB</b>\
                                     </span>\
                                     </div>\
                                     <a href="#" class="progress-current-cancel-btn btn btn-default disabled">\
                                     <i class="icon icon-times"></i>\
                                     </a></div></div>');

                    ipCont.append(itempFunc(file));

                });

            },
            processstart: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                
                $('.fileupload-progress').find('.upload-heading h4').html(progressHtmlText.uploading);
                $('.fileupload-progress').find('.remaining b').prop("title", progressHtmlText.timeremaining)
                
                $(this).addClass('fileupload-processing');
            },
            processstop: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                $(this).removeClass('fileupload-processing');
            },
            // Callback for file deletion:
            destroy: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('xnu-fileupload') ||
                        $(this).data('fileupload'),
                        removeNode = function () {
                            that._transition(data.context).done(
                                    function () {
                                        $(this).remove();
                                        that._trigger('destroyed', e, data);
                                    }
                            );
                        };
                if (data.url) {
                    data.dataType = data.dataType || that.options.dataType;
                    $.ajax(data).done(removeNode).fail(function () {
                        that._trigger('destroyfailed', e, data);
                    });
                } else {
                    removeNode();
                }
            }
        },
        _resetFineshedProcess: function (status, file) {

            if (status) {
                var itemId = file.uniqueId;

                $("#" + itemId).addClass("zoomOutDown fast").removeClass("on")
                        .one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function (event) {
                            $(this).remove().detach();
                        });
            }
        },
        _resetFinishedDeferreds: function () {
            this._finishedUploads = [];
        },
        _addFinishedDeferreds: function (deferred) {
            if (!deferred) {
                deferred = $.Deferred();
            }
            this._finishedUploads.push(deferred);
            return deferred;
        },
        _getFinishedDeferreds: function () {
            return this._finishedUploads;
        },
        // Link handler, that allows to download files
        // by drag & drop of the links to the desktop:
        _enableDragToDesktop: function () {
            var link = $(this),
                    url = link.prop('href'),
                    name = link.prop('download'),
                    type = 'application/octet-stream';
            link.bind('dragstart', function (e) {
                try {
                    e.originalEvent.dataTransfer.setData(
                            'DownloadURL',
                            [type, name, url].join(':')
                            );
                } catch (ignore) {
                }
            });
        },
        _formatFileSize: function (bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(1) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(1) + ' MB';
            }
            return (bytes / 1000).toFixed(1) + ' KB';
        },
        _formatBitrate: function (bits) {
            if (typeof bits !== 'number') {
                return '';
            }
            if (bits >= 1000000000) {
                return (bits / 1000000000).toFixed(2) + ' Gbit/s';
            }
            if (bits >= 1000000) {
                return (bits / 1000000).toFixed(2) + ' Mbit/s';
            }
            if (bits >= 1000) {
                return (bits / 1000).toFixed(2) + ' kbit/s';
            }
            return bits.toFixed(2) + ' bit/s';
        },
        _formatTime: function (seconds) {
            var date = new Date(seconds * 1000),
                    days = Math.floor(seconds / 86400);
            days = days ? days + 'd ' : '';
            return days +
                    ('0' + date.getUTCHours()).slice(-2) + ':' +
                    ('0' + date.getUTCMinutes()).slice(-2) + ':' +
                    ('0' + date.getUTCSeconds()).slice(-2);
        },
        _formatPercentage: function (floatValue) {
            return (floatValue * 100).toFixed(2) + ' %';
        },
        _renderExtendedProgress: function (data, extendedProgressNode) {

            extendedProgressNode.find(".bitrate b").text(this._formatBitrate(data.bitrate));

            extendedProgressNode.find(".remaining b").text(this._formatTime((data.total - data.loaded) * 8 / data.bitrate));

            extendedProgressNode.find(".totalPercentage b").text(this._formatPercentage(data.loaded / data.total));

            extendedProgressNode.find(".loadedPerTotal b").text(this._formatFileSize(data.loaded) + ' of ' + this._formatFileSize(data.total));


//            return '<span class="well well-sm hidden-xs">'+this._formatBitrate(data.bitrate) + '</span> <b class="hidden-xs">|</b> ' +
//                    '<span class="well well-sm hidden-xs">'+this._formatTime(
//                            (data.total - data.loaded) * 8 / data.bitrate
//                            ) + '</span> <b class="hidden-xs">|</b> ' +
//                    '<span class="well well-sm">'+this._formatPercentage(
//                            data.loaded / data.total
//                            ) + '</span> <b>|</b> ' +
//                    '<span class="well well-sm">'+this._formatFileSize(data.loaded) + ' / ' +
//                    this._formatFileSize(data.total)+'</span>';
        },
        _renderTemplate: function (func, files) {
            if (!func) {
                return $();
            }
            var result = func({
                files: files,
                formatFileSize: this._formatFileSize,
                options: this.options,
            });
            if (result instanceof $) {
                return result;
            }
            return $(this.options.templatesContainer).html(result).children();
        },
        _renderPreviews: function (data, options) {
            data.context.find('.tnpreviewImage').each(function (index, elm) {

                var pw = options.previewMaxWidth;
                var ph = options.previewMaxHeight - 2;

                if (data.files[index].preview) {
                    $(elm).append(data.files[index].preview);
                } else {
                    //add preview image for other known file types
                    $(elm).addClass(returnTypeIcon(fileExtension(data.files[index].name)[0]));

                    data.files[index].preview = [
                        $(elm).css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
                        202,
                        202
                    ];


                }
            });
        },
        _renderUpload: function (files) {
            files[0].data = {};
            var ext = fileExtension(files[0].name);
            files[0].data.ftype = returnTypeIcon(((ext !== null) ? ext[0] : false));
            files[0].data.realext = ext;


            return this._renderTemplate(
                    this.options.uploadTemplate,
                    files
                    );
        },
        _renderDownload: function (files) {
            if(files[0].error){
                files[0].data = {};
            }
            var ext = fileExtension(files[0].name);
            files[0].data.ftype = returnTypeIcon(((ext !== null) ? ext[0] : false));
            files[0].data.realext = files[0].extensionr;
            var $dwn = this._renderTemplate(
                    this.options.downloadTemplate,
                    files
                    ).data({
                id: files[0].id,
                t: files[0].name,
                date: files[0].date,
                type: 'f',
                p: files[0].pureName,
                ftype: files[0].filetype,
                parent: dir.id,
                ext: files[0].extension,
                realext: files[0].extensionr,
                path: files[0].path
            })//.find('a[download]').each(this._enableDragToDesktop).end();

            $.each(files, function (key, file) {
                $.each(file.data, function (k, v) {
                    $dwn.data(k, v);
                })
            });
            hideTip($dwn.find(".close")[0]);
            fileInfoBtn($dwn);
            return $dwn;
        },
        _startHandler: function (e) {
            e.preventDefault();
            var button = $(e.currentTarget),
                    template = button.closest('.template-upload'),
                    data = template.data('data');
            button.prop('disabled', true);
            if (data && data.submit) {
                data.submit();
            }
        },
        _cancelHandler: function (e) {
            e.preventDefault();
            var template = $(e.currentTarget)
                    .closest('.template-upload,.template-download'),
                    data = template.data('data') || {};
            data.context = data.context || template;
            if (data.abort) {
                data.abort();
            } else {
                data.errorThrown = 'abort';
                this._trigger('fail', e, data);
            }
        },
        _deleteHandler: function (e) {
            e.preventDefault();
            var button = $(e.currentTarget);
            this._trigger('destroy', e, $.extend({
                context: button.closest('.template-download'),
                type: 'DELETE'
            }, button.data()));
        },
        _forceReflow: function (node) {
            return $.support.transition && node.length &&
                    node[0].offsetWidth;
        },
        _transition: function (node) {
            var dfd = $.Deferred();

            if (!node)
                return dfd;

            if (node.hasClass('fade')) {
                node.slideToggle(
                        this.options.transitionDuration,
                        this.options.transitionEasing,
                        function () {
                            dfd.resolveWith(node);
                        }
                );
            } else {
                dfd.resolveWith(node);
            }
            return dfd;
        },
        _initButtonBarEventHandlers: function () {
            var fileUploadButtonBar = $('.fileupload-progress'),
                    filesList = this.options.filesContainer;
            this._on(fileUploadButtonBar.find('.start'), {
                click: function (e) {
                    e.preventDefault();
                    filesList.find('.start').click();
                }
            });
            this._on(fileUploadButtonBar.find('.cancel'), {
                click: function (e) {
                    e.preventDefault();
                    hideTip()
                    filesList.find('.startstop').click();
                }
            });
            this._on(fileUploadButtonBar.find('.delete'), {
                click: function (e) {
                    e.preventDefault();
                    filesList.find('.toggle:checked')
                            .closest('.template-download')
                            .find('.delete').click();
                    fileUploadButtonBar.find('.toggle')
                            .prop('checked', false);
                }
            });
            this._on(fileUploadButtonBar.find('.toggle'), {
                change: function (e) {
                    filesList.find('.toggle').prop(
                            'checked',
                            $(e.currentTarget).is(':checked')
                            );
                }
            });
        },
        _destroyButtonBarEventHandlers: function () {
            this._off(
                    $('.fileupload-progress')
                    .find('.start, .cancel, .delete'),
                    'click'
                    );
            this._off(
                    $('.fileupload-progress .toggle'),
                    'change.'
                    );
        },
        _initEventHandlers: function () {
            this._super();
            this._on(this.options.filesContainer, {
                'click .start': this._startHandler,
                'click .cancel': this._cancelHandler,
                'click .delete': this._deleteHandler
            });
            this._initButtonBarEventHandlers();
        },
        _destroyEventHandlers: function () {
            this._destroyButtonBarEventHandlers();
            this._off(this.options.filesContainer, 'click');
            this._super();
        },
        _enableFileInputButton: function () {
            this.element.find('.fileinput-button input')
                    .prop('disabled', false)
                    .parent().removeClass('disabled');
        },
        _disableFileInputButton: function () {
            this.element.find('.fileinput-button input')
                    .prop('disabled', true)
                    .parent().addClass('disabled');
        },
        _initTemplates: function () {
            var options = this.options;
            options.templatesContainer = this.document[0].createElement(
                    options.filesContainer.prop('nodeName')
                    );
            if (tmpl) {
                if (options.uploadTemplateId) {
                    options.uploadTemplate = tmpl(options.uploadTemplateId);
                }
                if (options.downloadTemplateId) {
                    options.downloadTemplate = tmpl(options.downloadTemplateId);
                }
            }
        },
        _initFilesContainer: function () {
            var options = this.options;
            if (options.filesContainer === undefined) {
                options.filesContainer = this.element.find('.files');
            } else if (!(options.filesContainer instanceof $)) {
                options.filesContainer = $(options.filesContainer);
            }
        },
        _initSpecialOptions: function () {
            this._super();
            this._initFilesContainer();
            this._initTemplates();
        },
        _create: function () {
            this._super();
            this._resetFinishedDeferreds();
            if (!$.support.fileInput) {
                this._disableFileInputButton();
            }
        },
        enable: function () {
            var wasDisabled = false;
            if (this.options.disabled) {
                wasDisabled = true;
            }
            this._super();
            if (wasDisabled) {
                this.element.find('input, button').prop('disabled', false);
                this._enableFileInputButton();
            }
        },
        disable: function () {
            if (!this.options.disabled) {
                this.element.find('input, button').prop('disabled', true);
                this._disableFileInputButton();
            }
            this._super();
        }

    });

}));

Raphael.fn.rGPie = function (cx, cy, radius, values, labels, stroke, preview, rgBg) {
    var r = this;

    r.customAttributes.segment = function (x, y, rad, startAngle, endAngle, opacity, color) {
        var flag = (endAngle - startAngle) > 180,
                clr = (endAngle - startAngle) / 360;
        startAngle = (startAngle % 360) * Math.PI / 180;
        endAngle = (endAngle % 360) * Math.PI / 180;

        return {
            path: [
                ["M", x, y],
                ["l", rad * Math.cos(startAngle), rad * Math.sin(startAngle)],
                ["A", rad, rad, 0, +flag, 1, x + rad * Math.cos(endAngle), y + rad * Math.sin(endAngle)],
                ["z"]
            ],
            fill: "hsb(0, 0, .27)", //color ? color : "hsb(" + clr + ", .75, .8)",
            "fill-opacity": opacity
        };
    };


    var data = values,
            off = {
                x: (cx - cy) * -1,
                y: (cx - cy) * -1,
            },
            paths = r.set(),
            total,
            start,
            opacity = 1,
            bg0 = r.circle(cx, cy, radius + 8).attr({fill: "none", stroke: "#444", "fill-opacity": 0, "stroke-width": 10}),
            bg = r.circle(cx, cy, radius).attr({
        stroke: "none",
        "stroke-width": 0
    });

    if (preview) {

        try {

            var str = ($.isArray(preview)) ? true : false //checks if preview is an array [url,width,height] or a <canvas> object.
            src = ((str) ? preview[0] : preview.toDataURL())
            ow = (str ? preview[1] : preview.width),
                    oh = (str ? preview[2] : preview.height);

            if (str || (rgBg && !str)) {
                bg.attr({fill: 'url(' + src + ') -20,-20,' + (ow) + ',' + (oh) + ''})
            }
        } catch (e) {
        }
        ;
    }

    r.set(bg0, bg);

    data = data.sort(function (a, b) {
        return b - a;
    });

    total = 0;

    for (var i = 0, ii = data.length; i < ii; i++) {

        total += data[i];

    }
    start = 0;
    for (i = 0; i < ii; i++) {
        var val = 360 / total * data[i];
        (function (i, val) {
            opacity = (i == 0 ? 1 : 0.3),
                    color = (i < 1 ? "#3980B5" : "#8AC53E")
            paths.push(
                    r.path().attr({segment: [cx, cy, radius, start, start + val, opacity, color], stroke: stroke})
                    );

        })(i, val);

        start += val;
    }

    return paths;
};
