/* news.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 1.2;

/* Handle everything API */
class APIHandler {

    constructor() {
      this.APIurl = "https://cloud.iexapis.com/stable/stock/market/batch?types=news&token=pk_370633a589a240f29304a7420b9960ec";
    }

    // Send API request
    sendAPIReq(div) {
        // Requested dividends or not
        httpRequest("GET", this.APIurl, this.handleResponse);
    }

    // Handle API response
    handleResponse(response) {
        // Build the HTML
        news.buildHTML(response);
    }
}

/* Handle everything HTML */
class newsArticles {
    
    constructor() {
    }

    buildHTML(response) {
        // Check for response
        if (response) {
           // Finished HTML goes here
           this.out = "<p>Headlines</p>";
           var first = [];
           // For each article in news
           for (var prop in response.news) {
             // If article is in english
             if (response.news[prop].lang == "en") {
                // Build news articles
                if (first.length == 2) {
                  first = ["", ""];
                } 
                else {
                  first = ["<div class='img-wrapper'>", "</div>"];
                }
                this.out +=
                    "<div class='article'><div class='content' onclick='window.location.href = \"" +
                    response.news[prop].url +
                    "\"'>" +
                    first[0] +
                    "<img src='" +
                    response.news[prop].image +
                    "' alt='thumbnail'>" +
                    first[1] +
                    "<a class='text'>" +
                    response.news[prop].source +
                    "</a><h4>" +
                    response.news[prop].headline +
                    "</h4></div><div class='text'><a>" +
                    timeDifference(response.news[prop].datetime) +
                    "</a>" +
                    '<svg onclick="shareArticle(this)" viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="m453.332031 85.332031c0 38.292969-31.039062 69.335938-69.332031 69.335938s-69.332031-31.042969-69.332031-69.335938c0-38.289062 31.039062-69.332031 69.332031-69.332031s69.332031 31.042969 69.332031 69.332031zm0 0"/><path d="m384 170.667969c-47.0625 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.269531-85.332031 85.332031-85.332031s85.332031 38.273438 85.332031 85.332031c0 47.0625-38.269531 85.335938-85.332031 85.335938zm0-138.667969c-29.417969 0-53.332031 23.9375-53.332031 53.332031 0 29.398438 23.914062 53.335938 53.332031 53.335938s53.332031-23.9375 53.332031-53.335938c0-29.394531-23.914062-53.332031-53.332031-53.332031zm0 0"/><path d="m453.332031 426.667969c0 38.289062-31.039062 69.332031-69.332031 69.332031s-69.332031-31.042969-69.332031-69.332031c0-38.292969 31.039062-69.335938 69.332031-69.335938s69.332031 31.042969 69.332031 69.335938zm0 0"/><path d="m384 512c-47.0625 0-85.332031-38.273438-85.332031-85.332031 0-47.0625 38.269531-85.335938 85.332031-85.335938s85.332031 38.273438 85.332031 85.335938c0 47.058593-38.269531 85.332031-85.332031 85.332031zm0-138.667969c-29.417969 0-53.332031 23.9375-53.332031 53.335938 0 29.394531 23.914062 53.332031 53.332031 53.332031s53.332031-23.9375 53.332031-53.332031c0-29.398438-23.914062-53.335938-53.332031-53.335938zm0 0"/><path d="m154.667969 256c0 38.292969-31.042969 69.332031-69.335938 69.332031-38.289062 0-69.332031-31.039062-69.332031-69.332031s31.042969-69.332031 69.332031-69.332031c38.292969 0 69.335938 31.039062 69.335938 69.332031zm0 0"/><path d="m85.332031 341.332031c-47.058593 0-85.332031-38.269531-85.332031-85.332031s38.273438-85.332031 85.332031-85.332031c47.0625 0 85.335938 38.269531 85.335938 85.332031s-38.273438 85.332031-85.335938 85.332031zm0-138.664062c-29.417969 0-53.332031 23.933593-53.332031 53.332031s23.914062 53.332031 53.332031 53.332031c29.421875 0 53.335938-23.933593 53.335938-53.332031s-23.914063-53.332031-53.335938-53.332031zm0 0"/><path d="m135.703125 245.761719c-7.425781 0-14.636719-3.863281-18.5625-10.773438-5.824219-10.21875-2.238281-23.253906 7.980469-29.101562l197.949218-112.851563c10.21875-5.867187 23.253907-2.28125 29.101563 7.976563 5.824219 10.21875 2.238281 23.253906-7.980469 29.101562l-197.953125 112.851563c-3.328125 1.898437-6.953125 2.796875-10.535156 2.796875zm0 0"/><path d="m333.632812 421.761719c-3.585937 0-7.210937-.898438-10.539062-2.796875l-197.953125-112.851563c-10.21875-5.824219-13.800781-18.859375-7.976563-29.101562 5.800782-10.238281 18.855469-13.84375 29.097657-7.976563l197.953125 112.851563c10.21875 5.824219 13.800781 18.859375 7.976562 29.101562-3.945312 6.910157-11.15625 10.773438-18.558594 10.773438zm0 0"/></svg>" +
                    "</div></div>";
             }
          }
        }
        
        // If no response provided, show no news message
        else {
            out = "<p>No news</p>";
        }
        
        // Inject the finished HTML into the page
        document.querySelector(".articles").innerHTML = this.out;
    }
}

/* Share */
async function shareArticle(el) {
   const shareData = {
     title: 'Share article',
     // Retrieve article title
     text: unescape(el.parentElement.parentElement.children[0].children[2].innerHTML),
     // Retrieve article url
     url: el.parentElement.parentElement.children[0].getAttribute('onclick').split('window.location.href = "').join('').split('""').join('')
   }
   
   try {
      await navigator.share(shareData);
      console.log('Shared successfully');
   } catch(err) {
      console.log('Error: ' + err);
   }
}

/* Time Difference */
function timeDifference(previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var current = Date.now();
  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    if (Math.round(elapsed / msPerMinute) > 1) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else {
      return '1 minute ago';
    }
  } else if (elapsed < msPerDay) {
    if (Math.round(elapsed / msPerHour) == 24) {
      return '1 day ago';
    }
    else if (Math.round(elapsed / msPerHour) > 1) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } 
    else {
       return '1 hour ago';
    }
  } else if (elapsed < msPerMonth) {
    if (Math.round(elapsed / msPerDay)) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    } else {
      return '1 day ago';
    }
  } else if (elapsed < msPerYear) {
    if (Math.round(elapsed / msPerMonth) > 1) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
      return '1 month ago';
    }
  }
}

/* HTTP Request */
function httpRequest(type, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            callback(response);
        }
    }
    xmlhttp.open(type, url, true); 
    xmlhttp.send();
}

/* Header UI */
window.addEventListener('scroll', function(e) {
   if (window.scrollY > 0) {
      document.querySelector('.header').style.boxShadow = 'inset 0 -1px 0 0 rgb(255 255 255 / 0.24)';
   }
   else {
      document.querySelector('.header').style.boxShadow = 'none';
   }
})

/* Main thread */

// Initiate API handler
APIhandler = new APIHandler();

// Initiate HTML builder
news = new newsArticles();

// Run
APIhandler.sendAPIReq();
