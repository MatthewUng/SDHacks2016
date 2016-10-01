var redditJoke = function(a){
	return JSON.parse(a)[0].data.children[0].data.title+"\n\n"+JSON.parse(a)[0].data.children[0].data.selftext;
}

list = {
	cat: ["http://catfacts-api.appspot.com/api/facts", function(a){return JSON.parse(a).facts}],
	taco: [],
	chuck: ["https://api.chucknorris.io/jokes/random", function(a){return JSON.parse(a).value}],
	chuck2: ["http://api.icndb.com/jokes/random", function(a){return JSON.parse(a).value.joke}],
	latvia: ["https://www.reddit.com/r/latvianjokes/random.json", redditJoke],
	dadjoke: ["https://www.reddit.com/r/dadjokes/random.json", redditJoke],
	showerthought: ["https://www.reddit.com/r/showerthoughts/random.json", redditJoke],
	joke: ["https://www.reddit.com/r/jokes/random.json", redditJoke]
}

function getThing(url, callback) {
	xhttp=new XMLHttpRequest();
	var res = "";
	xhttp.onloadend=function(){
		callback(this.responseText);
	}
	xhttp.open("GET",url,true)
	xhttp.send()
	return res;
}

function trigger(str) {
	var split = str.split(" ");
	Object.keys(list).forEach(function(a){ 
		if (split.indexOf("!"+a) >= 0) {
			getThing(list[a][0], function(b){chatClient.message(list[a][1](b))});
		}
	})
}