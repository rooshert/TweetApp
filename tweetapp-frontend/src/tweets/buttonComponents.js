import {React, useState} from 'react';


function actionTweetButton(tweet_id, action) {
	const url = '/api/tweet/action';
	const method = 'POST';
	const data = JSON.stringify({
		id: tweet_id,
		action: action
	});
	// const csrftoken = getCookie('csrftoken');
	// let xhr = new XMLHttpRequest();
	// xhr.open(method, url);
	// xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
	// xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	// xhr.setRequestHeader('Content-Type', 'application/json');
	// xhr.setRequestHeader('X-CSRFToken', csrftoken);

	// xhr.addEventListener("readystatechange", () => {
	// 	if(xhr.readyState === 4 && xhr.status === 200) {
	// 		if(action === 'like') {
	// 			socialScoreHandler(tweet_id, xhr);  // Обработка <лайка\дизлайка>
	// 		} else if(action === 'unlike') {
	// 			socialScoreHandler(tweet_id, xhr);
	// 		} else if(action === 'retweet') {
	// 			retweetHandler(xhr);  // Обработка ретвита
	// 		}
	// 	}
	// });
	// xhr.send(data);
}	

export function RetweetBtn(props) {
  const {tweet} = props;
  return <button id='retweet-id' className='btn btn-outline-success btn-sm'>retweet</button>
}

export function UnlikeBtn(props) {
  const {tweet} = props;
  return <button id='unlike-counter' className='btn btn-outline-primary btn-sm tweet-unlike'>unlike</button>
}

export function LikeBtn(props) {
  const {tweet, displayName} = props;
  const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0);
  const [likeBtnClicked, setLikeBtnClicked] = useState(false);
  return <button id='like-counter' className='btn btn-primary btn-sm tweet-like'>{tweet.likes} likes</button>
}

export function ActionBtn(props) {
  const {tweet, action} = props;
  const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0);
  const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false);
  let actionType = action.type;
  let displayName = action.displayName;
  let handleClick = (event) => {
    event.preventDefault();
    if (actionType === 'like') {
      if (userLike === true) {
        setLikes(likes - 1);
	setUserLike(!userLike);
      } else {
	setLikes(likes + 1); 
	setUserLike(!userLike);
      }
    }
  }
   
  return <button id='like-counter' className='btn btn-primary btn-sm tweet-like' onClick={handleClick}>{likes} {displayName}</button>
}

