/* ////////////////////////////////////////////////////////////////
Simple popup window script.
 //////////////////////////////////////////////////////////////// */
function popup(url, name, w, h, scroll) {
	var winLeft = (screen.width - w) / 2;
	var winTop = (screen.height - h) / 4;
	var params = 'height='+ h +',width='+ w +',left='+ winLeft +',top='+ winTop +',scrollbars='+ scroll +',resizable=0';
	var newWindow = window.open(url, name, params);

	if (this.focus) {
		newWindow.focus();
	}
}