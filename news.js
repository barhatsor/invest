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
           var d = new Date(0);
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
                    "</h4></div><div class='text'><a>" +
                    timeDifference(d.setUTCSeconds(response.news[prop].datetime)) +
                    "</a><img src='https://investor.netlify.app/images/share.svg' width='18px'></div></div>";
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

/* Time Difference */
function timeDifference(previous) {
    var current = new Date();
   
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
   
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }
    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour) + ' hours ago';   
    }
    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }
    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
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
