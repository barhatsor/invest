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
          document.querySelector(".entries").innerHTML = "<a>Add some stocks by searching above</a>";
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
   
    renderSkeleton(symbol) {
       // Insert stock at start of entries
       document.querySelector('.entries').innerHTML =
          '<div class="entry"><h1>'+symbol+'</h1><p>.</p></div>' +
          document.querySelector('.entries').innerHTML;
    }
   
    buildHTML(response) {
        // Finished HTML goes here
        this.out = "";
        // Check for response
        if (response.length != 0) {
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
                    "<div class='entry' onclick='stocks.toggleDetails(this)'>" +
                    '<div class="arrow-wrapper"><svg class="arrow" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="-122.9 121.1 105.9 61.9"><path d="M-63.2 180.3l43.5-43.5c1.7-1.7 2.7-4 2.7-6.5s-1-4.8-2.7-6.5c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.7L-69.9 161l-37.2-37.2c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.6c-1.9 1.8-2.8 4.2-2.8 6.6 0 2.3.9 4.6 2.6 6.5 11.4 11.5 41 41.2 43 43.3l.2.2c3.6 3.6 10.3 3.6 13.9 0z" fill="#fff"/></svg></div>' +
                    "<h1>" +
                    response[prop].quote.symbol +
                    "</h1><p>" +
                    response[prop].quote.companyName +
                    "</p>" +
                    precent +
                    round(response[prop].quote.changePercent, 1) +
                    "%</h2><span>" +
                    round(response[prop].quote.latestPrice, 1) +
                    "</span><div class='stats'></div></div>";
            }
        }
        // If no response provided, show no stocks message
        else {
            this.out = "<a>No stocks matching filter</a>";
        }
        
        // Inject the finished HTML into the page
        document.querySelector(".entries").innerHTML = this.out;
       
        // Add swipe eventListener for stocks
        document.querySelectorAll(".entry").forEach(entry => {
           addSwipeListener(entry);
        })
    }

    // Toggle stock details
    toggleDetails(stock) {
       var toggle = stock.classList.toggle("open");
       // If the stock's open
       if (toggle) {
           // Show details
           this.renderDetails(apiResponse[stock.children[1].innerHTML], stock);
       }
   }

   // Render stock details
   renderDetails(response, stock) {
       // Store finished HTML
       this.out = '';
       // Add stock stats
       this.out += '<div class="stat"><p>Prev Close</p><a>'+round(response.quote.previousClose)+'</a></div>';
       this.out += '<div class="stat"><p>Open</p><a>'+round(response.quote.open)+'</a></div>';
       this.out += '<div class="stat"><p>Low</p><a>'+round(response.quote.low)+'</a></div>';
       this.out += '<div class="stat"><p>High</p><a>'+round(response.quote.high)+'</a></div>';
       this.out += '<div class="stat"><p>52wk Low</p><a>'+round(response.quote.week52Low)+'</a></div>';
       this.out += '<div class="stat"><p>52wk High</p><a>'+round(response.quote.week52High)+'</a></div>';
       this.out += '<div class="stat"><p>Mkt Cap</p><a>'+moneyFormat(response.quote.marketCap)+'</a></div>';
       this.out += '<div class="stat"><p>Volume</p><a>'+moneyFormat(response.quote.volume)+'</a></div>';
       this.out += '<div class="stat"><p>Avg Vol (3m)</p><a>'+moneyFormat(response.quote.avgTotalVolume)+'</a></div>';
       this.out += '<div class="stat"><p>P/E</p><a>'+round(response.quote.peRatio, 1)+'</a></div>';
       // Inject finished HTML into stats wrapper
       stock.children[5].innerHTML = this.out;
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
        else {
           document.querySelectorAll('.entry').forEach(entry => {
                if (entry.children[1].innerHTML == data[prop].quote.symbol) {
                   // Filter it out
                   entry.style.animation = 'filter .5s forwards cubic-bezier(.79,.14,.15,.86)';
                }
            })
        }
    }
    data = tempData;
    // Rebuild entries
    window.setTimeout(function() {
       stocks.buildHTML(data);
       entry.style.animation = '';
    }, 500);
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
    document.querySelector(".search-wrapper").classList.remove("suggestions");
    document.body.style.overflow = "auto";
  }
})

// If enter key pressed
document.querySelector('.search').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
       // Add the first result
       addStock(document.querySelector('.search-wrapper').children[1]);
       // And close search
       document.querySelector(".search-wrapper").style.display = "none";
       document.querySelector(".search").blur();
    }
});

// If clicked off search, close it
document.querySelector('.search').addEventListener('blur', function (event) {
  document.querySelector(".search").classList.remove("suggestions");
  document.querySelector(".search").value = "";
  document.body.style.overflow = "auto";
})

// If clicked on suggestions or close, hide suggestions
document.querySelector('.search-wrapper').addEventListener('click', function (event) {
   document.querySelector(".search-wrapper").classList.remove("suggestions");
})
document.querySelector('.close').addEventListener('click', function (event) {
   document.querySelector(".search-wrapper").classList.remove("suggestions");
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
  document.body.style.overflow = "hidden";
  document.querySelector(".search-wrapper").innerHTML = "<hr>"+out;
  document.querySelector(".search-wrapper").classList.add("suggestions");
  document.querySelector(".search").classList.add("suggestions");
}


/* Swipe to remove stocks */
function addSwipeListener(gesuredZone) {
   var touchstartX = 0;
   var touchstartY = 0;
   var touchendX = 0;
   var touchendY = 0;

   gesuredZone.addEventListener('touchstart', function(event) {
       touchstartX = event.screenX;
       touchstartY = event.screenY;
   }, false);

   gesuredZone.addEventListener('touchend', function(event) {
       touchendX = event.screenX;
       touchendY = event.screenY;
       handleGesure();
   }, false); 

   function handleGesure() {
       var swiped = 'swiped: ';
       if (touchendX < touchstartX) {
           console.log(swiped + 'left!');
       }
       if (touchendX > touchstartX) {
           console.log(swiped + 'right!');
       }
       if (touchendY < touchstartY) {
           console.log(swiped + 'down!');
       }
       if (touchendY > touchstartY) {
           console.log(swiped + 'left!');
       }
       if (touchendY == touchstartY) {
           console.log('tap!');
       }
   }
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
   stocks.renderSkeleton(el.children[0].innerHTML);
   
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


/* Switch Tab */
function switchTab(url) {
   document.querySelector('.filter-button').style.opacity = 0;
   document.querySelector('.search').style.opacity = 0;
   document.querySelector('.entries').style.opacity = 0;
   document.querySelector('.footer').style.backgroundColor = '#111';
   document.querySelector('.footer').style.boxShadow = 'inset 0 1px 0 0 rgb(255 255 255 / 0.24)';
   document.querySelector('.footer').children[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 23" stroke-linecap="round" stroke-linejoin="round"><path d="M26.985,8.979c0,-2.265 -1.838,-4.104 -4.103,-4.104l-17.653,0c-2.265,0 -4.104,1.839 -4.104,4.104l0,8.207c0,2.265 1.839,4.103 4.104,4.103l17.653,0c2.265,0 4.103,-1.838 4.103,-4.103l0,-8.207Z" fill="none" stroke="#fff" stroke-width="1.5px"></path><path d="M19.609,4.537c0,-1.883 -1.244,-3.412 -2.777,-3.412l-5.554,0c-1.532,0 -2.777,1.529 -2.777,3.412" fill="none" stroke="#fff" stroke-width="1.5px"></path><path d="M24.392,9.331l-10.598,5.365l-10.076,-5.392" fill="none" stroke="#fff" stroke-width="1.5px"></path></svg>';
   document.querySelector('.footer').children[2].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 360"><path d="M287.247,324.747c0,-9.182 0,-306.099 0,-313.497c0,-6.213 -5.037,-11.25 -11.25,-11.25l-264.747,0c-6.213,0 -11.25,5.037 -11.25,11.25l0,290.997c0,31.016 25.234,56.249 56.249,56.249l242.279,0c-7.079,-9.408 -11.281,-21.097 -11.281,-33.749Zm-227.248,-108.749l36,0c6.213,0 11.25,5.037 11.25,11.25c0,6.213 -5.037,11.25 -11.25,11.25l-36,0c-6.213,0 -11.249,-5.037 -11.249,-11.25c0,-6.213 5.036,-11.25 11.249,-11.25Zm-11.249,-36.75c0,-6.213 5.036,-11.25 11.249,-11.25l36,0c6.213,0 11.25,5.037 11.25,11.25c0,6.213 -5.037,11.25 -11.25,11.25l-36,0c-6.213,0 -11.249,-5.037 -11.249,-11.25Zm179.248,125.249l-167.999,0c-6.213,0 -11.249,-5.037 -11.249,-11.25c0,-6.213 5.036,-11.25 11.249,-11.25l167.999,0c6.213,0 11.25,5.037 11.25,11.25c0,6.213 -5.037,11.25 -11.25,11.25Zm11.25,-59.249c0,6.213 -5.037,11.249 -11.25,11.249l-83.999,0c-6.213,0 -11.25,-5.036 -11.25,-11.249l0,-84c0,-6.213 5.037,-11.249 11.25,-11.249l83.999,0c6.213,0 11.25,5.036 11.25,11.249l0,84Zm-11.25,-120.749l-167.999,0c-6.213,0 -11.249,-5.037 -11.249,-11.25c0,-6.213 5.036,-11.25 11.249,-11.25l167.999,0c6.213,0 11.25,5.037 11.25,11.25c0,6.213 -5.037,11.25 -11.25,11.25Zm0,-48l-167.999,0c-6.213,0 -11.249,-5.037 -11.249,-11.25c0,-6.213 5.036,-11.25 11.249,-11.25l167.999,0c6.213,0 11.25,5.037 11.25,11.25c0,6.213 -5.037,11.25 -11.25,11.25Z" fill="#fff" fill-rule="nonzero"></path><rect x="155.248" y="172.498" width="61.499" height="61.499" fill="#fff" fill-rule="nonzero"></rect><path d="M372.746,77.999l-62.999,0c0,254.917 -0.038,246.755 0.067,246.755c0.971,15.706 11.705,28.76 26.205,33.185c23.194,7.077 46.975,-9.702 47.94,-34.014c0.058,0 0.037,5.62 0.037,-234.676c0,-6.213 -5.037,-11.25 -11.25,-11.25Z" fill="#fff" fill-rule="nonzero"></path></svg>';
   window.location.href = url;
}


/* Utility Functions */

// Round
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return (value != null ? Math.round(value * multiplier) / multiplier : '-');
}

// HTTP Request
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

// Money format
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
      return round(parseFloat(foo)) + foo.replace(/[^B|M|K]/g,"");
    } catch { return '-' }
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
        var toggle = filter.classList.toggle("active");
        // If the filter's active
        if (toggle) {
            // Filter the stocks
            filterStocks(apiResponse);
        }
        else {
            // Else, revert back to original list
            document.querySelectorAll('.entry').forEach(entry => {
                if (entry.style.animationFillMode == 'forwards') {
                    entry.style.animation = 'filter .5s reverse cubic-bezier(.79,.14,.15,.86)';
                    window.setTimeout(function() { entry.style.animation = ''; } , 500);
                }
            })
        }
    });
});

/* Main thread */

// Initiate API handler
APIhandler = new APIHandler();

// Initiate HTML builder
stocks = new stockEntries();

// Generate skeleton screen
document.querySelector('.entries').style.opacity = 1;
for (var i = 0; i < tArray.length; i++) {
   stocks.renderSkeleton(tArray[i]);
}

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
