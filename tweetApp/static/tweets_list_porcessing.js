
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function retweetButton(tweet) {
    return "<button class='btn btn-outline-success btn-sm' onclick=actionTweetButton(" + 
    	tweet.id + ",'retweet')>retweet</button>"
}

function unlikeButton(tweet) {
    return "<button id='unlike-counter' class='btn btn-outline-primary btn-sm tweet-unlike' onclick=actionTweetButton(" + 
    	tweet.id + ",'unlike')>unlike</button>"
}

function likeButton(tweet) {
    return "<button id='like-counter' class='btn btn-primary btn-sm tweet-like' onclick=actionTweetButton(" + 
    	tweet.id + ",'like')>" + tweet.likes + " likes</button>"
}



/* ------------------ Паттерн фабричный метод ------------------------------- */


class AbstractTweetFactory {

	createComponent(tweet) { }

}

class BaseTweetFactory extends AbstractTweetFactory {
	
	createComponent(tweet) {
		return new TweetHTMLComponent(tweet);
	}
}

class BaseRetweetFactory extends AbstractTweetFactory {

	createComponent(tweet) {
		return new RetweetHTMLComponent(tweet);
	}

}

class RetweetWithCommentFactory extends AbstractTweetFactory {

	createComponent(tweet) {
		return new RetweetWithCommentHTMLComponent(tweet);
	}

}


class TweetHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getComponent() {
		let t = this.tweet;
		return '<div class="tweet-' + t.id + ' card text-white bg-dark mb-3" style="margin-left: 255px;' +  
					'margin-right: 255px; margin-bottom: 25px;  margin-top: 25px">' +
 		       		'<div class="card-header">' + 
		       			'<a style="color: yellow;">@' + t.user + '</a>' + 
		       			'<em style="color: yellow; margin-left: 550px;">#origin tweet</em>' + 
 		       		'</div>' + 
				'<div class="card-body">' + 
    		       			'<p class="card-text">' + t.text_content + '</p>' + 
				'</div>' + 

				'<div class="btn-group d-flex" style="width: 30%; margin-left: 30px; margin-bottom: 10px;">' +
		    			likeButton(t) +
		    			unlikeButton(t) + 
					retweetButton(t) +
				'</div>' + 

		       		'<div><em style="color: yellow; margin-left: 630px;">' + t.date_created + '</em></div>' +
  			'</div>'
	}
}

class RetweetHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getComponent() {
		let t = this.tweet;
		return '<div class="tweet-' + t.parent.id + ' card text-white bg-dark mb-3" style="margin-left: 255px;' +  
					'margin-right: 255px; margin-bottom: 25px;  margin-top: 25px">' +
 		       		'<div class="card-header">' + 
		       			'<a style="color: yellow;">@' + t.user + '</a>' + 
		       			'<em style="color: yellow; margin-left: 450px;">#no comment retweet from @' + 
						t.parent.user + '</em>' + 
 		       		'</div>' + 
				'<div class="card-body">' + 
    		       			'<p class="card-text">' + t.parent.text_content + '</p>' + 
				'</div>' + 
	
				'<div class="btn-group d-flex" style="width: 30%; margin-left: 30px; margin-bottom: 10px;">' +
		    			likeButton(t.parent) +
		    			unlikeButton(t.parent) + 
				'</div>' + 

		       		'<div><em style="color: yellow; margin-left: 630px;">' + t.parent.date_created + '</em></div>' +
  			'</div>'
	}
}

class RetweetWithCommentHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getComponent() {
		let t = this.tweet;
		return '<div class="tweet-' + t.id + ' card text-white bg-dark mb-3" style="margin-left: 255px;' +  
					'margin-right: 255px; margin-bottom: 25px;  margin-top: 25px">' +
 		       		
				'<div class="card-header">' + 
		       			'<a style="color: yellow;">@' + t.user + '</a>' + 
		       			'<em style="color: yellow; margin-left: 450px;">#retweet with comment from @' + 
						t.parent.user + '</em>' + 
 		       		'</div>' + 

				'<div class="card-body">' + 
    		       			'<p class="card-text">' + t.text_content + '</p>' + 
				'</div>' + 

					'<div class="card border-warning mb-3" style="margin-left: 170px;' +  
							'margin-right: 170px; margin-bottom: 25px;  margin-top: 25px">' + 
  						
						'<div class="card-body text-dark">' + 
    							'<p class="card-text">' + t.parent.text_content + '</p>' +
  						'</div>' +
					'</div>' + 

				'<div class="btn-group d-flex" style="width: 30%; margin-left: 30px; margin-bottom: 10px;">' +
		    			likeButton(t) +
		    			unlikeButton(t) + 
				'</div>' + 

		       		'<div><em style="color: yellow; margin-left: 630px;">' + t.date_created + '</em></div>' +
  			'</div>'
	}
}

/* -------------------------------------------------------------------- */


function formatRetweetElement(tweet) {
	let component = null;

	if (tweet.retweet_with_comment === true) {
		let factory = new RetweetWithCommentFactory();
		let response = factory.createComponent(tweet);
		component = response.getComponent();
	} else {
		let factory = new BaseRetweetFactory();
		let response = factory.createComponent(tweet);
		component = response.getComponent();
	}
	return component;
}

function formatTweetElement(tweet) {
	let factory = new BaseTweetFactory();
	let response = factory.createComponent(tweet);
	let component = response.getComponent();
	return component;
}

function socialScoreHandler(tweet_id, xhr) {
	let tweet = JSON.parse(xhr.response);
	let tweets = document.getElementsByClassName('tweet-' + tweet_id);
	for (i=0; i<tweets.length; i++){
		let likeBtn = tweets[i].getElementsByClassName('tweet-like')[0];
		likeBtn.innerText = tweet.likes + ' likes'; 
	}
	return;
}

function retweetHandler(xhr) {
	let tweet = JSON.parse(xhr.response);
	let tweetsBar = document.getElementById('tweets-list');
	let component = null;

	if (tweet.retweet_with_comment) {
		let factory = new RetweetWithCommentFactory();
		component = factory.createComponent(tweet).getComponent();
	} else {
		let factory = new BaseRetweetFactory();
		component = factory.createComponent(tweet).getComponent();
	}
	
	tweetsBar.innerHTML = component + tweetsBar.innerHTML;
	return;
}

function actionTweetButton(tweet_id, action) {
	const url = '/api/tweet/action';
	const method = 'POST';
	const data = JSON.stringify({
		id: tweet_id,
		action: action
	});
	const csrftoken = getCookie('csrftoken');
	let xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('X-CSRFToken', csrftoken);

	xhr.addEventListener("readystatechange", () => {
		if(xhr.readyState === 4 && xhr.status === 200) {
			if(action === 'like') {
				socialScoreHandler(tweet_id, xhr);  // Обработка <лайка\дизлайка>
			} else if(action === 'unlike') {
				socialScoreHandler(tweet_id, xhr);
			} else if(action === 'retweet') {
				retweetHandler(xhr);  // Обработка ретвита
			}
		}
	});
	xhr.send(data);
}	


function loadTweetsToHTML() {
	let tweetsBar = document.getElementById('tweets-list');

	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	const url = '/api/tweets/';
	const method = 'GET';
	xhr.open(method, url);
	xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.onload  = () => {
		let tweets = xhr.response;  // Возвращает массив объектов
		let tweetsListString = '';  // Строка, содержащая HTML-элементы твита
		for (i=0; i<tweets.length; i++){
			var tweetObj = tweets[i];
			if (tweetObj.is_retweet === true) {
				var currentItem = formatRetweetElement(tweetObj);
			} else {
				var currentItem = formatTweetElement(tweetObj);  // Получаем HTML формат твита
			}
			tweetsListString += currentItem;  // Добавляем HTML твита в общую строку
		}
		tweetsBar.innerHTML = tweetsListString;  // Помещаем HTML-элементы твита в контейнер
	}
	xhr.send();
}

loadTweetsToHTML();

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function retweetButton(tweet) {
    return "<button class='btn btn-outline-success btn-sm' onclick=actionTweetButton(" + 
    	tweet.id + ",'retweet')>retweet</button>"
}

function unlikeButton(tweet) {
    return "<button id='unlike-counter' class='btn btn-outline-primary btn-sm tweet-unlike' onclick=actionTweetButton(" + 
    	tweet.id + ",'unlike')>unlike</button>"
}

function likeButton(tweet) {
    return "<button id='like-counter' class='btn btn-primary btn-sm tweet-like' onclick=actionTweetButton(" + 
    	tweet.id + ",'like')>" + tweet.likes + " likes</button>"
}



/* ------------------ Паттерн фабричный метод ------------------------------- */


class AbstractTweetFactory {

	createComponent(tweet) { }

}

class BaseTweetFactory extends AbstractTweetFactory {
	
	createComponent(tweet) {
		return new TweetHTMLComponent(tweet);
	}
}

class BaseRetweetFactory extends AbstractTweetFactory {

	createComponent(tweet) {
		return new RetweetHTMLComponent(tweet);
	}

}

class RetweetWithCommentFactory extends AbstractTweetFactory {

	createComponent(tweet) {
		return new RetweetWithCommentHTMLComponent(tweet);
	}

}


class TweetHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getComponent() {
		let t = this.tweet;
		return '<div class="tweet-' + t.id + ' card text-white bg-dark mb-3" style="margin-left: 255px;' +  
					'margin-right: 255px; margin-bottom: 25px;  margin-top: 25px">' +
 		       		'<div class="card-header">' + 
		       			'<a style="color: yellow;">@' + t.user + '</a>' + 
		       			'<em style="color: yellow; margin-left: 550px;">#origin tweet</em>' + 
 		       		'</div>' + 
				'<div class="card-body">' + 
    		       			'<p class="card-text">' + t.text_content + '</p>' + 
				'</div>' + 

				'<div class="btn-group d-flex" style="width: 30%; margin-left: 30px; margin-bottom: 10px;">' +
		    			likeButton(t) +
		    			unlikeButton(t) + 
					retweetButton(t) +
				'</div>' + 

		       		'<div><em style="color: yellow; margin-left: 630px;">' + t.date_created + '</em></div>' +
  			'</div>'
	}
}

class RetweetHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getComponent() {
		let t = this.tweet;
		return '<div class="tweet-' + t.parent.id + ' card text-white bg-dark mb-3" style="margin-left: 255px;' +  
					'margin-right: 255px; margin-bottom: 25px;  margin-top: 25px">' +
 		       		'<div class="card-header">' + 
		       			'<a style="color: yellow;">@' + t.user + '</a>' + 
		       			'<em style="color: yellow; margin-left: 450px;">#no comment retweet from @' + 
						t.parent.user + '</em>' + 
 		       		'</div>' + 
				'<div class="card-body">' + 
    		       			'<p class="card-text">' + t.parent.text_content + '</p>' + 
				'</div>' + 
	
				'<div class="btn-group d-flex" style="width: 30%; margin-left: 30px; margin-bottom: 10px;">' +
		    			likeButton(t.parent) +
		    			unlikeButton(t.parent) + 
				'</div>' + 

		       		'<div><em style="color: yellow; margin-left: 630px;">' + t.parent.date_created + '</em></div>' +
  			'</div>'
	}
}

class RetweetWithCommentHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getComponent() {
		let t = this.tweet;
		return '<div class="tweet-' + t.id + ' card text-white bg-dark mb-3" style="margin-left: 255px;' +  
					'margin-right: 255px; margin-bottom: 25px;  margin-top: 25px">' +
 		       		
				'<div class="card-header">' + 
		       			'<a style="color: yellow;">@' + t.user + '</a>' + 
		       			'<em style="color: yellow; margin-left: 450px;">#retweet with comment from @' + 
						t.parent.user + '</em>' + 
 		       		'</div>' + 

				'<div class="card-body">' + 
    		       			'<p class="card-text">' + t.text_content + '</p>' + 
				'</div>' + 

					'<div class="card border-warning mb-3" style="margin-left: 170px;' +  
							'margin-right: 170px; margin-bottom: 25px;  margin-top: 25px">' + 
  						
						'<div class="card-body text-dark">' + 
    							'<p class="card-text">' + t.parent.text_content + '</p>' +
  						'</div>' +
					'</div>' + 

				'<div class="btn-group d-flex" style="width: 30%; margin-left: 30px; margin-bottom: 10px;">' +
		    			likeButton(t) +
		    			unlikeButton(t) + 
				'</div>' + 

		       		'<div><em style="color: yellow; margin-left: 630px;">' + t.date_created + '</em></div>' +
  			'</div>'
	}
}

/* -------------------------------------------------------------------- */


function formatRetweetElement(tweet) {
	let component = null;

	if (tweet.retweet_with_comment === true) {
		let factory = new RetweetWithCommentFactory();
		let response = factory.createComponent(tweet);
		component = response.getComponent();
	} else {
		let factory = new BaseRetweetFactory();
		let response = factory.createComponent(tweet);
		component = response.getComponent();
	}
	return component;
}

function formatTweetElement(tweet) {
	let factory = new BaseTweetFactory();
	let response = factory.createComponent(tweet);
	let component = response.getComponent();
	return component;
}

function socialScoreHandler(tweet_id, xhr) {
	let tweet = JSON.parse(xhr.response);
	let tweets = document.getElementsByClassName('tweet-' + tweet_id);
	for (i=0; i<tweets.length; i++){
		let likeBtn = tweets[i].getElementsByClassName('tweet-like')[0];
		likeBtn.innerText = tweet.likes + ' likes'; 
	}
	return;
}

function retweetHandler(xhr) {
	let tweet = JSON.parse(xhr.response);
	let tweetsBar = document.getElementById('tweets-list');
	let component = null;

	if (tweet.retweet_with_comment) {
		let factory = new RetweetWithCommentFactory();
		component = factory.createComponent(tweet).getComponent();
	} else {
		let factory = new BaseRetweetFactory();
		component = factory.createComponent(tweet).getComponent();
	}
	
	tweetsBar.innerHTML = component + tweetsBar.innerHTML;
	return;
}

function actionTweetButton(tweet_id, action) {
	const url = '/api/tweet/action';
	const method = 'POST';
	const data = JSON.stringify({
		id: tweet_id,
		action: action
	});
	const csrftoken = getCookie('csrftoken');
	let xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('X-CSRFToken', csrftoken);

	xhr.addEventListener("readystatechange", () => {
		if(xhr.readyState === 4 && xhr.status === 200) {
			if(action === 'like') {
				socialScoreHandler(tweet_id, xhr);  // Обработка <лайка\дизлайка>
			} else if(action === 'unlike') {
				socialScoreHandler(tweet_id, xhr);
			} else if(action === 'retweet') {
				retweetHandler(xhr);  // Обработка ретвита
			}
		}
	});
	xhr.send(data);
}	


function loadTweetsToHTML() {
	let tweetsBar = document.getElementById('tweets-list');

	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	const url = '/api/tweets/';
	const method = 'GET';
	xhr.open(method, url);
	xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.onload  = () => {
		let tweets = xhr.response;  // Возвращает массив объектов
		let tweetsListString = '';  // Строка, содержащая HTML-элементы твита
		for (i=0; i<tweets.length; i++){
			var tweetObj = tweets[i];
			if (tweetObj.is_retweet === true) {
				var currentItem = formatRetweetElement(tweetObj);
			} else {
				var currentItem = formatTweetElement(tweetObj);  // Получаем HTML формат твита
			}
			tweetsListString += currentItem;  // Добавляем HTML твита в общую строку
		}
		tweetsBar.innerHTML = tweetsListString;  // Помещаем HTML-элементы твита в контейнер
	}
	xhr.send();
}

loadTweetsToHTML();

