function cat(callback) {
	xhttp=new XMLHttpRequest();
	var res = "";
	xhttp.onloadend=function(){
		callback(this.responseText);
	}
	xhttp.open("GET","http://catfacts-api.appspot.com/api/facts",true)
	xhttp.send()
	return res;
}