/*
 * jqComm - Various Common jQuery plugins
 *
 * Copyright (c) 2008 Milan Andrejevic <milan.andrejevic@gmail.com>
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*
	 * toggleNextDiv - Toggle next div, hide others
	 * $Version: 2008.05.30
	 *
	 * Example: $("#ShowCFTInfo").toggleNextDiv();
	 *          $(".Envelope").toggleNextDiv();
	 */
	$.fn.toggleNextDiv = function(options) {
		var collection = $(this).next("div");
		collection.hide();
		
		return this.each(function() {
			$(this).click(function() {			
				var current = $(this).next("div"); 
//				$(collection).not(current).hide();
				current.toggle();
			})
		});
	};
	
	/*
	 * toggleNextDivShowAllOnLoad - Toggle next div, hide others
	 * show all on load
	 * $Version: 2010.05.13
	 *
	 * Example: $("#ShowCFTInfo").toggleNextDivShowAllOnLoad();
	 *          $(".Envelope").toggleNextDivShowAllOnLoad();
	 */
	$.fn.toggleNextDivShowAllOnLoad = function(options) {
		return this.each(function() {
			$(this).click(function() {			
				var current = $(this).next("div"); 
				current.toggle();
				if (current.is(':visible') && $.isFunction(options)) { options($(this).text()); };
			})
		});
	};
		 
			
	/*
	 * showHideMenu - Add Show / Hide Menu
	 * $Version: 2008.05.26
	 *FROM HERE
	 * Example: $('#Content').showHideMenu([images url]);
	 */
	$.fn.showHideMenu = function(options) {
		return this.each(function() {
            var cookie = $.cookie("persistent.menu");
			var cntx = $(this);
			var menu = $('#Navigation');
			var url = (options !== undefined) ? options : ".."
			var hideIMG = '<img src="' + url + '/images/bg_hider_hide.gif" alt="Hide Menu"/>';
			var showIMG = '<img src="' + url + '/images/bg_hider_show.gif" alt="Show Menu" />';
			var showHideTrigger = $('<a id="ShowHideMenu" href="javascript:void(null);"></a>');
			var navi = IsNavigationHidden();

			$(showHideTrigger).append(hideIMG);
			$(cntx).before(showHideTrigger);

            if (navi == true) {
                $(cntx).parents("body").addClass("Bigger");
            }
			if ($(cntx).parents("body").hasClass("Bigger")){
				$(showHideTrigger).html(showIMG);
				$(menu).hide();
			} else {
				$(showHideTrigger).html(hideIMG);
				$(menu).show();
			}

			$(showHideTrigger).click(function(){
				if ($(menu).is(':visible')) {
					$(cntx).parents("body").addClass('Bigger');
					$(showHideTrigger).html(showIMG);
				} else {
					$(cntx).parents("body").removeClass('Bigger');
					$(showHideTrigger).html(hideIMG);
				}
				$(menu).toggle();
                PersistMenu();
				if ($(".HscrollEv").length > 0){
					resizeWidths();
				}
			})
		});
	};

	/*TILL HERE
	 * showHideBox - Add Show / Hide Box
	 * $Version: 2008.05.27
	 *
	 * Example: $('.Menu').showHideBox();
	 */
	$.fn.showHideBox = function(options) {
		var minBox = function(el){
			el.removeClass('Maximize').addClass('Minimize').attr("title", 'Minimize Box').html('<span>Minimize Box</span>');
		};
		var maxBox = function(el){
			el.removeClass('Minimize').addClass('Maximize').attr("title", 'Maximize Box').html('<span>Maximize Box</span>');
		};
		
		return this.each(function() {

            var disp = PersistentMenus($(this).find(".MenuContent").attr("id"));
            //alert($(this).find(".MenuContent").attr("id"));
			var cntx = $('.MenuContent', this);
			var minMaxTrigger = $('<a href="javascript:void(null);"></a>');
            //alert(disp);
            if (disp == "none") {
                $(cntx).hide();
            } 

            if ($(cntx).is(':visible')) {
                minBox($(minMaxTrigger));
            } else {
                maxBox($(minMaxTrigger));
            }
			
			//minBox($(minMaxTrigger));
			$("p:first-child span", this).prepend(minMaxTrigger);
            //alert($(this).find("div").attr("id"));

			$(minMaxTrigger).click(function(){
				if ($(cntx).is(':visible')) {
					maxBox($(this));
				} else {
					minBox($(this));
				}
				$(cntx).toggle();
                PersistMenu();
			})
		});
	};

	/*
	 * tabify - Tabify divs
	 * original work: http://www.barelyfitz.com/projects/tabber/
	 * $Version: 2008.06.16
	 *
	 * Example: $('.tabber').tabify({MenuClass:'tabbernav', ActiveClass:'Selected'});
	 */
	$.fn.tabify = function(options) {
	
	
		var opts = $.extend({}, TabifyDefault, options);
				
		return this.each(function() {
		
			var extraClass = opts.extraCLS;
			var cntx = $(this).children(extraClass);
			
			var menu = $('<ul class="' + opts.MenuClass + '"></ul>');
		 		
			var _default = $(cntx).index($('.tabbertabdefault')[0]);
			var _disabled = $(cntx).index($('.tabbertabdisabled')[0]);
			_default = _default == -1? 0: _default;
			_disabled = _default == _disabled? -1: _disabled;
			
			$(cntx).each(function(i) {
				var headline = $(':header:first', this).hide();
				txt = headline.text();
				var item = $('<li><a href="javascript:void(null);" title="' + txt + '">' + txt + '</a></li>');
				
				if (i == _default) {
					$(item).addClass(opts.ActiveClass);
				} else if (i == _disabled) {
					$(item).addClass('tabberdisabled');opts.ActiveClass
					$(this).hide();
				} else {
					$(this).hide();
				}
				
				$(menu).append(item);
			});
			
			$(this).prepend(menu);
			
			$('li', menu).click(function(){
				index = $('li', menu).index(this);
				if (index != _disabled) {
					$(cntx).each(function(i) {
						if (i == index) {
							$('li', menu).eq(i).addClass(opts.ActiveClass);
							$(this).show();
						} else {
							$('li', menu).eq(i).removeClass(opts.ActiveClass);
							$(this).hide();
						}
					});
				}
			})
		});
	};

	TabifyDefault = {
		extraCLS: 		'.tabbertab',
		MenuClass:		'tabbernav',
		ActiveClass:	'tabberactive'
	};
	/*
	 * toggleCfTVisibility - Toggle menu
	 * $Version: 2008.06.02
	 *
	 * Example: $('#ToggleSubmenu').toggleVisibility();
	 */

	$.fn.toggleCfTVisibility = function(options){
		var element = $(".Submenu");
		var bgColor = "#414c52";
		$(element).hide();
		var opts = $.extend({}, CFTDefaults, options);
		
		return this.each(function() {
			var trigger = $(this);

			$(trigger).click(function(ev){
				// Create iframe element to eliminate the problem in IE with select elements
				$(element).css("width", "190px")
				if (parseInt($(element).find("iframe").length) == 0){
					var elPadd = parseInt($(element).css("padding"));
					var elWidth = parseInt($(trigger).width());
					var elWidthPadd = parseInt($(trigger).width()) + parseInt($(element).css("padding-left")) + parseInt($(element).css("padding-right"));
					var elHeightPadd = $(element).outerHeight();

					var IFR = document.createElement("iframe");
					$(IFR)
						.attr("frameborder", 0)
						.css("width", elWidthPadd)
						.css("height", elHeightPadd)
						.attr("src", "empty.html"); 
					$(element)
						.css("padding", 0)
						.css("width", elWidthPadd)
						.wrapInner("<div></div>")
						.prepend(IFR)
						.css("height", elHeightPadd)
						.removeClass("Submenu");

					$(element)
						.find("div")
						.addClass("Submenu")
						.css("position","absolute")
						.css("background-color", bgColor)
						.css("width", elWidth)
						.css("padding", parseInt(elPadd))
						.css("left", 0)
						.css("top", 0)
				}
				
				var offset = $(this).offset();
				if ($(element).css("display") == "none"){
					var newEl = element;
					$(element).remove();
					$("#Content").append(newEl);
					element = newEl;
					$(element)
						.css("top", (offset.top + $(trigger).height() + 5))
						.css("left", offset.left)
						.css("position","absolute")
						.css("clear","none")
						.slideDown();
					$(this).html(opts.hide);
				} else {
					$(element).slideUp();
					$(this).html(opts.show);
				}
				return false;
			});
		});
	}
	
	CFTDefaults = {
		hide: 	'Hide CfT Menu',
		show:	'Show CfT Menu'
	};

	/*
	 * retrieveCftMenu - Retrive the Menu of the page with AJAX
	 * $Version: 2008.07.09
	 *
	 * Example: $('#Submenu').retrieveCftMenu("/ceproc/common/commonAjaxCall.do", "requestType=cftMenu&resourceId=2392");
	 */
	$.fn.retrieveCftMenu = function(urlGET, data, options){
		var isCftMenuLoaded = false;
		
		return this.each(function(){
			if ((urlGET !== undefined) && (data !== undefined)){
				var isCftMenuLoaded = true;
				var containerElement = $(this);
				$.ajax({
					type:"GET",
					url: urlGET,
					data: data,
					success: function(menu){
						$(containerElement).find("ul").replaceWith(menu);
						$('#ToggleSubmenu').toggleCfTVisibility(options);
						$('#ToggleSubmenu').trigger("click");
					},
					error: function(){
						$(containerElement).find("ul").replaceWith(
							`<ul><li><a href="/tenderDetails">View Tender</a></li></ul>
							<ul><li><a href="/tenderDocuments">Tender Documents</a></li></ul>
							<ul><li><a href="/clarification">Clarifications</a></li></ul>
							
							`
						);
						

						$(containerElement).find("a").each(function(){$(this).click(function(){return false;})});
						$('#ToggleSubmenu').toggleCfTVisibility(options);
						$('#ToggleSubmenu').trigger("click");
					}
				})
			}
		});
	}
	
		$.fn.retrieveCalendar = function(urlGET, data){
		//var isCftMenuLoaded = false;
		//depoly again
		return this.each(function(){
			if ((urlGET !== undefined) && (data !== undefined)){
				//var isCftMenuLoaded = true;
				var containerElement = $(this);
				//alert("ok1" + containerElement);
				$.ajax({
					type:"GET",
					url: urlGET,
					data: data,
					success: function(ret){
					//alert("ret" + ret);
					//alert("ok");
						$(containerElement).find("table").replaceWith(ret);
						//$('#ToggleSubmenu').toggleCfTVisibility();
						//$('#ToggleSubmenu').trigger("click");
					},
					error: function(){
					//alert("not ok");
						//$(containerElement).find("ul").replaceWith('<ul><li><a href="">Error contacting server</a></li></ul>');
						//$(containerElement).find("a").each(function(){$(this).click(function(){return false;})});
						//$('#ToggleSubmenu').toggleCfTVisibility();
						//$('#ToggleSubmenu').trigger("click");
					}
				})
			}
		});
	}
	
	$.fn.retrieveCharts = function(urlGET, data){

		return this.each(function(){
			if ((urlGET !== undefined) && (data !== undefined)){
				var containerElement = $(this);
				$.ajax({
					type:"GET",
					url: urlGET,
					data: data,
					success: function(ret){
						$(containerElement).find("img").attr("src", urlGET + "?" + data); 
					},
					error: function(){
					}
				})
			}
		});
	}
	/*
	 * textCountdown - CountDown
	 * $Version: 2008.06.02
	 *
	 * Example: $('.countdown').textCountdown();
	 */	
	$.fn.textCountdown = function(options){
		var opts = $.extend({}, textCountArr, options);
		var countdown = {
	        init: function() {
	            countdown.remaining = countdown.max - $(countdown.obj).val().length;
	            if (countdown.remaining <= 0) {
	                $(countdown.obj).val($(countdown.obj).val().substring(0,(countdown.max-1)));
	            }
	            $(countdown.obj).siblings(".remaining").html((countdown.remaining-1) + countdown.remaining_text);
	        },
	        max: null,
	        remaining: null,
	        obj: null,
			remaining_text: null
	    };

	    return this.each(function() {
	        $(this)
				.focus(function() {
		            var c = $(this).attr("class");
					countdown.remaining_text = opts.remaining_text;
		            countdown.max = parseInt(c.match(/limit_[0-9]{1,}_/)[0].match(/[0-9]{1,}/)[0]);
		            countdown.obj = this;
		            iCount = setInterval(countdown.init,100);
		        }).blur(function() {
		            countdown.init();
		            clearInterval(iCount);
		        });
	    });
	}

	textCountArr = {
		remaining_text: ' characters remaining.'
	};

	/*
	 * hideAlert - Close the alert box
	 * $Version: 2008.06.02
	 *
	 * Example: $('button#MClose').hideAlert(el);
	 */
	$.fn.hideAlert = function(el){
		var closingElement = $(el);
		return this.each(function() {
			$(this).click(function() {
				$(this).parent("p").parent("div[id='Message']").hide();
				if (($(".Submenu").css("display") != "none") && ($(".Submenu").length > 0)){
					var offset = $('#ToggleSubmenu').offset();
					$(".Submenu")
						.parent("div")
						.animate({"top": ((offset.top + $('#ToggleSubmenu').height() + 5) - $(closingElement).outerHeight(true)) + "px"}, "fast");
				}
				return false;
			});
		});
	}

	/*
	 * PopUp - Open a poup Window
	 * $Version: 2008.06.02
	 *
	 * Example: $(".popup").click(function(){
				$(this).PopUp($(this).attr("href"), {opts})
				return false;
			});
	 */
	$.fn.PopUp = function(url, options){
		var opts = $.extend({}, PopUpDefaults, options);
		var url = url;
		var wname = opts.windowname;
		var winLeft = (screen.width - opts.width) / 2;
		var winTop = (screen.height - opts.height) / 4;
		var params = 'height='+ opts.height +',width='+ opts.width +',left='+ winLeft +',top='+ winTop +',scrollbars='+ opts.scroll +',resizable=' + opts.resizable;
		return this.each(function() {
			var newWindow = window.open(url, wname, params);
			newWindow.focus();
		});
	}
	
	PopUpDefaults = {
		windowname: 'popupwindow',
		width:		810,
		height:		500,
		scroll:		1,
		resizable:	0
	};
	
	 /*
     * ToggleMenu - Toggle menu
     * $Version: 2009.09.09
     *
     * Example: $('#SectionHandle').ToggleMenu();
     */

    $.fn.ToggleMenu = function(options){
        var element = $(".SECTIONDropDown");
        //var bgColor = "#c48e00";
        $(element).hide();
        
        return this.each(function() {
            var trigger = $(this);

            $(trigger).click(function(ev){
                var elementClass = $(this).attr("id");
				var element = $("."+elementClass);
                var offset = $(this).offset();
                if ($(element).css("display") == "none"){
                    var newEl = element;
                    $(element).remove();
                    $("#Content").append(newEl);
                    element = newEl;
                    $(element)
                        .css("top", (offset.top + $(trigger).height() + 5))
                        .css("left", offset.left)
                        .css("position","absolute")
                        .css("clear","none")
                        .slideDown();
                } else {
                    $(element).slideUp();
                }
                return false;
            });
        });
    }
	
	 
	/*
	 * raiseFlag - Raise a flag
	 * $Version: 2009.04.29
	 *FROM HERE
	 * Example: $('#Content').showHideMenu([images url]);
	 */
	$.fn.raiseFlag = function(options) {
		return this.each(function() {
			var url = (options !== undefined) ? options : "..";
			var raisedIMG = '<img src="' + url + '/images/att_flag.gif" alt="Attention flag"/>';
			var inactIMG = '<img src="' + url + '/images/att_flag_inactive.gif" alt="Raise attention flag" />';

			$(this).click(function(){
				var IMG = $(this).find("img")
				var imgSRC = IMG.attr("src");
				
				if (imgSRC.search("_inactive") != -1){
					$(this).attr("title","Remove attention flag");
					IMG.replaceWith(raisedIMG);
					if($(this).find("input")!=null){
						$(this).find("input").attr("value","true");		
					}								
				} else {
					$(this).attr("title","Raise attention flag");
					IMG.replaceWith(inactIMG);
					if($(this).find("input")!=null){
						$(this).find("input").attr("value","false");
					}					
				}
				return false;
			});
		});
	};
	
	/*
	 * toggleNextDivWithSigns - Toggle next div
	 * requires elements PlusSign and MinusSign that will replace each other
	 *
	 * Example: $("#ShowCFTInfo").toggleNextDivWithSigns();
	 *          $(".Envelope").toggleNextDivWithSigns();
	 *          
	 * Version 26.01.2012.
	 */
	
	$.fn.toggleNextDivWithSigns = function(options) {
		$("#MinusSign", this).toggle();
		$("#PlusSign", this).toggle();
		$($(this).next("div")).slideToggle("fast");
	};
	})(jQuery);

// Functions added for persisting the left menus
function PersistMenu() {
    var propArray = new Array (
        "Navigation="          + $j("div [id='Navigation']").css("display"),
        "LoginMenuContent="    + $j("div [id='LoginMenuContent']").css("display"),
        "AdminMenuContent="    + $j("div [id='AdminMenuContent']").css("display"),
        "AdminMenuContent1="    + $j("div [id='AdminMenuContent1']").css("display"),
        "AdminMenuContent2="   + $j("div [id='AdminMenuContent2']").css("display"),
        "AdminMenuContent3="   + $j("div [id='AdminMenuContent3']").css("display"),
        "InfoMenuContent="     + $j("div [id='InfoMenuContent']").css("display"),
        "Calendar="            + $j("div [id='Calendar']").css("display")
    )

    $j.cookie("persistent.menu", propArray.join(";"));
}

function IsNavigationHidden() {
    var nav = ($j.cookie("persistent.menu") || "").split(";")[0].split("=");
    
    return (nav[1] == "none") ? true : false;
}

function PersistentMenus(el) {

    var nav = ($j.cookie("persistent.menu") || "").split(";");

    for (var i = 0; i < nav.length; i++) {
        var item = nav[i].split("=");

        if (item[0] == el) {
            return item[1];
        }
    }
}

// Resize Widths
function resizeWidths(){
	newWidth = 0;
	parentWidth = 710;
	firstDDWidth = $j(".Header dl dd.SumPOValueFR").width();

	$j("div.Header dl dd").each(function(i){
		var parentWidth = $j(this).parents("dl").width();
		var thisWidth = $j(this).outerWidth();
		newWidth = newWidth + thisWidth;
	});

	if (newWidth > parentWidth) {
		$j("#TenderEvaluationForm").find("dl").each(function(){
			var fieldsetClass = $j(this).parent().attr("class").split(" ")[0];
			var fieldsetClassNum = fieldsetClass.split("_")[1];
			if (fieldsetClassNum !== undefined){
				var multip = (14 * parseInt(fieldsetClassNum)) - 14;
				$j(this).width(newWidth - multip).css("padding-left", multip + "px");
				$j(this).find("dt").css("position","static").width("100%").css("padding-left",0).css("padding-right",0)
					.find("a").css("position","static").height("auto").css("border-bottom-width", 0).css("margin-right", 5);
			} else if (fieldsetClass == 'Supplier'){
				$j(this).width(newWidth);
				$j(this).find("dt").css("position","static").width("100%").css("padding-left",0).css("padding-right",0)
					.find("a").css("position","static").height("auto").css("border-bottom-width", 0).css("margin-right", 5);
			} else {
				$j(this).width(newWidth);
			}
		});
		$j(".Overall dt").css("position","static");
	}

	$j("#TenderEvaluationForm").find("dl").each(function(){
		/*
		var fieldsetClass = $j(this).parent().attr("class").split(" ")[0];
		var fieldsetClassNum = fieldsetClass.split("_")[1];
		if (fieldsetClassNum !== undefined){
			var multip = (14 * parseInt(fieldsetClassNum)) - 14;
			$j(this).find("dd.SumPOValueFR").width(firstDDWidth - multip);
		}
		*/
	});
	
	if ($j(".withWeight").length <=0 ){
		// Resize Overall widths
		newWidth = -4;
		var parentWidth = 715;
		$j("div.Header dl dd[class!='ASc'][class!='Thr'][class!='PN']").each(function(i){
			var thisWidth = $j(this).outerWidth();
			newWidth = newWidth + thisWidth;
			$j(this).parents("#TenderEvaluationForm").find(".Overall").find("dt").width(newWidth);
		});
		if (newWidth >= parentWidth) {
			padd = parseInt($j("#TenderEvaluationForm").find(".Overall").find("dt").css("padding-left"));
			padd = padd + parseInt($j("#TenderEvaluationForm").find(".Overall").find("dt").css("padding-right"));
			newWidth = $j("#TenderEvaluationForm").find(".Overall").find("dt").width() - (padd + 1);
			$j("#TenderEvaluationForm").find(".Overall").find("dt").width(newWidth).css("position","static");
		}
	}
	
	if ($j(".withWeight").length > 0 ){
		// Resize Overall widths
		newWidth = -4;
		var parentWidth = 715;
		$j("div.Header dl dd[class!='ASc'][class!='Thr'][class!='PN'][class!='Wgh'][class!='WghSc']").each(function(i){
			var thisWidth = $j(this).outerWidth();
			newWidth = newWidth + thisWidth;
			$j(this).parents("#TenderEvaluationForm").find(".Overall").find("dt").width(newWidth);
		});
		if (newWidth >= parentWidth) {
			padd = parseInt($j("#TenderEvaluationForm").find(".Overall").find("dt").css("padding-left"));
			padd = padd + parseInt($j("#TenderEvaluationForm").find(".Overall").find("dt").css("padding-right"));
			newWidth = $j("#TenderEvaluationForm").find(".Overall").find("dt").width() - (padd + 1);
			$j("#TenderEvaluationForm").find(".Overall").find("dt").width(newWidth).css("position","static");
		}
	}
}
function prepareEvaluationGUI(){
	$j('fieldset').filter('[class*=Sect_],[class*=Financial]').find("fieldset").hide();
	$j('fieldset').filter('[class*=Sect_],[class*=Financial]').find("dl.Criteria").hide();		
	$j("fieldset dl")
       .mouseover(function(){
           $j(this).addClass("Hover");
       })
       .mouseout(function(){
           $j(this).removeClass("Hover");
       });
	$j("a.ExpCol").each(function(){
       $j(this).click(function(){
           if ($j(this).parent("dt").parent("dl").parent("fieldset").find("fieldset").is(":visible")
           || $j(this).parent("dt").parent("dl").parent("fieldset").find("dl.Criteria").is(":visible")){
               $j(this).parent("dt").parent("dl").parent("fieldset").find("fieldset").hide();
               $j(this).parent("dt").parent("dl").parent("fieldset").find("dl.Criteria").hide();
           } else {
               $j(this).parent("dt").parent("dl").parent("fieldset").find("fieldset").show();
               $j(this).parent("dt").parent("dl").parent("fieldset").find("dl.Criteria").show();
           }
           
           if ($j(this).parent("p").parent("fieldset").find("dl.Criteria").is(":visible")){
               $j(this).parent("p").parent("fieldset").find("dl.Criteria").hide();
           } else {
               $j(this).parent("p").parent("fieldset").find("dl.Criteria").show();
           }               
           return false;
       });
   });	
	return false;
}