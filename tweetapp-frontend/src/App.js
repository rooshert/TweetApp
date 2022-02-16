import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import {TweetsComponent} from './tweets/baseComponents';
import {loadTweets} from './tweets/request2EndpointsComponents';

function App() {
  return (
    <div className="container-fluid">
      <TweetsComponent />
    </div>
  );
}

export default App;

