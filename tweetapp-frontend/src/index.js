import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import {TweetsComponent, TweetDetailComponent} from './tweets/baseComponents';


const e = React.createElement

// const tweetRoot = document.getElementById('tweet-root')
const tweetRoot = document.getElementById('root')
if (tweetRoot) {
	ReactDOM.render(<App />, tweetRoot)
}

// const tweetApp = document.getElementById('tweet-app')
const tweetApp = document.getElementById('tweet-root')
if (tweetApp) {
	ReactDOM.render(
		e(TweetsComponent, tweetApp.dataset), 
		tweetApp
	)
}

const tweetDetailElem = document.querySelectorAll('.tweet-detail')
tweetDetailElem.forEach(container => {
	ReactDOM.render(
		e(TweetDetailComponent, container.dataset), 
		container
	)
})

reportWebVitals();
