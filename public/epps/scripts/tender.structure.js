$j('document').ready(function(ev){
//	$("#TStruct fieldset fieldset, #TStruct fieldset div:not(.TSHead)")
//		.hide();
	$j(".TSHead p a").click(function(){
		var parentFldset = $j(this).parent("p").parent("div").parent("fieldset");
		$j.each(parentFldset.children("fieldset"), function(){
			if (!$j(this).is(":visible")){
				$j(this).show();
			} else {
				$j(this).hide();
			}
		});
		var s = $j("input[name=hiddenAct]").val();
		if(s != null) {
			if (s.indexOf(this.id)>=0) {
				s = s.replace(this.id, '').replace(',,',',');
				if (s.charAt(0)==',') s = s.substr(1);
				if (s.charAt(s.length-1)==',') s = s.substr(0, s.length-1);
			} else {
				if (s.length>0) s += ',';
				s += this.id;
			}
			$j("input[name=hiddenAct]").val(s);
		}
		return false;
	});
	
	var hid = $j("input[name=hiddenAct]");
	var s = hid.val();
	if (typeof s == "string" && s.length>0) {
		var as = s.split(",");
		for ( var i=0; i<as.length; i++) {
			$j("#"+as[i]).click();
		}
		hid.val(s);
	}
})