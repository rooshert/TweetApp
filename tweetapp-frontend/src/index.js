import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import {TweetsComponent} from './tweets/baseComponents';


const appElem = document.getElementById('root')
if (appElem) {
	ReactDOM.render(<App />, appElem)
}
const tweetsElem = document.getElementById('root')
if (tweetsElem) {
	ReactDOM.render(<TweetsComponent />, appElem)
}

reportWebVitals();
