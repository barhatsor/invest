/* main.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 2.8;
var apiResponse;

/* Handle everything API */
class APIHandler {

    constructor() {
    }

    // Send API request
    sendAPIReq(tickers) {
       if (tickers) {
          var APIurl = "https://cloud.iexapis.com/stable/stock/market/batch?symbols="+tickers+"&types=quote&displayPercent=true&token=pk_370633a589a240f29304a7420b9960ec";
          httpRequest("GET", APIurl, this.handleResponse);
       }
       // If no tickers provided, show no stocks message
       else {
          document.querySelector(".entries").innerHTML = "<a>No stocks</a>";
       }
    }

    // Handle API response
    handleResponse(response) {
        // Build the HTML
        apiResponse = response;
        stocks.buildHTML(apiResponse);
    }
}

/* Handle everything HTML */
class stockEntries {
    
    constructor() {
    }

    buildHTML(response) {
        // Check for response
        if (response) {
            // Finished HTML goes here
            this.out = "";
            // Create precent var to track negative precentages
            var precent;
            // For each stock in API response
            for (var prop in response) {
                // If precent is negative, color it red
                if (response[prop].quote.changePercent < 0) {
                    precent = "<h2 class='red'>";
                }
                // Else, default to green
                else {
                    precent = "<h2>+";
                }
                // Build stock entries
                this.out +=
                    "<div class='entry' onclick='toggleDetails(this)'><h1>" +
                    response[prop].quote.symbol +
                    "</h1><p>" +
                    response[prop].quote.companyName +
                    "</p>" +
                    precent +
                    // Round precentages to 2 digits & remove trailing zeros
                    ((Math.round(response[prop].quote.changePercent * 100) / 100).toFixed(1) * 1).toString() +
                    "%</h2><span>" +
                    // Do the same for stock prices
                    ((Math.round(response[prop].quote.latestPrice * 100) / 100).toFixed(1) * 1).toString() +
                    "</span><div class='stats'></div></div>";
            }
        }
        // If no response provided, show no stocks message
        else {
            out = "<a>No stocks</a>";
        }
        
        // Inject the finished HTML into the page
        document.querySelector(".entries").innerHTML = this.out;
    }
}


/* Filters */
function filterStocks(data) {
    var tempData = [];
    // For each stock
    for (var prop in data) {
        // Only add it to the list if filter condition is true
        if (data[prop].quote.peRatio < 20) {
            tempData.push(data[prop]);
        }
    }
    data = tempData;
    // Rebuild entries
    stocks.buildHTML(data);
}


/* Search */
var prevrequest = "";
// If typed in search
document.querySelector('.search').addEventListener('input', function (event) {
  // And if search not empty
  if (this.value != "" && this.value != prevrequest) {
    // Render suggestions
    prevrequest = this.value;
    httpRequest("GET", "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.value+"&apikey=XH456FPPVS8MHBXA", renderSuggestions);
  }
  else {
    // Else, close search
    document.querySelector(".search").classList.remove("suggestions");
    document.querySelector(".search-wrapper").style.display = "none";
    document.body.style.overflow = "auto";
  }
})

// If clicked on search, disable scrolling
document.querySelector('.search').addEventListener('focus', function (event) {
   document.body.style.overflow = "hidden";
})

// If clicked off search, close it
document.querySelector('.search').addEventListener('blur', function (event) {
  document.querySelector(".search").classList.remove("suggestions");
  document.querySelector(".search-wrapper").style.display = "none";
  document.querySelector(".search").value = "";
  document.body.style.overflow = "auto";
})

/* Search Suggestions */
function renderSuggestions(resp) {
  // Store finished HTML
  var out = "";
  // If response
  if (!resp.Note) {
    // Add suggestion to finished HTML
    resp.bestMatches.forEach(match => {
        out += '<div class="suggestion" onclick="addStock(this)"><p>'+match["1. symbol"]+'</p><a>'+match["2. name"]+'</a></div>';
    })
    // If no suggestions, show no results message
    if (out == "") {
      out = '<div class="suggestion"><p>No results</p></div>';
    }
  }
  // If no response provided, show try later message
  else {
    out = '<div class="suggestion"><p>Try again later</p></div>';
  }
  document.querySelector(".search-wrapper").innerHTML = "<hr>"+out;
  document.querySelector(".search-wrapper").style.display = "block";
  document.querySelector(".search").classList.add("suggestions");
}


/* Portfolio local storage */
var tArray = [];
var tickers;

if (localStorage.getItem('tickers')) {  
  // If portfolio in in storage, set variable to it
  tArray = localStorage.getItem('tickers').split(',');
  tickers = tArray.join(',');
} else {
  // If portfolio is not in storage, set variable to default tickers
  tickers = tArray.join(',');
}

// Set new localStorage value
localStorage.setItem('tickers', tickers);

function addStock(el) {
   // Add stock to array
   tArray.unshift(el.children[0].innerHTML);
   
   // Add skeleton stock to entries
   document.querySelector('.entries').innerHTML =
      '<div class="entry" style="background-image:none"><h1></h1><p>.</p></div>' + 
      document.querySelector('.entries').innerHTML;
   
   // Update localStorage
   tickers = tArray.join(',');
   localStorage.setItem('tickers', tickers);
   
   // Refresh entries
   APIhandler.sendAPIReq(tickers);
}

function removeStock(el) {
   // Remove stock from array
   var index = tArray.indexOf(el.children[0].innerHTML);
   if (index > -1) {
     tArray.splice(index, 1);
   }
   
   // Remove stock from entries
   el.remove();
   
   // Update localStorage
   tickers = tArray.join(',');
   localStorage.setItem('tickers', tickers);
}


/* Stock details */

// Toggle stock details
function toggleDetails(stock) {
    // If the stock's closed
    if (!stock.classList.contains("open")) {
        // Open it
        stock.classList.toggle("open");
        // And show details
        renderDetails(apiResponse[stock.children[0].innerHTML], stock);
    }
    else {
        // Else, close it
        stock.classList.remove("open");
    }
}

// Render stock details
function renderDetails(response, stock) {
    // Store finished HTML
    var out = '';
    // Add stock stats
    out += '<div class="stat"><p>Prev Close</p><a>'+response.quote.previousClose+'</a></div>';
    out += '<div class="stat"><p>Open</p><a>'+response.quote.open+'</a></div>';
    out += '<div class="stat"><p>Low</p><a>'+response.quote.low+'</a></div>';
    out += '<div class="stat"><p>High</p><a>'+response.quote.high+'</a></div>';
    out += '<div class="stat"><p>52wk Low</p><a>'+response.quote.week52Low+'</a></div>';
    out += '<div class="stat"><p>52wk High</p><a>'+response.quote.week52High+'</a></div>';
    out += '<div class="stat"><p>Mkt Cap</p><a>'+moneyFormat(response.quote.marketCap)+'</a></div>';
    out += '<div class="stat"><p>Volume</p><a>'+moneyFormat(response.quote.volume)+'</a></div>';
    out += '<div class="stat"><p>Avg Vol (3m)</p><a>'+moneyFormat(response.quote.avgTotalVolume)+'</a></div>';
    out += '<div class="stat"><p>P/E</p><a>'+response.quote.peRatio+'</a></div>';
    // Inject finished HTML into stats wrapper
    stock.children[4].innerHTML = out;
}


/* Money format */

function moneyFormat(labelValue) {
    // Nine Zeroes for Billions
    var foo = Math.abs(Number(labelValue)) >= 1.0e+9

       ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
       // Six Zeroes for Millions 
       : Math.abs(Number(labelValue)) >= 1.0e+6

       ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
       // Three Zeroes for Thousands
       : Math.abs(Number(labelValue)) >= 1.0e+3

       ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

       : Math.abs(Number(labelValue));
    
    // Round to last 2 digits & remove trailing zeros
    try {
        return ((Math.round(parseFloat(foo) * 100) / 100).toFixed(2) * 1).toString() + foo.replace(/[^B|M|K]/g,"");
    } catch { return "null" }
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

/* --UI-related JS-- */

// Toggle filter button
document.querySelector(".filter-button").addEventListener("click", (e) => {
    document.querySelector(".filter-button").classList.toggle("active");
    document.querySelector(".filters-wrapper").classList.toggle("active");
});

// Toggle each filter
document.querySelectorAll(".filter").forEach((filter) => {
    filter.addEventListener("click", (e) => {
        filter.classList.toggle("active");
        // If the filter's active
        if (filter.classList.contains("active")) {
            // Filter the stocks
            filterStocks(apiResponse);
        }
        else {
            // Else, revert back to original list
            stocks.buildHTML(apiResponse);
        }
    });
});

/* Main thread */

// Initiate API handler
APIhandler = new APIHandler();

// Initiate HTML builder
stocks = new stockEntries();

// Run
APIhandler.sendAPIReq(tickers);

/*
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var obj = JSON.parse(div);
    try {console.log(obj[0].amount);} catch {};
  }};
xmlhttp.open("GET", "https://cloud.iexapis.com/stable/stock/AAPL/dividends/5y?token=pk_370633a589a240f29304a7420b9960ec", true);
xmlhttp.send();
*/
