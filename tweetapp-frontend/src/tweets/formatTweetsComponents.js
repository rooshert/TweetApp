import {LikeBtn, UnlikeBtn, RetweetBtn, ActionBtn} from './buttonComponents';


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

	getFormattedTweet() {
		let t = this.tweet;
		let cls = `tweet-${t.id} card text-white bg-dark mb-3`
		return <div className={cls} style={{marginLeft: '225px', marginRight: '225px', marginBottom: '25px', marginTop: '25px'}}>
 		       		<div className="card-header">
		       			<a style={{color: 'yellow'}}>@{t.user}</a> 
		       			<em style={{color: 'yellow', marginLeft: '550px'}}>#origin tweet</em>
 		       		</div>
				<div className="card-body">
    		       			<p className="card-text">{t.text_content}</p>
				</div>

				<div className="btn-group d-flex" style={{width: '30%', marginLeft: '30px', marginBottom: '10px'}}>
					<ActionBtn tweet={t} action={{type: 'like', displayName: 'Likes'}} />
					<ActionBtn tweet={t} action={{type: 'retweet', displayName: 'Retweet'}} />
				</div>

		       		<div><em style={{color: 'yellow', marginLeft: '630px'}}>{t.date_created}</em></div>
  			</div>
	}
}

class RetweetWithCommentHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getFormattedTweet() {
		let t = this.tweet;
		let cls = `tweet-${t.id} card text-white bg-dark mb-3`;
		return <div className={cls} style={{marginLeft: '225px', marginRight: '225px', marginBottom: '25px', marginTop: '25px'}}>
 		       		
				<div className="card-header">
		       			<a style={{color: 'yellow'}}>@{t.user}</a>
		       			<em style={{color: 'yellow', marginLeft: '450px'}}>#retweet with comment from @{t.parent.user}</em>
 		       		</div>

				<div className="card-body">
    		       			<p className="card-text">{t.text_content}</p>
				</div>

					<div className="card border-warning mb-3" style={{marginLeft: '170px', marginRight: '170px', marginBottom: '25px', marginTop: '25px'}}>
  						
						<div className="card-body text-dark">
    							<p className="card-text">{t.parent.text_content}</p>
  						</div>
					</div>

				<div className="btn-group d-flex" style={{width: '30%', marginLeft: '30px', marginBottom: '10px'}}>
					<ActionBtn tweet={t} action={{type: 'like', displayName: 'Likes'}} />
				</div>

		       		<div><em style={{color: 'yellow', marginLeft: '630px'}}>{t.date_created}</em></div>
  			</div>
	}
}

class RetweetHTMLComponent {

	constructor(tweet) {
		this.tweet = tweet;
	}

	getFormattedTweet() {
		let t = this.tweet;
		let cls = `tweet-${t.parent.id} card text-white bg-dark mb-3`;
		return <div className={cls} style={{marginLeft: '255px', marginRight: '255px', marginBottom: '25px', marginTop: '25px'}}>
 		       		<div className="card-header">
		       			<a style={{color: 'yellow'}}>@{t.user}</a>
		       			<em style={{color: 'yellow', marginLeft: '450px'}}>#no comment retweet from @{t.parent.user}</em>
 		       		</div>
				<div className="card-body">
    		       			<p className="card-text">{t.parent.text_content}</p>
				</div>
	
				<div className="btn-group d-flex" style={{width: '30%', marginLeft: '30px', marginBottom: '10px'}}>
					<ActionBtn tweet={t} action={{type: 'like', displayName: 'Likes'}} />
				</div>

		       		<div><em style={{color: 'yellow', marginLeft: '630px'}}>{t.parent.date_created}</em></div>
  			</div>
	}
}

/* ------------------------------------------------------------------------- */ 


export function formatRetweetItem(tweet) {
  if (tweet.retweet_with_comment === true) {
    let factory = new RetweetWithCommentFactory();
    return factory.createComponent(tweet).getFormattedTweet();
  } 

  let factory = new BaseRetweetFactory();
  return factory.createComponent(tweet).getFormattedTweet();
}

export function formatTweetItem(tweet) {
  let factory = new BaseTweetFactory();
  return factory.createComponent(tweet).getFormattedTweet();
}

