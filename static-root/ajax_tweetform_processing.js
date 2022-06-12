/* ------------------ Паттерн фабричный метод ------------------------------- */


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
	return response.getComponent();
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

/* -------------------------------------------------------------------- */


function clearErrorContainer() {
	let errorContainer = document.getElementById('tweet-form-error');
	errorContainer.innerText = "";
	errorContainer.setAttribute('class', 'd-none alert alert-danger"');
	return;
}

function validationForm() {
	let textContent = document.getElementById('textContentInput').value;
	let errorContainer = document.getElementById('tweet-form-error');
	
	if(textContent.length === 0) {
		errorContainer.innerText = 'you forgot to tweet';
		errorContainer.setAttribute('class', 'alert alert-danger');
		return false;
	} else {
		return true;
	}
}

function sendTweetForm(e) {
	e.preventDefault(); 
	let xhr = new XMLHttpRequest();
	isValid = validationForm();
	if (isValid === false) {
		xhr.abort();
		return;
	}

	let textContent = document.getElementById('textContentInput').value;
	let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	csrfToken = 'csrfmiddlewaretoken=' + encodeURIComponent(csrfToken);
	textContent = 'text_content=' + encodeURIComponent(textContent);
	const postData = csrfToken + '&' + textContent
	xhr.responseType = 'json';
	xhr.open('POST', '/api/tweet/create/', true);
	xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	
	xhr.addEventListener("readystatechange", () => {
		if(xhr.readyState === 4 && xhr.status === 201) {
			clearErrorContainer();
 			document.getElementById('textContentInput').value = '';

			let tweetsBar = document.getElementById('tweets-list');
			let t = null;
			const newTweet = xhr.response;
			if (newTweet.is_retweet === true) {
				t = formatRetweetElement(newTweet);
			} else {
				t = formatTweetElement(newTweet);  // Получаем HTML формат твита
			}
			tweetsBar.innerHTML = t + tweetsBar.innerHTML;
			return;
		}
		if(xhr.status === 400) {
			let errorContainer = document.getElementById('tweet-form-error');
			let errors = xhr.response;
			if(errors) {
				errorContainer.setAttribute('class', 'alert alert-danger');
				errorContainer.setAttribute('style', 'margin: 50px');
				errorContainer.innerText = errors.text_content[0]
			}
			return;
		} 
		if(xhr.status === 401) {
			alert('You must login');
			window.location.href = '/login-page';
			return;
		}
		if(xhr.status === 403) {
			alert('You must login');
			window.location.href = '/login-page';
			return;
		}
	});
	
	xhr.send(postData);
}

document.getElementById('sendButton').addEventListener('click', sendTweetForm);

