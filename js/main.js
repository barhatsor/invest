var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var obj = JSON.parse(this.responseText);
        var out = "";
        var precent;
        for (var prop in obj) {
            if (obj[prop].quote.changePercent < 0) {
                precent = "<h2 class='red'>";
            } else {
                precent = "<h2>+";
            }
            out +=
                "<div class='entry'><h1>" +
                obj[prop].quote.symbol +
                "</h1><p>" +
                obj[prop].quote.companyName +
                "</p>" +
                precent +
                ((Math.round(obj[prop].quote.changePercent * 100) / 100).toFixed(1) * 1
                ).toString() +
                "%</h2><span>" +
                ((Math.round(obj[prop].quote.latestPrice * 100) / 100).toFixed(1) * 1
                ).toString() +
                "</span></div>";
        }
        document.querySelector(".entries").innerHTML =
            out + "<a href='https://iexcloud.io'>Data provided by IEX Cloud</a>";
        document.querySelector(".title").style.animation =
            "title .2s ease forwards";
        document.querySelectorAll(".entry").forEach(i => {
            if (scrldIntoView(i)) {
                i.style.animation = "entry .5s .2s ease forwards";
            }
        });
    }
};

xmlhttp.open(
    "GET",
    "https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,mcd,amzn,cost,lmt,fb,msft,ba,wmt,t&types=quote&displayPercent=true&token=pk_370633a589a240f29304a7420b9960ec",
    true
);
xmlhttp.send();

document.querySelector(".filter-button").addEventListener("click", e => {
    document.querySelector(".filter-button").classList.toggle("active");
    document.querySelector(".filters-wrapper").classList.toggle("active");
});

document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", e => {
        filter.classList.toggle("active");
    });
});

function scrldIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var isVisible = elemTop < window.screen.height;
    return isVisible;
}

window.onscroll = function(e) {
    document.querySelectorAll(".entry").forEach(entry => {
        if (scrldIntoView(entry)) {
            entry.style.animation = "entry .5s ease forwards";
        }
    });
};
