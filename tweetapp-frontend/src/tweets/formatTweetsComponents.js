import {LikeBtn, RetweetBtn, RetweetWithCommentBtn} from './buttonComponents';


export function TweetItem(props) {
	let {tweet, addTweetCallback} = props;
	let cls = `tweet-${tweet.id} card text-white bg-dark mb-3`;

	return <div className={cls} style={{marginLeft: '225px', marginRight: '225px', marginBottom: '25px', marginTop: '25px'}}>
	  <div className='card-header'>
	  	<a style={{color: 'yellow'}}>@{tweet.user}</a> 
	  	<em style={{color: 'yellow', marginLeft: '550px'}}>#origin tweet</em>
	  </div>
		<div className='card-body'>
  		<p className='card-text'>{tweet.text_content}</p>
		</div>

		<div className='btn-group d-flex' style={{width: '30%', marginLeft: '30px', marginBottom: '10px'}}>
			<LikeBtn tweet={tweet} action={{actionType: 'socialscore'}} />
			<RetweetBtn tweet={tweet} addTweetCallback={addTweetCallback} />
			<RetweetWithCommentBtn tweet={tweet} addTweetCallback={addTweetCallback} />
		</div>

	  <div>
	  	<em style={{color: 'yellow', marginLeft: '630px'}}>{tweet.date_created}</em>
	  </div>
  </div>
}


export function RetweetWithCommentItem(props) {
	let {tweet, addTweetCallback} = props;
	let cls = `tweet-${tweet.id} card text-white bg-dark mb-3`;

	return <div 
		className={cls} 
		style={{marginLeft: '225px', marginRight: '225px', marginBottom: '25px', marginTop: '25px'}}>
		
		<div className="card-header">
			<a style={{color: 'yellow'}}>@{tweet.user}</a>
	    <em style={{color: 'yellow', marginLeft: '450px'}}>#full retweet from @{tweet.parent.user}</em>
 	  </div>
		<div className="card-body">
	  		<p className="card-text">{tweet.text_content}</p>
		</div>

		<div className="card border-warning mb-3" style={{marginLeft: '170px', marginRight: '170px', marginBottom: '25px', marginTop: '0px'}}>
  			
			<div className="card-body text-dark">
  			<p className="card-text">{tweet.parent.text_content}</p>
  		</div>
		</div>

		<div className="btn-group d-flex" style={{width: '30%', marginLeft: '30px', marginBottom: '0px'}}>
			<LikeBtn tweet={tweet} action={{actionType: 'socialscore'}} />
			<RetweetBtn tweet={tweet} addTweetCallback={addTweetCallback} />
			<RetweetWithCommentBtn tweet={tweet} addTweetCallback={addTweetCallback} />
		</div>

	    <div>
	    	<em style={{color: 'yellow', marginLeft: '630px'}}>{tweet.date_created}</em>
	    </div>
  	</div>
}


export function RetweetItem(props) {
	let {tweet, addTweetCallback} = props;
	let cls = `tweet-${tweet.parent.id} card text-white bg-dark mb-3`;
	return <div className={cls} style={{marginLeft: '225px', marginRight: '225px', marginBottom: '25px', marginTop: '25px'}}>
 	  <div className="card-header">
	  	<a style={{color: 'yellow'}}>@{tweet.user}</a>
	  	<em style={{color: 'yellow', marginLeft: '450px'}}>#no comment retweet from @{tweet.parent.user}</em>
 	  </div>
		<div className="card-body">
  		<p className="card-text">{tweet.parent.text_content}</p>
		</div>
	
		<div className="btn-group d-flex" style={{width: '30%', marginLeft: '30px', marginBottom: '10px'}}>
			<LikeBtn tweet={tweet} action={{actionType: 'socialscore'}} />
			<RetweetBtn tweet={tweet} addTweetCallback={addTweetCallback} />
			<RetweetWithCommentBtn tweet={tweet} addTweetCallback={addTweetCallback} />
		</div>

	    <div><em style={{color: 'yellow', marginLeft: '630px'}}>{tweet.parent.date_created}</em></div>
  	</div>
}
