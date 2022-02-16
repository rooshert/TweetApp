
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
  xhr.onload  = () => {
    return callback(xhr.response, xhr.status)
  }
  xhr.onerror = () => {
    return callback({message: 'the request was an error'}, 400)
  }
  xhr.send(jsonData)
}

export function loadTweets(callback) {
  lookup('GET', '/tweets/', callback)
}

export function createTweet(newTweet, callback) {
  lookup('POST', '/tweet/create/', callback, {text_content: newTweet})
}

