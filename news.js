/* news.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 1.1;

/* Handle everything API */
class APIHandler {

    constructor() {
      this.APIurl = "https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,mcd,amzn,cost,lmt,fb,msft,ba,wmt,t&types=news&token=pk_370633a589a240f29304a7420b9960ec";
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
            var stock;
            var first = [];
            // For each stock in API response
            for (var prop in response) {
              stock = response[prop].news;
              // For each article in stock
              for (var props in stock) {
                // Build news articles
                if (first) {
                  first = ["<div class='img-wrapper'>", "</div>"];
                } 
                else {
                  first = ["", ""];
                }
                this.out +=
                    "<div class='article'>" +
                    first[0] +
                    "<img src='" +
                    stock[props].image +
                    "'>" +
                    first[1] +
                    "<a class='text'>" +
                    stock[props].source +
                    "</a><h4>" +
                    stock[props].headline +
                    "</h4><div class='text'><a>1 hour ago</a><img src='https://investor.netlify.app/images/share.svg' width='18px'></div></div>";
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

/* Main thread */

// Initiate API handler
APIhandler = new APIHandler();

// Initiate HTML builder
news = new newsArticles();

// Run
APIhandler.sendAPIReq();
