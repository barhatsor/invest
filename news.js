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
                       "<div class='article' onclick='window.location.href = \"" +
                       response.news[prop].url +
                       "\"'><div class='content'>" +
                       first[0] +
                       "<img src='" +
                       response.news[prop].image +
                       "'>" +
                       first[1] +
                       "<a class='text'>" +
                       response.news[prop].source +
                       "</a><h4>" +
                       response.news[prop].headline +
                       "</h4></div><div class='text'><a>1 hour ago</a><img src='https://investor.netlify.app/images/share.svg' width='18px'></div></div>";
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
