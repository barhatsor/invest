var v = 2.7;

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
        stocks.buildHTML(response);
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
                    "<div class='entry' onclick='toggleDetails(true, this)'><h1>" +
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


/* Chart */

// Gather data for chart
function initChart(obj) {
        document.querySelector('.chart-wrapper').style.opacity = 1;
        var labels = [];
        var points = [];
        if (!obj["Note"]) {
        // Access time series
        var ts = obj["Time Series (Daily)"];
        var i = 0;
        // For each time
        for (var prop in ts) {
            // Push time labels to array
            labels.push(Object.keys(ts)[i]);
            // Push points to array
            points.push(ts[prop]["1. open"]);
            i++;
        }
        // Reverse the chart
        labels.reverse();
        points.reverse();
        // Update chart data
        updateChart(labels, points);
    }
    else {
        document.querySelector('.details-wrapper').innerHTML += '<p style="margin-top: 70px;color: #737373">No chart... Try again later</p>';
    }
}

// Inject data into chart
function updateChart(labels, data) {
    if (chart) {
        var gradient = ctx.createLinearGradient(0, 0, 0, can.height);
        document.querySelector('.chart-wrapper').innerHTML = '';
        document.querySelector('.chart-wrapper').innerHTML = '<canvas class="chart"><canvas>';
    }
    else {
        var can = document.querySelector('.chart');
        var ctx = can.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 800);
    }

    var can = document.querySelector('.chart');
    var ctx = can.getContext('2d');

    if (red) {
        gradient.addColorStop(0, 'rgba(234, 67, 53, 0.5)');
    }
    else {
        gradient.addColorStop(0, 'rgba(52, 168, 83, 0.5)');
        red = '#34a853';
    }
    gradient.addColorStop(1, 'transparent');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: gradient,
                borderColor: red,
                pointRadius: 0,
                data: data
            }]
        },
        options: {
            legend: {display: false},
            grid: {display: false},
            scales: {xAxes: [{display: false}], yAxes: [{display: false}]}
        }
    });
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
        if (filter.className == "filter active") {
            httpRequest("GET", "https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,mcd,amzn,cost,lmt,fb,msft,ba,wmt,t&types=quote&displayPercent=true&token=pk_370633a589a240f29304a7420b9960ec", filterStocks);
        }
        else {
            APIhandler.sendAPIReq();
        }
    });
});

// Toggle stock details
var red = null;
function toggleDetails(toggle, el) {
    if (toggle == true) {
        if (el.children[2].className == "red") {
            red = "#ea4335";
        }
        else {
            red = null;
        }
        document.body.style.overflow = "hidden";
        document.querySelector('.details-wrapper').innerHTML = el.innerHTML;
        httpRequest("GET", "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+el.children[0].innerHTML+"&apikey=XH456FPPVS8MHBXA", initChart);
        document.querySelector('.details').classList.remove('hidden');
    }
    else {
        document.body.style.overflow = "auto";
        document.querySelector('.chart-wrapper').style.opacity = 0;
        document.querySelector('.details').classList.add('hidden');
    }
}

/* Main thread */

// Initiate API handler
APIhandler = new APIHandler();

// Initiate View builder
stocks = new stockEntries();

// Run
APIhandler.sendAPIReq();

/* Unimplemented (yet!) dividend filter code */

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
