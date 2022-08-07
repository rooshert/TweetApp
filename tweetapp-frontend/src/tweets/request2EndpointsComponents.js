
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function lookup(method, endpoint, callback, data) {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data);
  }

  const xhr = new XMLHttpRequest();	
  xhr.responseType = 'json';
  const url = `http://localhost:8000/api${endpoint}`;  // URL to django API endpoint
  xhr.open(method, url)
  const csrftoken = getCookie('csrftoken')
  xhr.setRequestHeader('Content-Type', 'application/json')
  if (csrftoken) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
  }
  
  xhr.onload = () => {
    if (xhr.status === 403) {
      const detail = xhr.response.detail
      if (detail === "Authentication credentials were not provided.") {
        window.location.href = '/login?showLoginRequired=true'
      }
    }
    callback(xhr.response, xhr.status)
  }

  xhr.onerror = () => {
    callback({message: 'the request was an error'}, 400)
  }

  xhr.send(jsonData)
}


export function loadTweets(username, callback) {
  let endpoint = '/tweets/'
  let method = 'GET'
  if (username) {
    endpoint = `/tweets/?username=${username}`
  }
  lookup(method, endpoint, callback)
}

export function loadTweetById(id, callback) {
  let endpoint = `/tweet/${id}/detail/`
  let method = 'GET'
  lookup(method, endpoint, callback)
}

export function createTweet(newTweet, callback) {
  lookup('POST', '/tweet/create/', callback, {text_content: newTweet})
}

export function actionTweet(tweetId, actionType, callback) {
  let data = {id: tweetId, action: actionType}
  lookup('POST', '/tweet/action', callback, data)
}

export function actionRetweetWithComment(tweetId, actionType, callback, content) {
  let data = {id: tweetId, action: actionType, content: content}
  lookup('POST', '/tweet/action', callback, data)
}
