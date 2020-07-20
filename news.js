/* news.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 1.1;

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
                    "</a><img src='https://investor.netlify.app/images/share.svg' alt='share' onclick='shareArticle(this)'></div></div>";
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
   console.log(el.parentElement.parentElement);
   const shareData = {
     title: 'Share article',
     // Retrieve article title
     text: el.parentElement.parentElement.children[0].children[2],
     // Retrieve article url
     url: el.parentElement.parentElement.children[0].onclick.split('window.location.href = "').join('').split('""').join(''),
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

/* Main thread */

// Initiate API handler
APIhandler = new APIHandler();

// Initiate HTML builder
news = new newsArticles();

// Run
APIhandler.sendAPIReq();
