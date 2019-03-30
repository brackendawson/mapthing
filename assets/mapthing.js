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

function getDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

gpxParse.parseRemoteGpxFile("trace.gpx", function(error, data) {
    if (error != null) {
        throw error
    }
    var speedArr = []
    var cumultiveDistance = 0
    lastPoint = data.tracks[0].segments[0][0]
    firstTime = data.tracks[0].segments[0][0].time

    data.tracks[0].segments[0].map(function(point) {
        var distance = getDistance(lastPoint.lat, lastPoint.lon, point.lat, point.lon)
        cumultiveDistance += distance
        var time = (point.time - lastPoint.time) / (1000 * 3600)
        var speed = distance / time
        speedArr.push({x: cumultiveDistance, y: speed, t: point.time})
        lastPoint = point
    })

    console.log("Total dist: " + speedArr[speedArr.length-1].x)
    var halfWay = speedArr[speedArr.length-1].x / 2
    console.log("Half way: " + halfWay)
    var midTime = speedArr.find(function(e) {
        return e.x > halfWay
    }).t
    console.log(midTime)
    firstHalfTime = (midTime - speedArr[0].t) / 1000
    console.log("First half: " + firstHalfTime)
    secondHalfTime = (speedArr[speedArr.length-1].t - midTime) / 1000
    console.log("Second half: " + secondHalfTime)
    split = secondHalfTime - firstHalfTime
    console.log("Split: " + split)
    document.getElementById("split").innerHTML = `<p>Split: ${split}s</p>`

    var chartContainer = document.getElementById("chart")
    var chart = new Chart(chartContainer, {
        type: 'scatter',
        data: {
            datasets: [{ 
                data: speedArr,
                label: "Pace (km/h)",
                borderColor: "#3e95cd",
                fill: false,
                showLine: true,
                pointRadius: 0,
              }
            ]
          },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                position: "bottom"
            }
        }
    });
});
