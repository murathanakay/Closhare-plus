$(function () {
    
    setTimeout(function(){
       $("body").removeClass("onload"); 
    },600);
        
    if(!isMob() && !isTablet())
    $('input[type=checkbox]:not(.not)').iCheck({
         checkboxClass: 'icheckbox_flat-blue',
    }).iCheck('check').iCheck('uncheck').on('ifCreated ifChanged', function(e) {
                // Get the field name
                var field = $(this).attr('name');
                $(this).closest("form").bootstrapValidator('revalidateField', field);
            });
    
    
    var tabs = $('.tabbable'),
    tab_a_selector = '.tabnav a';
    $norequestArr = new Array("login","register","recover");
    tabs.find(tab_a_selector).on('click', function(e) {

        e.preventDefault();
        $that = $(this);
        $that.tab('show');
        
        var state = {},
        id = "page",
        idx = $that.attr('href').replace(/^#/, '');
        // Set the state!
        state[ id ] = idx;
        $.bbq.pushState(state,2);
        $("body").trigger('click');
    }).on('shown.bs.tab', function (e) {
                var that = $(e.target)               
                $("div.social").toggle( !(that.data("social") === false) )
            });

    $(window).bind('hashchange', function(e) {
        
        //login register recover pages
        $('.tabbable').each(function() {
            
            var $this = $(this);
            if(($.inArray($.bbq.getState("page"), $norequestArr) === -1)){
            var idx = "login";
            }else{
            var idx = $.bbq.getState("page", false) || $this.find('li.active a').attr('href').replace(/^#/, '');
            }
            $el = $this.find('.tabnav a[href="#' + idx + '"]');
            

            $el.trigger('click');
        });
        //$('.button-loading').button("reset");
    });
    $(window).trigger('hashchange');    
});

$(function (){
   $('[data-toggle="modal"]').click(function(e) {
      e.preventDefault();
      var $this = $(this), data = $this.data("action");
         $this.button("loading");
         $.ajaxQueue({
            url: '/',
            type: 'GET',
            data: {content: data},
            dataType: 'json',
            success: function(response) {
              $this.button("reset");
              $('<div class="modal"><div class="modal-body">'+response.html+'</div></div>').modal();
              
            }
         });

     return false;
   });
   
if(welcomePage.animateBG){
$('.welcome-container').mousemove(function(e){
    var amountMovedX = (e.pageX * -1 / 6);
    var amountMovedY = (e.pageY * -1 / 6);
    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});
}
    $('.tab-pane form').bootstrapValidator({
        fields: {
            "register-email": {
                validators: {
                    notEmpty: {
                        message: 'The email address is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The email address is not a valid'
                    },
                    remote: {
                        type: 'GET',
                        data: {checkforemail: true},
                        url: AJAX_PATH,
                        name: "email",
                        delay: 1000,
                        message: 'This email address is already exist.'
                    }                    
                    
                }
            },
            "remember-me": {
                excluded: 'true',
                validators: {
                    
                }
            },
            "reset-email": {
                onSuccess: function(e, data) {
                    $("#resetNotify").slideDown("fast");
                },
                onError: function(e, data) {
                    $("#resetNotify").slideUp("fast");
                },           
                validators: {
                    emailAddress: {
                        message: 'The email address is not a valid'
                    },                    
                    notEmpty: {
                        message: 'The email address is required and cannot be empty'
                    },                   
                    remote: {
                        type: 'GET',
                        data: {checkforemail: true, reverse: true},
                        url: AJAX_PATH,
                        name: "email",
                        delay: 500,
                        message: 'There is no such an account associated with this email address'
                    }
                }
            },
            "register-terms": {
                validators: {
                    notEmpty: {
                        message: 'Please agree terms of use'
                    }
                }
            }           
        }
    }).on('success.field.bv', function(e, data) {
       if(data.element.hasClass("nfb")){
       data.element
                .data('bv.messages')
                .find('.form-control-feedback').hide();
    }
                var $parent = data.element.parents('.form-group');

                $parent.removeClass('has-success');

                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
    
    }).on('error.field.bv', function(e, data) {
            // $(e.target)  --> The field element
            // data.bv      --> The BootstrapValidator instance
            // data.field   --> The field name
            // data.element --> The field element

            // Hide the messages
            var el = data.element.data('bv.messages')
                el.find('.help-block[data-bv-for="' + data.field + '"]').hide();
        
            if(data.field == "register-terms"){
                el.find(".form-control-feedback").hide()
            }
        
        });  
});
    