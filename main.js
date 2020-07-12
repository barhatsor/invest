var v = 2.8;
var apiResponse;

/* Handle everything API */
class APIHandler {

    constructor(requestedStocks)
    {
        this.APIurl = "https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,mcd,amzn,cost,lmt,fb,msft,ba,wmt,t&types=quote&displayPercent=true&token=pk_370633a589a240f29304a7420b9960ec";
        // Dividends get a special URL
        this.APIurl_div = "https://cloud.iexapis.com/stable/stock/AAPL/dividends/5y?token=pk_370633a589a240f29304a7420b9960ec";
    }

    // Send API request
    sendAPIReq(div) {
        // Requested dividends or not
        if (!div) {
            httpRequest("GET", this.APIurl, this.handleResponse);
        } else {
            httpRequest("GET", this.APIurl_div, this.handleResponse);
        }
    }

    // Filter API response
     filterResponse(response)
    {
        //let result = response.filter(peRatio => peRatio < 11);
        //return result;
        return response;
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
            out = '<p style="padding-top: 15px;text-align: center">No stocks</p>';
        }
        // Inject the finished HTML into the page
        document.querySelector(".entries").innerHTML =
            this.out + "<a href='https://codepen.io/barhatsor' style='float: left;padding-right: 0'>Bar Hatsor V"+v+"</a><a href='https://iexcloud.io'>Data provided by IEX Cloud</a>";
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
document.querySelector('.search').addEventListener('input', function (event) {
  if (this.value != "" && this.value != prevrequest) {
    prevrequest = this.value;
    httpRequest("GET", "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+this.value+"&apikey=XH456FPPVS8MHBXA", renderSuggestions);
  }
  else {
    document.querySelector(".search").classList.remove("suggestions");
    document.querySelector(".search-wrapper").style.display = "none";
  }
});

document.querySelector('.search').addEventListener('blur', function (event) {
  document.querySelector(".search").classList.remove("suggestions");
  document.querySelector(".search-wrapper").style.display = "none";
});

document.querySelector('.close').addEventListener('click', function (event) {
  document.querySelector(".search").value = "";
  document.querySelector(".search").classList.remove("suggestions");
  document.querySelector(".search-wrapper").style.display = "none";
})


/* Search Suggestions */
function renderSuggestions(response) {
  var obj = response;
  var s = "1. symbol";
  var n = "2. name";
  var out = "";
  if (!obj.Note) {
    obj.bestMatches.forEach(match => {
    out += '<div class="suggestion"><p>'+match[s]+'</p><a>'+match[n]+'</a></div>';
    })
    if (out == "") {
      out = '<div class="suggestion"><p>No results</p></div>';
    }
  }
  else {
    out = '<div class="suggestion"><p>Try again later</p></div>';
  }
  document.querySelector(".search-wrapper").innerHTML = "<hr>"+out;
  document.querySelector(".search-wrapper").style.display = "block";
  document.querySelector(".search").classList.add("suggestions");
}


/* Stock details */

// Toggle stock details
var stats;
function toggleDetails(el) {
    el.classList.toggle("open");
    if (el.classList.contains("open")) {
        // If the stock's open, show details
        stats = el.children[4];
        httpRequest("GET", "https://cloud.iexapis.com/stable/stock/"+el.children[0].innerHTML+"/batch?types=quote&token=pk_370633a589a240f29304a7420b9960ec", renderDetails);
    }
}

// Render stock details
function renderDetails(response) {
    // Store finished HTML
    var out = '';
    // Add stock stats
    out += '<div class="stat"><p>Prev Close</p><a>'+response.quote.previousClose+'</a></div>';
    out += '<div class="stat"><p>Open</p><a>'+response.quote.open+'</a></div>';
    out += '<div class="stat"><p>Low</p><a>'+response.quote.low+'</a></div>';
    out += '<div class="stat"><p>High</p><a>'+response.quote.high+'</a></div>';
    out += '<div class="stat"><p>52wk Low</p><a>'+response.quote.week52Low+'</a></div>';
    out += '<div class="stat"><p>52wk High</p><a>'+response.quote.week52High+'</a></div>';
    out += '<div class="stat"><p>Mkt Cap</p><a>'+response.quote.marketCap+'</a></div>';
    out += '<div class="stat"><p>Volume</p><a>'+response.quote.volume+'</a></div>';
    out += '<div class="stat"><p>Avg Vol (3m)</p><a>'+response.quote.avgTotalVolume+'</a></div>';
    out += '<div class="stat"><p>P/E</p><a>'+response.quote.peRatio+'</a></div>';
    // Inject finished HTML into stats wrapper
    stats.innerHTML = out;
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

// Initiate View builder
stocks = new stockEntries();

// Run
APIhandler.sendAPIReq();

/* Unimplemented dividend filter */

/*
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var obj = JSON.parse(div);
    try {console.log(obj[0].amount);} catch {};
  }};
xmlhttp.open("GET", "https://cloud.iexapis.com/stable/stock/AAPL/dividends/5y?token=pk_370633a589a240f29304a7420b9960ec", true);
xmlhttp.send();*/
