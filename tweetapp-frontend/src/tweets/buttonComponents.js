import React, { useState} from 'react';
import {actionTweet, actionRetweetWithComment} from './request2EndpointsComponents';

import Modal from 'react-modal';


const customStyles = {
  content: {
  	width: '500px',
  	height: '250px', 
  	background: 'black',
    top: '300px',
    left: '50%',
    right: 'auto',
    bottom: '150px',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


export function RetweetWithCommentBtn(props) {
  let subtitle;
	const {tweet, addTweetCallback} = props;
	const [modalIsOpen, setIsOpen] = useState(false);
	const textAreaRef = React.createRef()

  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    subtitle.style.color = '#f00';
	}
  function closeModal() {
    setIsOpen(false);
  }
	let ClickRetweet = (e) => {
		e.preventDefault()

		if (tweet.retweet_with_comment === true) {
			// тут нужно будет дальше написать ссылку на исходных корневой твит
		}
		const retweetVal = textAreaRef.current.value
		actionRetweetWithComment(tweet.id, 'retweet', addTweetCallback, retweetVal)
		closeModal()
	}

	return (<div>
      <button className='btn btn-warning btn-sm' onClick={openModal}>
      	retweet with comment
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">

        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Retweet</h2>
        <form>
          <textarea ref={textAreaRef} required={true} className='form-control' />
          <br></br>
          <button className='btn btn-warning btn-sm' onClick={ClickRetweet}>retweet!</button>
        </form>

      </Modal>
    </div>
  )
}


export function RetweetBtn(props) {
	const {tweet, addTweetCallback} = props

	let ClickRetweet = (e) => {
		e.preventDefault()
		let tweetId = null
		if (tweet.parent) {
			console.log(111)
			let parentTweetId = tweet.parent.id
			tweetId = parentTweetId
		} else {
			tweetId = tweet.id
		}

		actionTweet(tweetId, 'retweet', addTweetCallback)
	}

	return (
		<button className="btn btn-warning btn-sm" onClick={ClickRetweet}>retweet</button>
	)
}


export function LikeBtn(props) {
	let {tweet, action} = props;
	const actionType = action.actionType
	const [likes, setLikes] = useState(tweet.likes)

	let updateLikesCallback = (response, status) => {
		if (status === 200 || status === 201) {
			setLikes(response.likes)
		} 
	}
	let likeClickHandler = (e) => {
		e.preventDefault()
		actionTweet(tweet.id, actionType, updateLikesCallback)
	}
	return (<button className="btn btn-primary btn-sm" onClick={likeClickHandler}>
		{likes} Likes
	</button>);
}


export function Link2TweetBtn(props) {
	let {tweet} = props

	const path = window.location.pathname
  const match = path.match(/(?<tweetid>\d+)/)
	const urlTweetId = match ? match.groups.tweetid : -1
	const isDetail = `${tweet.id}` === `${urlTweetId}`

	const handleView = (e) => {
		e.preventDefault()
		window.location.href = `/${tweet.id}`
	}

	if (isDetail === true) {
		return null
	}
	return <button className="btn btn-warning btn-sm" onClick={handleView}>view</button>
}
