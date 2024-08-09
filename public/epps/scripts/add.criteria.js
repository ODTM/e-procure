	function renderCriteraFields(){ // OK
		//1 - reset selectTypeForm values
		var val = $j("#CrType").val();
		$j("#selectTypeForm")[0].reset();
		$j("#CrType").val(val);
		//2 - reset 'visibiliti' of elements on default -> display: none
		$j(".CriteriaElements").hide();

		//in case that any option exist remove them....
		var cListDiv = $j("#c_list");
		var optDiv = $j("#options");
		$j(optDiv).remove();
		var newOptDiv = document.createElement("div");
		$j(newOptDiv)
			.attr("id","options");
		$j(cListDiv).append(newOptDiv);
		
		//show elements of selected type
		var selectedType = $j("#CrType").val();
		if (selectedType == ""){
			$j("#main").hide();
		}else{
			$j("#main").show().find("#"+selectedType).show();
			//set selectType hidden element
			$j("#criterionType").val(selectedType);
			if (selectedType != "c_list"){
				$j("#includedCheck").show();
			}
		}
		$j("form").prepareForm();
	}
	
	function renderOptions(chosen){ // OK
		
		if (chosen == "radio") {
			$j('#multi').hide(); 
			$j("#c_multiple").removeAttr("checked");
			$j('#optNum').show(); 
			
		} else if (chosen == "check"){
			$j('#multi').hide(); 
			$j("#c_multiple").attr("checked","checked");
			$j('#optNum').show(); 
		}else {//combo
			$j('#multi').show(); 
			$j('#optNum').show(); 
		}
	}
	
	function createOptions(){ // OK
		var optNo = trimStr($j("#c_list_optNo").val());
		if (optNo != ""){
			if (isNaN(optNo) || parseInt(optNo)>20 || parseInt(optNo)<1){
						alert("Number of options must be integer greater then 0 and less then 20");
						return false;
			}
			var targetDiv = $j("#options");
			var existedOpts = $j("#options .numExistedOpts");
			var numExistedOpts = existedOpts.length;
			if (numExistedOpts<=optNo){
				//add new
				for (var i=numExistedOpts+1; i <= optNo; i++){
					var spn = document.createElement("p")
					$j(spn)
						.attr("id","spn_"+i);
					
					var inputLbl = document.createElement("label");
						$j(inputLbl)
							.attr("for","c_opt_"+ i +"_lab")
							.addClass("w33")
							.addClass("numExistedOpts")
							.html("Label");
					$j(spn)
						.append(inputLbl);
					
					var inputLabel = document.createElement("input");
						$j(inputLabel)
							.attr("type","text")
							.attr("name","c_opt_"+ i +"_lab")
							.attr("id","c_opt_"+ i +"_lab")
							.attr("size","50")
							.addClass("w20");

					$j(spn)
						.append(inputLabel);
					
					var inputVlu = document.createElement("label");
						$j(inputVlu)
							.html("Value");
					$j(spn)
						.append(inputVlu);
					
					var inputValue = document.createElement("span");
						$j(inputValue)
							.attr("id","c_opt_"+ i +"_val")
							.html(i)
							.addClass("crtValue");
					$j(spn)
						.append(inputValue);
					
					
					var scoreSpan = document.createElement("span");
					$j(scoreSpan)
						.attr("id","evalScore_"+i);
					
					var inputEvs = document.createElement("label");
						$j(inputEvs)
							.attr("for","c_opt_"+ i +"_score")
							.html("Evaluation Score");
					$j(scoreSpan)
						.append(inputEvs);
					
					var showScoreSpan = "none";
					if($j("#c_included").attr("checked") == true){
						showScoreSpan ="inline";
					}
					$j(scoreSpan)
						.css("display", showScoreSpan);
					
					var inputScore = document.createElement("input");
					$j(inputScore)
						.attr("type","text")
						.attr("name","c_opt_"+ i +"_score")
						.attr("id","c_opt_"+ i +"_score")
						.attr("size","3");
					$j(scoreSpan)
						.append(inputScore);
					
					$j(spn)
						.append(scoreSpan);
					
					$j(targetDiv).append(spn);
				}
			}else{
				//delete
				var from = parseInt(optNo)+1;
				for (var i=from; i <= numExistedOpts; i++){
					var spanOpt = "#spn_"+ i;
					$j(targetDiv).find(spanOpt).remove();
				}
			}
			if (parseInt(optNo) > 0){
				$j("#options, #includedCheck").show();
			} else {
				$j("#includedCheck, #eval_params").hide();
				$j("#c_included").removeAttr("checked");
				var showWeight='true';
				$j("#c_threshold").val('');
				if (showWeight == 'true'){
					$j("#c_weight").val('');
				}
			}
			
		}else if (optNo == "" || isNaN(parseInt(optNo))){
			alert('Please enter the number of options you want to create');
		}
	}

	function validateCriterionFields(){
	
	//alert("validateCriterionFields");
	
		var frm = document.selectTypeForm;
		var selectedValue='';
		var act= 'criteria';
		var showWeight='true';
		//alert("showWeight before this criteria: " + showWeight);
		var selectedEntryId = '1211874266593';
		var  includedInEval = document.getElementById("c_included").checked;
		
		if (act == 'edit'){
			var type = 'null';
			selectedValue = 'c_'.concat(type);
		}else{
			var selectedType = document.sType.cTypeCombo;
			selectedValue = selectedType.options[selectedType.selectedIndex].value;
		}
		//alert("selectedValue: " + selectedValue);
		//if includedInEval must be mandatory!!
		if (includedInEval && document.getElementById('c_mandatory').checked==false){
		var confirmText = "This criterion has to be mandatory!";
			if (confirm(confirmText)) {
				$j('#c_mandatory').attr("checked","checked");
			}
		}	
			
		if (showWeight == 'true' && includedInEval){
	
				var selectedEntry =window.opener.document.getElementById("fld_" + selectedEntryId);
				var parent = selectedEntry;
				
				if (act == 'addSection' || act=='edit'){
					parent = parent.parentNode;
				}
				
				var parentLevel = 0;
				if (parent.attributes['level'] != null){
					parentLevel = parent.attributes['level'].nodeValue
				}
				
				var chLevel = parseInt(parentLevel) + 1;
				var children = parent.getElementsByTagName("fieldset");
				
				var childrenLen = children.length;
				var weightSum = 0;
				for (var j=0; j<childrenLen; j++){
					var weight = children.item(j).attributes['weight'];
					var level = children.item(j).attributes['level'];
					if (level.nodeValue == chLevel){
						if (weight != null && weight.nodeValue !=''){
							weightSum += parseInt(weight.nodeValue)
						}
					}
				}
				
				//alert("weightSum: " + weightSum);
				
				if (act=='edit'){
					weightSum = weightSum - parseInt(selectedEntry.attributes['weight'].nodeValue);
				}
				
				var _wght = document.getElementById("c_weight").value;
				var wght = trimStr(_wght);
				
				if ( isNaN(wght) || wght=='') {
					alert('Please enter a numeric value only for Weight!');
					return false;
				}
				if (wght !='' && !isNaN(wght) && wght.indexOf(".")!= -1){
					alert("Insert integer value for weight!");
					return false;
				}
				if ((weightSum +parseInt(_wght))>100){
					alert('Weight of level should not exceed 100. Before adding weight to this section weight was: ' + weightSum + '.Please correct the weight value!');
					return false;
				}
				
		}
		
		if (includedInEval){
			var _thres = document.getElementById('c_threshold').value
			var thresh = trimStr(_thres);
			if (thresh == "" || isNaN(thresh)||(thresh !='' && !isNaN(thresh) && thresh.indexOf(".")!= -1)){
				alert("Insert integer value for treshold!");
				return false;
			}
			if (parseInt(thresh)> 100 || parseInt(thresh)<= 0) {
				alert("Treshold must be >0 and <100");
				return false;
			}
		}
		
		var lab = trimStr(document.getElementById("c_label").value);
		if (lab == "") {
			alert('Please enter a value for Label!');
			return false;
		}
		if (lab.length>50) {
			alert("You can insert max 50 characters for label");
			return false;
		}
		
		if (selectedValue == "c_text"){
			var txtSize = trimStr(frm.c_text_size.value);
			//alert("parseInt.txtSize" + parseInt(txtSize));
			//alert("parseFloat.txtSize" + parseFloat(txtSize));
			if ((txtSize !='' && isNaN(txtSize))|| (txtSize !='' && !isNaN(txtSize) && txtSize.indexOf(".")!= -1)){
				alert("Insert integer value for size!");
				return false;
			}
			if ( txtSize !='' && parseInt(txtSize)>2000) {
				//alert('Please enter a numeric value only for size!');
				alert("Size must be number and less then 2000 characters");
				return false;
			}
		}else if (selectedValue == "c_area"){
			var row = trimStr(frm.c_area_row.value);
			var col = trimStr(frm.c_area_col.value);
			var size = trimStr(frm.c_area_size.value);
			//alert("size" +size);
			//alert("parseInt(size)" +parseInt(size));
			if ((size !='' && isNaN(size))|| (size !='' && !isNaN(size) && size.indexOf(".")!= -1)){
				alert("Please enter a number for the size");
				return false;
			}
			if ( size !='' && parseInt(size)>2000) {
				//alert('Please enter a numeric value only for size!');
				alert("Size must be number and less then 2000 characters");
				return false;
			}
			if (isNaN(row)||isNaN(col)|| (row !='' && !isNaN(row) && row.indexOf(".")!= -1) || (col !='' && !isNaN(col) && col.indexOf(".")!= -1))  {
				alert('Please enter a numeric value for Number of rows, Number of columns and Size');
				return false;
			}
			if (parseInt(row) >5 || parseInt(row)<=2)  {
				alert('Number of rows must be less then 5 and greater then 2');
				return false;
			}
			if (parseInt(col) >40 || parseInt(col)<=15)  {
				alert('Number of cols must be less then 40 and greater then 15');
				return false;
			}
			
		}else if (selectedValue == "c_numeric"){
			
			if (isNaN(frm.c_numeric_max.value) || isNaN(frm.c_numeric_min.value) || isNaN(frm.c_numeric_step.value)) {
				alert('Please enter a numeric value for Size, Max, Min');
				return false;
			}else if (parseFloat(frm.c_numeric_max.value)<=parseFloat(frm.c_numeric_min.value)){
				alert('Min value should be less than max velue');
				return false;
			}
			var maxNum='';
			var minNum='';
			if (frm.c_numeric_max.value!= ''){
				 maxNum = parseFloat(frm.c_numeric_max.value);
			}
			if (frm.c_numeric_min.value!= ''){
			 minNum = parseFloat(frm.c_numeric_min.value)
			}
			//alert("maxNum" + maxNum);
			//alert("minNum" + minNum);
			if (maxNum!= '' && minNum!=''){
				var diffER = (maxNum - minNum).toFixed(2);
				//alert("diff" + diffER);
			}
			if (maxNum!= '' && minNum!='' && frm.c_numeric_step.value!= ''){
			//alert( "razlika po mod" + (parseFloat(diffER) % parseFloat(frm.c_numeric_step.value)));
				if ((diffER % parseFloat(frm.c_numeric_step.value)).toFixed(2)!= parseFloat(0)){
					alert('Define another step for the specific min and max values');
					return false;
				}
			}
			if (includedInEval){
			//alert("maxNum" + maxNum);
			//alert("minNum" + minNum);
				if (maxNum == '' || minNum ==''){
				alert("if criterion is included in evaluation then min, max are mandatory!")
				return false;
				}
				//formula mandatory if included in evaluation
				return validateFormula(selectedValue);
			}
			
		}else if (selectedValue == "c_date"){
			var fromDate = document.getElementById("c_date_min").value;
			var toDate = document.getElementById("c_date_max").value;
			
			var cmpDate = compareDates(fromDate,toDate);
			
			if (cmpDate==false){
			//if (Date.parse(fromDate) > Date.parse(toDate)) {
				alert('Invalid Date Range!Start Date cannot be after End Date!')
				return false;
			}
			if (includedInEval){
				if (fromDate == '' || toDate == ''){
					alert("if criterion is included in evaluation then Date min, date max are mandatory!")
					return false;
				}
				//alert("DATE -> included, call validateFormula");
				//formula mandatory if included in evaluation
				return validateFormula(selectedValue);
			}
			
		}else if (selectedValue == "c_list"){
			var radio = document.selectTypeForm.c_list_selection;
			var selectedRadio = "";
			var len = radio.length
			var boolFormula=false;
			var multy=document.selectTypeForm.c_multiple.checked;
			var j=0;
			for (var i = 0; i < len; i++) {
				if (radio[i].checked) {
					selectedRadio = radio[i].value
				}
			}
			//alert("selectedRadio" + selectedRadio);
			if (selectedRadio == "") {
				alert('Please select type of options you want to create');
				return false;
			}else {
				var optNo = document.getElementById("c_list_optNo").value;
				
				if (optNo == "" || isNaN(parseInt(optNo))){
					
					alert('Please enter the number of options you want to create');
					return false;
				}else{
				var sumScore = 0;
					
					for (var i=1; i <= optNo; i++){
						if (isNaN(eval("frm.c_opt_" + i + "_val.value"))) {
							alert('Please enter a numeric value for Value of option');
							return false;
						}
						if ((eval("frm.c_opt_" + i + "_lab.value")) == "") {
							alert('Please enter a Label of option value');
							return false;
						}
						
						if (eval("frm.c_opt_" + i + "_lab.value") != "" && parseInt(eval("frm.c_opt_" + i + "_lab.value").length) >50) {
							alert("You can insert max 50 characters for label");
							return false;
						}
		
						if (isNaN(eval("frm.c_opt_" + i + "_score.value"))|| parseInt(eval("frm.c_opt_" + i + "_score.value"))>100){
							alert("Score must be integer, less then 100");
							return false;
						}
						if ((eval("frm.c_opt_" + i + "_score.value")) != "" && (eval("frm.c_opt_" + i + "_score.value")) != '0') {
							boolFormula = true;
							j++;								
						}
						if (((eval("frm.c_opt_" + i + "_score.value")) == "" || (eval("frm.c_opt_" + i + "_score.value")) != '0') ) {
							if (j>0){
								boolFormula == false;
							}else{
								boolFormula == true;
							}
						}
						//alert("multy" + multy);
						if (selectedRadio == 'check' || (selectedRadio == 'combo' && multy)){
							sumScore = sumScore + parseInt(eval("frm.c_opt_" + i + "_score.value"));
							//alert("sumScore" + sumScore);
							if (parseInt(sumScore)>100){
								alert("Sum of scores  must be less then 100");
								return false;
							}
						}
					}
				}
			}
			if (boolFormula && j<optNo){
				alert("if you insert one, please insert all scores");
				return false;
			}
		}else if (selectedValue == "c_date_range"){
			var fromMin = document.getElementById("c_date_range_from_min").value;
			var fromMax = document.getElementById("c_date_range_from_max").value;
			var toMin = document.getElementById("c_date_range_to_min").value;
			var toMax = document.getElementById("c_date_range_to_max").value;
			//alert("fromMin=" +  Date.parse(fromMin) + " fromMax=" + Date.parse(fromMax) + 
			//" toMin" + Date.parse(toMin)+ " toMax" +Date.parse(toMax))
			var cmpDate = compareDates(fromMin,fromMax);
			
			if (cmpDate==false){
			//if (Date.parse(fromMin) > Date.parse(fromMax)) {
				alert('Date From: '+'Invalid Date Range!Start Date cannot be after End Date!')
				return false;
			}
			cmpDate = compareDates(toMin,toMax);
			if (cmpDate==false){
			//if (Date.parse(toMin) > Date.parse(toMax)) {
				alert('Date To: '+'Invalid Date Range!Start Date cannot be after End Date!')
				return false;
			}
			cmpDate = compareDates(fromMax,toMin);
			if (cmpDate==false){
			//if (Date.parse(fromMax) > Date.parse(toMin)) {
				alert('Date to min must be > then Date from max:')
				return false;
			}
			
			
			
		}else if (selectedValue == "c_file"){
		
			var size = document.getElementById("c_file_size").value;
			if (isNaN(size) || parseFloat(size)>99){
			alert("File size must be number less than 99");
			return false;
			}
		}
		return true;
	}
	
	function validateFields(){
		//alert("validateFields");
		var frm = document.selectTypeForm;
		var act= 'criteria';
		var selectedEntryId = '1211874266593';
		var envelopeType = 'technical';
		var showWeight='true';
		
	
		//alert("envelopeType" + envelopeType);
		//alert("selectedEntryId" + selectedEntryId);
		//alert("act" + act);
		//alert("showWeight" + showWeight);
		
		if( selectedEntryId != 'finDef' && envelopeType !='financial'){
			var selectedEntry=window.opener.document.getElementById("fld_" + selectedEntryId);
			//var parent = selectedEntry;
			
			//alert("selectedEntry" + selectedEntry);	
			var parent;
			var mainTable = window.opener.document.getElementById("main_table");
			if (selectedEntry!=null){
				parent = selectedEntry;
			}else{
				parent = mainTable;
			}
			
		
			var lab = trimStr(frm.setLabel.value);
			//alert(lab);
			if (lab =='') {
				alert('Please enter a value for Label!');
				return false;
			}
			if (showWeight == 'true'){
				if ((act == 'addSection' || act=='edit') && selectedEntry!=null) {
						parent = parent.parentNode;
					}
					
					var parentLevel = 0;
					if (parent.attributes['level'] != null){
						parentLevel =parent.attributes['level'].nodeValue;
					}
					//alert("parentLevel" +parentLevel);
					var chLevel = parseInt(parentLevel) + 1;
					var children = parent.getElementsByTagName("fieldset");
					var childrenLen = children.length;
					//alert("childrenLen" + childrenLen);
						
					var weightSum = 0;
					for (var j=0; j<childrenLen; j++){
						var weight = children.item(j).attributes['weight'];
						//alert("weight" + weight);
						//alert("weight.nodeValue" + weight.nodeValue);

						var level = children.item(j).attributes['level'];
						if (level.nodeValue == chLevel){
								//alert("level.nodeValue" + level.nodeValue);
						//alert("chLevel" + chLevel);
							if (weight != null && weight.nodeValue!=''){
								weightSum += parseInt(weight.nodeValue)
							}
						
						}
					}
					//alert("weightSumfinal" + weightSum);
					if (act=='edit'){
						weightSum = weightSum - parseInt(selectedEntry.attributes['weight'].nodeValue);
					}
					
					var wght = trimStr(frm.setWeight.value);
					if (isNaN(wght)) {
						alert('Please enter a numeric value only for Weight!');
						return false;
					}
					
					if ((weightSum + parseInt(frm.setWeight.value))>100){
						alert('Weight of level should not exceed 100. Before adding weight to this section weight was: ' + weightSum + '.Please correct the weight value!');
						return false;
					}
			 }
		
		}
		if( envelopeType =='financial' && selectedEntryId == 'finDef'){
			var prsValCalc = document.getElementById("valCalc");
			
			if (prsValCalc!= null){
				var  presentValueCalc = document.getElementById("valCalc").checked;
			}
			var numYears = trimStr(frm.numYears.value);
			//alert(parseInt(numYears));
			//alert(presentValueCalc);
			//alert(numYears=='');
			//alert(isNaN(numYears));
			if (presentValueCalc && (isNaN(numYears) || numYears=='' || parseInt(numYears)<=0 || (numYears.indexOf(".") != -1) || parseInt(numYears)>10 )){
					alert("Please enter a numeric value for Number of Years and greater then 0!" + "0<numYears<10");
					return false;
			}
			var lab = trimStr(frm.setLabel.value);
			//alert(lab);
			if (lab =='') {
				alert('Please enter a value for Label!');
				return false;
			}
			if (parseInt(lab.length)>50){
				alert("You can insert max 50 characters for label" );
				return false;
			}
			var disc = document.getElementById("discount");
			var discount = trimStr(disc.value);
			//alert("discount" + discount);
			if (presentValueCalc && (isNaN(discount) || discount=='')){
				alert("Please insert numeric for discount!");
				return false;
			}
			
		}
		if (envelopeType =='financial' && selectedEntryId != 'finDef'){

			var fNumericLab = trimStr(frm.f_numeric_lab.value);
			if (fNumericLab=='' ) {
				alert('Please enter a value for Label!');
				return false;
			}
			if (parseInt(fNumericLab.length)>50){
				alert("You can insert max 50 characters for label" );
				return false;
			}
			
			
		}
		return true;
	}
	
	function validateFormula(criteria){ //OK
		var formulaType = $j("#evalFormula").val();
		var ret = true;
		alert("formulaType: [" + formulaType + "]");
		//if (formulaType ==""){
		//	alert("Please select formula type and its parameters");
		//	ret = false;
		//}else
		if (criteria == 'c_numeric'){
			var maxNum =  trimStr($j("#c_numeric_max").val());
			var minNum = trimStr($j("#c_numeric_min").val());
		}else{
			var maxNum =  trimStr($j("#c_date_max").val());
			var minNum = trimStr($j("#c_date_min").val());
		}
			var max = criteria == 'c_numeric' ? parseFloat(maxNum) : maxNum;
			var min = criteria == 'c_numeric' ? parseFloat(minNum) : minNum;
			
		 if (formulaType =="linear"){
			var low = trimStr($j("#c_lower").val());
			var up = trimStr($j("#c_upper").val());
			var lowScore = trimStr($j("#c_lower_score").val());
			var upScore = trimStr($j("#c_upper_score").val());
			
			if (isNaN(lowScore) || isNaN(upScore) || parseInt(lowScore) > 100 || 
			lowScore.indexOf(".")!= -1 || upScore.indexOf(".")!= -1 ||
				parseInt(lowScore)<0 || parseInt(upScore) >100 || parseInt(upScore)<0 || parseInt(upScore)>100){
				alert("Score must be integer >= 0 and <100");
				ret = false;
			}
			
			if(low == "" || up == "" || lowScore=="" || upScore==""){
				alert("Please enter values for Lower Limit, Upper Limit and Score");
				ret = false;
			}else{
			
				if (criteria == 'c_numeric' && (isNaN(low) || isNaN(up))){
						alert("lowerLimit and upperLimit must be numbers");
					ret = false;
				} 
									
				var lowerLimit = criteria == 'c_numeric' ? parseFloat(low) : low;
				var upperLimit = criteria == 'c_numeric' ? parseFloat(up) : up;
				
								
				if (criteria == 'c_numeric'){
					if(lowerLimit >= upperLimit){
						alert("Lower limit must be less then Upper limit");
						ret = false;
					}
					if (lowerLimit > max || lowerLimit< min){
						alert("lowerLimit must be beetwen min and max");
						ret = false;
					}
					if (upperLimit > max || upperLimit< min){
						alert("upperLimit must be beetwen min and max");
						ret = false;
					}
				}
				
				if (criteria == 'c_date'){
					cmpDate = compareDates(lowerLimit,upperLimit);
					if (cmpDate==false){
						alert("Lower limit must be less then Upper limit");
						ret = false;
					}
					var cmpDate1 = compareDates(lowerLimit, max);
					var cmpDate2 = compareDates(min, lowerLimit);
					if (cmpDate1==false || cmpDate2==false){
						alert("lowerLimit must be beetwen min and max");
						ret = false;
					}
					var cmpDate1 = compareDates(upperLimit,max);
					var cmpDate2 = compareDates(min,upperLimit);
					
					if (cmpDate1==false || cmpDate2==false){
						alert("upperLimit must be beetwen min and max");
						ret = false;
					}
					
				}
			}
		}else if (formulaType =="step"){
			//how many ranges?
			var stepDiv = $j("#step");
			var allParams = $j("#step div");
			//last div is empty -> used for adding new range, so subtract it
			var j=0;
			var numOfRanges = allParams.length - 1;
			//alert("numOfRanges" + numOfRanges);
			for (var i = 1; i<=numOfRanges ; i++){
				j=i+1;
				//alert("j" + j);
				var low = trimStr($j("#c_lower_" + i).val());
				var up = trimStr($j("#c_upper_" + i).val());
				//alert("j" + j + "numOfRanges" + numOfRanges);
				if (parseInt(j)<= parseInt(numOfRanges)){
					var nextForm = trimStr($j("#c_lower_" + j).val());
				}
				var score = trimStr($j("#c_score_" + i).val());
				
				if (isNaN(score) || parseInt(score) > 100 || score.indexOf(".")!= -1  || parseInt(score)<0 ){
					alert("Score must be integer >= 0 and <100");
					ret = false;
				}
				if(low=="" || up=="" || score==""){
					alert("Please enter values for From, To and Score");
					ret = false;
				}else{
					if (criteria == 'c_numeric' && (isNaN(low) || isNaN(up))){
							alert("from and to must be numbers");
						ret = false;
					} 
					var lowerLimit = criteria == 'c_numeric' ? parseFloat(low) : low;
					var upperLimit = criteria == 'c_numeric' ? parseFloat(up) : up;
					var nextLowerLimit = criteria == 'c_numeric' ? parseFloat(nextForm) : nextForm;
					if (criteria == 'c_numeric'){
						if (lowerLimit >= upperLimit){
							alert("From limit must be less then To");
							ret = false;
						}
						//alert("lowerLimit=" + lowerLimit + " max=" + max + " min=" + min + " upperLimit=" + upperLimit + "nextLowerLimit" + nextLowerLimit);
						if (lowerLimit > max || lowerLimit< min){
							alert("lowerLimit must be beetwen min and max");
							ret = false;
						}
						if (upperLimit > max || upperLimit< min){
							alert("upperLimit must be beetwen min and max");
							ret = false;
						}
					}
					if (criteria == 'c_date'){
						cmpDate = compareDates(lowerLimit,upperLimit);
						if (cmpDate==false){
							alert("From limit must be less then To");
							ret = false;
						}
						//alert("lowerLimit=" + lowerLimit + " max=" + max + " min=" + min + " upperLimit=" + upperLimit + "nextLowerLimit" + nextLowerLimit);

						var cmpDate1 = compareDates(lowerLimit, max);
						var cmpDate2 = compareDates(min, lowerLimit);
						if (cmpDate1==false || cmpDate2==false){
							alert("lowerLimit must be beetwen min and max");
							ret = false;
						}
						var cmpDate1 = compareDates(upperLimit,max);
						var cmpDate2 = compareDates(min,upperLimit);
						if (cmpDate1==false || cmpDate2==false){
							alert("upperLimit must be beetwen min and max");
							ret = false;
						}
					}
					if (parseInt(j)<= parseInt(numOfRanges)){
						if (criteria == 'c_numeric'){
							if (nextLowerLimit <= upperLimit){
								alert("'Form' in line " + (i+1) + "  must be  > then 'To' in line "+ i + "  ");
								ret = false;
							
							}
						}
						if (criteria == 'c_date'){
							cmpDate = compareDates(upperLimit,nextLowerLimit);
							if (cmpDate==false){
								alert("'Form' in line " + (i+1) + "  must be  > then 'To' in line "+ i + "  ");
								ret = false;
							
							}
						}
					}
				}
			}
		}
		return ret;
	}

	function trimStr(sString){ // OK
		while (sString.substring(0,1) == " "){
			sString = sString.substring(1, sString.length);
		}
		while (sString.substring(sString.length-1, sString.length) == " "){
			sString = sString.substring(0,sString.length-1);
		}
		return sString;
	}

	function addParam(i){ // OK
	
		var k = parseInt(i)-1;
		var addBtnToRemove = "addParam_" + k;
		
		$j("#"+addBtnToRemove).hide();
		if (i > 2){
			var deleteBtnToRemove = "deleteParam_" + k;
			$j("#"+deleteBtnToRemove).hide();
		}
		
		var j = parseInt(i) + 1;
		
		var crType = '';
		if (crType == ''){
			crType = $j("#CrType").val();
		} else {
			crType = 'c_'+ crType;
		}
		var dStyle = crType == 'c_date'? "" : "none";
		
		var contP = document.createElement("p");
		$j(contP)
			.attr("id","params_" + i)
			.addClass("params_div");
		
			var lblFrom = document.createElement("label");
				$j(lblFrom)
					.addClass("w33")
					.attr("for","c_lower_" + i)
					.html("From")
			var inpFrom = document.createElement("input");
				$j(inpFrom)
					.attr("type","text")
					.attr("size", 4)
					.attr("id","c_lower_" + i)
					.attr("name","c_lower_" + i)
					.val("");
			//output+="<a style=\"display:"+ dStyle +";\" href=\"javascript:NewCal(\"c_lower_" + i +"\",\"ddmmyyyy\")\"><img src=\"../images/action_calendar.gif\" width=\"18\" height=\"18\" border=\"0\" alt=\"Pick a date\"></a>";
			
			var lblTo = document.createElement("label");
				$j(lblTo)
					.attr("for","c_upper_" + i)
					.html("To")
			var inpTo = document.createElement("input");
				$j(inpTo)
					.attr("type","text")
					.attr("size", 4)
					.attr("id","c_upper_" + i)
					.attr("name","c_upper_" + i)
					.val("");
			//output+="<a style=\"display:"+ dStyle +";\" href=\"javascript:NewCal(\"c_upper_" + i +"\",\"ddmmyyyy\")\"><img src=\"../images/action_calendar.gif\" width=\"18\" height=\"18\" border=\"0\" alt=\"Pick a date\"></a>";

			var lblScore = document.createElement("label");
				$j(lblScore)
					.attr("for","c_score_" + i)
					.html("Score")
			var inpScore = document.createElement("input");
				$j(inpScore)
					.attr("type","text")
					.attr("size", 2)
					.attr("id","c_score_" + i)
					.attr("name","c_score_" + i)
					.val("");

			var btnAdd = document.createElement("button");
				$j(btnAdd)
					//.attr("type", "button")
					.attr("id", "addParam_" + i)
					.attr("name", "addParam_" + i)
					.html("Add")
					.click(function(ev){
						addParam(j);
						return false;
					});

			var btnDel = document.createElement("button");
				$j(btnDel)
					//.attr("type", "button")
					.attr("id", "deleteParam_" + i)
					.attr("name", "deleteParam_" + i)
					.html("Delete")
					.click(function(ev){
						deleteParam(i);
						return false;
					});

		$j(contP)
			.append(lblFrom)
			.append(inpFrom)
			.append(lblTo)
			.append(inpTo)
			.append(lblScore)
			.append(inpScore)
			.append(btnAdd)
			.append(btnDel);

		var divToAdd = "params_" + k;
		$j("#"+divToAdd)
			.after(contP);
	}

	function deleteParam(i){ // OK
		var output = "";
		var spanToDelete = "params_" + i;
		$j("#"+spanToDelete).remove();
		
		var j = parseInt(i) - 1;
		var addBtnToShow="addParam_" + j;
		$j("#"+addBtnToShow).show();
		if (i > 2){
			var deleteBtnToShow="deleteParam_" +j;
			$j("#"+deleteBtnToShow).show();
		}
	}

	function showFormula(){ // OK
		var selectedValue = $j("#evalFormula").val();
		if (selectedValue == ''){
			$j("#linear, #step").hide();
		}else if (selectedValue == 'linear'){
			$j("#step").hide();
			$j("#linear").show();
		}else if (selectedValue == 'step'){
			$j("#linear").hide();
			$j("#step, #params_1, #params_2").show();
		}
	}

	function showEvalParams(check){ // OK
		//alert("check:" + check);
		if (check){
			if ($j('#c_mandatory').attr("checked") != true){
				var confirmText = "This criterion has to be mandatory!";
				if (confirm(confirmText)) {
					$j('#c_mandatory').attr("checked","checked");
				}
			}
		}
		var crType = '';
		if(crType == ''){
			crType = $j("#CrType").val();
		}else{
			crType = 'c_'+ crType;
		}
		//if checked show eval_params div; and id selected type is c_date or c_numeric show formula div
		if (check){
			$j('#eval_params').show();
			
			if (crType == 'c_numeric' || crType == 'c_date'){
				$j('#formula').show();
				//show calendar if criterion type is date
				var aStyle = "none";
				if(crType == 'c_date'){
					aStyle = "inline";
				}
				//var dateElements = $j("a");
				$j("a").each(function(ev){
					$j(this).css("display",aStyle);
				});
			}
			
		}else{
			var showWeight='true';
			//alert("showWeight: " + showWeight);
			$j('#eval_params').hide();
			$j('#c_threshold').val("");
			if (showWeight == 'true'){
				$j('#c_weight').val("");
			}
			
		}

		if (crType == 'c_list'){
			var listScoreStyle = check ? "":"none";
			$j("span[id^='evalScore_']").each(function(){
				$j(this).css("display",listScoreStyle);
			});
		}
	
	}

	function presentValueCalc(check){ // OK
		if (check){
			$j('#presentValueCalc').show();
		}else{	
			$j('#presentValueCalc').hide();
		}
	}
	//returns false if date1 >= date2
	// returns true if date2>date1
	function compareDates(date1, date2){ // OK
		var date2Str = date2.split("/");
		var datDate2 = new Date(date2Str[2], date2Str[1]-1, date2Str[0]);
	
		var date1Str = date1.split("/");
		var datDate1 = new Date(date1Str[2], date1Str[1]-1, date1Str[0]);
	
		var iDiffMS = datDate1.getTime() - datDate2.getTime();
		if (iDiffMS >= 0 ){
			return false;
		}
		return true;
	}
	
	$j("document").ready(function(){
		if ($j("form#selectTypeForm").length > 0){
			renderCriteraFields();
			$j("#CrType").change(function(){renderCriteraFields();});
			$j("#evalFormula").change(function(){showFormula();});
		}
	});