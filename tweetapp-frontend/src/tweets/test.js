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