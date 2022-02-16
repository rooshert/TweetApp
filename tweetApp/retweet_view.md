retweet strucure = {
	'id': my retweet id,
       	'parent': {
       		'id': tweet_obj.parent.id, 
       		'text_content': tweet_obj.parent.text_content or None if retweet without comment,
       		'likes': tweet_obj.likes,
       		'date_created': tweet_obj.date_created

		'source': 'main/retweet'
       },
       	'text_content': tweet_obj.text_content,
       	'likes': tweet_obj.likes,
      	'date_created': tweet_obj.date_created
}

Если "ретвит ретвит ретвита", то рекурсивно спускаемя до корневого твита:
	def retweet_handler(tweet_obj):
		'''
			tweet_obj представляет собой новосозданный объект ретвита.
		'''
		if tweet_obj.is_retweet:
			root_tweet = retweet_handler(tweet_obj.parent)
			return root_tweet
		else:
			return tweet_obj

		return root_tweet

	def simple_retweet_of_tweet(tweet_obj): 
		'''
			Если ...
		'''
		if tweet_obj.parent.is_retweet:
			return retweet_handler(tweet_obj.parent)
		return tweet_obj.parent
	
	def retweet_tweet_with_comment(tweet_obj):
		if tweet_obj.parent.retweet_with_comment:
			# Проводим особую обработку
		return None

