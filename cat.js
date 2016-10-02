var redditJoke = function(a){
	return JSON.parse(a)[0].data.children[0].data.title+"  \n\n"+JSON.parse(a)[0].data.children[0].data.selftext;
}
var translation = function(a){
	return JSON.parse(a).contents.translated
}

function translator(str) {
	return function(r){return str + r.join(" ")}
}

function randomEle(arr){
	return function(){return arr[~~(Math.random()*arr.length)]};
}

list = {
	cat: ["http://catfacts-api.appspot.com/api/facts", function(a){return JSON.parse(a).facts}],
	taco: [],
	chuck: ["https://api.chucknorris.io/jokes/random", function(a){return JSON.parse(a).value}],
	chuck2: ["http://api.icndb.com/jokes/random", function(a){return JSON.parse(a).value.joke}],
	latvia: ["https://www.reddit.com/r/latvianjokes/random.json", redditJoke],
	dadjoke: ["https://www.reddit.com/r/dadjokes/random.json", redditJoke],
	showerthought: ["https://www.reddit.com/r/showerthoughts/random.json", redditJoke],
	joke: ["https://www.reddit.com/r/jokes/random.json", redditJoke],
	subreddit: ["", redditJoke, function(r){return "https://www.reddit.com/r/"+r[0]+"/random.json"}],
	pirate: ["", function(a){return JSON.parse(a).translation.pirate}, translator("http://isithackday.com/arrpi.php?format=json&text=")],
	number: ["", function(a){return a}, function(r){return "http://numbersapi.com/"+r[0]}],
	yomomma: ["http://api.yomomma.info/", function(a){return JSON.parse(a).joke}],
	nerdyPickupLine: ["",randomEle(nerdyPickupLines)],
	pokemonPickupLine: ["",randomEle(pokemonPickupLines)],
	yoda: ["", function(){return ""}, function(){return ""}, function(dat){
		$.ajax({
		  type: "POST",
		  url: "http://www.yodaspeak.co.uk/index.php",
		  data: "YodaMe="+dat.join("+")+"&go=Convert+to+Yoda-Speak%21",
		  success: function(a){chatClient.message(a.slice(a.indexOf("name='YodaSpeak'")).split(/\<|\>/)[1])},
		  processData:false
		});
	}]
}

function getThing(url, callback, callback2, dat2) {
	if (url!="") {
		xhttp=new XMLHttpRequest();
		var res = "";
		xhttp.onloadend=function(){
			callback(this.responseText);
		}
		xhttp.open("GET",url,true)
		xhttp.send()
		return res;
	}
	else if(!dat2) {
		
		callback();
	} else {
		callback2(dat2);
	}
}

function trigger(str) {
	var split = str.split(" ").map(function(a){return a.trim()});
	Object.keys(list).forEach(function(a){ 
		if (split.indexOf("!"+a) >= 0) {
			getThing(
				list[a][2]?list[a][2](split.slice(1)):
					list[a][0], 
				function(b){chatClient.message(list[a][1](b))}, 
				list[a][3],
				split.slice(1)
			);
		}
	})
}