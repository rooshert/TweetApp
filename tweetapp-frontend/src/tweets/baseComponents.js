import React, {useEffect, useState} from 'react';

import {TweetItem, RetweetWithCommentItem, RetweetItem} from './formatTweetsComponents';
import {loadTweets, createTweet} from './request2EndpointsComponents';


export function Tweet(props) {
  /* Фунция возвращает твит в виде HTML кода */
  const {tweet, addTweetCallback} = props;

  if (tweet.retweet_with_comment == true) {
    // Твит с комментарием
    return <RetweetWithCommentItem tweet={tweet} addTweetCallback={addTweetCallback} />
  }
  if (tweet.is_retweet == true) {
    // обычный ретвит
    return <RetweetItem tweet={tweet} addTweetCallback={addTweetCallback} />
  } 

  return <TweetItem tweet={tweet} addTweetCallback={addTweetCallback} />
}


function TweetsList(props) {
  /* Компонент списка твитов.
   * props.newTweets - список созданных объектов твита
   */
  const [tweetsInit, setTweetsInit] = useState([])  // ...
  const [tweets, setTweets] = useState([])  // Список newTweets хранит объекты все твитов
  const [tweetsDidSet, setTweetsDidSet] = useState(false)
  const {newTweets, addTweetCallback} = props;  // Список объект новосозданных твитов
  useEffect(() => { 
    const final = [...newTweets].concat(tweetsInit)
    if (final.length !== tweets.length) {
      setTweets(final);
    }
  }, [newTweets, tweets, tweetsInit])  // Указываем UseEffect отслежывать изменения над списками newTweets, tweets, tweetsInit
  
  useEffect(() => {
    if (tweetsDidSet === false) {
      // Функция загружает список твитов из бэкенда
      const tweetsLoadedCallback = (response, status) => {
        // Функция-колбэк. Запускается после ответа от сервера
        if (status === 200) {
      	  setTweetsInit(response)
          setTweetsDidSet(true)
        } else {
          alert('There was an error!');
        }
      }
      loadTweets(tweetsLoadedCallback)  // Вызываем функцию загрузки твитов, передаём в неё функцию-колбэк
    }
  }, [tweetsInit, tweetsDidSet, setTweetsDidSet])  // Указываем useEffect отслежывать изменения только над списом useEffect(func, [tweetsInit])
  
  return tweets.map((item, index) => {
    // Проходимся циклом по списку объктов твитов и форматируем каждый элемент в HTML-код с помощью компонента Tweet
    return <Tweet tweet={item} addTweetCallback={addTweetCallback} />
  })
}


export function TweetsComponent(props) {
  /*  Главный компонент приложение. 
   *  Компонент возвращает:
   *		* Форму создания нового твита
   *            * Список твитов
   */
  const [newTweets, setNewTweets] = useState([]);  // Список newTweets хранит объекты созданных твитов
  const textAreaRef = React.createRef()  // Компонент для манипуляции над текстовыми полями формы
  
  const tweetListUpdateCallback = (response, status) => {
    // колл-бэк функция которая добавляет новосоданный твит в список твитов
    let tempNewTweet = [...newTweets]  // Копируем список твитов в переменную tempNewTweet
    // if (status === 201) {
    if (status === 201 || status === 200) {
      tempNewTweet.unshift(response)
      setNewTweets(tempNewTweet)
    } else {
      alert('create tweet error, please try again')
    }
  }

  const tweetSendHandler = (e) => {
    // Функция-обработчик отправки формы твита
    e.preventDefault();
    const newTweet = textAreaRef.current.value;  // Получаем твит из текстового поля формы
    createTweet(newTweet, tweetListUpdateCallback)
    textAreaRef.current.value = '';  // Очищаем текстовое поле формы
  }

  return <div>
    <div className='col-8 mb-5' style={{paddingLeft: '400px'}}>
      <form onSubmit={tweetSendHandler}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>  
        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Tweet!</button>
      </form>
    </div>

  <TweetsList newTweets={newTweets} addTweetCallback={tweetListUpdateCallback} />
  </div>
}
