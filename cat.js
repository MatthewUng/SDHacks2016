var titles = [];
var titlesNew = [];
var terminals = {};
var startwords = [];
var wordstats = {};
var lastTime = 0;
	
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

helptext = {
	subreddit: " <subreddit>",
	pirate: " <sentence>",
	number: " <number>",
	yoda: " <sentence>"
}

list = {
	help: ["", function(){return "Available commands: " + Object.keys(list).map(function(q){return "!"+q + (helptext[q]?helptext[q]:"")}).sort().join(", ")}],
	cat: ["http://catfacts-api.appspot.com/api/facts", function(a){return JSON.parse(a).facts}],
	chuck: ["https://api.chucknorris.io/jokes/random", function(a){return JSON.parse(a).value}],
	chuck2: ["http://api.icndb.com/jokes/random", function(a){return JSON.parse(a).value.joke}],
	latvia: ["https://www.reddit.com/r/latvianjokes/random.json", redditJoke],
	dadjoke: ["https://www.reddit.com/r/dadjokes/random.json", redditJoke],
	showerthought: ["https://www.reddit.com/r/showerthoughts/random.json", redditJoke],
	joke: ["https://www.reddit.com/r/jokes/random.json", redditJoke],
	subreddit: ["", redditJoke, function(r){return "https://www.reddit.com/r/"+r[0]+"/random.json"}],
	pirate: ["", function(a){return JSON.parse(a).translation.pirate}, translator("http://isithackday.com/arrpi.php?format=json&text=")],
	number: ["", function(a){return a}, function(r){return "http://numbersapi.com/"+r[0]}],
	yomama: ["http://api.yomomma.info/", function(a){return JSON.parse(a).joke}],
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
	}],
	schneier: ["http://www.schneierfacts.com/",function(a){
		return a.slice(a.indexOf("<p class=\"fact\">")).split(/\<|\>/)[2];
	}],
	talk: ["",function(){return make_title(5)}]
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
	else if(!callback2) {
		
		callback();
	} else {
		callback2(dat2);
	}
}

function trigger(str) {
	var split = str.split(" ").map(function(a){return a.toUpperCase().trim()});
	var matched = false;
	Object.keys(list).forEach(function(a){ 
		if (split.indexOf("!"+a.toUpperCase()) >= 0) {
			matched = true;
			getThing(
				list[a][2]?list[a][2](split.slice(1)):
					list[a][0], 
				function(b){chatClient.message(list[a][1](b))}, 
				list[a][3],
				split.slice(1)
			);
		}
	})
	if(!matched) {
		titlesNew.push(str);
		var time = new Date().getTime();
		if (time - lastTime > 5 * 60 * 1000) {//5 minutes
			lastTime = time; //copy of array
			titles = titlesNew.slice();
			generate();
		}
	}
}

function manualGen() {
	titles = titlesNew.slice();
	generate();
}

//blatantly copied from http://www.soliantconsulting.com/blog/2013/02/title-generator-using-markov-chains
function generate(){ 
	for (var i = 0; i < titles.length; i++) {
		var words = titles[i].split(' ');
		terminals[words[words.length-1]] = true;
		startwords.push(words[0]);
		for (var j = 0; j < words.length - 1; j++) {
			if (wordstats.hasOwnProperty(words[j])) {
				wordstats[words[j]].push(words[j+1]);
			} else {
				wordstats[words[j]] = [words[j+1]];
			}
		}
	}
}
var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
};

var make_title = function (min_length) {
    word = choice(startwords);
    var title = [word];
    while (wordstats.hasOwnProperty(word)) {
        var next_words = wordstats[word];
        word = choice(next_words);
        title.push(word);
        if (title.length > min_length && terminals.hasOwnProperty(word)) break;
    }
    if (title.length < min_length) return make_title(min_length);
    return title.join(' ');
};

Object.keys(list).forEach(function(a){
	var e = document.createElement("button");
	e["className"] = "btn";
	e.innerText=a;
	$(".button-list")[0].appendChild(e)
	//e.onclick="trigger(\"!"+a+"\)";
	e.addEventListener("click",function(){trigger("!"+a)});
})