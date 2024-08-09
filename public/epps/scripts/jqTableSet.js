/*
 * jqTableSet - Various TABLE jQuery plugins
 *
 * Copyright (c) 2008 Milan Andrejevic <milan.andrejevic@gmail.com>
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*
	 * TableSet - Show/ hide additional hidden columns in table with jQuery
	 * $Version: 2009.02.25
	 *
	 * Example: $("#T01").tableSet({hidden: [3,4,5,6,7], left: true});
	 * Table MUST have <table id="T01"><thead><th/>...</thead><tbody><td/>...</tbody></table> structure.
	 *
	 * Requires cookie-plugin: http://www.stilbuero.de/2006/09/17/cookie-plugin-for-jquery/
	 */
	$.fn.tableSet = function(options,cookie) {
		var opts = $.extend({}, tableSetDefaults, options);
		var obj = $(this);
		var rows = $("tbody tr", obj).length;
		var ID = obj.attr('id');
		var cookieName=cookie+ '#' + ID;
		if(cookie==null){
			cookieName = window.location.pathname.match(/([^/|\\]+)$/gi)[0]+ '#' + ID;
		}		
		obj.wrapAll('<div class="' + opts.wrapperClass + '"></div>');
		obj.after('<div class="' + opts.popupClass + ' ' + ID + '"></div>');
		var popup = $('.' + ID);
		var wrapper = $('.' + opts.wrapperClass);

		if (opts.left) {
			popup.addClass(opts.popupLeftModifierClass);
		}
		if (opts.title) {
			popup.append(opts.popupTitle);
		}
		var extraTH = '<th class="' + opts.extraClass + '"><a href="javascript:void(null);" class="' +  opts.triggerClass + '"><img src="' + opts.icon + '" alt="" title="show/hide columns" /></a></th>';
		var extraTD = '<td rowspan="' + rows + '" class="' + opts.extraClass + '">&nbsp;</td>';

		$.map(opts.hidden, function(n) {
			var node = $("thead th:nth-child(" + n + ")", obj);
			var text = node.text();
            /*text = text.replace(/\W/gi,"");
            if (text == "") {
                text = "#" + n;
            }*/
            label = ID + opts.prefix + n;
			popup.append('<p><label for="sh_' + label + '"><input name="' + label + '" id="sh_' + label + '" type="checkbox" class="Check" value="' + label + '" />' + text + '</label></p>');
			node.addClass(opts.prefix + label);
			$("tbody td:nth-child(" + n + ")", obj).addClass(opts.prefix + label);
		});

		if (opts.left) {
			$("thead th:first", obj).before(extraTH);
			$("tbody tr:first td:first", obj).before(extraTD);
		} else {
			$("thead th:last", obj).after(extraTH);
			$("tbody tr:first td:last", obj).after(extraTD);
		};

		var currentState = function() {
			arr = $.map($(":checkbox", popup), function(n) {
				return (n.checked == true) ? '1': '0';
			});
			return arr;
		};

		var saveCurrentState = function() {
			arr = currentState();
			val = arr.join(".");
			$.cookie(cookieName, val, {expires: opts.expiresDays, path: '/'});
			// delete cookie: $.cookie(cookieName, null);
		};

		var getSavedValue = function() {
			var val = $.cookie(cookieName);
			if (val) {
				return val.split(".");
			} else {
				return false;
			}
		};

		if (opts.saveState && $.cookie) {
			arr = getSavedValue();
			if (arr) {
				$.map($(":checkbox", popup), function(n, i) {
					n.checked = (arr[i] == '1') ? true : false;
					if (n.checked) {
						$("." + opts.prefix + n.value, obj).show();
					} else {
						$("." + opts.prefix + n.value, obj).hide();
					}
				});
			} else {
				$(":checkbox", popup).each(function() {
					this.checked = false;
					$("." + opts.prefix + this.value, obj).hide();
				})
			};
		} else {
			$(":checkbox", popup).each(function() {
				this.checked = false;
				$("." + opts.prefix + this.value, obj).hide();
			})
		};

		$("." + opts.triggerClass, obj).click(function() {
			//$(wrapper).css('z-index', 100); mda 2009/02/17
			popup.show();
		});

		$(":checkbox", popup).click(function() {
			$("." + opts.prefix + this.value, obj).toggle();
		});

		$(popup).bind("mouseleave", function() {
			$(this).hide();
			//$(wrapper).css('z-index', 10); mda 2009/02/17
			if (opts.saveState) {
				saveCurrentState();
			}
		});
		
		return this

	};
	var conPath = location.pathname.split('/');
	tableSetDefaults = {
		hidden: [],
		prefix: '_',
		expiresDays: 30,
		saveState: true,
		left: false,
		title: true,
		wrapperClass: 'tableSet',
		triggerClass: 'setcolumns',
		extraClass: 'extra',
		popupClass: 'showhide',
		popupTitle: '<p class="smalltitle">Show/Hide</p>',
		popupLeftModifierClass: 'left',
		icon: '/' + conPath[1] + '/images/sh_icon.gif'
	};

	/*
	 * tableZebra - Table Zebra effect with jQuery
	 * $Version: 2008.07.02
	 *
	 * Example: $(".zebra").tableZebra();
	 */
	$.fn.tableZebra = function(options) {
		var opts = $.extend({}, tableZebraDefaults, options);

		return this.each(function() {
			if (!$(this).hasClass("NoZebra")){
				$("tbody tr:odd", this).addClass(opts.oddClass);
				$("tbody tr:even", this).addClass(opts.evenClass);
				$("tbody tr", this).hover(
					function() {
						$("td", this).not("." + opts.excludeClass).addClass(opts.hoverClass);
					},
					function() {
						$("td", this).not("." + opts.excludeClass).removeClass(opts.hoverClass);
					}
				);
			}
		});
	};

	tableZebraDefaults = {
		oddClass: 'Even',
		evenClass: '',
		hoverClass: 'Hover',
		excludeClass: 'extra'
	};
})(jQuery);
