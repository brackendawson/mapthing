var map = L.map('map').setView([50.901, -1.397], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYnJhY2tlbmQiLCJhIjoiY2p0dmRrYTc4MWVwZjRnbnB2ZXBtYmxjdSJ9.9Kurt9ZO5u1EIZAMCLiNqg'
}).addTo(map);

new L.GPX("trace.gpx", {async: true}).on('loaded', function(e) {
    map.fitBounds(e.target.getBounds());
  }).addTo(map);

var data = [12, 19, 3, 5, 2, 3];
var options = {
    responsive:true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

var graphContainer = document.getElementById("chart")
var graph = new Chart(graphContainer, {
    type: 'line',
    data: data,
    options: options
});