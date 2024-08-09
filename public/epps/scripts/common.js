/**
 * Formats the given amount input for display and sets the amount
 * as number to the corresponding hidden input with id {inputId}Hidden
 *
 * @param inputId the id of the input field
 */
function handleMonetaryAmount(inputId) {
	var id = "#" + inputId;
	var idHidden = id + "Hidden";
	if ($j(idHidden).val() != '') {
		var number = $j(idHidden).asNumber();
		$j(id).val(number);
		$j(id).formatCurrency({symbol:''});
		$j(idHidden).val(number);
	}
    $j(id).blur(function() {
    	var userInput = $j(id).asNumber();
		if (!$j.isNumeric(userInput) /*|| userInput == 0*/) {
			$j(id).val('');
			$j(idHidden).val('');
		} else {
	        $j(id).formatCurrency({symbol:''});
	        $j(idHidden).val($j(id).asNumber());
		}
    });
}

/**
 * Returns the value of the parameter with the given name.
 *
 * @param name the parameter name
 *
 * @returns the parameter value
 */
function getRequestParameter(name) {
	var url = window.location.search.substring(1);
	var variables = url.split('&');
	for (var i = 0; i < variables.length; i++) {
		var names = variables[i].split('=');
		if (names[0] == name) {
			return names[1];
		}
	}
}

/**
 * Writes the drop down menu for the page number selection of display tag table.
 *
 * @param pages the total pages
 * @param url the current URL
 * @param node the node
 */
function writePageSelection(inputPages, url, node){
	var scriptNode = $j('script').last();
	var aboveNode = $j(scriptNode).parent().parent().prev();
	var uidNode = null;
	var tableNode = null;
	// if the aboveNode node is input(hidden)
	// then the UID is included, and the
	// and the node before that is the table.
	if(aboveNode.is("input") && "tableUid" == aboveNode.attr('name')) {
		uidNode = aboveNode;
		tableNode = aboveNode.prev();
	} else {
		tableNode = aboveNode;
	}
	
	var tableId = tableNode.attr("id");
	var fixedUrl = url;
	while (fixedUrl.indexOf('&amp;') != -1) {
		fixedUrl = fixedUrl.replace('&amp;','&');
	}
	var pageSizeName = tableId + "_ps";
	var pageSizeValue = getRequestParameter(pageSizeName);
	var disable = $j(scriptNode).parent().attr("id") == 'OnePage'
		&& (pageSizeValue == '10' || pageSizeValue === undefined);
	if (!disable) {
		var selectPageSizeId = tableId + '_pss';
		var selectPageSizeHtml = '<div style="float: left;">' + RESULTS_PER_PAGE_LITERAL + ':&nbsp;</div>'
			+ '<div style="float: left;"><select id="' + selectPageSizeId + '">';
		$j.each(["10", "20", "50", "100"], function(index, value) {
			var selectedAttr = pageSizeValue == value ? 'selected="selected"' : '';
			selectPageSizeHtml += '<option value="' + value + '" ' + selectedAttr + '>' + value + '</option>';
		});
		selectPageSizeHtml += '</select></div>';
		$j(scriptNode).parent().append(selectPageSizeHtml);
		$j('#' + selectPageSizeId).change(function() {
			var currentValue = $j(this).val();
			/*var link = pageSizeValue == null ? fixedUrl + "&" + pageSizeName + "=" + currentValue
				: fixedUrl.replace(pageSizeName + "=" + pageSizeValue, pageSizeName + "=" + currentValue);*/
			var urlSearchParams = new URLSearchParams(fixedUrl);
			urlSearchParams.set(pageSizeName, currentValue);
			var link = "?" + urlSearchParams.toString();
			window.location.href = link;
		});
	}
	var pages = inputPages.replace(',','');
	pages = pages.replace('.','');
	
	
	if (pages > 1) {
		var uid = uidNode == null 
			? url.match(/d-(\d+)-p=(1|$|&)/)[1] 
				: displayTableUidEncode(uidNode.attr('value'));
		var pageNumberName = 'd-' + uid + '-p';
		var pageNumberValue = getRequestParameter(pageNumberName);
		var selectPageNumberId = tableId + '_psn';
		var selectPageNumberHtml = '<div style="float: left;">' + GOTO_PAGE_LITERAL + ':&nbsp;</div>'
			+ '<div style="float: left;"><select id="' + selectPageNumberId + '">';
		for (i = 1; i <= pages; i++) {
			var selectedAttr = pageNumberValue == i ? 'selected="selected"' : '';
			selectPageNumberHtml += '<option value="' + i + '" ' + selectedAttr + '>' + i + '</option>';			
		}
		selectPageNumberHtml += '</select><div>';
		$j(scriptNode).parent().append(selectPageNumberHtml);
		$j('#' + selectPageNumberId).change(function() {
			var currentValue = $j(this).val();
			/*var newPart = pageNumberName + "=" + currentValue;
			var link = fixedUrl.replace(/d-(\d+)-p=(\d*)/, newPart);
			window.location.href = link*/
			var urlSearchParams = new URLSearchParams(fixedUrl);
			urlSearchParams.set(pageNumberName, currentValue);
			window.location.href = "?" + urlSearchParams.toString();
		});
	}
}

function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function containsInvalidCharacters(value) {
	var result = false;
	if (!isEmpty(value)) {
		var invalidChars = isEmpty(INVALID_CHARACTERS) ? '<>&%' : INVALID_CHARACTERS;
		var regex = "[" + invalidChars + "]+";
		var pattern = new RegExp(regex, "g");
		result = pattern.test(value);
	}
	return result;
}

/**
 * DisplayTable UID param encoder
 * 
 * @see org.displaytag.util.ParamEncoder
 * @param str
 * @returns
 */
function displayTableUidEncode (str){
    var hash = 17;
    str = "x-"+str;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = (3 * hash) + char;
    }
    return (hash & 0x7fffff);
}
