//Function to send a http request and return the response from the site.
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

let map;
let markers = [];
var obj; 
var lati;
var longi;
var time;
var prev;

function initMap(){
    var iitgandhinagar = {lat:23.2115, lng:72.6842};
    var client = new HttpClient();
    
    console.log("************First Response************");
    client.get('https://api.thingspeak.com/channels/1271022/feeds.json?results=2', function(response) {
        console.log("Response:- ");
        console.log(response);

        obj = JSON.parse(response);
        console.log("Feeds:- ");
        console.log(obj["feeds"]);

        lati = parseFloat(obj.feeds[1].field1);
        console.log("Latitude:-  " + lati);

        longi = parseFloat(obj.feeds[1].field2);
        console.log("Longitude:- " + longi);

        time = obj.feeds[1].created_at;
        console.log("Location last updated on:- " + time);
    });

    setTimeout(function(){         
        var curr = {lat: lati, lng: longi };
        prev = curr;     
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 16,
            center: curr,
            mapTypeId: "terrain",
        });   
        addMarker(curr);
        //map.setCenter(curr); 
        repeater();
    }, 3000);    
}

var i = 0;
function repeater(){
    var client = new HttpClient();
    console.log();
    console.log("************New Response************");
    
    client.get('https://api.thingspeak.com/channels/1271022/feeds.json?results=2', function(response) {
        console.log("Response:- ")
        console.log(response);

        obj = JSON.parse(response);
        console.log("Feeds:- ")
        console.log(obj["feeds"]);

        lati = parseFloat(obj.feeds[1].field1);
        console.log("Latitude:-  " + lati);

        longi = parseFloat(obj.feeds[1].field2);
        console.log("Longitude:- " + longi);

        time = obj.feeds[1].created_at;
        console.log("Location last updated on:- " + time);
    });

    setTimeout(function(){
        curr = {lat: lati, lng: longi };
        if (curr != prev){
            addMarker(curr);
            deletemarker(i);
            i++;
            //map.setCenter(curr);
            prev = curr;
        }
        repeater();
    }, 3000);
}
 
//Function to add marker to the map at location.
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

//Function to remove marker from the map present at the ith index of the markers array.
function deletemarker(i){
    markers[i].setMap(null);
}