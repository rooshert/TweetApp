import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import {TweetsComponent, TweetDetailComponent} from './tweets/baseComponents';


const component = React.createElement

const appElem = document.getElementById('tweet-root')
if (appElem) {
	ReactDOM.render(<App />, appElem)
}

const tweetsElem = document.getElementById('tweet-app')
if (tweetsElem) {
	ReactDOM.render(
		component(TweetsComponent, tweetsElem.dataset), 
		tweetsElem
	)
}

const tweetDetailElem = document.querySelectorAll('.tweet-detail')
tweetDetailElem.forEach(container => {
	ReactDOM.render(
		component(TweetDetailComponent, container.dataset), 
		container
	)
})

reportWebVitals();
