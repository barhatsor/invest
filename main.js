var v = 2.6;

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
        // Parse response from JSON to array
        var obj = JSON.parse(response);
        //this.APIresponse = JSON.parse(this.responseText);
        // Filter response
        var filteredResponse = obj;
        //filteredResponse = this.APIresponse;//this.filterResponse(this.APIresponse);
        // Finally, build the HTML
        stocks.buildHTML(filteredResponse);
    }
}

/* Handle everything HTML */
class stockEntries {
    
    constructor() {
    }

    scrldIntoView(el) {
        var rect = el.getBoundingClientRect();
        var elemTop = rect.top;
        var isVisible = elemTop < window.screen.height;
        return isVisible;
    }

    buildHTML(response) {
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
                "<div class='entry' style='opacity:1'><h1>" +
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
                "</span></div>";
        }

        // Inject the finished HTML into the page
        document.querySelector(".entries").innerHTML =
            this.out + "<a href='https://codepen.io/barhatsor' style='float: left;padding-right: 0'>Bar Hatsor V"+v+"</a><a href='https://iexcloud.io'>Data provided by IEX Cloud</a>";
    }
}

/* Filters */
function filterStocks(response) {
    var obj = JSON.parse(response);
    var filteredResponse = '';
    for (var prop in response) {
        if (response[prop].quote.peRatio < 15) {
            filteredResponse += response[prop];
        }
    }
    stocks.buildHTML(filteredResponse);
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


/* Search Suggestions */
function renderSuggestions(response) {
  var obj = JSON.parse(response);
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

/* HTTP Request */
function httpRequest(type, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {
           callback(this.responseText);
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
        if (filter.classList == "active") {
            var originalEntries = document.querySelector(".entries").innerHTML;
            httpRequest("GET", "https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,mcd,amzn,cost,lmt,fb,msft,ba,wmt,t&types=quote&displayPercent=true&token=pk_370633a589a240f29304a7420b9960ec", filterStocks);
        }
        else {
            document.querySelector(".entries").innerHTML = originalEntries;
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

/* Unimplemented (yet!) filter code */

/*
var filter = peRatio.filter(function(ratio) {
  return ratio < 15;
});
console.log(filter);
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var obj = JSON.parse(div);
    try {console.log(obj[0].amount);} catch {};
  }};
xmlhttp.open("GET", "https://cloud.iexapis.com/stable/stock/AAPL/dividends/5y?token=pk_370633a589a240f29304a7420b9960ec", true);
xmlhttp.send(); */
