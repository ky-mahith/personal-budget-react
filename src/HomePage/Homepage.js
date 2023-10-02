import React from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';





var dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
            '#ffcd56',
            '#ff6384',
            '#562726',
            '#3DE000',
            "#DAFF33",
            "#33FFEC",
            "#3371FF",
            "#4D0F92",
            ],
        }
    ],
    labels: []
};




function createChart() {
var ctx = document.getElementById("myChart").getContext("2d");
var myPieChart = new Chart(ctx, {
type: 'pie',
data: dataSource
});
}

var newDataSource = [];

var svg = d3.select("#pie-chart").append("svg").append("g");

svg.append("g").attr("class", "slices");
svg.append("g").attr("class", "labels");
svg.append("g").attr("class", "lines");

var width = 650,
height = 300,
radius = Math.min(width, height) / 2;


var pie = d3.layout
.pie()
.sort(null)
.value(function (d) {
return d.budget;
});

var arc = d3.svg
.arc()
.outerRadius(radius * 0.8)
.innerRadius(radius * 0.4);

var outerArc = d3.svg
.arc()
.innerRadius(radius * 0.9)
.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function (d) {
return d.data.title;
};

var titles = []
var getTitles = ()=>{
axios.get("http://localhost:3000/budget").then(function (res) {
for(var i=0;i<res.data.myBudget.length;i++){
    titles.push(res.data.myBudget[i].title)
}
})
}
getTitles();

var color = d3.scaleLinear
.ordinal()
.domain(titles)
.range([
    '#ffcd56',
    '#ff6384',
    '#562726',
    '#3DE000',
    "#DAFF33",
    "#33FFEC",
    "#3371FF",
    "#4D0F92",
]);






function change(data) {
/* ------- PIE SLICES -------*/
var slice = svg
.select(".slices")
.selectAll("path.slice")
.data(pie(data), key);

slice
.enter()
.insert("path")
.style("fill", function (d) {
return color(d.data.title);
})
.attr("class", "slice");

slice
.transition()
.duration(1000)
.attrTween("d", function (d) {
this._current = this._current || d;
var interpolate = d3.interpolate(this._current, d);
this._current = interpolate(0);
return function (t) {
return arc(interpolate(t));
};
});

slice.exit().remove();

/* ------- TEXT LABELS -------*/

var text = svg.select(".labels").selectAll("text").data(pie(data), key);

text
.enter()
.append("text")
.attr("dy", ".35em")
.text(function (d) {
return d.data.title;
});

function midAngle(d) {
return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

text
.transition()
.duration(1000)
.attrTween("transform", function (d) {
this._current = this._current || d;
var interpolate = d3.interpolate(this._current, d);
this._current = interpolate(0);
return function (t) {
var d2 = interpolate(t);
var pos = outerArc.centroid(d2);
pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
return "translate(" + pos + ")";
};
})
.styleTween("text-anchor", function (d) {
this._current = this._current || d;
var interpolate = d3.interpolate(this._current, d);
this._current = interpolate(0);
return function (t) {
var d2 = interpolate(t);
return midAngle(d2) < Math.PI ? "start" : "end";
};
});

text.exit().remove();

/* ------- SLICE TO TEXT POLYLINES -------*/

var polyline = svg
.select(".lines")
.selectAll("polyline")
.data(pie(data), key);

polyline.enter().append("polyline");

polyline
.transition()
.duration(1000)
.attrTween("points", function (d) {
this._current = this._current || d;
var interpolate = d3.interpolate(this._current, d);
this._current = interpolate(0);
return function (t) {
var d2 = interpolate(t);
var pos = outerArc.centroid(d2);
pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
return [arc.centroid(d2), outerArc.centroid(d2), pos];
};
});

polyline.exit().remove();
}



function getBudget() {
axios.get("/budget").then(function (res) {
//   console.log(res.data.myBudget);
for (var i = 0; i < res.data.myBudget.length; i++) {
dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
dataSource.labels[i] = res.data.myBudget[i].title;

newDataSource.push({
"title": res.data.myBudget[i].title,
"budget": res.data.myBudget[i].budget,
});
}
createChart();
change(newDataSource);
});
}

getBudget();






function HomePage() {
  return (
    <main class="center" id="main">

        <div class="page-area">

            <div class="text-box">
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
                <div>
                    
                    <a href="/login.html"><mark>Login</mark></a> to monitor your data.
                </div>
            </div>
    
            <div class="text-box">
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
                
                <a href="/login.html"><button class="button button1">Sign Up Here</button></a>
            </div>
    
            <div class="text-box">
                <h1>Alerts</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </div>
    
            <div class="text-box">
                <h1>Results</h1>
                <p>
                What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </div>
    
            <div class="text-box">
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </div>
    
            <div class="text-box">
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </div>
    
            <div class="text-box">
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </div>
        

            <div>
                <h1>Chart</h1>
                <div>
                    <canvas id="myChart" width="800" height="300"></canvas>
                    <figcaption>Fig.1 - ChartJS</figcaption>
                </div>

                <div id="pie-chart">
                    
                    
                </div>
                <figcaption>Fig.2 - D3JS</figcaption>
            </div>

        </div>

    </main>


  );
}

export default HomePage;
