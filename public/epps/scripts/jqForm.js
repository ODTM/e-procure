/*
 * jqForm - Various FORM jQuery plugins
 *
 * Copyright (c) 2008 Milan Andrejevic <milan.andrejevic@gmail.com>
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*
	* checkGroup - check all enabled checkboxes by class selector or by name
	* original work: http://plugins.jquery.com/project/checkgroup
	* $Version: 2008.05.29
	*
	* Example: $('#SelectAll').checkGroup({nameStartsWith: 'Submited_Tender'});
	*/
	$.fn.checkGroup=function(options) {
		var opts = $.extend({groupSelector: null, nameStartsWith: 'group_name'}, options || {});
		
		return this.each(function() {
			var trigger = $(this);
			var group_selector = (opts.groupSelector == null) ? 'input[name ^= ' + opts.nameStartsWith + ']' : opts.groupSelector;
			
			$(trigger).click(function(e) {
				chk_val = (e.target.checked);
				$(group_selector).attr('checked', chk_val);
				$(trigger).attr('checked', chk_val);
			});

			$(group_selector).click(function() {
				if (!this.checked) {
					$(trigger).attr('checked', false);
				} else {
					if ($(group_selector).size() == $(group_selector+':checked').size()) {
						$(trigger).attr('checked', 'checked');
					}
				}
			});
		});
	};

	/*
	 * passwordCheck - Check password and password reenter. Password strength meter.
	 * $Version: 2008.05.29
	 *
	 * Example: $('#Password').passwordCheck({against: $('#RePassword')});
	 */
	$.fn.passwordCheck = function(options) {
		var opts = $.extend({}, passwordCheckDefaults, options);
		//alert(opts);
				

		var $inputs = $('#passwordConfigForm :input');
   
    	var values = {};
    	$inputs.each(function() {
        values[this.name] = $(this).val();
        //alert("value "+$(this).val() +" name "+this.name);
    	});
		
		var checkRepetition = function(pLen,str) {
			res = ""
			for ( i=0; i<str.length ; i++ ) {
				repeated=true
				for (j=0; j < pLen && (j+i+pLen) < str.length; j++)
					repeated = repeated && (str.charAt(j+i) == str.charAt(j+i+pLen))
				if (j < pLen) repeated = false
				if (repeated) {
					i += pLen - 1
					repeated = false
				}
				else {
					res += str.charAt(i)
				}
			}
			return res
		};
		var contains = function (values, obj){
		var res;
			for (m=0; m<values.length; m++){
			
				if (values[m] == obj){
					res =  true;
					break;
				} else {
				res = false;
				}
			}
			
			return res;
		}
		
		var passwordValid = function(password){
		var isValid = true;
		var pattern = values['stringPattern'];
		var allValidCharacters = pattern.split("");
		var splitPassword = password.split("");
			for (k=0; k<splitPassword.length; k++){
				if (!contains(allValidCharacters,splitPassword[k])){
				isValid = false;				
							
				}
			}
			
			//alert('password' +password+' isValid '+isValid);
			return isValid;
		}
		
		var score = function(password) {
			var score = 0;
			
			if (!passwordValid(password)){return opts.invalid }	
			if (password.length < values['passwordMinLength']) {return opts.shortPass}	
			if(password.length > values['passwordMaxLength']) {return opts.invalid}
			//password contains spaces
			if (password.indexOf(' ') >= 0) { return opts.containsSpace }
			//password < opts.tooShort
			//if (password.length < opts.tooShort ) { return opts.shortPass }
			//password must contain letters and numbers
			//if (password.match(/^[A-Za-z]+$/)) { return opts.justLetters }
			//if (password.match(/^\d+$/)) { return opts.justNumbers }
			//password length
            score += password.length * 2 // heuristic weight
			score += (checkRepetition(1, password).length - password.length ) * 1
			score += (checkRepetition(2, password).length - password.length ) * 1
			score += (checkRepetition(3, password).length - password.length ) * 1
			score += (checkRepetition(4, password).length - password.length ) * 1
	
			//password has 3 numbers
			if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) score += 5 
			//password has 2 sybols
			if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) score += 5 
			//password has Upper and Lower chars
			if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10 
			//password has number and chars
			if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) score += 15 
			//password has number and symbol
			if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) score += 15 
			//password has char and symbol
			if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) score += 15 
			//password is just a nubers or chars
			if (password.match(/^\w+$/) || password.match(/^\d+$/) ) score -= 10 

			return score
		};
		
		var reenterMessage = $('<div class="' + opts.messageClass + '"><p></p></div>');
		var update = function(equal) {
			if (equal) {
				$("p", reenterMessage).text(opts.Match);
			} else {
				$("p", reenterMessage).text(opts.noMatch);
			}
		};
		
		return this.each(function() {
			var password = null;
			var reenter = null;
			
			var indicator = $('<div class="' + opts.indicatorContainerClass + '"><div></div></div>');
			var passwordMessage = $('<div class="' + opts.messageClass + '"><p></p></div><input type="hidden" name="passStrength" id="passStrength" value="" />');
			$(this).after(indicator);
			$(indicator).after(passwordMessage);
			var reenterInput = opts.against;
			$(reenterInput).after(reenterMessage);
			
			$(this).keyup(function() {
				password = $(this).val();
				var strength = score(password);
				var pass_strength = "0"
				if (typeof(strength) == 'string') {
				
					$("p", passwordMessage).text(strength);
					$("div", indicator).css({'width': '0%'});
				} else {
					if (strength < 0) strength = 0
					if (strength > 100) strength = 100
					
					$("p", passwordMessage).text(opts.verystrong)
					pass_strength = "5"
					
					if (strength < 67 ) {
						$("p", passwordMessage).text(opts.strong)
						pass_strength = "4"
					}
					if (strength < 50 ) {
						$("p", passwordMessage).text(opts.medium)
						pass_strength = "3"
					}
					if (strength < 34 ) {
						$("p", passwordMessage).text(opts.normal)
						pass_strength = "2"
					}
					if (strength < 17 ) {
						$("p", passwordMessage).text(opts.weak)
						pass_strength = "1"
					}
					
					$("div", indicator).css({'width': strength + '%'});
				}
				var pass_strength_hidden = $('<input type="hidden" name="passStrength" id="passStrength" value="' + pass_strength + '" />');
				//$(passwordMessage).after(pass_strength_hidden);
				$('#passStrength').replaceWith(pass_strength_hidden);
			
				//alert ("pass_strength" + pass_strength);
			    //alert ("hidden filed =" + document.getElementById("passStrength").getAttribute("value").toString());
			}).blur(function() {
				update((password == reenter));
			})
			
			$(reenterInput).keyup(function() {
				reenter = $(this).val();
				update((password == reenter));
			})
		});
	};
	
	passwordCheckDefaults = {
		indicatorContainerClass: 'indicatorContainer',
		messageClass: 'passwordMessage',
		tooShort: 8,
		shortPass: 'Too short!',
		containsSpace: 'No spaces!',
		weak: 'Weak',
		normal: 'Normal',
		medium: 'Medium',
		strong: 'Strong',
		verystrong: 'Very strong',
		noMatch: 'Doesn\'t match',
		Match: 'Passwords match',
		justLetters: 'Just Letters',
		justNumbers: 'Just Numbers',
		invalid: 'Invalid'
	};
	
	/*
	 * addClearDate - Add Clear Date button
	 * $Version: 2008.05.26
	 *
	 * Example: $('input.Date').addClearDate();
	 */
	$.fn.addClearDate = function() {
		return this.each(function() {
			var clearTrigger = $('<input type="image" class="ACT" src="../images/action_clear.gif" title="Clear Date" />');
			var ID = this.id;
			$(this).after(clearTrigger);
			
			$(clearTrigger).click(function() {
				$('#' + ID).val('');
				return false;
			})
		});
	};
	
	/*
	 * prepareForm - Prepare form and adding events on Inputs to illustrate the input highlight
	 * $Version: 2008.06.02
	 *
	 * Example: $(element).prepareForm();
	 */
	$.fn.prepareForm = function(){
		var activeClass = "active";
		return this.each(function(){
			$(this).find("input:not(:button), textarea, select").each(function(){
				$(this)
					.focus(function(){
						if ($(this).hasClass("Radio")==true || $(this).hasClass("Check")==true){
						} else {
							$(this).addClass(activeClass);
						}
						$(this).parents("form").find("label[for='"+ $(this).attr("id") +"']").addClass(activeClass);
					})
					.blur(function(){
						if ($(this).hasClass("Radio")==true || $(this).hasClass("Check")==true){
						} else {
							$(this).removeClass(activeClass);
						}
						$(this).parents("form").find("label[for='"+ $(this).attr("id") +"']").removeClass(activeClass);
					});
			});
		});
	}

})(jQuery);
